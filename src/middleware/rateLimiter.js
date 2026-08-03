export const loginAttempts = new Map();

const WINDOW_MS = 16 * 60 * 1000;
const LOCKOUT_MS = 16 * 60 * 1000;

export function checkLoginRateLimit(ip, username) {
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
    if (now - attemptData.lastAttempt > WINDOW_MS && (!attemptData.lockUntil || now >= attemptData.lockUntil)) {
      loginAttempts.delete(key);
    }
  }
  return { allowed: true };
}

export function recordFailedLogin(ip, username) {
  const now = Date.now();
  const key = `${ip}:${(username || '').toLowerCase()}`;
  let attemptData = loginAttempts.get(key);

  if (!attemptData || (now - attemptData.lastAttempt > WINDOW_MS && (!attemptData.lockUntil || now >= attemptData.lockUntil))) {
    attemptData = { count: 1, lastAttempt: now, lockUntil: null };
  } else {
    attemptData.count += 1;
    attemptData.lastAttempt = now;
  }

  const MAX_FAILED_ATTEMPTS = 5;

  if (attemptData.count >= MAX_FAILED_ATTEMPTS) {
    attemptData.lockUntil = now + LOCKOUT_MS;
    console.warn(`[Security Alert] Rate-limiting active: ${attemptData.count} failed logins for user "${username}" from IP ${ip}. Lockout reset to 16m from last attempt.`);
  }

  loginAttempts.set(key, attemptData);
}

export function clearFailedLogin(ip, username) {
  const key = `${ip}:${(username || '').toLowerCase()}`;
  loginAttempts.delete(key);
}
