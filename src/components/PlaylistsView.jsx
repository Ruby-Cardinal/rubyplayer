import React from 'react';
import { ListMusic, Play, Lock, CheckCircle, Music2, ArrowLeft } from 'lucide-react';

export default function PlaylistsView({
  playlists,
  allTracks,
  onPlayTrack,
  currentTrack,
  isPlaying,
  selectedPlaylistId,
  onSelectPlaylist,
  isLocked,
  lockedPlaylistId,
  onToggleLockPlaylist,
}) {
  const currentPlaylist = playlists.find((p) => p.id === selectedPlaylistId);

  // Match playlist track paths with loaded allTracks metadata
  const getPlaylistTracks = (pl) => {
    if (!pl || !pl.tracks) return [];
    return pl.tracks
      .map((relPath) => {
        const found = allTracks.find((t) => t.relativePath === relPath || t.relativePath.endsWith(relPath));
        if (found) return found;
        // Fallback placeholder track if metadata not matched
        return {
          id: relPath,
          title: relPath.split('/').pop(),
          artist: 'Playlist Track',
          album: pl.name,
          relativePath: relPath,
          duration: 0,
        };
      })
      .filter(Boolean);
  };

  if (selectedPlaylistId && currentPlaylist) {
    const playlistTracks = getPlaylistTracks(currentPlaylist);
    const isThisLocked = isLocked && lockedPlaylistId === currentPlaylist.id;

    return (
      <div>
        <button
          className="btn-icon"
          onClick={() => onSelectPlaylist(null)}
          style={{
            width: 'auto',
            padding: '0 1rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.5rem',
            gap: '0.5rem',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <ArrowLeft size={16} />
          <span>Back to Playlists</span>
        </button>

        <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem', alignItems: 'flex-end' }}>
          <div
            style={{
              width: '160px',
              height: '160px',
              borderRadius: 'var(--radius-lg)',
              background: 'linear-gradient(135deg, var(--accent-ruby), #4c0519)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              boxShadow: 'var(--shadow-glow)',
            }}
          >
            <ListMusic size={64} />
          </div>

          <div>
            <div
              style={{
                fontSize: '0.8rem',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'var(--text-muted)',
                fontWeight: 600,
              }}
            >
              Playlist
            </div>
            <h1
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '2.2rem',
                fontWeight: 700,
                margin: '0.2rem 0',
              }}
            >
              {currentPlaylist.name}
            </h1>
            <div style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
              {playlistTracks.length} tracks
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button
                onClick={() =>
                  playlistTracks.length > 0 && onPlayTrack(playlistTracks[0], playlistTracks)
                }
                style={{
                  background: 'var(--accent-ruby)',
                  color: '#fff',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: 'var(--radius-full)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  boxShadow: 'var(--shadow-glow)',
                }}
              >
                <Play size={18} fill="#fff" />
                <span>Play Playlist</span>
              </button>

              <button
                onClick={() => onToggleLockPlaylist(currentPlaylist.id)}
                style={{
                  background: isThisLocked ? 'rgba(225, 29, 72, 0.2)' : 'var(--bg-surface-elevated)',
                  border: `1px solid ${isThisLocked ? 'var(--accent-ruby)' : 'var(--border-glass)'}`,
                  color: isThisLocked ? 'var(--accent-ruby)' : 'var(--text-primary)',
                  padding: '0.75rem 1.25rem',
                  borderRadius: 'var(--radius-full)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <Lock size={16} />
                <span>{isThisLocked ? 'Playlist Locked' : 'Lock to This Playlist'}</span>
              </button>
            </div>
          </div>
        </div>

        <table className="track-table">
          <thead>
            <tr>
              <th style={{ width: '48px' }}>#</th>
              <th>Title</th>
              <th>Artist</th>
              <th>Album</th>
              <th style={{ width: '80px', textAlign: 'right' }}>Length</th>
            </tr>
          </thead>
          <tbody>
            {playlistTracks.map((t, idx) => {
              const isCurrent = currentTrack && currentTrack.id === t.id;
              return (
                <tr
                  key={t.id || idx}
                  className={`track-row ${isCurrent ? 'playing' : ''}`}
                  onClick={() => onPlayTrack(t, playlistTracks)}
                >
                  <td style={{ textAlign: 'center', color: 'var(--text-muted)' }}>{idx + 1}</td>
                  <td style={{ fontWeight: 600 }}>{t.title}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{t.artist}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{t.album}</td>
                  <td style={{ textAlign: 'right', color: 'var(--text-muted)' }}>
                    {t.duration
                      ? `${Math.floor(t.duration / 60)}:${Math.floor(t.duration % 60)
                          .toString()
                          .padStart(2, '0')}`
                      : '--:--'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 700 }}>
          Playlists
        </h1>
        <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
          {playlists.length} playlists found in media folder
        </div>
      </div>

      {playlists.length === 0 ? (
        <div
          style={{
            padding: '4rem 2rem',
            textAlign: 'center',
            background: 'var(--bg-glass-card)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-glass)',
          }}
        >
          <ListMusic size={48} className="text-muted" style={{ marginBottom: '1rem', opacity: 0.4 }} />
          <h3>No Playlists Found</h3>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', fontSize: '0.9rem' }}>
            Add `.m3u` or `.m3u8` playlist files to your Navidrome media folder.
          </p>
        </div>
      ) : (
        <div className="card-grid">
          {playlists.map((pl) => {
            const isThisLocked = isLocked && lockedPlaylistId === pl.id;
            return (
              <div
                key={pl.id}
                className="music-card"
                onClick={() => onSelectPlaylist(pl.id)}
              >
                <div
                  className="card-img-wrapper"
                  style={{
                    background: 'linear-gradient(135deg, #be123c, #1e1b4b)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                  }}
                >
                  <ListMusic size={56} />
                  {isThisLocked && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '10px',
                        left: '10px',
                        background: 'var(--accent-ruby)',
                        padding: '4px 8px',
                        borderRadius: 'var(--radius-full)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                      }}
                    >
                      <Lock size={12} />
                      <span>LOCKED</span>
                    </div>
                  )}
                </div>
                <div className="card-title">{pl.name}</div>
                <div className="card-subtitle">{pl.tracks ? pl.tracks.length : 0} tracks</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
