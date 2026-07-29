import React from 'react';
import { Music2 } from 'lucide-react';
import { getCoverArtUrl, getFolderCoverUrl } from '../services/mediaService';

const RETRO_LABEL_PALETTES = [
  {
    name: 'Capitol Mustard Gold',
    background: 'radial-gradient(circle at 38% 35%, #d4a630 0%, #b8860b 45%, #7a5806 80%, #523b03 100%)',
    textColor: '#1a0d00',
    subtextColor: 'rgba(26, 13, 0, 0.75)',
    dividerColor: 'rgba(26, 13, 0, 0.35)',
    spindleBg: '#100800',
    spindleBorder: 'rgba(255, 220, 100, 0.4)',
  },
  {
    name: 'Verve Plum Purple',
    background: 'radial-gradient(circle at 38% 35%, #805ad5 0%, #5b37a6 45%, #3c2075 80%, #231147 100%)',
    textColor: '#fffaed',
    subtextColor: 'rgba(255, 250, 237, 0.8)',
    dividerColor: 'rgba(255, 250, 237, 0.35)',
    spindleBg: '#120726',
    spindleBorder: 'rgba(220, 190, 255, 0.4)',
  },
  {
    name: 'RCA Crimson Red',
    background: 'radial-gradient(circle at 38% 35%, #c83232 0%, #9e1b1b 45%, #6e0f0f 80%, #450808 100%)',
    textColor: '#fff5e6',
    subtextColor: 'rgba(255, 245, 230, 0.8)',
    dividerColor: 'rgba(255, 245, 230, 0.35)',
    spindleBg: '#1c0505',
    spindleBorder: 'rgba(255, 180, 180, 0.4)',
  },
  {
    name: 'Apple Emerald Green',
    background: 'radial-gradient(circle at 38% 35%, #2f855a 0%, #225c3e 45%, #153e2a 80%, #0b2619 100%)',
    textColor: '#fffaed',
    subtextColor: 'rgba(255, 250, 237, 0.8)',
    dividerColor: 'rgba(255, 250, 237, 0.35)',
    spindleBg: '#051910',
    spindleBorder: 'rgba(180, 255, 210, 0.4)',
  },
  {
    name: 'Sun Burnt Orange',
    background: 'radial-gradient(circle at 38% 35%, #dd6b20 0%, #b84c0b 45%, #803104 80%, #521d01 100%)',
    textColor: '#1c0a00',
    subtextColor: 'rgba(28, 10, 0, 0.75)',
    dividerColor: 'rgba(28, 10, 0, 0.35)',
    spindleBg: '#140600',
    spindleBorder: 'rgba(255, 200, 150, 0.4)',
  },
  {
    name: 'Blue Note Royal Navy',
    background: 'radial-gradient(circle at 38% 35%, #2b6cb0 0%, #1e4e82 45%, #123357 80%, #0a1f36 100%)',
    textColor: '#fff8e7',
    subtextColor: 'rgba(255, 248, 231, 0.8)',
    dividerColor: 'rgba(255, 248, 231, 0.35)',
    spindleBg: '#051221',
    spindleBorder: 'rgba(180, 220, 255, 0.4)',
  },
  {
    name: 'Atlantic Teal Cyan',
    background: 'radial-gradient(circle at 38% 35%, #319795 0%, #236e6c 45%, #144746 80%, #0b2b2a 100%)',
    textColor: '#fffaed',
    subtextColor: 'rgba(255, 250, 237, 0.8)',
    dividerColor: 'rgba(255, 250, 237, 0.35)',
    spindleBg: '#041716',
    spindleBorder: 'rgba(180, 255, 250, 0.4)',
  },
  {
    name: 'Motown Chocolate Brown',
    background: 'radial-gradient(circle at 38% 35%, #9c6644 0%, #7f4f24 45%, #582f0e 80%, #3a1d05 100%)',
    textColor: '#fff8e7',
    subtextColor: 'rgba(255, 248, 231, 0.8)',
    dividerColor: 'rgba(255, 248, 231, 0.35)',
    spindleBg: '#1a0b00',
    spindleBorder: 'rgba(255, 220, 180, 0.4)',
  },
];

function getRetroPaletteForTrack(track) {
  const str = `${track?.title || ''}-${track?.artist || ''}`.toLowerCase();
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % RETRO_LABEL_PALETTES.length;
  return RETRO_LABEL_PALETTES[index];
}

export default function VinylDisc({ currentTrack, isPlaying, onOpenLyrics, theme, children }) {
  const songTitle = currentTrack?.title || 'No Song Selected';
  const artistName = currentTrack?.artist || 'Unknown Artist';
  const isRetro = theme === 'retro';
  const retroPalette = getRetroPaletteForTrack(currentTrack);

  // Dynamically shrink title font size when text is long.
  // Arc circumference at r=108 is ~339px. At 24px, ~14px avg char width → ~24 chars fit.
  const MAX_TITLE_SIZE = 24;
  const MIN_TITLE_SIZE = 9;
  const IDEAL_MAX_CHARS = 22;
  const titleFontSize = Math.max(
    MIN_TITLE_SIZE,
    Math.floor(MAX_TITLE_SIZE * IDEAL_MAX_CHARS / Math.max(songTitle.length, IDEAL_MAX_CHARS))
  );

  // Determine artwork image (embedded cover art -> folder cover.png -> RubyCardinal.png fallback)
  const coverArt = currentTrack
    ? (currentTrack.hasCover ? getCoverArtUrl(currentTrack.id) : getFolderCoverUrl(currentTrack.id))
    : getFolderCoverUrl();

  const [imgError, setImgError] = React.useState(false);

  React.useEffect(() => {
    setImgError(false);
  }, [coverArt]);

  return (
    <div className="vinyl-container" onClick={onOpenLyrics} title="Click to view lyrics">
      {/* Outer Glowing Ring */}
      <div className={`vinyl-outer-ring ${isPlaying ? 'playing' : ''}`}>

        {/* Visualizer overlay child layer */}
        {children}

        {/* Center: Classic Vinyl label in Retro mode, Album Art otherwise */}
        <div className="vinyl-center-art">
          {isRetro ? (
            /* ── Classic vinyl center label — fills the full art circle ── */
            <div className="retro-vinyl-label" style={{ background: retroPalette.background }}>
              <div className="retro-label-top">
                <span className="retro-label-title" style={{ color: retroPalette.textColor }}>
                  {songTitle}
                </span>
              </div>

              <div className="retro-spindle-zone">
                <div
                  className="retro-spindle"
                  style={{
                    background: retroPalette.spindleBg,
                    borderColor: retroPalette.spindleBorder,
                  }}
                />
              </div>

              <div className="retro-label-bottom">
                <div className="retro-label-divider" style={{ background: retroPalette.dividerColor }} />
                <span className="retro-label-artist" style={{ color: retroPalette.subtextColor }}>
                  {artistName}
                </span>
                <span className="retro-label-speed" style={{ color: retroPalette.subtextColor }}>
                  33⅓ RPM
                </span>
              </div>
            </div>
          ) : (coverArt && !imgError) ? (
            <img src={coverArt} alt={songTitle} className="vinyl-img" onError={() => setImgError(true)} />
          ) : (
            <div className="vinyl-placeholder">
              <Music2 size={54} className="vinyl-placeholder-icon" />
            </div>
          )}
        </div>

        {/* SVG Vector Curved Text Layer (TOP LAYER ABOVE VISUALIZER) */}
        {!isRetro && (
          <svg viewBox="0 0 300 300" className="vinyl-text-svg">
            <defs>
              {/* Top arc path for Song Title (clockwise) */}
              <path
                id="topArc"
                d="M 42, 150 A 108, 108 0 1, 1 258, 150"
                fill="none"
              />
              {/* Bottom arc path for Artist Name (counter-clockwise / flipped) */}
              <path
                id="bottomArc"
                d="M 258, 150 A 108, 108 0 0, 1 42, 150"
                fill="none"
              />
            </defs>

            {/* Curved Song Title (Top) */}
            <text className="vinyl-curved-text title-text" style={{ fontSize: `${titleFontSize}px` }}>
              <textPath href="#topArc" startOffset="50%" textAnchor="middle">
                {songTitle}
              </textPath>
            </text>

            {/* Curved Artist Name (Bottom) */}
            <text className="vinyl-curved-text artist-text">
              <textPath href="#bottomArc" startOffset="50%" textAnchor="middle">
                {artistName}
              </textPath>
            </text>
          </svg>
        )}

      </div>
    </div>
  );
}
