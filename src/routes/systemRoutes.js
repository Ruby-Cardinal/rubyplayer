import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import { appConfig, saveUsers } from '../config/config.js';
import { getSessionUser, hashPassword, verifyPassword } from '../services/authService.js';
import { getOrScanMediaFolder } from '../services/mediaScanner.js';

const router = Router();

router.get('/config', (req, res) => {
  const session = getSessionUser(req);
  res.json({
    isAuthenticated: Boolean(session),
  });
});

router.post('/config/users', (req, res) => {
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

router.post('/playlist/save', async (req, res) => {
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

    await getOrScanMediaFolder(true);

    res.json({
      success: true,
      message: `Playlist "${fileName}" saved successfully`,
      filename: fileName,
    });
  } catch (err) {
    console.error('Error saving playlist file:', err);
    res.status(500).json({ error: 'Failed to write playlist file: ' + fileName });
  }
});

export default router;
