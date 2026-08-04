import {
  getSavedRainbowFrozen,
  updateMetaThemeColor,
  getCoverArtUrl,
  getFolderCoverUrl,
} from './mediaService';

const themeModules = import.meta.glob('../themes/*/index.js', { eager: true });

const THEMES = Object.values(themeModules).map((mod) => mod.default || mod);

let activeTheme = null;
let activeBackgroundComponent = null;
let rainbowIntervalId = null;
let currentRainbowHue = 0;
const listeners = new Set();

function getSavedThemeId() {
  try {
    return localStorage.getItem('rubyplayer_site_color') || '#ff2e55';
  } catch (err) {
    return '#ff2e55';
  }
}

function saveThemeId(id) {
  try {
    localStorage.setItem('rubyplayer_site_color', id);
  } catch (err) { }
}

function injectOrUpdateThemeStyles(cssContent) {
  let styleEl = document.getElementById('ruby-theme-override');
  if (!cssContent) {
    if (styleEl) styleEl.remove();
    return;
  }
  if (!styleEl) {
    styleEl = document.createElement('style');
    styleEl.id = 'ruby-theme-override';
    document.head.appendChild(styleEl);
  }
  styleEl.textContent = cssContent;
}

function clearAllThemeBodyClasses() {
  THEMES.forEach((t) => {
    if (t.bodyClass) {
      document.body.classList.remove(t.bodyClass);
    }
  });
  document.body.classList.remove('theme-rainbow-frozen');
  document.body.removeAttribute('data-visualizer-mode');
}

export function getThemes() {
  return THEMES;
}

export function getThemeById(id) {
  if (!id) return null;
  return THEMES.find((t) => t.id.toLowerCase() === id.toLowerCase()) || null;
}

export function getActiveTheme() {
  return activeTheme;
}

export function getActiveBackgroundComponent() {
  return activeBackgroundComponent;
}

export function onThemeChange(callback) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function notifyListeners() {
  listeners.forEach((cb) => {
    try {
      cb({ activeTheme, activeBackgroundComponent });
    } catch (e) { }
  });
}

export async function applyTheme(themeIdOrHex, currentTrack = null) {
  if (!themeIdOrHex) themeIdOrHex = '#ff2e55';
  const root = document.documentElement;

  if (rainbowIntervalId) {
    clearInterval(rainbowIntervalId);
    rainbowIntervalId = null;
  }

  clearAllThemeBodyClasses();
  root.style.removeProperty('--bg-primary');
  root.style.removeProperty('--text-primary');

  const foundTheme = getThemeById(themeIdOrHex);
  activeTheme = foundTheme;
  saveThemeId(themeIdOrHex);

  if (foundTheme) {
    if (foundTheme.bodyClass) {
      document.body.classList.add(foundTheme.bodyClass);
    }
    const visMode = foundTheme.visualizerMode || (foundTheme.id === 'retro' ? 'retro' : foundTheme.id === 'rainbow' ? 'rainbow' : 'neon');
    document.body.setAttribute('data-visualizer-mode', visMode);

    injectOrUpdateThemeStyles(foundTheme.css || '');

    if (typeof foundTheme.apply === 'function') {
      foundTheme.apply(currentTrack);
    } else if (foundTheme.type === 'animated') {
      if (getSavedRainbowFrozen()) {
        document.body.classList.add('theme-rainbow-frozen');
      }

      const updateRainbowVars = () => {
        if (getSavedRainbowFrozen()) return;
        currentRainbowHue = (currentRainbowHue + 0.25) % 360;
        const hue = currentRainbowHue;
        const rColor = `hsl(${hue}, 95%, 60%)`;
        const rDark = `hsl(${hue}, 95%, 42%)`;
        const rGlow = `hsla(${hue}, 95%, 60%, 0.6)`;
        const rBgGlow = `hsla(${hue}, 95%, 60%, 0.18)`;
        const rBorderGlow = `hsla(${hue}, 95%, 60%, 0.45)`;

        root.style.setProperty('--accent-ruby', rColor);
        root.style.setProperty('--accent-ruby-dark', rDark);
        root.style.setProperty('--accent-ruby-glow', rGlow);
        root.style.setProperty('--accent-ruby-bg-glow', rBgGlow);
        root.style.setProperty('--border-glow', rBorderGlow);
        root.style.setProperty('--shadow-ruby', `0 0 30px ${rGlow}`);

        updateMetaThemeColor(rColor);
      };

      updateRainbowVars();
      rainbowIntervalId = setInterval(updateRainbowVars, 250);
    } else if (foundTheme.vars) {
      Object.entries(foundTheme.vars).forEach(([key, val]) => {
        root.style.setProperty(key, val);
      });
      if (foundTheme.vars['--accent-ruby']) {
        updateMetaThemeColor(foundTheme.vars['--accent-ruby']);
      }
    }

    if (foundTheme.Background) {
      if (typeof foundTheme.Background === 'function') {
        if (foundTheme.Background.name && foundTheme.Background.name !== 'Background' && foundTheme.Background.name !== '') {
          activeBackgroundComponent = foundTheme.Background;
        } else {
          try {
            const res = foundTheme.Background();
            if (res && typeof res.then === 'function') {
              const mod = await res;
              activeBackgroundComponent = mod?.default || mod;
            } else {
              activeBackgroundComponent = foundTheme.Background;
            }
          } catch (err) {
            activeBackgroundComponent = foundTheme.Background;
          }
        }
      } else {
        activeBackgroundComponent = foundTheme.Background;
      }
    } else {
      activeBackgroundComponent = null;
    }
  } else {
    injectOrUpdateThemeStyles('');
    activeBackgroundComponent = null;

    const hex = themeIdOrHex;
    const r = parseInt(hex.slice(1, 3), 16) || 255;
    const g = parseInt(hex.slice(3, 5), 16) || 46;
    const b = parseInt(hex.slice(5, 7), 16) || 85;

    const darkHex = `rgb(${Math.max(0, r - 30)}, ${Math.max(0, g - 30)}, ${Math.max(0, b - 30)})`;
    const glow = `rgba(${r}, ${g}, ${b}, 0.5)`;
    const bgGlow = `rgba(${r}, ${g}, ${b}, 0.12)`;
    const borderGlow = `rgba(${r}, ${g}, ${b}, 0.4)`;

    root.style.setProperty('--accent-ruby', hex);
    root.style.setProperty('--accent-ruby-dark', darkHex);
    root.style.setProperty('--accent-ruby-glow', glow);
    root.style.setProperty('--accent-ruby-bg-glow', bgGlow);
    root.style.setProperty('--border-glow', borderGlow);
    root.style.setProperty('--shadow-ruby', `0 0 30px ${glow}`);

    updateMetaThemeColor(hex);
  }

  notifyListeners();
}

export function handleTrackChangeForAdaptiveTheme(track) {
  if (activeTheme && activeTheme.type === 'adaptive') {
    applyTheme(activeTheme.id, track);
  }
}

export function getSavedThemeOption(themeId, optionId, defaultValue = false) {
  try {
    const val = localStorage.getItem(`rubyplayer_theme_${themeId}_${optionId}`);
    if (val === null) return defaultValue;
    return val === 'true';
  } catch (err) {
    return defaultValue;
  }
}

export function setThemeOption(themeId, optionId, value) {
  try {
    localStorage.setItem(`rubyplayer_theme_${themeId}_${optionId}`, value ? 'true' : 'false');
    notifyListeners();
  } catch (err) { }
}

