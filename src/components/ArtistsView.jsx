import React, { useState } from 'react';
import { User, Play, ArrowLeft, Disc } from 'lucide-react';

export default function ArtistsView({ tracks, onPlayTrack, currentTrack, isPlaying }) {
  const [selectedArtist, setSelectedArtist] = useState(null);

  // Group tracks by artist
  const artistsMap = {};
  for (const track of tracks) {
    const artistKey = track.artist || 'Unknown Artist';
    if (!artistsMap[artistKey]) {
      artistsMap[artistKey] = {
        name: artistKey,
        tracks: [],
        albums: new Set(),
        coverArt: track.coverArt || null,
      };
    }
    if (!artistsMap[artistKey].coverArt && track.coverArt) {
      artistsMap[artistKey].coverArt = track.coverArt;
    }
    artistsMap[artistKey].tracks.push(track);
    if (track.album) artistsMap[artistKey].albums.add(track.album);
  }

  const artistsList = Object.values(artistsMap);

  if (selectedArtist) {
    const artistData = artistsMap[selectedArtist];
    if (!artistData) {
      setSelectedArtist(null);
      return null;
    }

    return (
      <div>
        <button
          className="btn-icon"
          onClick={() => setSelectedArtist(null)}
          style={{ width: 'auto', padding: '0 1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', gap: '0.5rem', display: 'flex', alignItems: 'center' }}
        >
          <ArrowLeft size={16} />
          <span>Back to Artists</span>
        </button>

        <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem', alignItems: 'center' }}>
          {artistData.coverArt ? (
            <img
              src={artistData.coverArt}
              alt=""
              style={{ width: '140px', height: '140px', borderRadius: '50%', objectFit: 'cover', boxShadow: 'var(--shadow-glow)' }}
            />
          ) : (
            <div
              style={{
                width: '140px',
                height: '140px',
                borderRadius: '50%',
                background: '#1a1c2b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-ruby)',
              }}
            >
              <User size={64} />
            </div>
          )}
          <div>
            <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', fontWeight: 600 }}>
              Artist
            </div>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.4rem', fontWeight: 700, margin: '0.2rem 0' }}>
              {artistData.name}
            </h1>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              {artistData.albums.size} albums • {artistData.tracks.length} tracks
            </div>
            <button
              onClick={() => onPlayTrack(artistData.tracks[0], artistData.tracks)}
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
              <span>Play All Discography</span>
            </button>
          </div>
        </div>

        <table className="track-table">
          <thead>
            <tr>
              <th style={{ width: '48px' }}>#</th>
              <th>Title</th>
              <th>Album</th>
              <th style={{ width: '80px', textAlign: 'right' }}>Length</th>
            </tr>
          </thead>
          <tbody>
            {artistData.tracks.map((t, idx) => {
              const isCurrent = currentTrack && currentTrack.id === t.id;
              return (
                <tr
                  key={t.id}
                  className={`track-row ${isCurrent ? 'playing' : ''}`}
                  onClick={() => onPlayTrack(t, artistData.tracks)}
                >
                  <td style={{ textAlign: 'center', color: 'var(--text-muted)' }}>{idx + 1}</td>
                  <td style={{ fontWeight: 600 }}>{t.title}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{t.album}</td>
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
          Artists
        </h1>
        <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
          {artistsList.length} artists in library
        </div>
      </div>

      <div className="card-grid">
        {artistsList.map((artist) => (
          <div
            key={artist.name}
            className="music-card"
            onClick={() => setSelectedArtist(artist.name)}
          >
            <div className="card-img-wrapper" style={{ borderRadius: '50%' }}>
              {artist.coverArt ? (
                <img src={artist.coverArt} alt={artist.name} />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                  <User size={48} />
                </div>
              )}
              <div
                className="card-play-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onPlayTrack(artist.tracks[0], artist.tracks);
                }}
              >
                <Play size={20} fill="#fff" style={{ marginLeft: '2px' }} />
              </div>
            </div>
            <div className="card-title" style={{ textAlign: 'center' }}>{artist.name}</div>
            <div className="card-subtitle" style={{ textAlign: 'center' }}>
              {artist.albums.size} albums • {artist.tracks.length} tracks
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
