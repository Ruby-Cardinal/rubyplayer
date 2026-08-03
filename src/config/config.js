import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const ROOT_DIR = process.cwd();

export const CONFIG_FILE = path.join(ROOT_DIR, 'rubyplayer_config.json');
export const USERS_FILE = path.join(ROOT_DIR, 'user_rubymusic.json');
export const CACHE_FILE = path.join(ROOT_DIR, 'rubyplayer_metadata_cache.json');

export const appConfig = {
  mediaFolder: path.join(ROOT_DIR, 'music'),
  MusicLocation: path.join(ROOT_DIR, 'music'),
  LockedPlaylists: [],
  Users: [],
  Roles: [],
};

export const activeSessions = new Map();

let isSavingConfig = false;
let isSavingUsers = false;
let lastConfigWriteTime = 0;
let lastUsersWriteTime = 0;

function hashToken(token) {
  if (!token || typeof token !== 'string') return null;
  return crypto.createHash('sha256').update(token).digest('hex');
}

function hashPassword(password) {
  return { hash: bcrypt.hashSync(password, 10) };
}

export function saveConfig() {
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

export function saveUsers() {
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

export function loadServerUsers(isInitialBoot = false) {
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
        let migrationNeeded = false;
        for (const s of saved.Sessions) {
          if (!s || s.expiresAt <= now) continue;
          let tHash = s.tokenHash;
          if (!tHash && s.token) {
            tHash = hashToken(s.token);
            s.tokenHash = tHash;
            delete s.token;
            migrationNeeded = true;
          }
          if (tHash) {
            activeSessions.set(tHash, s);
            restoredCount++;
          }
        }
        if (migrationNeeded) {
          saveUsers();
          console.log('[Server Auth] Migrated active session tokens to SHA-256 hashes in user_rubymusic.json.');
        }
        if (isInitialBoot && restoredCount > 0) {
          console.log(`[Server Auth] Restored ${restoredCount} active session(s) from user_rubymusic.json.`);
        }
      }
    } catch (err) {
      console.error('Error reading user_rubymusic.json:', err);
    }
  }

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

      if (sourceFileData) {
        delete sourceFileData.DefaultPassword;
        fs.writeFileSync(defaultPasswordSourceFile, JSON.stringify(sourceFileData, null, 2));
      }
      saveUsers();
    }
  } else if (!appConfig.serverHash && isInitialBoot) {
    console.warn('[Server Auth] Notice: DefaultPassword is not configured in user_rubymusic.json or rubyplayer_config.json.');
  }

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

export function loadServerConfig(isInitialBoot = false) {
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

  loadServerUsers(isInitialBoot);
}

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

export let serverMetadataCache = {};
if (fs.existsSync(CACHE_FILE)) {
  try {
    serverMetadataCache = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf-8'));
  } catch (err) {
    console.error('Error reading metadata cache file:', err);
  }
}

export function saveMetadataCache() {
  try {
    fs.writeFileSync(CACHE_FILE, JSON.stringify(serverMetadataCache, null, 2));
  } catch (err) {
    console.error('Error writing metadata cache file:', err);
  }
}
