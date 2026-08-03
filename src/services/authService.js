import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { activeSessions, saveUsers } from '../config/config.js';

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
const FIFTEEN_MINUTES_MS = 15 * 60 * 1000;

export const activeMediaTokens = new Map();

export function hashPassword(password) {
  return { hash: bcrypt.hashSync(password, 10) };
}

export function verifyPassword(password, storedHash) {
  if (!password || !storedHash) return false;
  try {
    return bcrypt.compareSync(password, storedHash);
  } catch (err) {
    return false;
  }
}

export function hashToken(token) {
  if (!token || typeof token !== 'string') return null;
  return crypto.createHash('sha256').update(token).digest('hex');
}

export function createMediaToken(sessionTokenHash) {
  const rawMediaToken = 'mt_' + crypto.randomBytes(24).toString('hex');
  const mHash = hashToken(rawMediaToken);
  activeMediaTokens.set(mHash, {
    sessionTokenHash,
    expiresAt: Date.now() + FIFTEEN_MINUTES_MS,
  });
  return rawMediaToken;
}

export function createSession(user) {
  const token = crypto.randomBytes(32).toString('hex');
  const tokenHash = hashToken(token);
  const now = Date.now();
  const session = {
    tokenHash,
    username: user.username,
    role: user.role || 'user',
    expiresAt: now + THIRTY_DAYS_MS,
    lastActive: now,
  };
  activeSessions.set(tokenHash, session);
  saveUsers();
  return { ...session, token };
}

export function getSessionUser(req) {
  if (!req) return null;
  let token = null;
  const authHeader = req.headers ? req.headers.authorization : null;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.slice(7).trim();
  } else if (req.query) {
    if (req.query.mt) token = String(req.query.mt).trim();
    else if (req.query.mediaToken) token = String(req.query.mediaToken).trim();
    else if (req.query.token) token = String(req.query.token).trim();
  }

  if (!token) return null;
  const tHash = hashToken(token);
  if (!tHash) return null;

  let sessionTokenHash = tHash;
  if (activeMediaTokens.has(tHash)) {
    const mtInfo = activeMediaTokens.get(tHash);
    if (Date.now() > mtInfo.expiresAt) {
      const parentSession = activeSessions.get(mtInfo.sessionTokenHash);
      if (parentSession && Date.now() <= parentSession.expiresAt) {
        mtInfo.expiresAt = Date.now() + FIFTEEN_MINUTES_MS;
        sessionTokenHash = mtInfo.sessionTokenHash;
      } else {
        activeMediaTokens.delete(tHash);
        return null;
      }
    } else {
      sessionTokenHash = mtInfo.sessionTokenHash;
    }
  }

  const session = activeSessions.get(sessionTokenHash);
  if (!session) return null;

  if (Date.now() > session.expiresAt) {
    activeSessions.delete(sessionTokenHash);
    saveUsers();
    return null;
  }

  session.lastActive = Date.now();
  session.expiresAt = Date.now() + THIRTY_DAYS_MS;
  return session;
}
