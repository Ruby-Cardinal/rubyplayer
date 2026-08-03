const AUTH_TOKEN_KEY = 'rubyplayer_auth_token';

export function getAuthToken() {
  try {
    return localStorage.getItem(AUTH_TOKEN_KEY) || null;
  } catch (err) {
    return null;
  }
}

export function setAuthToken(token) {
  try {
    if (token) {
      localStorage.setItem(AUTH_TOKEN_KEY, token);
    } else {
      localStorage.removeItem(AUTH_TOKEN_KEY);
    }
  } catch (err) { }
}

export function getAuthHeaders(headers = {}) {
  const token = getAuthToken();
  if (token) {
    return {
      ...headers,
      Authorization: `Bearer ${token}`,
    };
  }
  return headers;
}

export async function loginUser(username, password) {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Invalid username or password');
  }
  const data = await res.json();
  if (data.token) {
    setAuthToken(data.token);
  }
  return data;
}

export async function setInitialPassword(newPassword) {
  const res = await fetch('/api/auth/set-password', {
    method: 'POST',
    headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({ newPassword }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Failed to set password');
  }
  return res.json();
}


export async function logoutUser() {
  const token = getAuthToken();
  if (token) {
    await fetch('/api/auth/logout', {
      method: 'POST',
      headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ token }),
    }).catch(() => { });
  }
  setAuthToken(null);
}

export async function checkAuthStatus() {
  const token = getAuthToken();
  if (!token) return { authenticated: false, user: null };

  try {
    const res = await fetch('/api/auth/me', {
      headers: getAuthHeaders(),
    });
    if (!res.ok) {
      setAuthToken(null);
      return { authenticated: false, user: null };
    }
    const data = await res.json();
    return data;
  } catch (err) {
    return { authenticated: false, user: null };
  }
}

export async function changeUserPassword(currentPassword, newPassword) {
  const res = await fetch('/api/config/users', {
    method: 'POST',
    headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({
      action: 'changePassword',
      password: currentPassword,
      newPassword,
    }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Failed to update password');
  }
  return res.json();
}

export async function fetchServerConfig() {
  const res = await fetch('/api/config', { headers: getAuthHeaders() });
  if (!res.ok) throw new Error('Failed to fetch config');
  return res.json();
}

let cachedMediaToken = null;
let mediaTokenExpiresAt = 0;
let pendingMediaTokenPromise = null;

export async function getMediaToken() {
  const token = getAuthToken();
  if (!token) return null;

  if (cachedMediaToken && Date.now() < mediaTokenExpiresAt - 60000) {
    return cachedMediaToken;
  }

  if (pendingMediaTokenPromise) {
    return pendingMediaTokenPromise;
  }

  pendingMediaTokenPromise = (async () => {
    try {
      const res = await fetch('/api/auth/media-token', {
        method: 'POST',
        headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
      });
      if (!res.ok) throw new Error('Failed to fetch media token');
      const data = await res.json();
      if (data.mediaToken) {
        cachedMediaToken = data.mediaToken;
        const ttlMs = (data.expiresInSeconds || 900) * 1000;
        mediaTokenExpiresAt = Date.now() + ttlMs;
        return cachedMediaToken;
      }
      return null;
    } catch (err) {
      return null;
    } finally {
      pendingMediaTokenPromise = null;
    }
  })();

  return pendingMediaTokenPromise;
}

export async function scanMediaFolder(force = false) {
  getMediaToken().catch(() => { });
  const url = force ? '/api/scan?force=true' : '/api/scan';
  const res = await fetch(url, { headers: getAuthHeaders() });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to scan media folder');
  }
  return res.json();
}

function getValidMediaTokenOrAuthToken() {
  if (cachedMediaToken && Date.now() < mediaTokenExpiresAt - 10000) {
    return cachedMediaToken;
  }
  return getAuthToken();
}

export function getAudioStreamUrl(trackOrPath) {
  if (!trackOrPath) return '';
  getMediaToken().catch(() => { });
  const token = getValidMediaTokenOrAuthToken();
  const tokenParam = token ? `&mt=${encodeURIComponent(token)}` : '';
  const rel = typeof trackOrPath === 'object' ? (trackOrPath.relativePath || trackOrPath.id) : trackOrPath;
  return `/api/stream?path=${encodeURIComponent(rel)}${tokenParam}`;
}

export function getCoverArtUrl(trackId) {
  if (!trackId) return null;
  getMediaToken().catch(() => { });
  const token = getValidMediaTokenOrAuthToken();
  const tokenParam = token ? `&mt=${encodeURIComponent(token)}` : '';
  return `/api/cover?id=${encodeURIComponent(trackId)}${tokenParam}`;
}

export function getFolderCoverUrl(trackId) {
  getMediaToken().catch(() => { });
  const token = getValidMediaTokenOrAuthToken();
  const tokenParam = token ? `&mt=${encodeURIComponent(token)}` : '';
  if (!trackId) return `/api/folder-cover?${tokenParam.replace('&', '')}`;
  return `/api/folder-cover?id=${encodeURIComponent(trackId)}${tokenParam}`;
}

export async function fetchTrackLyrics(trackId) {
  if (!trackId) return null;
  const res = await fetch(`/api/lyrics?id=${encodeURIComponent(trackId)}`, { headers: getAuthHeaders() });
  if (!res.ok) return null;
  const data = await res.json().catch(() => ({}));
  return data.lyrics || null;
}


export function parseLrcLyrics(lrcText) {
  if (!lrcText || typeof lrcText !== 'string') return [];
  const lines = lrcText.split(/\r?\n/);
  const result = [];
  const timeRegex = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/;

  for (const line of lines) {
    const match = line.match(timeRegex);
    if (match) {
      const minutes = parseInt(match[1], 10);
      const seconds = parseInt(match[2], 10);
      const ms = parseInt(match[3].padEnd(3, '0'), 10);
      const timestamp = minutes * 60 + seconds + ms / 1000;
      const text = line.replace(timeRegex, '').trim();
      if (text) {
        result.push({ timestamp, text });
      }
    }
  }

  return result.sort((a, b) => a.timestamp - b.timestamp);
}

let rainbowIntervalId = null;
let currentRainbowHue = 0;
let lastAdaptiveCoverUrl = null;

function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

export function updateMetaThemeColor(color) {
  if (!color) return;
  try {
    let meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'theme-color');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', color);
  } catch (err) { }
}

function applyHSLAccent(hue, saturation, lightness) {
  const root = document.documentElement;
  const mainColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  const darkColor = `hsl(${hue}, ${saturation}%, ${Math.max(15, lightness - 18)}%)`;
  const glow = `hsla(${hue}, ${saturation}%, ${lightness}%, 0.6)`;
  const bgGlow = `hsla(${hue}, ${saturation}%, ${lightness}%, 0.15)`;
  const borderGlow = `hsla(${hue}, ${saturation}%, ${lightness}%, 0.45)`;

  root.style.setProperty('--accent-ruby', mainColor);
  root.style.setProperty('--accent-ruby-dark', darkColor);
  root.style.setProperty('--accent-ruby-glow', glow);
  root.style.setProperty('--accent-ruby-bg-glow', bgGlow);
  root.style.setProperty('--border-glow', borderGlow);
  root.style.setProperty('--shadow-ruby', `0 0 30px ${glow}`);

  updateMetaThemeColor(mainColor);
}

import { applyTheme } from './themeService';

export function applySiteThemeColor(hex) {
  applyTheme(hex);
}


export function getSavedRainbowFrozen() {
  try {
    return localStorage.getItem('rubyplayer_rainbow_frozen') === 'true';
  } catch (err) {
    return false;
  }
}

export function setRainbowFrozen(isFrozen) {
  try {
    localStorage.setItem('rubyplayer_rainbow_frozen', isFrozen ? 'true' : 'false');
    if (isFrozen) {
      document.body.classList.add('theme-rainbow-frozen');
    } else {
      document.body.classList.remove('theme-rainbow-frozen');
    }
  } catch (err) { }
}

export function getSavedDisableRotation() {
  try {
    return localStorage.getItem('rubyplayer_disable_rotation') === 'true';
  } catch (err) {
    return false;
  }
}

export function setDisableRotation(disabled) {
  try {
    localStorage.setItem('rubyplayer_disable_rotation', disabled ? 'true' : 'false');
    if (disabled) {
      document.body.classList.add('disable-rotation');
    } else {
      document.body.classList.remove('disable-rotation');
    }
  } catch (err) { }
}

export function getSavedDisableVisualizerMotion() {
  try {
    return localStorage.getItem('rubyplayer_disable_visualizer_motion') === 'true';
  } catch (err) {
    return false;
  }
}

export function setDisableVisualizerMotion(disabled) {
  try {
    localStorage.setItem('rubyplayer_disable_visualizer_motion', disabled ? 'true' : 'false');
    if (disabled) {
      document.body.classList.add('disable-visualizer-motion');
    } else {
      document.body.classList.remove('disable-visualizer-motion');
    }
  } catch (err) { }
}

export function getSavedSiteThemeColor() {
  try {
    return localStorage.getItem('rubyplayer_site_color') || '#ff2e55';
  } catch (err) {
    return '#ff2e55';
  }
}

export function saveSelectedPlaylistId(playlistId) {
  try {
    if (playlistId) {
      localStorage.setItem('rubyplayer_last_playlist', playlistId);
    }
  } catch (err) { }
}

export function getSavedSelectedPlaylistId() {
  try {
    return localStorage.getItem('rubyplayer_last_playlist') || 'all';
  } catch (err) {
    return 'all';
  }
}

export function getFavoriteTrackIds() {
  try {
    const raw = localStorage.getItem('rubyplayer_favorites');
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    return [];
  }
}

export function saveFavoriteTrackIds(favorites) {
  try {
    localStorage.setItem('rubyplayer_favorites', JSON.stringify(favorites || []));
  } catch (err) { }
}

export function toggleFavoriteTrackId(trackId) {
  if (!trackId) return getFavoriteTrackIds();
  const idStr = String(trackId);
  const favs = getFavoriteTrackIds();
  let updated;
  if (favs.includes(idStr)) {
    updated = favs.filter((id) => id !== idStr);
  } else {
    updated = [...favs, idStr];
  }
  saveFavoriteTrackIds(updated);
  return updated;
}

export function isTrackFavorite(trackOrId, favoritesList) {
  if (!trackOrId || !Array.isArray(favoritesList)) return false;
  const idStr = typeof trackOrId === 'object'
    ? String(trackOrId.relativePath || trackOrId.id)
    : String(trackOrId);
  return favoritesList.includes(idStr);
}


// Global Singleton Web Audio API Context & Gain Node
let globalAudioCtx = null;
let globalAnalyser = null;
let globalGainNode = null;
let globalSource = null;
let boundAudioElement = null;

// Media Session API integration for Android PWA background playback & notification controls
export function updateMediaSession(track, callbacks = {}) {
  if (!('mediaSession' in navigator)) return;

  if (!track) {
    navigator.mediaSession.metadata = null;
    return;
  }

  const trackId = track.id || track.relativePath;
  const coverUrl = track.hasCover ? getCoverArtUrl(trackId) : getFolderCoverUrl(trackId);

  navigator.mediaSession.metadata = new window.MediaMetadata({
    title: track.title || 'RubyPlayer',
    artist: track.artist || 'Unknown Artist',
    album: track.album || 'RubyPlayer Library',
    artwork: coverUrl
      ? [{ src: coverUrl, sizes: '512x512', type: 'image/jpeg' }]
      : [],
  });

  if (callbacks.onPlay) navigator.mediaSession.setActionHandler('play', callbacks.onPlay);
  if (callbacks.onPause) navigator.mediaSession.setActionHandler('pause', callbacks.onPause);
  if (callbacks.onSkipNext) navigator.mediaSession.setActionHandler('nexttrack', callbacks.onSkipNext);
  if (callbacks.onSkipPrev) navigator.mediaSession.setActionHandler('previoustrack', callbacks.onSkipPrev);
}

export function getOrCreateWebAudio(audioElement, initialVolume = 1, isMuted = false) {
  const effectiveVol = isMuted ? 0 : Math.max(0, Math.min(1, initialVolume));

  if (audioElement) {
    audioElement.volume = effectiveVol;
  }

  if (!globalAudioCtx && audioElement) {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      globalAudioCtx = new AudioContext();
      globalAnalyser = globalAudioCtx.createAnalyser();
      globalAnalyser.fftSize = 256;
      globalAnalyser.smoothingTimeConstant = 0.78;

      globalGainNode = globalAudioCtx.createGain();
      globalGainNode.gain.value = effectiveVol;

      // Keep Web Audio API context alive in Chrome background tabs
      globalAudioCtx.onstatechange = () => {
        if (globalAudioCtx && globalAudioCtx.state === 'suspended' && boundAudioElement && !boundAudioElement.paused) {
          globalAudioCtx.resume().catch(() => { });
        }
      };
    } catch (err) {
      // Context setup notice
    }
  }

  if (globalAudioCtx && audioElement && boundAudioElement !== audioElement) {
    if (globalSource) {
      try { globalSource.disconnect(); } catch (e) { }
      globalSource = null;
    }
    try {
      globalSource = globalAudioCtx.createMediaElementSource(audioElement);
      globalSource.connect(globalAnalyser);
      globalAnalyser.connect(globalGainNode);
      globalGainNode.connect(globalAudioCtx.destination);
      boundAudioElement = audioElement;
    } catch (err) {
      boundAudioElement = audioElement;
    }
  } else if (globalAudioCtx && audioElement && !globalSource) {
    try {
      globalSource = globalAudioCtx.createMediaElementSource(audioElement);
      globalSource.connect(globalAnalyser);
      globalAnalyser.connect(globalGainNode);
      globalGainNode.connect(globalAudioCtx.destination);
      boundAudioElement = audioElement;
    } catch (err) {
      boundAudioElement = audioElement;
    }
  }

  if (globalAudioCtx && globalAudioCtx.state === 'suspended' && audioElement && !audioElement.paused) {
    globalAudioCtx.resume().catch(() => { });
  }

  return { ctx: globalAudioCtx, analyser: globalAnalyser, gainNode: globalGainNode };
}

export function setWebAudioVolume(vol, isMuted = false, audioElement = null) {
  const targetAudio = audioElement || boundAudioElement;
  const effectiveVol = isMuted ? 0 : Math.max(0, Math.min(1, vol));

  if (targetAudio) {
    targetAudio.volume = effectiveVol;
  }

  if (globalGainNode) {
    globalGainNode.gain.value = effectiveVol;
  }
}

export async function downloadTrack(track) {
  if (!track) return;
  const token = (await getMediaToken()) || getAuthToken();
  if (!token) return;
  const trackId = track.id || track.relativePath;
  const url = `/api/download?id=${encodeURIComponent(trackId)}&mt=${encodeURIComponent(token)}`;

  const link = document.createElement('a');
  link.href = url;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export async function savePlaylistOnServer(name, tracks) {
  const res = await fetch('/api/playlist/save', {
    method: 'POST',
    headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({ name, tracks }),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to save playlist');
  }
  return res.json();
}


