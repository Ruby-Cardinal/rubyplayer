import fs from 'fs';
import path from 'path';
import jsmediatags from 'jsmediatags';
import { appConfig, loadServerConfig, serverMetadataCache, saveMetadataCache } from '../config/config.js';
import { getSessionUser } from './authService.js';

export const AUDIO_EXTENSIONS = new Set(['.mp3', '.flac', '.m4a', '.ogg', '.wav', '.aac', '.wma', '.opus']);
export const PLAYLIST_EXTENSIONS = new Set(['.m3u', '.m3u8', '.pls']);

export function findFolderCoverFile(songFullPath) {
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

  const rubyMatch = checkDirForCover(appConfig.mediaFolder, 'ruby-winged-logo.svg') || checkDirForCover(appConfig.mediaFolder, 'ruby-winged-logo.png');
  if (rubyMatch) return rubyMatch;

  const rootMatch = checkDirForCover(appConfig.mediaFolder);
  if (rootMatch) return rootMatch;

  const publicLogo = path.join(process.cwd(), 'public', 'ruby-winged-logo.svg');
  if (fs.existsSync(publicLogo)) return publicLogo;

  return null;
}

export function readTagsNode(filePath) {
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

export function extractLyrics(tags) {
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

export function extractPictureBuffer(picture) {
  if (!picture || !picture.data) return null;
  try {
    const format = picture.format || 'image/jpeg';
    const buffer = Buffer.from(picture.data);
    return { format, buffer };
  } catch (err) {
    return null;
  }
}

export function extractPublishDate(tags, stats) {
  const parseDateFromText = (text) => {
    if (!text || typeof text !== 'string') return null;
    const str = text.trim();
    if (!str) return null;

    const monthNames = 'January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec';

    const fullDateRegex = new RegExp(`(${monthNames})\\s+(\\d{1,2})[th|st|nd|rd,]*\\s+(\\d{4})`, 'i');
    const matchFull = str.match(fullDateRegex);
    if (matchFull) {
      return `${matchFull[1]} ${matchFull[2]}, ${matchFull[3]}`;
    }

    const reverseDateRegex = new RegExp(`(\\d{1,2})\\s+(${monthNames})\\s+(\\d{4})`, 'i');
    const matchRev = str.match(reverseDateRegex);
    if (matchRev) {
      return `${matchRev[2]} ${matchRev[1]}, ${matchRev[3]}`;
    }

    const monthYearRegex = new RegExp(`(${monthNames})\\s+(\\d{4})`, 'i');
    const matchMY = str.match(monthYearRegex);
    if (matchMY) {
      return `${matchMY[1]} ${matchMY[2]}`;
    }

    const isoMatch = str.match(/\b(19\d\d|20\d\d)[-/.](0[1-9]|1[0-2])[-/.](0[1-9]|[12]\d|3[01])\b/);
    if (isoMatch) {
      const year = isoMatch[1];
      const monthIdx = parseInt(isoMatch[2], 10) - 1;
      const day = parseInt(isoMatch[3], 10);
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return `${months[monthIdx]} ${day}, ${year}`;
    }

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
}

export function scanDirectoryFiles(dirPath, baseDir) {
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

export function collectFolderAudioTracks(dirPath, baseDir) {
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

export function generateAndSyncArtistPlaylists(targetFolder) {
  if (!targetFolder || !fs.existsSync(targetFolder)) return;

  try {
    const rootItems = fs.readdirSync(targetFolder, { withFileTypes: true });

    for (const item of rootItems) {
      if (item.isDirectory() && !item.name.startsWith('.')) {
        const artistName = item.name;
        const artistDirPath = path.join(targetFolder, artistName);
        const tracks = collectFolderAudioTracks(artistDirPath, targetFolder);

        if (tracks.length === 0) continue;

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

export let scannedPlaylistsCache = [];
export let scannedFilesCache = [];
let activeScanPromise = null;

export async function scanAndParseServerFolder() {
  loadServerConfig();
  const targetFolder = appConfig.MusicLocation || appConfig.mediaFolder;

  console.log(`[Server Scanner] Scanning MusicLocation: "${targetFolder}"`);

  if (!targetFolder || !fs.existsSync(targetFolder)) {
    console.warn(`[Server Scanner] Warning: MusicLocation directory "${targetFolder}" does not exist!`);
    scannedFilesCache = [];
    scannedPlaylistsCache = [];
    return { files: [], playlists: [] };
  }

  const { files: rawFiles, playlists: rawPlaylists } = scanDirectoryFiles(targetFolder, targetFolder);
  const playlists = rawPlaylists.filter((p) => !p.isArtistPlaylist);

  playlists.sort((a, b) => {
    return a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' });
  });

  scannedPlaylistsCache = playlists;
  console.log(`[Server Scanner] Discovered ${rawFiles.length} audio file(s) and ${playlists.length} user playlist(s) in "${targetFolder}".`);

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

export function getOrScanMediaFolder(forceRescan = false) {
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

export function isPlaylistMatch(p, nameOrId) {
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

export function getUserRoleAndAllowedPlaylists(sessionUser) {
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

export function getAllowedPlaylistsForReq(playlists, req = null) {
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
  if (!Array.isArray(lockedList) || lockedList.length === 0 || lockedList.some((item) => String(item).toLowerCase() === 'none')) {
    return playlists;
  }
  return playlists.filter((p) =>
    lockedList.some((nameOrId) => isPlaylistMatch(p, nameOrId))
  );
}

export function isAllowedPath(fileRelPath, scannedPlaylists, req = null) {
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
  if (!Array.isArray(lockedList) || lockedList.length === 0 || lockedList.some((item) => String(item).toLowerCase() === 'none')) {
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

export function filterAllowedTracks(tracks, playlists, req = null) {
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
  if (!Array.isArray(lockedList) || lockedList.length === 0 || lockedList.some((item) => String(item).toLowerCase() === 'none')) {
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

export function formatLightTrack(t) {
  const { coverBase64, lyrics, ...light } = t;
  const fullPath = path.join(appConfig.mediaFolder, t.relativePath);
  const folderCoverFile = findFolderCoverFile(fullPath);
  light.hasFolderCover = Boolean(folderCoverFile && !folderCoverFile.toLowerCase().endsWith('rubycardinal.png'));
  return light;
}
