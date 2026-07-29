import React from 'react';
import { Play, Pause, Music2, Clock } from 'lucide-react';

export default function TracksView({
  tracks,
  currentTrack,
  isPlaying,
  onPlayTrack,
}) {
  const formatTime = (secs) => {
    if (!secs || isNaN(secs)) return '--:--';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 700 }}>
          All Tracks
        </h1>
        <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
          {tracks.length} songs available
        </div>
      </div>

      {tracks.length === 0 ? (
        <div
          style={{
            padding: '4rem 2rem',
            textAlign: 'center',
            background: 'var(--bg-glass-card)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-glass)',
          }}
        >
          <Music2 size={48} className="text-muted" style={{ marginBottom: '1rem', opacity: 0.4 }} />
          <h3>No tracks found in media folder</h3>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', fontSize: '0.9rem' }}>
            Check your Navidrome media folder path in Settings.
          </p>
        </div>
      ) : (
        <table className="track-table">
          <thead>
            <tr>
              <th style={{ width: '48px' }}>#</th>
              <th>Title</th>
              <th>Artist</th>
              <th>Album</th>
              <th style={{ width: '80px', textAlign: 'right' }}>
                <Clock size={14} />
              </th>
            </tr>
          </thead>
          <tbody>
            {tracks.map((track, idx) => {
              const isCurrent = currentTrack && currentTrack.id === track.id;
              return (
                <tr
                  key={track.id}
                  className={`track-row ${isCurrent ? 'playing' : ''}`}
                  onClick={() => onPlayTrack(track, tracks)}
                >
                  <td style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                    {isCurrent && isPlaying ? (
                      <Pause size={16} className="text-ruby" />
                    ) : (
                      idx + 1
                    )}
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                      {track.coverArt ? (
                        <img
                          src={track.coverArt}
                          alt=""
                          style={{
                            width: '38px',
                            height: '38px',
                            borderRadius: 'var(--radius-sm)',
                            objectFit: 'cover',
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: '38px',
                            height: '38px',
                            borderRadius: 'var(--radius-sm)',
                            background: '#1e2030',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'var(--text-muted)',
                          }}
                        >
                          <Music2 size={18} />
                        </div>
                      )}
                      <div>
                        <div style={{ fontWeight: 600 }}>{track.title}</div>
                        {track.lyrics && (
                          <span
                            style={{
                              fontSize: '0.7rem',
                              color: 'var(--accent-ruby)',
                              background: 'rgba(225, 29, 72, 0.12)',
                              padding: '1px 6px',
                              borderRadius: '4px',
                            }}
                          >
                            Lyrics
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td style={{ color: 'var(--text-secondary)' }}>{track.artist}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{track.album}</td>
                  <td style={{ textAlign: 'right', color: 'var(--text-muted)' }}>
                    {formatTime(track.duration)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
