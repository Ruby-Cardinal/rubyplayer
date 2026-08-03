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
  const isSakura = theme === 'sakura' || document.body.classList.contains('theme-sakura');
  const sakuraPalette = {
    name: 'Japanese Sakura Blossom 櫻',
    background: 'radial-gradient(circle at 38% 35%, #ffe4e9 0%, #ffb7c5 40%, #f472b6 75%, #301424 100%)',
    textColor: '#2d0c1e',
    subtextColor: 'rgba(45, 12, 30, 0.85)',
    dividerColor: 'rgba(45, 12, 30, 0.4)',
    spindleBg: '#180712',
    spindleBorder: 'rgba(255, 183, 197, 0.6)',
  };
  const retroPalette = isSakura ? sakuraPalette : getRetroPaletteForTrack(currentTrack);

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
  }, [coverArt, theme]);

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
              {/* Brand Logo Watermark Layer */}
              <div className="retro-watermark">
                <svg viewBox="0 0 44 24" className="retro-watermark-svg" fill="currentColor">
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
              </div>
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
              <svg viewBox="0 0 44 24" className="vinyl-placeholder-logo" fill="var(--accent-ruby)">
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
