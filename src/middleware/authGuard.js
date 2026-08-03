import { getSessionUser } from '../services/authService.js';

export function requireAuth(req, res, next) {
  const session = getSessionUser(req);
  if (!session) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  req.user = session;
  next();
}

export function requireAdmin(req, res, next) {
  const session = getSessionUser(req);
  if (!session || session.role !== 'admin') {
    return res.status(403).json({ error: 'Admin privileges required' });
  }
  req.user = session;
  next();
}
