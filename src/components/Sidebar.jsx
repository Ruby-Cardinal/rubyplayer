import React from 'react';
import { Music, Disc, User, ListMusic, Lock, Radio } from 'lucide-react';

export default function Sidebar({
  currentView,
  setCurrentView,
  isLocked,
  playlists,
  selectedPlaylistId,
  setSelectedPlaylistId,
}) {
  const handleNav = (view) => {
    if (isLocked && view !== 'playlists') {
      return;
    }
    setCurrentView(view);
  };

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-icon">
          <Radio size={20} />
        </div>
        <div className="brand-text">
          Ruby<span>Player</span>
        </div>
      </div>

      <div className="nav-section-title">Library</div>

      <div
        className={`nav-item ${currentView === 'tracks' ? 'active' : ''} ${isLocked ? 'disabled' : ''}`}
        onClick={() => handleNav('tracks')}
      >
        <Music size={18} />
        <span>All Tracks</span>
      </div>

      <div
        className={`nav-item ${currentView === 'albums' ? 'active' : ''} ${isLocked ? 'disabled' : ''}`}
        onClick={() => handleNav('albums')}
      >
        <Disc size={18} />
        <span>Albums</span>
      </div>

      <div
        className={`nav-item ${currentView === 'artists' ? 'active' : ''} ${isLocked ? 'disabled' : ''}`}
        onClick={() => handleNav('artists')}
      >
        <User size={18} />
        <span>Artists</span>
      </div>

      <div
        className={`nav-item ${currentView === 'playlists' ? 'active' : ''}`}
        onClick={() => handleNav('playlists')}
      >
        <ListMusic size={18} />
        <span>Playlists</span>
      </div>

      {playlists && playlists.length > 0 && (
        <>
          <div className="nav-section-title">Playlists</div>
          {playlists.map((pl) => (
            <div
              key={pl.id}
              className={`nav-item ${selectedPlaylistId === pl.id && currentView === 'playlist-detail' ? 'active' : ''}`}
              onClick={() => {
                setSelectedPlaylistId(pl.id);
                setCurrentView('playlist-detail');
              }}
            >
              <ListMusic size={16} />
              <span style={{ fontSize: '0.85rem' }}>{pl.name}</span>
            </div>
          ))}
        </>
      )}

      {isLocked && (
        <div className="lock-badge" style={{ marginTop: 'auto' }}>
          <Lock size={16} />
          <span>Locked to Playlist</span>
        </div>
      )}
    </aside>
  );
}
