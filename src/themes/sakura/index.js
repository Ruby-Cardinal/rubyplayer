import { Flower2 } from 'lucide-react';

export default {
  id: 'sakura',
  name: 'Sakura Ink 櫻',
  Icon: Flower2,
  previewGradient: 'linear-gradient(135deg, #1c141a, #ffb7c5, #f472b6, #181218)',
  previewTextColor: '#ffffff',
  bodyClass: 'theme-sakura',
  vars: {
    '--accent-ruby': '#ff9ebb',
    '--accent-ruby-dark': '#db2777',
    '--accent-ruby-glow': 'rgba(255, 158, 187, 0.65)',
    '--accent-ruby-bg-glow': 'rgba(255, 158, 187, 0.16)',
    '--border-glow': 'rgba(244, 114, 182, 0.45)',
    '--shadow-ruby': '0 0 28px rgba(255, 158, 187, 0.4)',
  },
  css: `
    .sakura-theme-canvas {
      display: none;
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 0;
      overflow: hidden;
    }
    body.theme-sakura .sakura-theme-canvas {
      display: block;
    }
    .sakura-ink-wash-overlay {
      position: absolute;
      inset: 0;
      background: 
        radial-gradient(circle at 15% 15%, rgba(255, 183, 197, 0.1), transparent 60%),
        radial-gradient(circle at 85% 85%, rgba(244, 114, 182, 0.08), transparent 50%),
        radial-gradient(circle at 50% 50%, rgba(20, 14, 20, 0.4), rgba(12, 8, 12, 0.95));
    }
    .sakura-branch-svg {
      position: absolute;
      pointer-events: none;
      filter: drop-shadow(0 4px 18px rgba(0, 0, 0, 0.8));
    }
    .sakura-branch-svg.top-left-branch {
      top: 0;
      left: 0;
      width: 680px;
      height: 480px;
      opacity: 0.92;
    }
    .sakura-branch-svg.bottom-right-branch {
      bottom: 0;
      right: 0;
      width: 580px;
      height: 380px;
      opacity: 0.85;
    }
    .sakura-falling-petals-container {
      position: absolute;
      inset: 0;
      pointer-events: none;
    }
    .sakura-petal {
      position: absolute;
      top: -40px;
      background: linear-gradient(135deg, #fff0f5 0%, #ffb7c5 60%, #f472b6 100%);
      border-radius: 50% 0% 50% 50%;
      box-shadow: 0 0 10px rgba(255, 183, 197, 0.6);
      animation: floatSakuraPetal linear infinite;
      transform-origin: center center;
    }
    @keyframes floatSakuraPetal {
      0% { top: -40px; transform: translateX(0) rotate(0deg); }
      25% { transform: translateX(25px) rotate(90deg); }
      50% { transform: translateX(-20px) rotate(180deg); }
      75% { transform: translateX(30px) rotate(270deg); }
      100% { top: 105vh; transform: translateX(-15px) rotate(360deg); }
    }
    body.theme-sakura {
      background-color: #120c12 !important;
      color: #fff0f5 !important;
    }
    body.theme-sakura .glass-card {
      background: rgba(24, 17, 26, 0.82) !important;
      border-color: rgba(255, 183, 197, 0.25) !important;
      backdrop-filter: blur(14px) !important;
    }
    body.theme-sakura .navbar {
      background: rgba(20, 14, 22, 0.88) !important;
      border-bottom-color: rgba(255, 183, 197, 0.22) !important;
    }
    body.theme-sakura .player-bar {
      background: rgba(18, 12, 20, 0.92) !important;
      border-top-color: rgba(255, 183, 197, 0.22) !important;
    }
    body.theme-sakura .track-row:hover {
      background: rgba(255, 183, 197, 0.1) !important;
    }
    body.theme-sakura .track-row.active {
      background: rgba(255, 183, 197, 0.18) !important;
      border-left-color: #ff9ebb !important;
    }
  `,
  vinylLabel: null,
  getDynamicVinylLabel: () => {
    try {
      const enabled = localStorage.getItem('rubyplayer_theme_sakura_sakuraRetroLabel') === 'true';
      if (enabled) {
        return {
          name: 'Japanese Sakura Blossom 櫻',
          background: 'radial-gradient(circle at 38% 35%, #ffe4e9 0%, #ffb7c5 40%, #f472b6 75%, #301424 100%)',
          textColor: '#2d0c1e',
          subtextColor: 'rgba(45, 12, 30, 0.85)',
          dividerColor: 'rgba(45, 12, 30, 0.4)',
          spindleBg: '#180712',
          spindleBorder: 'rgba(255, 183, 197, 0.6)',
        };
      }
    } catch (e) { }
    return null;
  },
  Background: () => import('./Background.jsx'),
  options: [
    {
      id: 'sakuraRetroLabel',
      label: 'Use Retro Vinyl Label',
      description: 'Displays classic Sakura vinyl center label instead of album cover art.',
    },
  ],
};

