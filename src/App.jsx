import React, { useState, useEffect, useRef } from 'react';
import {
  Shuffle,
  Repeat,
  ChevronDown,
  ChevronUp,
  ArrowUpDown,
  ArrowDownAZ,
  ArrowUpAZ,
} from 'lucide-react';
import Navbar from './components/Navbar';
import PlayerControls from './components/PlayerControls';
import AudioVisualizer from './components/AudioVisualizer';
import VinylDisc from './components/VinylDisc';
import ConfigModal from './components/ConfigModal';
import LyricsModal from './components/LyricsModal';
import LoginModal from './components/LoginModal';
import RubyFavIcon from './components/RubyFavIcon';
import PlaylistEditorModal from './components/PlaylistEditorModal';
import HelpModal from './components/HelpModal';
import PwaInstallPrompt from './components/PwaInstallPrompt';
import {
  applyTheme,
  onThemeChange,
  getActiveBackgroundComponent,
  handleTrackChangeForAdaptiveTheme,
} from './services/themeService';

import {
  fetchServerConfig,
  scanMediaFolder,
  getAudioStreamUrl,
  getMediaToken,
  getCoverArtUrl,
  getFolderCoverUrl,
  applySiteThemeColor,
  getSavedSiteThemeColor,
  getSavedSelectedPlaylistId,
  saveSelectedPlaylistId,
  getFavoriteTrackIds,
  toggleFavoriteTrackId,
  isTrackFavorite,
  getOrCreateWebAudio,
  setWebAudioVolume,
  updateMediaSession,
  checkAuthStatus,
  logoutUser,
  downloadTrack,
} from './services/mediaService';

// Sort Tracks according to criteria hierarchy: Date (Default) -> Title -> Original Order
function getSortedTracks(tracksList, mode, direction) {
  if (!tracksList || tracksList.length === 0) return [];

  const indexed = tracksList.map((track, originalIndex) => ({ track, originalIndex }));

  indexed.sort((a, b) => {
    const tA = a.track;
    const tB = b.track;

    if (mode === 'date') {
      const timeA = tA.publishTimestamp || (tA.publishDate ? new Date(tA.publishDate).getTime() : 0);
      const timeB = tB.publishTimestamp || (tB.publishDate ? new Date(tB.publishDate).getTime() : 0);

      if (timeA !== timeB) {
        return direction === 'desc' ? timeB - timeA : timeA - timeB;
      }
      // Tie-breaker 1: Title
      const titleCmp = (tA.title || '').localeCompare(tB.title || '');
      if (titleCmp !== 0) return titleCmp;
      // Tie-breaker 2: Original Index
      return a.originalIndex - b.originalIndex;
    }

    if (mode === 'title') {
      const titleCmp = (tA.title || '').localeCompare(tB.title || '');
      if (titleCmp !== 0) {
        return direction === 'desc' ? -titleCmp : titleCmp;
      }
      // Tie-breaker 1: Date
      const timeA = tA.publishTimestamp || (tA.publishDate ? new Date(tA.publishDate).getTime() : 0);
      const timeB = tB.publishTimestamp || (tB.publishDate ? new Date(tB.publishDate).getTime() : 0);
      if (timeA !== timeB) return timeB - timeA;
      // Tie-breaker 2: Original Index
      return a.originalIndex - b.originalIndex;
    }

    // 'original' mode: Original order in playlist / folder
    return direction === 'desc' ? b.originalIndex - a.originalIndex : a.originalIndex - b.originalIndex;
  });

  return indexed.map((item) => item.track);
}

export default function App() {
  const [config, setConfig] = useState({
    mediaFolder: '',
    lockedPlaylistId: null,
    isLocked: false,
    allowClientConfig: true,
  });

  const [tracks, setTracks] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [scanError, setScanError] = useState(null);

  // Playback State
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [currentQueue, setCurrentQueue] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  // UI & Sorting State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlaylistId, setSelectedPlaylistId] = useState(() => getSavedSelectedPlaylistId());
  const [sortMode, setSortMode] = useState(() => localStorage.getItem('rubyplayer_sort_mode') || 'date');
  const [sortDirection, setSortDirection] = useState(() => localStorage.getItem('rubyplayer_sort_dir') || 'desc');
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState('off');
  const [isPlaylistCollapsed, setIsPlaylistCollapsed] = useState(false);

  // Favorites state
  const [favorites, setFavorites] = useState(() => getFavoriteTrackIds());

  // Modals & Auth State
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [isLyricsOpen, setIsLyricsOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isPlaylistEditorOpen, setIsPlaylistEditorOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [hasHelpBeenClicked, setHasHelpBeenClicked] = useState(() => {
    return localStorage.getItem('rubyplayer_help_clicked') === 'true';
  });
  const [isHelpSparkling, setIsHelpSparkling] = useState(true);

  useEffect(() => {
    // Sparkle for at least 2 seconds on page load / reload
    const timer = setTimeout(() => {
      if (localStorage.getItem('rubyplayer_help_clicked') === 'true') {
        setIsHelpSparkling(false);
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleOpenHelp = () => {
    setIsHelpOpen(true);
    setIsHelpSparkling(false);
    if (!hasHelpBeenClicked) {
      localStorage.setItem('rubyplayer_help_clicked', 'true');
      setHasHelpBeenClicked(true);
    }
  };

  const handleToggleFavorite = (trackToToggle) => {
    const target = trackToToggle || currentTrack;
    if (!target) return;
    const tId = target.relativePath || target.id;
    const updated = toggleFavoriteTrackId(tId);
    setFavorites(updated);
  };

  // Theme tracking (updated when config dialog closes)
  const [currentTheme, setCurrentTheme] = useState(() => getSavedSiteThemeColor());

  const currentTrack = currentQueue[currentTrackIndex] || null;

  const audioRef = useRef(null);
  const activeTrackIdRef = useRef(null);
  const activeTrackRef = useRef(null);
  const recentPlayedIdsRef = useRef([]);

  // Track recent played songs for non-repeating shuffle history (last 5 songs)
  useEffect(() => {
    if (currentTrack) {
      const id = currentTrack.relativePath || currentTrack.id;
      if (id) {
        recentPlayedIdsRef.current = [
          ...recentPlayedIdsRef.current.filter((item) => item !== id),
          id,
        ].slice(-5);
      }
    }
  }, [currentTrack?.id, currentTrack?.relativePath]);

  // Auto-scroll active track into view when currentTrack changes
  useEffect(() => {
    if (activeTrackRef.current) {
      activeTrackRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [currentTrack?.id]);

  const [BackgroundComp, setBackgroundComp] = useState(() => getActiveBackgroundComponent());

  useEffect(() => {
    applyTheme(getSavedSiteThemeColor(), currentTrack);
  }, []);

  useEffect(() => {
    return onThemeChange(({ activeBackgroundComponent }) => {
      setBackgroundComp(() => activeBackgroundComponent);
      setCurrentTheme(getSavedSiteThemeColor());
    });
  }, []);

  useEffect(() => {
    handleTrackChangeForAdaptiveTheme(currentTrack);
  }, [currentTrack?.id, currentTrack?.hasCover]);


  // Reload library data function (used on startup and after login/logout)
  const loadLibraryData = async () => {
    try {
      setIsLoading(true);
      setScanError(null);

      const authData = await checkAuthStatus();
      setCurrentUser(authData.authenticated ? authData.user : null);

      const serverCfg = await fetchServerConfig();
      setConfig(serverCfg);

      const scanData = await scanMediaFolder();
      const loadedTracks = scanData.files || [];
      const loadedPlaylists = scanData.playlists || [];

      setTracks(loadedTracks);
      setPlaylists(loadedPlaylists);

      const savedId = getSavedSelectedPlaylistId();
      const isValidSaved = savedId === 'none' || savedId === 'all' || savedId === 'favorites' || loadedPlaylists.some((p) => p.id === savedId);
      const initialId = isValidSaved ? savedId : 'all';

      setSelectedPlaylistId(initialId);

      if (initialId === 'none') {
        setCurrentQueue([]);
        setCurrentTrackIndex(-1);
      } else {
        const selPl = loadedPlaylists.find((p) => p.id === initialId);
        let initTracks = loadedTracks;
        if (initialId === 'favorites') {
          const currentFavs = getFavoriteTrackIds();
          initTracks = loadedTracks.filter((t) => isTrackFavorite(t, currentFavs));
        } else if (selPl && initialId !== 'all' && Array.isArray(selPl.tracks)) {
          initTracks = loadedTracks.filter((t) =>
            selPl.tracks.some(
              (p) => typeof p === 'string' && (t.relativePath === p || t.relativePath.endsWith(p) || p.endsWith(t.relativePath))
            )
          );
        }
        const sortedInit = getSortedTracks(initTracks, sortMode, sortDirection);
        setCurrentQueue(sortedInit);
        if (sortedInit.length > 0) {
          setCurrentTrackIndex(0);
        } else {
          setCurrentTrackIndex(-1);
        }
      }

      if (!authData.authenticated && serverCfg.isLocked && serverCfg.lockedPlaylistId) {
        setSelectedPlaylistId(serverCfg.lockedPlaylistId);
      }
    } catch (err) {
      console.error('Initialization error:', err);
      setScanError("Ooop ooop beeep");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadLibraryData();
  }, []);

  const handleLoginSuccess = async (user) => {
    setCurrentUser(user);
    await loadLibraryData();
  };

  const handleLogout = async () => {
    await logoutUser();
    setCurrentUser(null);
    await loadLibraryData();
  };

  const effectiveIsLocked = Boolean(
    config.LockedPlaylists && config.LockedPlaylists.length > 0 && !currentUser
  );

  // Handle playback whenever currentTrack changes — single persistent audio element
  useEffect(() => {
    if (!audioRef.current || !currentTrack) return;

    const trackId = currentTrack.relativePath || currentTrack.id;
    if (activeTrackIdRef.current !== trackId) {
      activeTrackIdRef.current = trackId;
      audioRef.current.src = getAudioStreamUrl(currentTrack);
    }

    setWebAudioVolume(volume, isMuted, audioRef.current);

    // Update PWA / Android Media Session notification controls
    updateMediaSession(currentTrack, {
      onPlay: () => {
        if (audioRef.current) audioRef.current.play();
        setIsPlaying(true);
      },
      onPause: () => {
        if (audioRef.current) audioRef.current.pause();
        setIsPlaying(false);
      },
      onSkipNext: handleSkipNext,
      onSkipPrev: handleSkipPrev,
    });

    if (isPlaying) {
      audioRef.current.play().catch((err) => console.warn('Autoplay notice:', err));
    }
  }, [currentTrack]);

  // Filtered & Sorted tracks for search & playlist
  const selectedPlaylist = playlists.find((p) => p.id === selectedPlaylistId);
  let baseTrackList = tracks;

  if (selectedPlaylistId === 'none') {
    baseTrackList = [];
  } else if (selectedPlaylistId === 'favorites') {
    baseTrackList = tracks.filter((t) => isTrackFavorite(t, favorites));
  } else if (selectedPlaylist && selectedPlaylistId !== 'all') {
    if (Array.isArray(selectedPlaylist.tracks)) {
      baseTrackList = tracks.filter((t) =>
        selectedPlaylist.tracks.some(
          (p) => typeof p === 'string' && (t.relativePath === p || t.relativePath.endsWith(p) || p.endsWith(t.relativePath))
        )
      );
    }
  }

  const sortedBaseTracks = getSortedTracks(baseTrackList, sortMode, sortDirection);

  const displayTracks = sortedBaseTracks.filter((track) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      (track.title && track.title.toLowerCase().includes(q)) ||
      (track.artist && track.artist.toLowerCase().includes(q)) ||
      (track.album && track.album.toLowerCase().includes(q))
    );
  });

  const activeQueue = selectedPlaylistId === 'none'
    ? []
    : (displayTracks.length > 0 ? displayTracks : (currentQueue.length > 0 ? currentQueue : tracks));

  // Playlist & Sort Handlers
  const handlePlaylistChange = (newPlaylistId) => {
    setSelectedPlaylistId(newPlaylistId);
    saveSelectedPlaylistId(newPlaylistId);

    if (newPlaylistId === 'none') {
      setCurrentQueue([]);
      setCurrentTrackIndex(-1);
      return;
    }

    let rawList = tracks;
    if (newPlaylistId === 'favorites') {
      rawList = tracks.filter((t) => isTrackFavorite(t, favorites));
    } else {
      const p = playlists.find((pl) => pl.id === newPlaylistId);
      if (p && newPlaylistId !== 'all' && Array.isArray(p.tracks)) {
        rawList = tracks.filter((t) =>
          p.tracks.some(
            (pathStr) => typeof pathStr === 'string' && (t.relativePath === pathStr || t.relativePath.endsWith(pathStr) || pathStr.endsWith(t.relativePath))
          )
        );
      }
    }
    const sorted = getSortedTracks(rawList, sortMode, sortDirection);
    setCurrentQueue(sorted);
    setCurrentTrackIndex(sorted.length > 0 ? 0 : -1);
  };

  const handleSortChange = (newMode, newDirection) => {
    setSortMode(newMode);
    setSortDirection(newDirection);
    localStorage.setItem('rubyplayer_sort_mode', newMode);
    localStorage.setItem('rubyplayer_sort_dir', newDirection);

    const sorted = getSortedTracks(baseTrackList, newMode, newDirection);
    setCurrentQueue(sorted);
    setCurrentTrackIndex(0);
  };

  // Playback Control Handlers
  const playTrack = (track, queueList) => {
    const q = queueList && queueList.length > 0 ? queueList : activeQueue;
    setCurrentQueue(q);
    const idx = q.findIndex((t) => t.id === track.id);
    const targetIdx = idx >= 0 ? idx : 0;

    if (currentTrackIndex === targetIdx && currentTrack?.id === track.id) {
      togglePlayPause();
      return;
    }

    setCurrentTrackIndex(targetIdx);
    setIsPlaying(true);
  };

  const togglePlayPause = async () => {
    if (!currentTrack && activeQueue.length > 0) {
      playTrack(activeQueue[0], activeQueue);
      return;
    }
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      const token = await getMediaToken();
      const currentSrc = audioRef.current.src || '';
      if (token && currentTrack && !currentSrc.includes(encodeURIComponent(token))) {
        const savedTime = audioRef.current.currentTime || 0;
        audioRef.current.src = getAudioStreamUrl(currentTrack);
        audioRef.current.currentTime = savedTime;
      }
      audioRef.current.play().then(() => setIsPlaying(true)).catch((err) => console.warn('Play error:', err));
    }
  };

  // Helper to pick next shuffled track index excluding recent played history (up to 5 tracks)
  const getShuffledNextIndex = (queue, track) => {
    if (!queue || queue.length === 0) return 0;
    if (queue.length === 1) return 0;

    const history = recentPlayedIdsRef.current || [];
    const maxExcludeCount = Math.min(5, Math.max(0, queue.length - 1));
    const excludedIds = new Set(history.slice(-maxExcludeCount));

    if (track) {
      const curId = track.relativePath || track.id;
      if (curId) excludedIds.add(curId);
    }

    const candidates = queue
      .map((t, idx) => ({ t, idx }))
      .filter(({ t }) => {
        const id = t.relativePath || t.id;
        return !excludedIds.has(id);
      });

    if (candidates.length > 0) {
      const randomItem = candidates[Math.floor(Math.random() * candidates.length)];
      return randomItem.idx;
    }

    const fallbackCandidates = queue
      .map((t, idx) => ({ t, idx }))
      .filter(({ t }) => (t.relativePath || t.id) !== (track?.relativePath || track?.id));

    if (fallbackCandidates.length > 0) {
      return fallbackCandidates[Math.floor(Math.random() * fallbackCandidates.length)].idx;
    }

    return Math.floor(Math.random() * queue.length);
  };

  const handleSkipNext = () => {
    if (activeQueue.length === 0) return;
    setCurrentQueue(activeQueue);
    let currentIdxInActive = activeQueue.findIndex((t) => t.id === currentTrack?.id);
    if (currentIdxInActive === -1) currentIdxInActive = currentTrackIndex;

    let nextIdx = (currentIdxInActive + 1) % activeQueue.length;
    if (isShuffle) {
      nextIdx = getShuffledNextIndex(activeQueue, currentTrack);
    }
    setCurrentTrackIndex(nextIdx);
    setIsPlaying(true);
  };

  const handleSkipPrev = () => {
    if (activeQueue.length === 0) return;

    // If more than 5 seconds into song, restart current track to 0:00
    if (audioRef.current && audioRef.current.currentTime > 5) {
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
      return;
    }

    setCurrentQueue(activeQueue);
    let currentIdxInActive = activeQueue.findIndex((t) => t.id === currentTrack?.id);
    if (currentIdxInActive === -1) currentIdxInActive = currentTrackIndex;

    let prevIdx = (currentIdxInActive - 1 + activeQueue.length) % activeQueue.length;
    if (isShuffle) {
      prevIdx = getShuffledNextIndex(activeQueue, currentTrack);
    }
    setCurrentTrackIndex(prevIdx);
    setIsPlaying(true);
  };

  const handleRewind10 = () => {
    if (audioRef.current) audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 10);
  };

  const handleFastForward10 = () => {
    if (audioRef.current) audioRef.current.currentTime = Math.min(duration, audioRef.current.currentTime + 10);
  };

  // Media Session API: lock screen controls + background playback priority
  // Uses refs for handlers to avoid stale closures and excessive re-registration
  const handleSkipNextRef = useRef(handleSkipNext);
  const handleSkipPrevRef = useRef(handleSkipPrev);
  const handleRewind10Ref = useRef(handleRewind10);
  const handleFastForward10Ref = useRef(handleFastForward10);
  useEffect(() => {
    handleSkipNextRef.current = handleSkipNext;
    handleSkipPrevRef.current = handleSkipPrev;
    handleRewind10Ref.current = handleRewind10;
    handleFastForward10Ref.current = handleFastForward10;
  });

  useEffect(() => {
    if (!('mediaSession' in navigator) || !currentTrack) return;

    const coverUrl = currentTrack.hasCover
      ? getCoverArtUrl(currentTrack.id)
      : getFolderCoverUrl(currentTrack.id);

    // Build artwork array with absolute URL
    const artworkArr = coverUrl
      ? [{ src: new URL(coverUrl, window.location.origin).href, sizes: '512x512', type: 'image/jpeg' }]
      : [];

    navigator.mediaSession.metadata = new MediaMetadata({
      title: currentTrack.title || 'Unknown Title',
      artist: currentTrack.artist || 'Unknown Artist',
      album: currentTrack.album || '',
      artwork: artworkArr,
    });

    navigator.mediaSession.setActionHandler('play', () => {
      if (audioRef.current) audioRef.current.play().then(() => setIsPlaying(true)).catch(() => { });
    });
    navigator.mediaSession.setActionHandler('pause', () => {
      if (audioRef.current) { audioRef.current.pause(); setIsPlaying(false); }
    });
    navigator.mediaSession.setActionHandler('previoustrack', () => handleSkipPrevRef.current());
    navigator.mediaSession.setActionHandler('nexttrack', () => handleSkipNextRef.current());
    navigator.mediaSession.setActionHandler('seekbackward', () => handleRewind10Ref.current());
    navigator.mediaSession.setActionHandler('seekforward', () => handleFastForward10Ref.current());

    return () => {
      ['play', 'pause', 'previoustrack', 'nexttrack', 'seekbackward', 'seekforward'].forEach((action) => {
        try { navigator.mediaSession.setActionHandler(action, null); } catch (e) { }
      });
    };
  }, [currentTrack]);

  const handleSeek = (newTime) => {
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleVolumeChange = (newVol) => {
    setVolume(newVol);
    let nextMute = isMuted;
    if (newVol > 0 && isMuted) {
      nextMute = false;
      setIsMuted(false);
    }
    setWebAudioVolume(newVol, nextMute, audioRef.current);
  };

  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    setWebAudioVolume(volume, nextMuted, audioRef.current);
  };

  const handleTrackEnded = () => {
    if (repeatMode === 'one') {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
    } else if (repeatMode === 'all' || currentTrackIndex < activeQueue.length - 1) {
      handleSkipNext();
    } else {
      setIsPlaying(false);
    }
  };

  const handleDownloadTrack = () => {
    if (!currentUser) {
      setIsLoginOpen(true);
      return;
    }
    if (currentTrack) {
      downloadTrack(currentTrack);
    }
  };

  // Render Playlist Column Component
  const renderPlaylistColumn = () => {
    const favCount = tracks.filter((t) => isTrackFavorite(t, favorites)).length;

    const sortedPlaylists = [...playlists].sort((a, b) => {
      if (Boolean(a.isArtistPlaylist) !== Boolean(b.isArtistPlaylist)) {
        return a.isArtistPlaylist ? 1 : -1;
      }
      return a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' });
    });

    return (
      <div className="playlist-column-wrapper">
        <div className={`col-playlist glass-card ${isPlaylistCollapsed ? 'is-collapsed' : ''}`}>
          <div className="playlist-header">
            <div className="playlist-dropdown-wrapper">
              <select
                className="playlist-dropdown"
                value={selectedPlaylistId}
                onChange={(e) => handlePlaylistChange(e.target.value)}
                disabled={config.isLocked}
              >
                <option value="none">-- No Playlist --</option>
                <option value="all">All Songs ({tracks.length})</option>
                <option value="favorites">💎 Favorites ({favCount})</option>
                {sortedPlaylists.map((pl) => (
                  <option key={pl.id} value={pl.id}>
                    {pl.isArtistPlaylist ? '🎵 ' : ''}{pl.name} ({Array.isArray(pl.tracks) ? pl.tracks.length : 0})
                  </option>
                ))}
              </select>
              <ChevronDown size={16} className="dropdown-arrow" />
            </div>

            <div className="playlist-controls">
              {/* Sort Mode Dropdown */}
              <div className="sort-dropdown-wrapper" title="Sort Playlist">
                <ArrowUpDown size={14} className="sort-icon" />
                <select
                  className="sort-dropdown"
                  value={sortMode}
                  onChange={(e) => handleSortChange(e.target.value, sortDirection)}
                >
                  <option value="date">Date</option>
                  <option value="title">Alphabetical</option>
                  <option value="original">Playlist Order</option>
                </select>
              </div>

              {/* Sort Direction Toggle */}
              <button
                className="btn-toggle sort-dir-btn"
                onClick={() => handleSortChange(sortMode, sortDirection === 'desc' ? 'asc' : 'desc')}
                title={`Sort Direction: ${sortDirection === 'desc' ? 'Descending (Newest / Z-A)' : 'Ascending (Oldest / A-Z)'}`}
              >
                {sortDirection === 'desc' ? <ArrowDownAZ size={17} /> : <ArrowUpAZ size={17} />}
              </button>

              <button
                className={`btn-toggle ${isShuffle ? 'active' : ''}`}
                onClick={() => setIsShuffle(!isShuffle)}
                title="Toggle Shuffle"
              >
                <Shuffle size={18} />
              </button>

              <button
                className={`btn-toggle ${repeatMode !== 'off' ? 'active' : ''}`}
                onClick={() => {
                  if (repeatMode === 'off') setRepeatMode('all');
                  else if (repeatMode === 'all') setRepeatMode('one');
                  else setRepeatMode('off');
                }}
                title={`Repeat: ${repeatMode}`}
              >
                <Repeat size={18} />
                {repeatMode === 'one' && <span className="repeat-badge">1</span>}
              </button>
            </div>

            <button
              className={`btn-toggle btn-expand-playlist ${isPlaylistCollapsed ? 'active' : ''}`}
              onClick={() => setIsPlaylistCollapsed(!isPlaylistCollapsed)}
              title={isPlaylistCollapsed ? 'Expand Track List' : 'Collapse Track List'}
            >
              {isPlaylistCollapsed ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
            </button>
          </div>

          <div className="track-list">
            {selectedPlaylistId === 'none' ? (
              <div className="no-tracks">No playlist selected</div>
            ) : displayTracks.length === 0 ? (
              <div className="no-tracks">
                {selectedPlaylistId === 'favorites' ? 'No favorite songs added yet' : 'No songs found'}
              </div>
            ) : (
              displayTracks.map((track, idx) => {
                const isCurrent = currentTrack && currentTrack.id === track.id;
                const isFav = isTrackFavorite(track, favorites);
                return (
                  <div
                    key={track.id || idx}
                    ref={isCurrent ? activeTrackRef : null}
                    className={`track-row ${isCurrent ? 'active' : ''}`}
                    onClick={() => playTrack(track, displayTracks)}
                  >
                    <div className="track-left">
                      <span className="track-index">{idx + 1}.</span>
                      <div className="track-info">
                        <span className="track-title-name">{track.title}</span>
                        {track.publishDate && (
                          <span className="track-date" title={`Date (${track.dateSource || 'Published'})`}>
                            {track.publishDate}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="track-right">
                      <button
                        className={`btn-fav-track ${isFav ? 'active' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleFavorite(track);
                        }}
                        title={isFav ? 'Remove from Favorites' : 'Add to Favorites'}
                      >
                        <RubyFavIcon filled={isFav} size={15} />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="app-container">
      {BackgroundComp && <BackgroundComp />}
      {/* Hidden Audio Element — src is managed imperatively in useEffect when trackId changes */}
      <audio
        ref={audioRef}
        onTimeUpdate={() => audioRef.current && setCurrentTime(audioRef.current.currentTime)}
        onLoadedMetadata={() => audioRef.current && setDuration(audioRef.current.duration)}
        onEnded={handleTrackEnded}
      />

      {/* Top Header Navbar */}
      <Navbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenConfig={() => setIsConfigOpen(true)}
        currentUser={currentUser}
        onOpenLogin={() => setIsLoginOpen(true)}
        onLogout={handleLogout}
        isLocked={effectiveIsLocked}
        onOpenPlaylistEditor={() => setIsPlaylistEditorOpen(true)}
      />

      {/* Main Content Layout */}
      <main className="main-content">
        {scanError ? (
          <div className="error-panel">
            <h2>Media Folder Access Error</h2>
            <p>{scanError}</p>
            <button className="btn-primary" onClick={() => setIsConfigOpen(true)}>
              Configure Media Directory
            </button>
          </div>
        ) : isLoading ? (
          <div className="loading-panel">
            <div className="spinner" />
            <div>Loading RubyPlayer library...</div>
          </div>
        ) : (
          <div className="inner-deck-layout">
            {/* Left Column: Round Hero Vinyl + Inward Reflection Visualizer Stage */}
            <div className="deck-left-col">
              <div className="vinyl-wrapper-stage inner-deck-stage">
                <VinylDisc
                  currentTrack={currentTrack}
                  isPlaying={isPlaying}
                  onOpenLyrics={() => setIsLyricsOpen(true)}
                  theme={currentTheme}
                >
                  <div className="inner-deck-visualizer-overlay">
                    <AudioVisualizer audioRef={audioRef} isPlaying={isPlaying} mode="inner-circular" />
                  </div>
                </VinylDisc>
              </div>
            </div>

            {/* Right Column: Playlist */}
            <div className="deck-right-col">
              {renderPlaylistColumn()}
            </div>
          </div>
        )}
      </main>

      {/* Bottom Player Controls */}
      <PlayerControls
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        onPlayPause={togglePlayPause}
        onSkipNext={handleSkipNext}
        onSkipPrev={handleSkipPrev}
        onRewind10={handleRewind10}
        onFastForward10={handleFastForward10}
        currentTime={currentTime}
        duration={duration}
        onSeek={handleSeek}
        volume={volume}
        onVolumeChange={handleVolumeChange}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        onOpenLyrics={() => setIsLyricsOpen(true)}
        onOpenHelp={handleOpenHelp}
        isHelpUnread={isHelpSparkling}
        currentUser={currentUser}
        onDownloadTrack={handleDownloadTrack}
        isFavorite={currentTrack ? isTrackFavorite(currentTrack, favorites) : false}
        onToggleFavorite={() => handleToggleFavorite(currentTrack)}
      />

      {/* Modals */}
      <ConfigModal
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
      />

      <LyricsModal
        isOpen={isLyricsOpen}
        onClose={() => setIsLyricsOpen(false)}
        currentTrack={currentTrack}
        currentTime={currentTime}
      />

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      <PlaylistEditorModal
        isOpen={isPlaylistEditorOpen}
        onClose={() => setIsPlaylistEditorOpen(false)}
        playlists={playlists}
        allTracks={tracks}
        onPlaylistSaved={loadLibraryData}
      />

      <HelpModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />

      {/* PWA App Installation & Offline Notification Prompt */}
      <PwaInstallPrompt />

    </div>
  );
}
