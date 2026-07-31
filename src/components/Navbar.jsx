import React from 'react';
import { Search, Settings, User, LogOut, Lock, Unlock, ListMusic, X } from 'lucide-react';
import { APP_VERSION } from '../version';

export default function Navbar({
  searchQuery,
  setSearchQuery,
  onOpenConfig,
  currentUser,
  onOpenLogin,
  onLogout,
  isLocked,
  onOpenPlaylistEditor,
}) {
  return (
    <header className="navbar">
      {/* Brand Logo */}
      <div className="brand">
        <svg viewBox="0 0 44 24" className="brand-icon" fill="currentColor">
          {/* Left Large Soaring Wings */}
          <path d="M 12.019543,9.84966 C 6.0195435,0.84966 0.23452747,-0.508646 0.23452747,2.491354 1.5863185,4.235654 2.1433225,5.165263 3.8143315,6.33953 4.9739405,7.313472 5.5276865,7.918064 6.9332245,8.437282 8.7459275,8.79624 9.5195435,7.34966 12.019543,9.84966 Z" opacity="0.92" />
          <path d="M 12.307968,11.059576 C 5.6454687,3.8534248 0.5463824,3.8636644 1.0893481,6.7156874 c 1.4497602,1.354126 2.0852992,2.1125647 3.6996946,2.8529567 1.1491079,0.6650049 1.7230881,1.1151889 2.9962142,1.2925719 1.585706,-0.06658 1.9729055,-1.6158616 4.5227101,0.198365 z" opacity="0.92" style={{ strokeWidth: 0.915573 }} />
          <path d="M 13.726849,13.503329 C 7.38949,7.854406 2.7501784,8.0780633 3.3531024,10.402154 c 1.3708431,1.053155 1.9780789,1.65047 3.4752957,2.191617 1.0709701,0.498745 1.6104246,0.84499 2.775624,0.937223 1.4403059,-0.121724 1.7334789,-1.413012 4.1228259,-0.02766 z" opacity="0.92" style={{ strokeWidth: 0.793121 }} />
          {/* Original Classic Ruby Diamond (Center) */}
          <path d="M22 3L12 10l10 13 10-13-10-7zm0 3.8L28.2 10 22 18 15.8 10 22 6.8z" />
          {/* Right Large Soaring Wings */}
          <path d="m 32.189158,9.7124763 c 5.999999,-9.00000001 11.785016,-10.35830601 11.785016,-7.358306 -1.351792,1.7443 -1.908795,2.673909 -3.579805,3.848176 -1.159609,0.973942 -1.713354,1.578534 -3.118892,2.097752 -1.812704,0.358958 -2.58632,-1.087622 -5.086319,1.412378 z" opacity="0.92" />
          <path d="m 31.900733,10.922392 c 6.662499,-7.2061509 11.761586,-7.1959113 11.21862,-4.3438883 -1.44976,1.354126 -2.085299,2.1125647 -3.699695,2.8529567 -1.149108,0.6650046 -1.723088,1.1151886 -2.996214,1.2925716 -1.585706,-0.06658 -1.972905,-1.6158613 -4.52271,0.198365 z" opacity="0.92" style={{ strokeWidth: 0.915573 }} />
          <path d="m 30.481852,13.366145 c 6.337359,-5.6489227 10.976671,-5.4252654 10.373747,-3.101175 -1.370843,1.053155 -1.978079,1.65047 -3.475296,2.191617 -1.07097,0.498745 -1.610425,0.84499 -2.775624,0.937223 -1.440306,-0.121724 -1.733479,-1.413012 -4.122826,-0.02766 z" opacity="0.92" style={{ strokeWidth: 0.793121 }} />
        </svg>
        <span className="brand-name">
          <span className="brand-ruby">Ruby</span>
          <sub className="brand-player-sub">Player</sub>
          <sup style={{ fontSize: '0.5em', opacity: 0.45, marginLeft: '0.25em', fontWeight: 400, letterSpacing: '0.02em' }}>{APP_VERSION}</sup>
        </span>
      </div>

      {/* Center Search Input */}
      <div className="search-box">
        <Search size={16} className="search-icon" />
        <input
          type="text"
          placeholder="Search songs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button
            type="button"
            className="search-clear-btn"
            onClick={() => setSearchQuery('')}
            title="Clear search"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Right Header Actions: User Auth Status & Settings */}
      <div className="nav-actions" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        {currentUser ? (
          <div className="user-badge">
            <User size={14} style={{ color: 'var(--accent-ruby)' }} />
            <span>{currentUser.username}</span>
            <button
              onClick={onLogout}
              className="btn-logout"
              title="Log Out"
            >
              <LogOut size={13} />
            </button>
          </div>
        ) : (
          <button
            className="btn-icon"
            onClick={onOpenLogin}
            title={isLocked ? "Log in to unlock full library" : "Log in"}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              width: 'auto',
              padding: '0.35rem 0.85rem',
              borderRadius: 'var(--radius-full, 9999px)',
              border: isLocked ? '1px solid var(--accent-ruby)' : '1px solid var(--border-glass)',
              background: isLocked ? 'rgba(255, 46, 85, 0.12)' : 'transparent',
              fontSize: '0.82rem',
              fontWeight: '600',
              color: isLocked ? 'var(--accent-ruby)' : 'var(--text-primary)',
            }}
          >
            <User size={15} />
            <span>Log In</span>
          </button>
        )}

        {currentUser?.role === 'admin' && (
          <button
            className="btn-icon btn-playlist-editor"
            onClick={onOpenPlaylistEditor}
            title="Manage Playlists (Admin)"
          >
            <ListMusic size={20} />
          </button>
        )}

        <button className="btn-icon btn-settings" onClick={onOpenConfig} title="Settings & Preferences">
          <Settings size={20} />
        </button>
      </div>
    </header>
  );
}

