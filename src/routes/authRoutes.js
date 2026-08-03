import { Router } from 'express';
import { appConfig, loadServerConfig, saveUsers } from '../config/config.js';
import { hashPassword, verifyPassword, createSession, getSessionUser, createMediaToken, hashToken } from '../services/authService.js';
import { activeSessions } from '../config/config.js';
import { checkLoginRateLimit, recordFailedLogin, clearFailedLogin } from '../middleware/rateLimiter.js';

const router = Router();

router.post('/login', (req, res) => {
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

router.post('/set-password', (req, res) => {
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

router.post('/logout', (req, res) => {
  const authHeader = req.headers.authorization;
  let token = null;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.slice(7).trim();
  } else if (req.body && req.body.token) {
    token = req.body.token;
  }
  if (token) {
    const tokenHash = hashToken(token);
    if (tokenHash && activeSessions.has(tokenHash)) {
      activeSessions.delete(tokenHash);
      saveUsers();
    }
  }
  res.json({ success: true });
});

router.get('/me', (req, res) => {
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

router.post('/media-token', (req, res) => {
  const session = getSessionUser(req);
  if (!session) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  const rawMediaToken = createMediaToken(session.tokenHash);
  res.json({
    success: true,
    mediaToken: rawMediaToken,
    expiresInSeconds: 900,
  });
});

export default router;
