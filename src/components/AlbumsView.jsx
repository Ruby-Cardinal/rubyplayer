import React, { useState } from 'react';
import { Disc, Play, ArrowLeft, Music2 } from 'lucide-react';

export default function AlbumsView({ tracks, onPlayTrack, currentTrack, isPlaying }) {
  const [selectedAlbum, setSelectedAlbum] = useState(null);

  const albumsMap = {};
  for (const track of tracks) {
    const albumKey = track.album || 'Unknown Album';
    if (!albumsMap[albumKey]) {
      albumsMap[albumKey] = {
        name: albumKey,
        artist: track.artist || 'Unknown Artist',
        coverArt: track.coverArt || null,
        tracks: [],
      };
    }
    if (!albumsMap[albumKey].coverArt && track.coverArt) {
      albumsMap[albumKey].coverArt = track.coverArt;
    }
    albumsMap[albumKey].tracks.push(track);
  }

  const albumsList = Object.values(albumsMap);

  if (selectedAlbum) {
    const albumData = albumsMap[selectedAlbum];
    if (!albumData) {
      setSelectedAlbum(null);
      return null;
    }

    return (
      <div>
        <button
          className="btn-icon"
          onClick={() => setSelectedAlbum(null)}
          style={{ width: 'auto', padding: '0 1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', gap: '0.5rem', display: 'flex', alignItems: 'center' }}
        >
          <ArrowLeft size={16} />
          <span>Back to Albums</span>
        </button>

        <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem', alignItems: 'flex-end' }}>
          {albumData.coverArt ? (
            <img
              src={albumData.coverArt}
              alt=""
              style={{ width: '160px', height: '160px', borderRadius: 'var(--radius-lg)', objectFit: 'cover', boxShadow: 'var(--shadow-glow)' }}
            />
          ) : (
            <div
              style={{
                width: '160px',
                height: '160px',
                borderRadius: 'var(--radius-lg)',
                background: '#1a1c2b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-ruby)',
              }}
            >
              <Disc size={64} />
            </div>
          )}
          <div>
            <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', fontWeight: 600 }}>
              Album
            </div>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', fontWeight: 700, margin: '0.2rem 0' }}>
              {albumData.name}
            </h1>
            <div style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
              {albumData.artist} • {albumData.tracks.length} songs
            </div>
            <button
              onClick={() => onPlayTrack(albumData.tracks[0], albumData.tracks)}
              style={{
                marginTop: '1rem',
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
              <span>Play Album</span>
            </button>
          </div>
        </div>

        <table className="track-table">
          <thead>
            <tr>
              <th style={{ width: '48px' }}>#</th>
              <th>Title</th>
              <th>Artist</th>
              <th style={{ width: '80px', textAlign: 'right' }}>Length</th>
            </tr>
          </thead>
          <tbody>
            {albumData.tracks.map((t, idx) => {
              const isCurrent = currentTrack && currentTrack.id === t.id;
              return (
                <tr
                  key={t.id}
                  className={`track-row ${isCurrent ? 'playing' : ''}`}
                  onClick={() => onPlayTrack(t, albumData.tracks)}
                >
                  <td style={{ textAlign: 'center', color: 'var(--text-muted)' }}>{idx + 1}</td>
                  <td style={{ fontWeight: 600 }}>{t.title}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{t.artist}</td>
                  <td style={{ textAlign: 'right', color: 'var(--text-muted)' }}>
                    {t.duration ? `${Math.floor(t.duration / 60)}:${Math.floor(t.duration % 60).toString().padStart(2, '0')}` : '--:--'}
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
          Albums
        </h1>
        <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
          {albumsList.length} albums in library
        </div>
      </div>

      <div className="card-grid">
        {albumsList.map((album) => (
          <div
            key={album.name}
            className="music-card"
            onClick={() => setSelectedAlbum(album.name)}
          >
            <div className="card-img-wrapper">
              {album.coverArt ? (
                <img src={album.coverArt} alt={album.name} />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                  <Disc size={48} />
                </div>
              )}
              <div
                className="card-play-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onPlayTrack(album.tracks[0], album.tracks);
                }}
              >
                <Play size={20} fill="#fff" style={{ marginLeft: '2px' }} />
              </div>
            </div>
            <div className="card-title">{album.name}</div>
            <div className="card-subtitle">{album.artist} • {album.tracks.length} tracks</div>
          </div>
        ))}
      </div>
    </div>
  );
}
