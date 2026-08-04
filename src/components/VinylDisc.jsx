import React, { useState, useEffect } from 'react';
import { Music2 } from 'lucide-react';
import { getCoverArtUrl, getFolderCoverUrl } from '../services/mediaService';
import { getActiveTheme, onThemeChange } from '../services/themeService';

export default function VinylDisc({ currentTrack, isPlaying, onOpenLyrics, theme, children, overlay }) {
  const [activeThemeState, setActiveThemeState] = useState(() => getActiveTheme());

  useEffect(() => {
    const unsubscribe = onThemeChange(({ activeTheme }) => {
      setActiveThemeState(activeTheme);
    });
    return () => unsubscribe();
  }, []);

  const songTitle = currentTrack?.title || 'No Song Selected';
  const artistName = currentTrack?.artist || 'Unknown Artist';

  const currentTheme = activeThemeState;

  let vinylLabelPalette = null;
  if (currentTheme) {
    if (typeof currentTheme.getDynamicVinylLabel === 'function') {
      vinylLabelPalette = currentTheme.getDynamicVinylLabel(currentTrack);
    } else if (currentTheme.vinylLabel) {
      vinylLabelPalette = currentTheme.vinylLabel;
    }
  }

  const hasVinylLabel = !!vinylLabelPalette;

  const MAX_TITLE_SIZE = 24;
  const MIN_TITLE_SIZE = 9;
  const IDEAL_MAX_CHARS = 22;
  const titleFontSize = Math.max(
    MIN_TITLE_SIZE,
    Math.floor(MAX_TITLE_SIZE * IDEAL_MAX_CHARS / Math.max(songTitle.length, IDEAL_MAX_CHARS))
  );

  const coverArt = currentTrack
    ? (currentTrack.hasCover ? getCoverArtUrl(currentTrack.id) : getFolderCoverUrl(currentTrack.id))
    : getFolderCoverUrl();

  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [coverArt, theme]);

  return (
    <div className="vinyl-container" onClick={onOpenLyrics} title="Click to view lyrics">
      <div className={`vinyl-outer-ring ${isPlaying ? 'playing' : ''}`}>

        {children}

        <div className="vinyl-center-art" style={hasVinylLabel ? { borderColor: '#121212' } : {}}>
          {hasVinylLabel ? (
            <div className="retro-vinyl-label" style={{ background: vinylLabelPalette.background }}>
              <div className="retro-watermark">
                <svg viewBox="0 0 44 24" className="retro-watermark-svg" fill="currentColor">
                  <path d="M 12.019543,9.84966 C 6.0195435,0.84966 0.23452747,-0.508646 0.23452747,2.491354 1.5863185,4.235654 2.1433225,5.165263 3.8143315,6.33953 4.9739405,7.313472 5.5276865,7.918064 6.9332245,8.437282 8.7459275,8.79624 9.5195435,7.34966 12.019543,9.84966 Z" opacity="0.92" />
                  <path d="M 12.307968,11.059576 C 5.6454687,3.8534248 0.5463824,3.8636644 1.0893481,6.7156874 c 1.4497602,1.354126 2.0852992,2.1125647 3.6996946,2.8529567 1.1491079,0.6650049 1.7230881,1.1151889 2.9962142,1.2925719 1.585706,-0.06658 1.9729055,-1.6158616 4.5227101,0.198365 z" opacity="0.92" style={{ strokeWidth: 0.915573 }} />
                  <path d="M 13.726849,13.503329 C 7.38949,7.854406 2.7501784,8.0780633 3.3531024,10.402154 c 1.3708431,1.053155 1.9780789,1.65047 3.4752957,2.191617 1.0709701,0.498745 1.6104246,0.84499 2.775624,0.937223 1.4403059,-0.121724 1.7334789,-1.413012 4.1228259,-0.02766 z" opacity="0.92" style={{ strokeWidth: 0.793121 }} />
                  <path d="M22 3L12 10l10 13 10-13-10-7zm0 3.8L28.2 10 22 18 15.8 10 22 6.8z" />
                  <path d="m 32.189158,9.7124763 c 5.999999,-9.00000001 11.785016,-10.35830601 11.785016,-7.358306 -1.351792,1.7443 -1.908795,2.673909 -3.579805,3.848176 -1.159609,0.973942 -1.713354,1.578534 -3.118892,2.097752 -1.812704,0.358958 -2.58632,-1.087622 -5.086319,1.412378 z" opacity="0.92" />
                  <path d="m 31.900733,10.922392 c 6.662499,-7.2061509 11.761586,-7.1959113 11.21862,-4.3438883 -1.44976,1.354126 -2.085299,2.1125647 -3.699695,2.8529567 -1.149108,0.6650046 -1.723088,1.1151886 -2.996214,1.2925716 -1.585706,-0.06658 -1.972905,-1.6158613 -4.52271,0.198365 z" opacity="0.92" style={{ strokeWidth: 0.915573 }} />
                  <path d="m 30.481852,13.366145 c 6.337359,-5.6489227 10.976671,-5.4252654 10.373747,-3.101175 -1.370843,1.053155 -1.978079,1.65047 -3.475296,2.191617 -1.07097,0.498745 -1.610425,0.84499 -2.775624,0.937223 -1.440306,-0.121724 -1.733479,-1.413012 -4.122826,-0.02766 z" opacity="0.92" style={{ strokeWidth: 0.793121 }} />
                </svg>
              </div>
              <div className="retro-label-top">
                <span className="retro-label-title" style={{ color: vinylLabelPalette.textColor }}>
                  {songTitle}
                </span>
              </div>

              <div className="retro-spindle-zone">
                <div
                  className="retro-spindle"
                  style={{
                    background: vinylLabelPalette.spindleBg,
                    borderColor: vinylLabelPalette.spindleBorder,
                  }}
                />
              </div>

              <div className="retro-label-bottom">
                <div className="retro-label-divider" style={{ background: vinylLabelPalette.dividerColor }} />
                <span className="retro-label-artist" style={{ color: vinylLabelPalette.subtextColor }}>
                  {artistName}
                </span>
                <span className="retro-label-speed" style={{ color: vinylLabelPalette.subtextColor }}>
                  33⅓ RPM
                </span>
              </div>
            </div>
          ) : (coverArt && !imgError) ? (
            <img src={coverArt} alt={songTitle} className="vinyl-img" onError={() => setImgError(true)} />
          ) : (
            <div className="vinyl-placeholder">
              <svg viewBox="0 0 44 24" className="vinyl-placeholder-logo" fill="var(--accent-ruby)">
                <path d="M 12.019543,9.84966 C 6.0195435,0.84966 0.23452747,-0.508646 0.23452747,2.491354 1.5863185,4.235654 2.1433225,5.165263 3.8143315,6.33953 4.9739405,7.313472 5.5276865,7.918064 6.9332245,8.437282 8.7459275,8.79624 9.5195435,7.34966 12.019543,9.84966 Z" opacity="0.92" />
                <path d="M 12.307968,11.059576 C 5.6454687,3.8534248 0.5463824,3.8636644 1.0893481,6.7156874 c 1.4497602,1.354126 2.0852992,2.1125647 3.6996946,2.8529567 1.1491079,0.6650049 1.7230881,1.1151889 2.9962142,1.2925719 1.585706,-0.06658 1.9729055,-1.6158616 4.5227101,0.198365 z" opacity="0.92" style={{ strokeWidth: 0.915573 }} />
                <path d="M 13.726849,13.503329 C 7.38949,7.854406 2.7501784,8.0780633 3.3531024,10.402154 c 1.3708431,1.053155 1.9780789,1.65047 3.4752957,2.191617 1.0709701,0.498745 1.6104246,0.84499 2.775624,0.937223 1.4403059,-0.121724 1.7334789,-1.413012 4.1228259,-0.02766 z" opacity="0.92" style={{ strokeWidth: 0.793121 }} />
                <path d="M22 3L12 10l10 13 10-13-10-7zm0 3.8L28.2 10 22 18 15.8 10 22 6.8z" />
                <path d="m 32.189158,9.7124763 c 5.999999,-9.00000001 11.785016,-10.35830601 11.785016,-7.358306 -1.351792,1.7443 -1.908795,2.673909 -3.579805,3.848176 -1.159609,0.973942 -1.713354,1.578534 -3.118892,2.097752 -1.812704,0.358958 -2.58632,-1.087622 -5.086319,1.412378 z" opacity="0.92" />
                <path d="m 31.900733,10.922392 c 6.662499,-7.2061509 11.761586,-7.1959113 11.21862,-4.3438883 -1.44976,1.354126 -2.085299,2.1125647 -3.699695,2.8529567 -1.149108,0.6650046 -1.723088,1.1151886 -2.996214,1.2925716 -1.585706,-0.06658 -1.972905,-1.6158613 -4.52271,0.198365 z" opacity="0.92" style={{ strokeWidth: 0.915573 }} />
                <path d="m 30.481852,13.366145 c 6.337359,-5.6489227 10.976671,-5.4252654 10.373747,-3.101175 -1.370843,1.053155 -1.978079,1.65047 -3.475296,2.191617 -1.07097,0.498745 -1.610425,0.84499 -2.775624,0.937223 -1.440306,-0.121724 -1.733479,-1.413012 -4.122826,-0.02766 z" opacity="0.92" style={{ strokeWidth: 0.793121 }} />
              </svg>
            </div>
          )}
        </div>

        {!hasVinylLabel && (
          <svg viewBox="0 0 300 300" className="vinyl-text-svg">
            <defs>
              <path
                id="topArc"
                d="M 42, 150 A 108, 108 0 1, 1 258, 150"
                fill="none"
              />
              <path
                id="bottomArc"
                d="M 258, 150 A 108, 108 0 0, 1 42, 150"
                fill="none"
              />
            </defs>

            <text className="vinyl-curved-text title-text" style={{ fontSize: `${titleFontSize}px` }}>
              <textPath href="#topArc" startOffset="50%" textAnchor="middle">
                {songTitle}
              </textPath>
            </text>

            <text className="vinyl-curved-text artist-text">
              <textPath href="#bottomArc" startOffset="50%" textAnchor="middle">
                {artistName}
              </textPath>
            </text>
          </svg>
        )}

      </div>
      {overlay}
    </div>
  );
}

