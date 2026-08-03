import React from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  FileText,
  Download,
  HelpCircle,
  ListMusic,
  EyeOff,
  Disc,
} from 'lucide-react';
import RubyFavIcon from './RubyFavIcon';

export default function PlayerControls({
  currentTrack,
  isPlaying,
  onPlayPause,
  onSkipNext,
  onSkipPrev,
  onRewind10,
  onFastForward10,
  currentTime,
  duration,
  onSeek,
  volume,
  onVolumeChange,
  isMuted,
  onToggleMute,
  onOpenLyrics,
  onOpenHelp,
  isHelpUnread = false,
  currentUser,
  onDownloadTrack,
  isFavorite = false,
  onToggleFavorite,
  isPlaylistHidden = false,
  onToggleHidePlaylist,
  isVinylHidden = false,
  onToggleHideVinyl,
}) {
  const formatTime = (secs) => {
    if (!secs || isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const progressPercent = duration > 0 ? Math.round((currentTime / duration) * 100) : 0;

  return (
    <footer className="player-bar">
      <div className="timeline-row">
        <span className="time-display">
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>
        <div className="seekbar-wrapper">
          <input
            type="range"
            min={0}
            max={duration || 100}
            value={currentTime || 0}
            onChange={(e) => onSeek(parseFloat(e.target.value))}
            className="timeline-slider"
          />
        </div>
        <span className="percent-display">{progressPercent}%</span>
      </div>

      <div className="controls-row">
        <div className="controls-left">
          <button
            className={`btn-icon-ctrl btn-help-icon ${isHelpUnread ? 'sparkling' : ''}`}
            onClick={onOpenHelp}
            title={isHelpUnread ? 'Click to open UI Help Guide' : 'UI Help & Feature Guide'}
            style={{ marginRight: '0.65rem' }}
          >
            <HelpCircle size={20} />
          </button>

          <button
            className={`btn-download ${!currentUser ? 'unauthenticated' : ''}`}
            onClick={onDownloadTrack}
            disabled={!currentTrack}
            title={
              !currentTrack
                ? 'No song loaded'
                : currentUser
                  ? `Download "${currentTrack.title || 'song'}"`
                  : 'Log in to download song'
            }
          >
            <Download size={16} />
            <span>Download</span>
          </button>
        </div>

        <div className="controls-center">
          <button className="btn-icon-ctrl" onClick={onSkipPrev} title="Previous Track">
            <SkipBack size={20} />
          </button>

          <button className="btn-icon-ctrl" onClick={onRewind10} title="Rewind 10s">
            <RotateCcw size={18} />
          </button>

          <button
            className="btn-play-hero"
            onClick={onPlayPause}
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause size={24} /> : <Play size={24} style={{ marginLeft: '3px' }} />}
          </button>

          <button className="btn-icon-ctrl" onClick={onFastForward10} title="Fast Forward 10s">
            <RotateCw size={18} />
          </button>

          <button className="btn-icon-ctrl" onClick={onSkipNext} title="Next Track">
            <SkipForward size={20} />
          </button>
        </div>

        <div className="controls-right">
          <button
            className={`btn-icon-ctrl btn-fav-player ${isFavorite ? 'active' : ''}`}
            onClick={onToggleFavorite}
            disabled={!currentTrack}
            title={
              !currentTrack
                ? 'No song loaded'
                : isFavorite
                  ? 'Remove from Favorites'
                  : 'Add to Favorites'
            }
            style={{
              color: isFavorite ? 'var(--accent-ruby)' : 'var(--text-secondary)',
              marginRight: '0.5rem',
            }}
          >
            <RubyFavIcon filled={isFavorite} size={18} />
          </button>

          <button
            className="btn-icon-ctrl"
            onClick={onOpenLyrics}
            title="Lyrics"
            style={{
              color: (currentTrack?.lyrics || currentTrack?.hasLyrics) ? 'var(--accent-ruby)' : 'var(--text-secondary)',
              marginRight: '0.5rem',
            }}
          >
            <FileText size={18} />
          </button>

          <button
            className={`btn-icon-ctrl ${isVinylHidden ? 'active' : ''}`}
            onClick={onToggleHideVinyl}
            title={isVinylHidden ? 'Show Vinyl' : 'Hide Vinyl'}
            style={{
              color: isVinylHidden ? 'var(--accent-ruby)' : 'var(--text-secondary)',
              marginRight: '0.5rem',
            }}
          >
            <Disc size={18} />
          </button>

          <button
            className={`btn-icon-ctrl ${isPlaylistHidden ? 'active' : ''}`}
            onClick={onToggleHidePlaylist}
            title={isPlaylistHidden ? 'Show Playlist' : 'Hide Playlist'}
            style={{
              color: isPlaylistHidden ? 'var(--accent-ruby)' : 'var(--text-secondary)',
              marginRight: '0.5rem',
            }}
          >
            {isPlaylistHidden ? <EyeOff size={18} /> : <ListMusic size={18} />}
          </button>

          <div className="volume-wrapper">
            <button className="btn-icon-ctrl volume-icon" onClick={onToggleMute}>
              {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={isMuted ? 0 : volume}
              onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
              className="volume-slider"
            />
          </div>
        </div>
      </div>
    </footer>
  );
}
