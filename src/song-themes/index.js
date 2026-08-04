const songThemeModules = import.meta.glob('./*/index.js', { eager: true });

const SONG_THEMES = Object.entries(songThemeModules).map(([path, mod]) => {
  const themeObj = mod.default || mod;
  const parts = path.split('/');
  const folderName = parts[parts.length - 2];

  return {
    folderName,
    songTitle: themeObj.songTitle || folderName,
    ...themeObj,
  };
});

export function getSongThemeForTrack(track) {
  if (!track || !track.title) return null;
  const title = track.title.trim().toLowerCase();
  return SONG_THEMES.find((st) => st.songTitle.trim().toLowerCase() === title) || null;
}

export function getSongThemes() {
  return SONG_THEMES;
}
