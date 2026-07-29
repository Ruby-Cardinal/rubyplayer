import React from 'react';
import { Search, Settings, User, LogOut, Lock, Unlock } from 'lucide-react';

export default function Navbar({
  searchQuery,
  setSearchQuery,
  onOpenConfig,
  currentUser,
  onOpenLogin,
  onLogout,
  isLocked,
}) {
  return (
    <header className="navbar">
      {/* Brand Logo */}
      <div className="brand">
        <svg viewBox="0 0 44 24" className="brand-icon" fill="currentColor">
          {/* Right Soaring Wings */}
          <path d="M 32,10 C 38,1 43.785016,-0.35830619 43.785016,2.6416938 42.433225,4.3859935 41.876221,5.3156033 40.205212,6.4898704 39.045603,7.4638118 38.491857,8.0684039 37.086319,8.5876221 35.273616,8.9465798 34.5,7.5 32,10 Z" opacity="0.92" />
          <path d="M 32.557483,9.8018244 C 39.315343,4.6633629 43.923167,5.2474812 43.141157,7.5175866 41.692493,8.4608349 41.040603,9.0090678 39.505805,9.4320235 38.399261,9.8458904 37.83449,10.149089 36.665646,10.15034 35.239186,9.9168673 35.047421,8.6066754 32.557483,9.8018284 Z" opacity="0.92" />
          <path d="m 32.368343,9.8493609 c 8.045763,-2.7089031 12.225172,-0.6826315 10.758593,1.2184371 -1.674161,0.430733 -2.467086,0.741844 -4.056562,0.652047 -1.180781,0.03847 -1.812837,0.145249 -2.920766,-0.227162 -1.277007,-0.677164 -1.039938,-1.97992 -3.781266,-1.6433183 z" opacity="0.92" />

          {/* Left Soaring Wings */}
          <path d="M 12.019543,9.84966 C 6.0195435,0.84966 0.23452747,-0.508646 0.23452747,2.491354 1.5863185,4.235654 2.1433225,5.165263 3.8143315,6.33953 4.9739405,7.313472 5.5276865,7.918064 6.9332245,8.437282 8.7459275,8.79624 9.5195435,7.34966 12.019543,9.84966 Z" opacity="0.92" />
          <path d="M 11.46206,9.651484 C 4.7042005,4.513023 0.09637647,5.097141 0.87838647,7.367247 2.3270505,8.310495 2.9789405,8.858728 4.5137385,9.281684 5.6202825,9.69555 6.1850535,9.998749 7.3538975,10 8.7803575,9.766527 8.9721225,8.456335 11.46206,9.651488 Z" opacity="0.92" />
          <path d="M 11.6512,9.699021 C 3.6054375,6.990118 -0.57397153,9.016389 0.89260747,10.917458 c 1.67416103,0.430733 2.46708603,0.741844 4.05656203,0.652047 1.180781,0.03847 1.812837,0.145249 2.920766,-0.227162 1.277007,-0.677164 1.039938,-1.97992 3.7812655,-1.643318 z" opacity="0.92" />

          {/* Original Classic Ruby Diamond (Center) */}
          <path d="M22 3L12 10l10 13 10-13-10-7zm0 3.8L28.2 10 22 18 15.8 10 22 6.8z" />
        </svg>
        <span className="brand-name">
          <span className="brand-ruby">Ruby</span>
          <sub className="brand-player-sub">Player</sub>
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
      </div>

      {/* Right Header Actions: User Auth Status & Settings */}
      <div className="nav-actions" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        {currentUser ? (
          <div className="user-badge">
            <Unlock size={14} style={{ color: '#10b981' }} />
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
            {isLocked ? <Lock size={14} /> : <User size={15} />}
            <span>Log In</span>
          </button>
        )}

        <button className="btn-icon btn-settings" onClick={onOpenConfig} title="Settings & Preferences">
          <Settings size={20} />
        </button>
      </div>
    </header>
  );
}

