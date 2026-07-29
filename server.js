import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
import jsmediatags from 'jsmediatags';
import crypto from 'crypto';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONFIG_FILE = path.join(__dirname, 'rubyplayer_config.json');
const USERS_FILE = path.join(__dirname, 'user_rubymusic.json');
const CACHE_FILE = path.join(__dirname, 'rubyplayer_metadata_cache.json');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

let bcrypt = null;
try {
  const loaded = require('bcryptjs');
  bcrypt = (loaded && typeof loaded.compareSync === 'function') ? loaded : (loaded?.default || loaded);
} catch (e) {
  try {
    const loaded = require('bcrypt');
    bcrypt = (loaded && typeof loaded.compareSync === 'function') ? loaded : (loaded?.default || loaded);
  } catch (e2) { }
}

// Password Security Engine (Bcrypt with PBKDF2 fallback)
function hashPassword(password) {
  if (bcrypt && typeof bcrypt.hashSync === 'function') {
    return { hash: bcrypt.hashSync(password, 10) };
  }
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return { hash: `$pbkdf2$100000$${salt}$${derivedKey}` };
}

function verifyPassword(password, storedHash) {
  if (!password || !storedHash) return false;

  if (storedHash.startsWith('$2a$') || storedHash.startsWith('$2b$') || storedHash.startsWith('$2y$')) {
    if (bcrypt && typeof bcrypt.compareSync === 'function') {
      try {
        return bcrypt.compareSync(password, storedHash);
      } catch (err) {
        return false;
      }
    }
  }

  if (storedHash.startsWith('$pbkdf2$')) {
    const parts = storedHash.split('$');
    if (parts.length === 5) {
      const iterations = parseInt(parts[2], 10);
      const salt = parts[3];
      const expectedKey = parts[4];
      const derivedKey = crypto.pbkdf2Sync(password, salt, iterations, 64, 'sha512').toString('hex');
      try {
        const bufA = Buffer.from(derivedKey, 'hex');
        const bufB = Buffer.from(expectedKey, 'hex');
        if (bufA.length !== bufB.length) return false;
        return crypto.timingSafeEqual(bufA, bufB);
      } catch (err) {
        return false;
      }
    }
  }

  return false;
}

// Active Sessions Store (token -> { username, role, expiresAt, lastActive })
const activeSessions = new Map();

// Login Rate Limiter (Anti-Bot & Dictionary Attack Mitigation)
const loginAttempts = new Map(); // key (${ip}:${username}) -> { count, lastAttempt, lockUntil }

const WINDOW_MS = 16 * 60 * 1000;  // 16-minute sliding window (resets on every bad attempt)
const LOCKOUT_MS = 16 * 60 * 1000; // 16-minute lockout duration

function checkLoginRateLimit(ip, username) {
  const now = Date.now();
  const key = `${ip}:${(username || '').toLowerCase()}`;
  const attemptData = loginAttempts.get(key);

  if (attemptData) {
    if (attemptData.lockUntil && now < attemptData.lockUntil) {
      const remainingMs = attemptData.lockUntil - now;
      const waitMinutes = Math.min(15, Math.max(1, Math.ceil(remainingMs / (60 * 1000))));
      return {
        allowed: false,
        message: `Too many failed login attempts. Please wait ${waitMinutes} minute(s) before trying again.`,
      };
    }
    // Clean up if 16 minutes of complete inactivity have passed
    if (now - attemptData.lastAttempt > WINDOW_MS && (!attemptData.lockUntil || now >= attemptData.lockUntil)) {
      loginAttempts.delete(key);
    }
  }
  return { allowed: true };
}

function recordFailedLogin(ip, username) {
  const now = Date.now();
  const key = `${ip}:${(username || '').toLowerCase()}`;
  let attemptData = loginAttempts.get(key);

  if (!attemptData || (now - attemptData.lastAttempt > WINDOW_MS && (!attemptData.lockUntil || now >= attemptData.lockUntil))) {
    attemptData = { count: 1, lastAttempt: now, lockUntil: null };
  } else {
    // Increment count & RESET the 16-minute window timer on every bad attempt!
    attemptData.count += 1;
    attemptData.lastAttempt = now;
  }

  const MAX_FAILED_ATTEMPTS = 5;

  if (attemptData.count >= MAX_FAILED_ATTEMPTS) {
    // Extend lockout for 16 minutes from this latest failed attempt
    attemptData.lockUntil = now + LOCKOUT_MS;
    console.warn(`[Security Alert] Rate-limiting active: ${attemptData.count} failed logins for user "${username}" from IP ${ip}. Lockout reset to 16m from last attempt.`);
  }

  loginAttempts.set(key, attemptData);
}

function clearFailedLogin(ip, username) {
  const key = `${ip}:${(username || '').toLowerCase()}`;
  loginAttempts.delete(key);
}

function createSession(user) {
  const token = crypto.randomBytes(32).toString('hex');
  const now = Date.now();
  const ONE_YEAR_MS = 365 * 24 * 60 * 60 * 1000;
  const session = {
    token,
    username: user.username,
    role: user.role || 'user',
    expiresAt: now + ONE_YEAR_MS,
    lastActive: now,
  };
  activeSessions.set(token, session);
  saveUsers();
  return session;
}

function getSessionUser(req) {
  if (!req) return null;
  let token = null;
  const authHeader = req.headers ? req.headers.authorization : null;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.slice(7).trim();
  } else if (req.query && req.query.token) {
    token = String(req.query.token).trim();
  }

  if (!token) return null;
  const session = activeSessions.get(token);
  if (!session) return null;

  if (Date.now() > session.expiresAt) {
    activeSessions.delete(token);
    saveUsers();
    return null;
  }

  session.lastActive = Date.now();
  return session;
}

// Default Server Configuration
let appConfig = {
  mediaFolder: path.join(__dirname, 'music'),
  MusicLocation: path.join(__dirname, 'music'),
  LockedPlaylists: [],
  Users: [],
  Roles: [],
};

let isSavingConfig = false;
let isSavingUsers = false;
let lastConfigWriteTime = 0;
let lastUsersWriteTime = 0;

function saveConfig() {
  try {
    isSavingConfig = true;
    lastConfigWriteTime = Date.now();
    const dataToSave = {
      MusicLocation: appConfig.MusicLocation || appConfig.mediaFolder,
      LockedPlaylists: appConfig.LockedPlaylists || [],
    };
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(dataToSave, null, 2));
  } catch (err) {
    console.error('Error writing rubyplayer_config.json file:', err);
  } finally {
    setTimeout(() => {
      isSavingConfig = false;
    }, 1500);
  }
}

function saveUsers() {
  try {
    isSavingUsers = true;
    lastUsersWriteTime = Date.now();
    const now = Date.now();
    const activeSessionsArray = [];
    for (const session of activeSessions.values()) {
      if (session && session.expiresAt > now) {
        activeSessionsArray.push(session);
      }
    }
    const dataToSave = {
      Users: appConfig.Users || [],
      Sessions: activeSessionsArray,
      Roles: appConfig.Roles || [],
    };
    if (appConfig.serverHash) {
      dataToSave.serverHash = appConfig.serverHash;
    }
    fs.writeFileSync(USERS_FILE, JSON.stringify(dataToSave, null, 2));
  } catch (err) {
    console.error('Error writing user_rubymusic.json file:', err);
  } finally {
    setTimeout(() => {
      isSavingUsers = false;
    }, 1500);
  }
}

// Load users and active sessions from user_rubymusic.json
function loadServerUsers(isInitialBoot = false) {
  const usersExisted = fs.existsSync(USERS_FILE);
  if (usersExisted) {
    try {
      const saved = JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'));
      if (Array.isArray(saved.Users)) {
        appConfig.Users = saved.Users;
      } else if (Array.isArray(saved)) {
        appConfig.Users = saved;
      } else {
        appConfig.Users = [];
      }

      if (saved.serverHash && typeof saved.serverHash === 'string') {
        appConfig.serverHash = saved.serverHash;
      }

      if (Array.isArray(saved.Roles)) {
        appConfig.Roles = saved.Roles;
      }

      if (Array.isArray(saved.Sessions)) {
        const now = Date.now();
        activeSessions.clear();
        let restoredCount = 0;
        for (const s of saved.Sessions) {
          if (s && s.token && s.expiresAt > now) {
            activeSessions.set(s.token, s);
            restoredCount++;
          }
        }
        if (isInitialBoot && restoredCount > 0) {
          console.log(`[Server Auth] Restored ${restoredCount} active session(s) from user_rubymusic.json.`);
        }
      }
    } catch (err) {
      console.error('Error reading user_rubymusic.json:', err);
    }
  }

  // Check for DefaultPassword in user_rubymusic.json or rubyplayer_config.json
  let rawDefaultPassword = null;
  let defaultPasswordSourceFile = null;
  let sourceFileData = null;

  if (fs.existsSync(USERS_FILE)) {
    try {
      const uData = JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'));
      if (uData.DefaultPassword && typeof uData.DefaultPassword === 'string') {
        rawDefaultPassword = uData.DefaultPassword;
        defaultPasswordSourceFile = USERS_FILE;
        sourceFileData = uData;
      }
    } catch (e) { }
  }

  if (!rawDefaultPassword && fs.existsSync(CONFIG_FILE)) {
    try {
      const cData = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf-8'));
      if (cData.DefaultPassword && typeof cData.DefaultPassword === 'string') {
        rawDefaultPassword = cData.DefaultPassword;
        defaultPasswordSourceFile = CONFIG_FILE;
        sourceFileData = cData;
      }
    } catch (e) { }
  }

  if (rawDefaultPassword) {
    const trimmed = rawDefaultPassword.trim();
    const isPlaceholder = trimmed === "Change this or people can't login!" || trimmed.toLowerCase() === "change this";

    if (isPlaceholder) {
      console.warn('[Server Auth] Notice: DefaultPassword is set to placeholder ("Change this or people can\'t login!"). Server will not generate serverHash until a custom DefaultPassword is set.');
    } else {
      const { hash } = hashPassword(trimmed);
      appConfig.serverHash = hash;
      console.log('[Server Auth] Successfully generated serverHash from custom DefaultPassword.');

      // Strip DefaultPassword from source file and save serverHash into user_rubymusic.json
      if (sourceFileData) {
        delete sourceFileData.DefaultPassword;
        fs.writeFileSync(defaultPasswordSourceFile, JSON.stringify(sourceFileData, null, 2));
      }
      saveUsers();
    }
  } else if (!appConfig.serverHash && isInitialBoot) {
    console.warn('[Server Auth] Notice: DefaultPassword is not configured in user_rubymusic.json or rubyplayer_config.json.');
  }

  // Auto-migrate Users from rubyplayer_config.json if user_rubymusic.json was missing/empty
  if ((!appConfig.Users || appConfig.Users.length === 0) && fs.existsSync(CONFIG_FILE)) {
    try {
      const oldConfig = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf-8'));
      if (Array.isArray(oldConfig.Users) && oldConfig.Users.length > 0) {
        appConfig.Users = oldConfig.Users;
        saveUsers();
        delete oldConfig.Users;
        fs.writeFileSync(CONFIG_FILE, JSON.stringify(oldConfig, null, 2));
        console.log('[Server Users] Migrated users from rubyplayer_config.json to user_rubymusic.json.');
      }
    } catch (err) {
      console.error('Error migrating users from config file:', err);
    }
  }

  // Auto-generate passwordHash for users missing passwordHash
  let usersUpdated = false;
  if (Array.isArray(appConfig.Users)) {
    for (const u of appConfig.Users) {
      if (!u.passwordHash) {
        if (String(u.username).toLowerCase() === 'admin' && !appConfig.serverHash) {
          const { hash } = hashPassword('admin');
          u.passwordHash = hash;
          usersUpdated = true;
          console.log('[Server Users] Generated default hashed password "admin" for admin user.');
        } else if (appConfig.serverHash) {
          u.passwordHash = appConfig.serverHash;
          u.mustResetPassword = true;
          usersUpdated = true;
          console.log(`[Server Users] Initialized user "${u.username}" with serverHash default password and set mustResetPassword=true.`);
        } else {
          u.mustResetPassword = true;
          console.warn(`[Server Users] Warning: User "${u.username}" has no passwordHash and no serverHash is configured.`);
        }
      }
    }
  }

  if (usersUpdated) {
    saveUsers();
  }

  // Initialize default admin user if no users exist anywhere
  if (!appConfig.Users || appConfig.Users.length === 0) {
    const { hash } = hashPassword('admin');
    appConfig.Users = [
      {
        username: 'admin',
        passwordHash: hash,
        role: 'admin',
      },
    ];
    saveUsers();
    console.log('[Server Users] Initialized default admin account in user_rubymusic.json (username: admin, password: admin)');
  }

  if (!usersExisted && (!appConfig.Users || appConfig.Users.length === 0)) {
    saveUsers();
    console.log(`[Server Users] Created default user storage file at "${USERS_FILE}".`);
  }
}

// Load server config
function loadServerConfig(isInitialBoot = false) {
  const fileExisted = fs.existsSync(CONFIG_FILE);
  if (fileExisted) {
    try {
      const saved = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf-8'));
      const loc = saved.MusicLocation || saved.mediaFolder;
      if (loc) {
        appConfig.MusicLocation = loc;
        appConfig.mediaFolder = loc;
      }
      if (Array.isArray(saved.LockedPlaylists)) {
        appConfig.LockedPlaylists = saved.LockedPlaylists;
      } else {
        appConfig.LockedPlaylists = [];
      }
      // Strip legacy Users key from config if present
      if (saved.Users) {
        delete saved.Users;
        fs.writeFileSync(CONFIG_FILE, JSON.stringify(saved, null, 2));
      }
    } catch (err) {
      console.error('Error reading config file:', err);
    }
  }

  if (!fileExisted) {
    saveConfig();
    console.log(`[Server Config] Created default configuration file at "${CONFIG_FILE}".`);
  }

  // Load user accounts
  loadServerUsers(isInitialBoot);
}
loadServerConfig(true);

// Watch rubyplayer_config.json for external edits
try {
  if (fs.existsSync(CONFIG_FILE)) {
    fs.watchFile(CONFIG_FILE, { interval: 2000 }, (curr, prev) => {
      if (curr.mtimeMs !== prev.mtimeMs && Date.now() - lastConfigWriteTime > 3000) {
        console.log('[Server Config] Detected external changes to rubyplayer_config.json — reloading configuration...');
        loadServerConfig(false);
      }
    });
  }
} catch (err) {
  console.error('[Server Config] Failed to initialize config file watcher:', err);
}

// Watch user_rubymusic.json for external edits
try {
  if (fs.existsSync(USERS_FILE)) {
    fs.watchFile(USERS_FILE, { interval: 2000 }, (curr, prev) => {
      if (curr.mtimeMs !== prev.mtimeMs && Date.now() - lastUsersWriteTime > 3000) {
        console.log('[Server Users] Detected external changes to user_rubymusic.json — reloading users...');
        loadServerUsers(false);
      }
    });
  }
} catch (err) {
  console.error('[Server Users] Failed to initialize users file watcher:', err);
}



// Server-side Metadata Cache
let serverMetadataCache = {}; // id -> track metadata
if (fs.existsSync(CACHE_FILE)) {
  try {
    serverMetadataCache = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf-8'));
  } catch (err) {
    console.error('Error reading metadata cache file:', err);
  }
}

function saveMetadataCache() {
  try {
    fs.writeFileSync(CACHE_FILE, JSON.stringify(serverMetadataCache, null, 2));
  } catch (err) {
    console.error('Error writing metadata cache file:', err);
  }
}

// Supported audio and playlist extensions
const AUDIO_EXTENSIONS = new Set(['.mp3', '.flac', '.m4a', '.ogg', '.wav', '.aac', '.wma', '.opus']);
const PLAYLIST_EXTENSIONS = new Set(['.m3u', '.m3u8', '.pls']);

// Helper to find folder cover.png or fallback ruby-winged-logo.svg (case-insensitive)
function findFolderCoverFile(songFullPath) {
  const coverNames = ['cover.png', 'cover.jpg', 'cover.jpeg', 'folder.png', 'folder.jpg', 'album.png', 'album.jpg', 'artist.png', 'artist.jpg', 'ruby-winged-logo.svg', 'ruby-winged-logo.png'];

  const checkDirForCover = (dirPath, targetFileName = null) => {
    if (!dirPath || !fs.existsSync(dirPath)) return null;
    try {
      const items = fs.readdirSync(dirPath);
      if (targetFileName) {
        for (const item of items) {
          if (item.toLowerCase() === targetFileName.toLowerCase()) {
            return path.join(dirPath, item);
          }
        }
      }
      for (const item of items) {
        if (coverNames.includes(item.toLowerCase())) {
          return path.join(dirPath, item);
        }
      }
    } catch (e) { }
    return null;
  };

  if (songFullPath) {
    const songDir = path.dirname(songFullPath);
    const match = checkDirForCover(songDir);
    if (match) return match;

    const parentDir = path.dirname(songDir);
    if (parentDir && parentDir.startsWith(path.resolve(appConfig.mediaFolder))) {
      const parentMatch = checkDirForCover(parentDir);
      if (parentMatch) return parentMatch;
    }
  }

  // Prioritize default ruby-winged-logo.svg at MusicLocation when no song is selected or as root media folder fallback
  const rubyMatch = checkDirForCover(appConfig.mediaFolder, 'ruby-winged-logo.svg') || checkDirForCover(appConfig.mediaFolder, 'ruby-winged-logo.png');
  if (rubyMatch) return rubyMatch;

  const rootMatch = checkDirForCover(appConfig.mediaFolder);
  if (rootMatch) return rootMatch;

  // Fallback to server public brand logo
  const publicLogo = path.join(__dirname, 'public', 'ruby-winged-logo.svg');
  if (fs.existsSync(publicLogo)) return publicLogo;

  return null;
}

// Safe jsmediatags reader helper for Node
function readTagsNode(filePath) {
  return new Promise((resolve) => {
    const reader = jsmediatags.default || jsmediatags;
    if (!reader || typeof reader.read !== 'function') {
      return resolve(null);
    }
    reader.read(filePath, {
      onSuccess: (tag) => resolve(tag),
      onError: (error) => resolve(null),
    });
  });
}

// Extract lyrics helper for server
function extractLyrics(tags) {
  if (!tags) return null;

  if (typeof tags.lyrics === 'string' && tags.lyrics.trim()) return tags.lyrics.trim();
  if (tags.lyrics?.text && typeof tags.lyrics.text === 'string') return tags.lyrics.text.trim();
  if (tags.lyrics?.lyrics && typeof tags.lyrics.lyrics === 'string') return tags.lyrics.lyrics.trim();

  if (tags.USLT) {
    if (typeof tags.USLT === 'string' && tags.USLT.trim()) return tags.USLT.trim();
    if (tags.USLT.data) {
      if (typeof tags.USLT.data === 'string' && tags.USLT.data.trim()) return tags.USLT.data.trim();
      if (typeof tags.USLT.data.lyrics === 'string' && tags.USLT.data.lyrics.trim()) return tags.USLT.data.lyrics.trim();
      if (typeof tags.USLT.data.text === 'string' && tags.USLT.data.text.trim()) return tags.USLT.data.text.trim();
    }
    if (typeof tags.USLT.lyrics === 'string' && tags.USLT.lyrics.trim()) return tags.USLT.lyrics.trim();
    if (typeof tags.USLT.text === 'string' && tags.USLT.text.trim()) return tags.USLT.text.trim();
  }

  if (tags.SYLT) {
    if (typeof tags.SYLT === 'string' && tags.SYLT.trim()) return tags.SYLT.trim();
    if (tags.SYLT.data) {
      if (typeof tags.SYLT.data === 'string' && tags.SYLT.data.trim()) return tags.SYLT.data.trim();
      if (typeof tags.SYLT.data.lyrics === 'string' && tags.SYLT.data.lyrics.trim()) return tags.SYLT.data.lyrics.trim();
    }
  }

  if (tags['©lyr']) {
    if (typeof tags['©lyr'] === 'string' && tags['©lyr'].trim()) return tags['©lyr'].trim();
    if (tags['©lyr'].data && typeof tags['©lyr'].data === 'string') return tags['©lyr'].data.trim();
  }

  if (tags.LYRICS) {
    if (typeof tags.LYRICS === 'string' && tags.LYRICS.trim()) return tags.LYRICS.trim();
    if (tags.LYRICS.data && typeof tags.LYRICS.data === 'string') return tags.LYRICS.data.trim();
  }

  for (const key of Object.keys(tags)) {
    const uKey = key.toUpperCase();
    if (uKey.includes('USLT') || uKey.includes('LYRIC') || uKey.includes('SYLT')) {
      const val = tags[key];
      if (typeof val === 'string' && val.trim()) return val.trim();
      if (val?.data) {
        if (typeof val.data === 'string' && val.data.trim()) return val.data.trim();
        if (typeof val.data.lyrics === 'string' && val.data.lyrics.trim()) return val.data.lyrics.trim();
      }
    }
  }

  return null;
}

// Convert tag picture to buffer and mime
function extractPictureBuffer(picture) {
  if (!picture || !picture.data) return null;
  try {
    const format = picture.format || 'image/jpeg';
    const buffer = Buffer.from(picture.data);
    return { format, buffer };
  } catch (err) {
    return null;
  }
}

// Helper to extract published date following strict order:
// 1. ID3/ID4 Copyright tag (scans string for full date/month/day/year)
// 2. Modified tag in ID4 (©day, TDRC, TYER, year, date)
// 3. File creation date (stats.birthtime or stats.ctime)
function extractPublishDate(tags, stats) {
  const parseDateFromText = (text) => {
    if (!text || typeof text !== 'string') return null;
    const str = text.trim();
    if (!str) return null;

    const monthNames = 'January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec';

    // 1. Month Day, Year (e.g. "November 14, 2019" or "Nov 14 2019")
    const fullDateRegex = new RegExp(`(${monthNames})\\s+(\\d{1,2})[th|st|nd|rd,]*\\s+(\\d{4})`, 'i');
    const matchFull = str.match(fullDateRegex);
    if (matchFull) {
      return `${matchFull[1]} ${matchFull[2]}, ${matchFull[3]}`;
    }

    // 2. Day Month Year (e.g. "14 November 2019")
    const reverseDateRegex = new RegExp(`(\\d{1,2})\\s+(${monthNames})\\s+(\\d{4})`, 'i');
    const matchRev = str.match(reverseDateRegex);
    if (matchRev) {
      return `${matchRev[2]} ${matchRev[1]}, ${matchRev[3]}`;
    }

    // 3. Month Year (e.g. "November 2019")
    const monthYearRegex = new RegExp(`(${monthNames})\\s+(\\d{4})`, 'i');
    const matchMY = str.match(monthYearRegex);
    if (matchMY) {
      return `${matchMY[1]} ${matchMY[2]}`;
    }

    // 4. ISO Date YYYY-MM-DD or YYYY/MM/DD
    const isoMatch = str.match(/\b(19\d\d|20\d\d)[-/.](0[1-9]|1[0-2])[-/.](0[1-9]|[12]\d|3[01])\b/);
    if (isoMatch) {
      const year = isoMatch[1];
      const monthIdx = parseInt(isoMatch[2], 10) - 1;
      const day = parseInt(isoMatch[3], 10);
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return `${months[monthIdx]} ${day}, ${year}`;
    }

    // 5. 4-digit Year
    const yearMatch = str.match(/\b(19\d\d|20\d\d)\b/);
    if (yearMatch) {
      return yearMatch[1];
    }

    return null;
  };

  const getTimestamp = (dateStr) => {
    if (!dateStr) return 0;
    const ts = new Date(dateStr).getTime();
    if (!isNaN(ts)) return ts;
    const yMatch = String(dateStr).match(/\b(19\d\d|20\d\d)\b/);
    if (yMatch) return new Date(`${yMatch[1]}-01-01`).getTime();
    return 0;
  };

  // ORDER 1: ID3/ID4 Copyright Tag
  if (tags) {
    const copyrightCandidates = [
      tags['©cpr'],
      tags.cprt,
      tags.TCOP,
      tags.copyright,
      tags.CPRT,
      tags.COPYRIGHT,
    ];
    for (const cand of copyrightCandidates) {
      const text = typeof cand === 'string' ? cand : cand?.data;
      const parsed = parseDateFromText(text);
      if (parsed) return { date: parsed, timestamp: getTimestamp(parsed), source: 'Copyright Tag' };
    }

    for (const key of Object.keys(tags)) {
      const kLow = key.toLowerCase();
      if (kLow.includes('cpr') || kLow.includes('copyright') || key.toUpperCase() === 'TCOP') {
        const val = tags[key];
        const text = typeof val === 'string' ? val : val?.data;
        const parsed = parseDateFromText(text);
        if (parsed) return { date: parsed, timestamp: getTimestamp(parsed), source: 'Copyright Tag' };
      }
    }

    // ORDER 2: Modified Tag in ID4 / ID3
    const modifiedCandidates = [
      tags['©day'],
      tags.day,
      tags.TDRC,
      tags.TYER,
      tags.year,
      tags.TDAT,
      tags.date,
      tags.DATE,
      tags.MODIFIED,
    ];
    for (const cand of modifiedCandidates) {
      const text = typeof cand === 'string' ? String(cand) : String(cand?.data || '');
      const parsed = parseDateFromText(text);
      if (parsed) return { date: parsed, timestamp: getTimestamp(parsed), source: 'ID4 Modified Tag' };
    }
  }

  // ORDER 3: File Creation Date (stats.birthtime or stats.ctime)
  if (stats) {
    let fileDate = null;
    if (stats.birthtime && !isNaN(new Date(stats.birthtime).getTime()) && new Date(stats.birthtime).getFullYear() > 1980) {
      fileDate = new Date(stats.birthtime);
    } else if (stats.ctime && !isNaN(new Date(stats.ctime).getTime())) {
      fileDate = new Date(stats.ctime);
    } else if (stats.mtime && !isNaN(new Date(stats.mtime).getTime())) {
      fileDate = new Date(stats.mtime);
    }

    if (fileDate && !isNaN(fileDate.getTime())) {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const m = months[fileDate.getMonth()];
      const d = fileDate.getDate();
      const y = fileDate.getFullYear();
      return { date: `${m} ${d}, ${y}`, timestamp: fileDate.getTime(), source: 'File Creation Date' };
    }
  }

  return { date: null, timestamp: 0, source: null };
};

// Directory scanning helper
function scanDirectoryFiles(dirPath, baseDir) {
  let filesList = [];
  let playlistsList = [];

  if (!fs.existsSync(dirPath)) {
    return { files: [], playlists: [] };
  }

  try {
    const items = fs.readdirSync(dirPath, { withFileTypes: true });

    for (const item of items) {
      const fullPath = path.join(dirPath, item.name);
      const relativePath = path.relative(baseDir, fullPath).replace(/\\/g, '/');

      if (item.isDirectory()) {
        const sub = scanDirectoryFiles(fullPath, baseDir);
        filesList = filesList.concat(sub.files);
        playlistsList = playlistsList.concat(sub.playlists);
      } else if (item.isFile()) {
        const ext = path.extname(item.name).toLowerCase();
        if (AUDIO_EXTENSIONS.has(ext)) {
          const stats = fs.statSync(fullPath);
          const pathParts = relativePath.split('/');
          let artistGuess = 'Unknown Artist';
          let albumGuess = 'Unknown Album';

          if (pathParts.length >= 3) {
            artistGuess = pathParts[pathParts.length - 3];
            albumGuess = pathParts[pathParts.length - 2];
          } else if (pathParts.length === 2) {
            artistGuess = pathParts[0];
            albumGuess = pathParts[0];
          }

          filesList.push({
            id: Buffer.from(relativePath).toString('base64url'),
            fullPath,
            relativePath,
            fileName: item.name,
            size: stats.size,
            mtimeMs: Math.floor(stats.mtimeMs),
            birthtime: stats.birthtime,
            ctime: stats.ctime,
            mtime: stats.mtime,
            ext,
            artistGuess,
            albumGuess,
            titleGuess: item.name.replace(ext, '').replace(/^\d+[\s._-]+/, ''),
          });
        } else if (PLAYLIST_EXTENSIONS.has(ext)) {
          try {
            const content = fs.readFileSync(fullPath, 'utf-8');
            const lines = content.split(/\r?\n/);
            const tracks = [];
            let playlistName = item.name.replace(ext, '').trim();

            let isArtistPlaylist = false;
            for (let line of lines) {
              line = line.trim();
              if (line.startsWith('#PLAYLIST:')) {
                const nameHeader = line.replace('#PLAYLIST:', '').trim();
                if (nameHeader) playlistName = nameHeader;
              } else if (line.startsWith('#TYPE:ARTIST')) {
                isArtistPlaylist = true;
              } else if (line && !line.startsWith('#')) {
                tracks.push(line.replace(/\\/g, '/'));
              }
            }

            playlistsList.push({
              id: Buffer.from(relativePath).toString('base64url'),
              name: playlistName,
              relativePath,
              tracks,
              isArtistPlaylist,
            });
          } catch (e) {
            console.error(`Failed to parse playlist ${relativePath}:`, e);
          }
        }
      }
    }
  } catch (err) {
    console.error(`Error scanning dir ${dirPath}:`, err);
  }

  return { files: filesList, playlists: playlistsList };
}

// Helper to recursively collect all audio tracks inside a folder
function collectFolderAudioTracks(dirPath, baseDir) {
  let tracks = [];
  if (!fs.existsSync(dirPath)) return tracks;
  try {
    const items = fs.readdirSync(dirPath, { withFileTypes: true });
    for (const item of items) {
      const fullPath = path.join(dirPath, item.name);
      if (item.isDirectory()) {
        tracks = tracks.concat(collectFolderAudioTracks(fullPath, baseDir));
      } else if (item.isFile()) {
        const ext = path.extname(item.name).toLowerCase();
        if (AUDIO_EXTENSIONS.has(ext)) {
          const relativePath = path.relative(baseDir, fullPath).replace(/\\/g, '/');
          tracks.push(relativePath);
        }
      }
    }
  } catch (err) {
    console.error(`[Artist Playlist Sync] Error scanning artist dir ${dirPath}:`, err);
  }
  return tracks;
}

// Automatically create & sync .m3u playlists for each root artist folder in MusicLocation
function generateAndSyncArtistPlaylists(targetFolder) {
  if (!targetFolder || !fs.existsSync(targetFolder)) return;

  try {
    const rootItems = fs.readdirSync(targetFolder, { withFileTypes: true });

    for (const item of rootItems) {
      if (item.isDirectory() && !item.name.startsWith('.')) {
        const artistName = item.name;
        const artistDirPath = path.join(targetFolder, artistName);
        const tracks = collectFolderAudioTracks(artistDirPath, targetFolder);

        if (tracks.length === 0) continue;

        // Sort tracks naturally by path
        tracks.sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));

        const playlistFileName = `${artistName}.m3u`;
        const playlistPath = path.join(targetFolder, playlistFileName);

        const m3uLines = [
          '#EXTM3U',
          `#PLAYLIST:${artistName}`,
          '#TYPE:ARTIST',
          ...tracks
        ];
        const newM3uContent = m3uLines.join('\n') + '\n';

        let existingContent = '';
        if (fs.existsSync(playlistPath)) {
          try {
            existingContent = fs.readFileSync(playlistPath, 'utf-8');
          } catch (e) { }
        }

        // Only write to disk if playlist does not exist or track list has changed
        if (existingContent.trim() !== newM3uContent.trim()) {
          fs.writeFileSync(playlistPath, newM3uContent, 'utf-8');
          console.log(`[Artist Playlist Sync] Updated playlist "${playlistFileName}" (${tracks.length} track(s))`);
        }
      }
    }
  } catch (err) {
    console.error(`[Artist Playlist Sync] Error synchronizing artist playlists in "${targetFolder}":`, err);
  }
}

// In-Memory Media Cache & Active Scan Deduplication Promise
let scannedPlaylistsCache = [];
let scannedFilesCache = [];
let activeScanPromise = null;

// Full Server Scan & ID3 Parsing Pipeline
async function scanAndParseServerFolder() {
  loadServerConfig();
  const targetFolder = appConfig.MusicLocation || appConfig.mediaFolder;

  console.log(`[Server Scanner] Scanning MusicLocation: "${targetFolder}"`);

  if (!targetFolder || !fs.existsSync(targetFolder)) {
    console.warn(`[Server Scanner] Warning: MusicLocation directory "${targetFolder}" does not exist!`);
    scannedFilesCache = [];
    scannedPlaylistsCache = [];
    return { files: [], playlists: [] };
  }

  // Auto-generate and synchronize artist playlists before scanning directory items
  generateAndSyncArtistPlaylists(targetFolder);

  const { files: rawFiles, playlists } = scanDirectoryFiles(targetFolder, targetFolder);

  // Sort playlists: custom playlists first, artist playlists at the bottom (alphabetically within each group)
  playlists.sort((a, b) => {
    if (Boolean(a.isArtistPlaylist) !== Boolean(b.isArtistPlaylist)) {
      return a.isArtistPlaylist ? 1 : -1;
    }
    return a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' });
  });

  scannedPlaylistsCache = playlists;
  console.log(`[Server Scanner] Discovered ${rawFiles.length} audio file(s) and ${playlists.length} playlist(s) in "${targetFolder}".`);

  const parsedTracks = [];
  let cacheUpdated = false;

  for (const file of rawFiles) {
    const cached = serverMetadataCache[file.id];
    if (cached && cached.size === file.size && Math.floor(cached.mtimeMs) === file.mtimeMs && cached.publishDate !== undefined) {
      parsedTracks.push(cached);
      continue;
    }

    console.log(`[Server Scanner] Parsing ID3 tags for: ${file.relativePath}`);
    const tag = await readTagsNode(file.fullPath);
    const tags = tag?.tags || {};

    let coverFormat = null;
    let coverBase64 = null;
    const pic = extractPictureBuffer(tags.picture);
    if (pic) {
      coverFormat = pic.format;
      coverBase64 = pic.buffer.toString('base64');
    }

    const lyrics = extractLyrics(tags);
    const stats = fs.existsSync(file.fullPath) ? fs.statSync(file.fullPath) : null;
    const pubInfo = extractPublishDate(tags, stats);

    const trackObj = {
      id: file.id,
      relativePath: file.relativePath,
      fileName: file.fileName,
      size: file.size,
      mtimeMs: file.mtimeMs,
      title: tags.title || file.titleGuess,
      artist: tags.artist || file.artistGuess,
      album: tags.album || file.albumGuess,
      albumArtist: tags.artist || file.artistGuess,
      year: tags.year || null,
      publishDate: pubInfo.date,
      publishTimestamp: pubInfo.timestamp,
      dateSource: pubInfo.source,
      track: tags.track || null,
      genre: tags.genre || null,
      duration: 0,
      hasCover: Boolean(pic),
      coverFormat,
      coverBase64,
      hasLyrics: Boolean(lyrics),
      lyrics,
    };

    serverMetadataCache[file.id] = trackObj;
    parsedTracks.push(trackObj);
    cacheUpdated = true;
  }

  if (cacheUpdated) {
    saveMetadataCache();
  }

  scannedFilesCache = parsedTracks;
  return { files: parsedTracks, playlists };
}

function getOrScanMediaFolder(forceRescan = false) {
  loadServerConfig();
  if (activeScanPromise) {
    return activeScanPromise;
  }

  if (!forceRescan && scannedFilesCache.length > 0 && scannedPlaylistsCache.length > 0) {
    return Promise.resolve({
      files: scannedFilesCache,
      playlists: scannedPlaylistsCache,
    });
  }

  activeScanPromise = scanAndParseServerFolder().finally(() => {
    activeScanPromise = null;
  });

  return activeScanPromise;
}

function isPlaylistMatch(p, nameOrId) {
  if (!nameOrId) return false;
  const rawTarget = String(nameOrId).toLowerCase().trim();
  const targetStripped = rawTarget.replace(/\.(m3u8?|pls)$/i, '');

  const plId = String(p.id || '').toLowerCase();
  const plName = String(p.name || '').toLowerCase().trim();
  const plNameStripped = plName.replace(/\.(m3u8?|pls)$/i, '');

  const plRel = String(p.relativePath || '').toLowerCase().trim();
  const plRelStripped = plRel.replace(/\.(m3u8?|pls)$/i, '');

  const plFile = plRel ? path.basename(plRel).toLowerCase() : '';
  const plFileStripped = plFile.replace(/\.(m3u8?|pls)$/i, '');

  return (
    plId === rawTarget ||
    plName === rawTarget ||
    plRel === rawTarget ||
    plFile === rawTarget ||
    plNameStripped === targetStripped ||
    plRelStripped === targetStripped ||
    plFileStripped === targetStripped
  );
}

function getUserRoleAndAllowedPlaylists(sessionUser) {
  if (!sessionUser) return { role: null, allowedList: null };

  const currentDbUser = (appConfig.Users || []).find(
    (u) => u.username.toLowerCase() === String(sessionUser.username).toLowerCase()
  );

  const effectiveRole = currentDbUser ? (currentDbUser.role || sessionUser.role) : sessionUser.role;

  if (String(effectiveRole).toLowerCase() === 'admin') {
    return { role: 'admin', allowedList: ['all'] };
  }

  let allowedList = null;
  if (currentDbUser) {
    if (Array.isArray(currentDbUser.AllowedPlaylist)) allowedList = currentDbUser.AllowedPlaylist;
    else if (Array.isArray(currentDbUser.allowedPlaylists)) allowedList = currentDbUser.allowedPlaylists;
    else if (Array.isArray(currentDbUser.AllowedPlaylists)) allowedList = currentDbUser.AllowedPlaylists;
  }

  if (!allowedList) {
    const rolesList = appConfig.Roles || [];
    const roleDef = rolesList.find(
      (r) => String(r.role || r.name).toLowerCase() === String(effectiveRole).toLowerCase()
    );
    if (roleDef) {
      if (Array.isArray(roleDef.AllowedPlaylist)) allowedList = roleDef.AllowedPlaylist;
      else if (Array.isArray(roleDef.allowedPlaylists)) allowedList = roleDef.allowedPlaylists;
      else if (Array.isArray(roleDef.AllowedPlaylists)) allowedList = roleDef.AllowedPlaylists;
    }
  }

  return { role: effectiveRole, allowedList };
}

function getAllowedPlaylistsForReq(playlists, req = null) {
  const sessionUser = req ? getSessionUser(req) : null;

  if (sessionUser) {
    const { role, allowedList } = getUserRoleAndAllowedPlaylists(sessionUser);
    if (role === 'admin' || (allowedList && allowedList.some((item) => String(item).toLowerCase() === 'all'))) {
      return playlists;
    }
    if (Array.isArray(allowedList)) {
      return playlists.filter((p) =>
        allowedList.some((nameOrId) => isPlaylistMatch(p, nameOrId))
      );
    }
    return [];
  }

  const lockedList = appConfig.LockedPlaylists;
  if (Array.isArray(lockedList) && lockedList.length > 0) {
    return playlists.filter((p) =>
      lockedList.some((nameOrId) => isPlaylistMatch(p, nameOrId))
    );
  }
  return playlists;
}

// Server Security Guard for LockedPlaylists & Role AllowedPlaylists
function isAllowedPath(fileRelPath, scannedPlaylists, req = null) {
  const sessionUser = req ? getSessionUser(req) : null;

  if (sessionUser) {
    const { role, allowedList } = getUserRoleAndAllowedPlaylists(sessionUser);
    if (role === 'admin' || (allowedList && allowedList.some((item) => String(item).toLowerCase() === 'all'))) {
      return true;
    }
    const allowedPlaylists = getAllowedPlaylistsForReq(scannedPlaylists, req);
    if (allowedPlaylists.length === 0) return false;
    return allowedPlaylists.some((pl) =>
      pl.tracks && pl.tracks.some((p) => fileRelPath === p || fileRelPath.endsWith(p) || p.endsWith(fileRelPath))
    );
  }

  const lockedList = appConfig.LockedPlaylists;
  if (!Array.isArray(lockedList) || lockedList.length === 0) {
    return true;
  }

  const targetPlaylists = scannedPlaylists.filter((p) =>
    lockedList.some((nameOrId) => isPlaylistMatch(p, nameOrId))
  );

  if (targetPlaylists.length === 0) return false;

  return targetPlaylists.some((pl) =>
    pl.tracks && pl.tracks.some((p) => fileRelPath === p || fileRelPath.endsWith(p) || p.endsWith(fileRelPath))
  );
}

function filterAllowedTracks(tracks, playlists, req = null) {
  const sessionUser = req ? getSessionUser(req) : null;

  if (sessionUser) {
    const { role, allowedList } = getUserRoleAndAllowedPlaylists(sessionUser);
    if (role === 'admin' || (allowedList && allowedList.some((item) => String(item).toLowerCase() === 'all'))) {
      return tracks;
    }
    const allowedPlaylists = getAllowedPlaylistsForReq(playlists, req);
    if (allowedPlaylists.length === 0) return [];
    return tracks.filter((t) =>
      allowedPlaylists.some((pl) =>
        pl.tracks && pl.tracks.some((p) => t.relativePath === p || t.relativePath.endsWith(p) || p.endsWith(t.relativePath))
      )
    );
  }

  const lockedList = appConfig.LockedPlaylists;
  if (!Array.isArray(lockedList) || lockedList.length === 0) {
    return tracks;
  }

  const targetPlaylists = playlists.filter((p) =>
    lockedList.some((nameOrId) => isPlaylistMatch(p, nameOrId))
  );

  if (targetPlaylists.length === 0) return [];

  return tracks.filter((t) =>
    targetPlaylists.some((pl) =>
      pl.tracks && pl.tracks.some((p) => t.relativePath === p || t.relativePath.endsWith(p) || p.endsWith(t.relativePath))
    )
  );
}

function formatLightTrack(t) {
  const { coverBase64, lyrics, ...light } = t;
  const fullPath = path.join(appConfig.mediaFolder, t.relativePath);
  const folderCoverFile = findFolderCoverFile(fullPath);
  light.hasFolderCover = Boolean(folderCoverFile && !folderCoverFile.toLowerCase().endsWith('rubycardinal.png'));
  return light;
}

// API Routes

// Authentication API Routes
app.post('/api/auth/login', (req, res) => {
  loadServerConfig();
  const { username, password } = req.body || {};
  if (!username) {
    return res.status(400).json({ error: 'Username is required' });
  }

  const clientIp = req.ip || req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown';
  const rateLimitCheck = checkLoginRateLimit(clientIp, username);

  if (!rateLimitCheck.allowed) {
    return res.status(429).json({ error: rateLimitCheck.message });
  }

  const user = appConfig.Users.find((u) => u.username.toLowerCase() === String(username).toLowerCase());

  if (!user) {
    recordFailedLogin(clientIp, username);
    return res.status(401).json({ error: 'Invalid username or password' });
  }

  if (String(user.username).toLowerCase() === 'admin' && !user.passwordHash) {
    const { hash } = hashPassword('admin');
    user.passwordHash = hash;
    saveUsers();
  }

  if (!user.passwordHash || !verifyPassword(password, user.passwordHash)) {
    recordFailedLogin(clientIp, username);
    return res.status(401).json({ error: 'Invalid username or password' });
  }

  const isFirstTime = user.mustResetPassword === true;

  clearFailedLogin(clientIp, username);
  const session = createSession(user);

  res.json({
    success: true,
    token: session.token,
    mustResetPassword: isFirstTime,
    user: {
      username: user.username,
      role: user.role || 'user',
    },
  });
});

app.post('/api/auth/set-password', (req, res) => {
  const session = getSessionUser(req);
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized session' });
  }

  const { newPassword } = req.body || {};
  if (!newPassword || newPassword.length < 1) {
    return res.status(400).json({ error: 'New password is required' });
  }

  const user = appConfig.Users.find((u) => u.username.toLowerCase() === session.username.toLowerCase());
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const { hash } = hashPassword(newPassword);
  user.passwordHash = hash;
  delete user.salt;
  delete user.mustResetPassword;

  saveUsers();
  console.log(`[Server Auth] User "${user.username}" successfully set their initial password.`);

  res.json({
    success: true,
    user: {
      username: user.username,
      role: user.role || 'user',
    },
  });
});

app.post('/api/auth/logout', (req, res) => {
  const authHeader = req.headers.authorization;
  let token = null;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.slice(7).trim();
  } else if (req.body && req.body.token) {
    token = req.body.token;
  }
  if (token && activeSessions.has(token)) {
    activeSessions.delete(token);
    saveUsers();
  }
  res.json({ success: true });
});

app.get('/api/auth/me', (req, res) => {
  const session = getSessionUser(req);
  if (!session) {
    return res.status(401).json({ authenticated: false });
  }
  res.json({
    authenticated: true,
    user: {
      username: session.username,
      role: session.role,
    },
  });
});

app.post('/api/config/users', (req, res) => {
  const session = getSessionUser(req);
  if (!session) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const { action, username, password, newPassword } = req.body || {};

  if (action === 'changePassword') {
    if (!newPassword || typeof newPassword !== 'string' || newPassword.trim().length === 0) {
      return res.status(400).json({ error: 'New password is required' });
    }

    const targetUser = appConfig.Users.find(
      (u) => u.username.toLowerCase() === session.username.toLowerCase()
    );
    if (!targetUser) return res.status(404).json({ error: 'User not found' });

    if (targetUser.passwordHash) {
      if (!password) {
        return res.status(400).json({ error: 'Current password is required' });
      }
      if (!verifyPassword(password, targetUser.passwordHash)) {
        return res.status(401).json({ error: 'Incorrect current password' });
      }
    }

    const { hash } = hashPassword(newPassword);
    targetUser.passwordHash = hash;
    delete targetUser.salt;
    delete targetUser.mustResetPassword;

    saveUsers();
    console.log(`[Server Users] Password successfully updated for user "${targetUser.username}".`);
    return res.json({ success: true, message: 'Password updated successfully' });
  }

  res.status(400).json({ error: 'Invalid action' });
});

app.post('/api/playlist/save', async (req, res) => {
  const session = getSessionUser(req);
  if (!session || session.role !== 'admin') {
    return res.status(403).json({ error: 'Admin privileges required to save playlists' });
  }

  const { name, tracks } = req.body || {};
  if (!name || typeof name !== 'string' || !name.trim()) {
    return res.status(400).json({ error: 'Playlist name is required' });
  }

  if (!Array.isArray(tracks)) {
    return res.status(400).json({ error: 'Tracks list must be an array' });
  }

  let fileName = name.trim();
  if (!fileName.toLowerCase().endsWith('.m3u') && !fileName.toLowerCase().endsWith('.m3u8')) {
    fileName += '.m3u';
  }

  const targetDir = appConfig.MusicLocation || appConfig.mediaFolder;
  if (!targetDir || !fs.existsSync(targetDir)) {
    return res.status(500).json({ error: 'Music directory does not exist' });
  }

  const filePath = path.join(targetDir, fileName);
  const resolvedTarget = path.resolve(targetDir);
  const resolvedFile = path.resolve(filePath);

  if (!resolvedFile.startsWith(resolvedTarget)) {
    return res.status(400).json({ error: 'Invalid playlist file path' });
  }

  try {
    const fileContent = '#EXTM3U\n' + tracks.join('\n') + '\n';
    fs.writeFileSync(filePath, fileContent, 'utf-8');

    // Force re-scan media folder so new/edited playlist updates immediately
    await getOrScanMediaFolder(true);

    res.json({
      success: true,
      message: `Playlist "${fileName}" saved successfully`,
      filename: fileName,
    });
  } catch (err) {
    console.error('Error saving playlist file:', err);
    res.status(500).json({ error: 'Failed to write playlist file: ' + err.message });
  }
});

app.get('/api/config', (req, res) => {
  const session = getSessionUser(req);
  res.json({
    isAuthenticated: Boolean(session),
  });
});

app.get('/api/scan', async (req, res) => {
  try {
    const force = req.query.force === 'true';
    const { files, playlists } = await getOrScanMediaFolder(force);
    const allowedPlaylists = getAllowedPlaylistsForReq(playlists, req);
    const allowedTracks = filterAllowedTracks(files, playlists, req);
    const lightTracks = allowedTracks.map(formatLightTrack);

    res.json({
      totalFiles: lightTracks.length,
      files: lightTracks,
      playlists: allowedPlaylists,
    });
  } catch (err) {
    console.error('Scan error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/tracks', async (req, res) => {
  try {
    const { files, playlists } = await getOrScanMediaFolder(false);
    const allowedTracks = filterAllowedTracks(files, playlists, req);
    res.json(allowedTracks.map(formatLightTrack));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Embedded Track Cover Art Endpoint
app.get('/api/cover', async (req, res) => {
  const trackId = req.query.id;
  if (!trackId) return res.status(400).send('Missing track id');

  const cached = serverMetadataCache[trackId];
  if (!cached || !cached.hasCover || !cached.coverBase64) {
    return res.status(404).send('Cover image not found');
  }

  if (!isAllowedPath(cached.relativePath, scannedPlaylistsCache, req)) {
    return res.status(403).send('Access denied: Player locked to playlist');
  }

  const imgBuffer = Buffer.from(cached.coverBase64, 'base64');
  res.setHeader('Content-Type', cached.coverFormat || 'image/jpeg');
  res.setHeader('Cache-Control', 'public, max-age=86400');
  res.send(imgBuffer);
});

// Folder cover.png or Fallback Brand Logo Endpoint
app.get('/api/folder-cover', async (req, res) => {
  const trackId = req.query.id;
  let songFullPath = null;

  if (trackId) {
    if (serverMetadataCache[trackId]) {
      const cached = serverMetadataCache[trackId];
      songFullPath = path.join(appConfig.mediaFolder, cached.relativePath);
    } else {
      try {
        const decoded = Buffer.from(trackId, 'base64url').toString('utf-8');
        const candidate = path.join(appConfig.mediaFolder, decoded);
        if (fs.existsSync(candidate)) {
          songFullPath = candidate;
        }
      } catch (e) { }
    }
  }

  const targetFile = findFolderCoverFile(songFullPath);

  if (!targetFile || !fs.existsSync(targetFile)) {
    return res.status(404).send('Cover image not found');
  }

  const ext = path.extname(targetFile).toLowerCase();
  let mime = 'image/png';
  if (ext === '.jpg' || ext === '.jpeg') mime = 'image/jpeg';
  else if (ext === '.svg') mime = 'image/svg+xml';

  res.setHeader('Content-Type', mime);
  res.setHeader('Cache-Control', 'public, max-age=86400');
  res.sendFile(targetFile);
});

app.get('/api/lyrics', async (req, res) => {
  const trackId = req.query.id;
  if (!trackId) return res.status(400).json({ error: 'Missing track id' });

  const cached = serverMetadataCache[trackId];
  if (!cached) {
    return res.status(404).json({ error: 'Track not found' });
  }

  if (!isAllowedPath(cached.relativePath, scannedPlaylistsCache, req)) {
    return res.status(403).json({ error: 'Access denied: Player locked to playlist' });
  }

  res.json({
    id: cached.id,
    lyrics: cached.lyrics || null,
  });
});

app.get('/api/stream', async (req, res) => {
  let fileRelPath = req.query.path || req.query.id;
  if (!fileRelPath) {
    return res.status(400).send('Missing path or id parameter');
  }

  // 1. Check metadata cache first
  if (serverMetadataCache[fileRelPath]) {
    fileRelPath = serverMetadataCache[fileRelPath].relativePath;
  } else {
    // 2. Try decoding as base64url
    try {
      const decoded = Buffer.from(fileRelPath, 'base64url').toString('utf-8');
      if (decoded && fs.existsSync(path.join(appConfig.mediaFolder, decoded))) {
        fileRelPath = decoded;
      }
    } catch (e) { }
  }

  const fullPath = path.join(appConfig.mediaFolder, fileRelPath);

  if (!fullPath.startsWith(path.resolve(appConfig.mediaFolder))) {
    return res.status(403).send('Access denied');
  }

  if (!isAllowedPath(fileRelPath, scannedPlaylistsCache, req)) {
    return res.status(403).send('Access denied: Locked playlist restriction active');
  }

  if (!fs.existsSync(fullPath)) {
    return res.status(404).send('File not found');
  }

  const stat = fs.statSync(fullPath);
  const fileSize = stat.size;
  const range = req.headers.range;

  const ext = path.extname(fullPath).toLowerCase();
  const mimeTypes = {
    '.mp3': 'audio/mpeg',
    '.flac': 'audio/flac',
    '.m4a': 'audio/mp4',
    '.ogg': 'audio/ogg',
    '.wav': 'audio/wav',
    '.aac': 'audio/aac',
    '.opus': 'audio/opus',
  };
  const contentType = mimeTypes[ext] || 'application/octet-stream';

  if (range) {
    const parts = range.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunksize = end - start + 1;
    const file = fs.createReadStream(fullPath, { start, end });

    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': contentType,
    };

    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      'Content-Length': fileSize,
      'Content-Type': contentType,
    };
    res.writeHead(200, head);
    fs.createReadStream(fullPath).pipe(res);
  }
});

app.get('/api/download', async (req, res) => {
  const session = getSessionUser(req);
  if (!session) {
    return res.status(401).json({ error: 'Authentication required to download tracks' });
  }

  let fileRelPath = req.query.path || req.query.id;
  if (!fileRelPath) {
    return res.status(400).send('Missing path or id parameter');
  }

  let trackObj = null;
  if (serverMetadataCache[fileRelPath]) {
    trackObj = serverMetadataCache[fileRelPath];
    fileRelPath = trackObj.relativePath;
  } else {
    try {
      const decoded = Buffer.from(fileRelPath, 'base64url').toString('utf-8');
      if (decoded && fs.existsSync(path.join(appConfig.mediaFolder, decoded))) {
        fileRelPath = decoded;
      }
    } catch (e) { }
  }

  const fullPath = path.join(appConfig.mediaFolder, fileRelPath);

  if (!fullPath.startsWith(path.resolve(appConfig.mediaFolder))) {
    return res.status(403).send('Access denied');
  }

  if (!isAllowedPath(fileRelPath, scannedPlaylistsCache, req)) {
    return res.status(403).send('Access denied: Locked playlist restriction active');
  }

  if (!fs.existsSync(fullPath)) {
    return res.status(404).send('File not found');
  }

  const ext = path.extname(fullPath) || '.mp3';
  let title = trackObj?.title;
  let artist = trackObj?.artist;

  let downloadName = '';
  if (artist && artist !== 'Unknown Artist' && title) {
    downloadName = `${artist} - ${title}${ext}`;
  } else if (title) {
    downloadName = `${title}${ext}`;
  } else {
    downloadName = path.basename(fullPath);
  }

  const safeFilename = downloadName.replace(/[/\\?%*:|"<>]/g, '_').trim();

  res.download(fullPath, safeFilename, (err) => {
    if (err && !res.headersSent) {
      res.status(500).send('Error downloading file');
    }
  });
});

app.listen(PORT, '0.0.0.0', async () => {
  console.log(`RubyPlayer Server listening on http://0.0.0.0:${PORT} (all network interfaces)`);
  console.log(`[Server Ready] MusicLocation: "${appConfig.MusicLocation || appConfig.mediaFolder}"`);
  try {
    const { files, playlists } = await scanAndParseServerFolder();
    console.log(`[Server Ready] Media library primed with ${files.length} track(s) and ${playlists.length} playlist(s).`);
  } catch (err) {
    console.error('[Server Scanner] Startup scan notice:', err);
  }
});
