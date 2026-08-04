import { Navigation } from 'lucide-react';
import { getRetroPaletteForTrack } from '../retro/index.js';

export default {
  id: 'rolling',
  name: 'Rolling Road 🛣️',
  Icon: Navigation,
  visualizerMode: 'retro',
  previewGradient: 'linear-gradient(135deg, #020617 0%, #0f172a 40%, #c8820a 75%, #451a03 100%)',
  previewTextColor: '#ffffff',
  bodyClass: 'theme-rolling',
  vars: {
    '--accent-ruby': '#c8820a',
    '--accent-ruby-dark': '#9a640a',
    '--accent-ruby-glow': 'rgba(200, 130, 10, 0.25)',
    '--accent-ruby-bg-glow': 'rgba(200, 130, 10, 0.10)',
    '--border-glow': 'rgba(200, 130, 10, 0.3)',
    '--shadow-ruby': '0 4px 18px rgba(0, 0, 0, 0.5)',
    '--bg-primary': '#030712',
    '--text-primary': '#f8fafc',
  },
  css: `
    .rolling-theme-canvas {
      display: none;
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 0;
      overflow: hidden;
    }
    body.theme-rolling .rolling-theme-canvas {
      display: block;
    }

    .rolling-sky {
      position: absolute;
      inset: 0;
      background: linear-gradient(180deg, #020617 0%, #0b1324 45%, #1e293b 80%, #030712 100%);
    }

    .rolling-stars-container {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 48vh;
      pointer-events: none;
      overflow: hidden;
      z-index: 1;
    }
    .rolling-star {
      position: absolute;
      background: #ffffff;
      border-radius: 50%;
      box-shadow: 0 0 4px #ffffff;
      animation: starTwinkle ease-in-out infinite alternate;
    }
    @keyframes starTwinkle {
      0% {
        opacity: 0.25;
        transform: scale(0.75);
      }
      100% {
        opacity: 1.0;
        transform: scale(1.3);
      }
    }

    .rolling-clouds-container {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 35vh;
      overflow: hidden;
      z-index: 2;
    }
    .rolling-cloud-wrapper {
      position: absolute;
      animation: rollingItemLeftToRight linear infinite;
      will-change: transform;
    }

    .rolling-horizon-glow {
      position: absolute;
      bottom: 44vh;
      left: 0;
      right: 0;
      height: 20vh;
      background: linear-gradient(180deg, transparent 0%, rgba(51, 65, 85, 0.4) 45%, rgba(30, 58, 138, 0.55) 80%, rgba(15, 23, 42, 0) 100%);
      pointer-events: none;
      z-index: 3;
    }

    .rolling-mountains {
      position: absolute;
      bottom: 46vh;
      left: 0;
      right: 0;
      height: 18vh;
      pointer-events: none;
      z-index: 4;
    }
    .mountains-svg {
      width: 100%;
      height: 100%;
    }

    .rolling-scenery-field {
      position: absolute;
      inset: 0;
      pointer-events: none;
      overflow: visible !important;
      z-index: 5;
    }

    .rolling-sign-field {
      position: absolute;
      inset: 0;
      pointer-events: none;
      overflow: visible !important;
      z-index: 5;
    }

    .distant-item {
      filter: brightness(0.65);
    }
    .roadside-item {
      filter: brightness(0.9) drop-shadow(0 6px 12px rgba(0, 0, 0, 0.85));
    }

    .rolling-road-container {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 34vh;
      overflow: hidden;
      background: transparent;
      z-index: 6;
    }

    .rolling-asphalt {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 34vh;
      background: #060913;
      border-top: 8px solid #757575ff;
      box-shadow: inset 0 10px 24px rgba(0, 0, 0, 0.95);
    }

    .rolling-road-dashes {
      position: absolute;
      top: 12vh;
      left: 0;
      right: 0;
      height: 12px;
      background-image: repeating-linear-gradient(
        90deg,
        #757575ff 0px,
        #757575ff 60px,
        transparent 60px,
        transparent 120px
      );
      background-size: 120px 100%;
      background-repeat: repeat-x;
      animation: rollingRoadDashes 3.0s linear infinite;
    }

    .rolling-item-wrapper {
      position: absolute;
      left: 0;
      display: flex;
      align-items: flex-end;
      overflow: visible !important;
      animation: rollingItemLeftToRight linear infinite;
      will-change: transform;
    }
    .roadside-svg {
      width: 100%;
      height: 100%;
      overflow: visible !important;
    }

    @keyframes spinBlades {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    @keyframes rollingRoadDashes {
      0% {
        background-position: 0 0;
      }
      100% {
        background-position: 240px 0;
      }
    }

    @keyframes rollingItemLeftToRight {
      0% {
        transform: translate3d(-160px, 0, 0);
      }
      100% {
        transform: translate3d(calc(100vw + 180px), 0, 0);
      }
    }

    body.theme-rolling .vinyl-outer-ring {
      border-color: #111111 !important;
      box-shadow: 0 12px 35px rgba(0, 0, 0, 0.95), inset 0 0 20px rgba(0, 0, 0, 0.95) !important;
    }

    body.theme-rolling .vinyl-container {
      filter: drop-shadow(0 24px 32px rgba(0, 0, 0, 0.95)) drop-shadow(0 8px 16px rgba(0, 0, 0, 0.85)) !important;
    }

    body.theme-rolling .navbar {
      background: rgba(3, 7, 18, 0.92) !important;
      border-bottom-color: rgba(200, 130, 10, 0.3) !important;
    }
  `,
  vinylLabel: null,
  getDynamicVinylLabel: (track) => getRetroPaletteForTrack(track),
  Background: () => import('./Background.jsx'),
  options: [],
};
