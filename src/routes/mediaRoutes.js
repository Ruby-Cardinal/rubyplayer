import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import { appConfig, serverMetadataCache } from '../config/config.js';
import { getSessionUser } from '../services/authService.js';
import {
  getOrScanMediaFolder,
  getAllowedPlaylistsForReq,
  filterAllowedTracks,
  formatLightTrack,
  isAllowedPath,
  findFolderCoverFile,
} from '../services/mediaScanner.js';

const router = Router();

router.get('/scan', async (req, res) => {
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
    res.status(500).json({ error: "Something bad happened while doing this" });
  }
});

router.get('/tracks', async (req, res) => {
  try {
    const { files, playlists } = await getOrScanMediaFolder(false);
    const allowedTracks = filterAllowedTracks(files, playlists, req);
    res.json(allowedTracks.map(formatLightTrack));
  } catch (err) {
    res.status(500).json({ error: "Oh look, a butterfly" });
  }
});

router.get('/cover', async (req, res) => {
  const { playlists } = await getOrScanMediaFolder(false);
  const trackId = req.query.id;
  if (!trackId) return res.status(400).send('Missing track id');

  const cached = serverMetadataCache[trackId];
  if (!cached || !cached.hasCover || !cached.coverBase64) {
    return res.status(404).send('Cover image not found');
  }

  if (!isAllowedPath(cached.relativePath, playlists, req)) {
    return res.status(403).send('Access denied: Player locked to playlist');
  }

  const imgBuffer = Buffer.from(cached.coverBase64, 'base64');
  res.setHeader('Content-Type', cached.coverFormat || 'image/jpeg');
  res.setHeader('Cache-Control', 'public, max-age=86400');
  res.send(imgBuffer);
});

router.get('/folder-cover', async (req, res) => {
  await getOrScanMediaFolder(false);
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

router.get('/lyrics', async (req, res) => {
  const { playlists } = await getOrScanMediaFolder(false);
  const trackId = req.query.id;
  if (!trackId) return res.status(400).json({ error: 'Missing track id' });

  const cached = serverMetadataCache[trackId];
  if (!cached) {
    return res.status(404).json({ error: 'Track not found' });
  }

  if (!isAllowedPath(cached.relativePath, playlists, req)) {
    return res.status(403).json({ error: 'Access denied: Player locked to playlist' });
  }

  res.json({
    id: cached.id,
    lyrics: cached.lyrics || null,
  });
});

router.get('/stream', async (req, res) => {
  const { playlists } = await getOrScanMediaFolder(false);
  let fileRelPath = req.query.path || req.query.id;
  if (!fileRelPath) {
    return res.status(400).send('Missing path or id parameter');
  }

  if (serverMetadataCache[fileRelPath]) {
    fileRelPath = serverMetadataCache[fileRelPath].relativePath;
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

  if (!isAllowedPath(fileRelPath, playlists, req)) {
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
    let start = parseInt(parts[0], 10);
    let end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

    if (isNaN(start) || start < 0) start = 0;
    if (isNaN(end) || end >= fileSize) end = fileSize - 1;

    if (start > end || start >= fileSize) {
      res.writeHead(416, {
        'Content-Range': `bytes */${fileSize}`,
      });
      return res.end();
    }

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

router.get('/download', async (req, res) => {
  const session = getSessionUser(req);
  if (!session) {
    return res.status(401).json({ error: 'Authentication required to download tracks' });
  }

  const { playlists } = await getOrScanMediaFolder(false);
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

  if (!isAllowedPath(fileRelPath, playlists, req)) {
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

export default router;
