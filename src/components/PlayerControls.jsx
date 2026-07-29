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
} from 'lucide-react';

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
  currentUser,
  onDownloadTrack,
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
      {/* Top Timeline Seekbar Row */}
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

      {/* Bottom Controls Row */}
      <div className="controls-row">
        {/* Download button on the left side of player bar */}
        <div className="controls-left">
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

        {/* Center Playback Buttons */}
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

        {/* Right Volume & Lyrics Control */}
        <div className="controls-right">
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
