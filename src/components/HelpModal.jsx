import React from 'react';
import {
  X,
  HelpCircle,
  Disc,
  ListMusic,
  Sliders,
  Search,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export default function HelpModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="ui-tour-overlay" onClick={onClose}>
      <div className="tour-header-bar" onClick={(e) => e.stopPropagation()}>
        <button className="btn-tour-close" onClick={onClose}>
          <span>Exit Guide</span>
          <X size={16} />
        </button>
      </div>

      <div className="tour-callout tour-navbar" onClick={(e) => e.stopPropagation()}>
        <div className="tour-arrow tour-arrow-up">
          <ArrowUp size={28} />
        </div>
        <div className="tour-card glass-card">
          <div className="tour-card-header">
            <Search size={16} className="tour-card-icon" />
            <span>Search & Login</span>
          </div>
          <div className="tour-card-body">
            Looking for a specific song, this is the place for you!
            Log in to enabled downloading. Ask me for a user account.
            Settings contains some fun themes!
          </div>
        </div>
      </div>

      <div className="tour-callout tour-vinyl" onClick={(e) => e.stopPropagation()}>
        <div className="tour-card glass-card">
          <div className="tour-card-header">
            <Disc size={16} className="tour-card-icon" />
            <span>Vinyl Record & Spectrum</span>
          </div>
          <div className="tour-card-body">
            It sorta looks like a spacey neon record!
            Or enable Retro settings, and then it will look like one.
            Clicking the song image will also bring up lyrics.
          </div>
        </div>
        <div className="tour-arrow tour-arrow-up">
          <ArrowRight size={28} />
        </div>
      </div>

      <div className="tour-callout tour-playlist" onClick={(e) => e.stopPropagation()}>
        <div className="tour-arrow tour-arrow-left">
          <ArrowLeft size={28} />
        </div>
        <div className="tour-card glass-card">
          <div className="tour-card-header">
            <ListMusic size={16} className="tour-card-icon" />
            <span>Playlist</span>
          </div>
          <div className="tour-card-body">
            Playlists!  You can favorite songs to create a custom playlist. Sorting works, and shuffling sorta works
          </div>
        </div>
      </div>

      <div className="tour-callout tour-playerbar" onClick={(e) => e.stopPropagation()}>
        <div className="tour-card glass-card">
          <div className="tour-card-header">
            <Sliders size={16} className="tour-card-icon" />
            <span>Media Player Controls</span>
          </div>
          <div className="tour-card-body">
            Umm.. play song here?
            Bonus, login and download the song!
          </div>
        </div>
        <div className="tour-arrow tour-arrow-down">
          <ArrowDown size={28} />
        </div>
      </div>
    </div>
  );
}
