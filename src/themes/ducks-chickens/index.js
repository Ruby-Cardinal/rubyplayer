import { Bird } from 'lucide-react';
import { extractAndApplyAdaptiveColor } from '../adaptive/index.js';
import { getSavedThemeOption } from '../../services/themeService.js';

export default {
  id: 'ducks-chickens',
  name: 'Ducks & Chickens 🦆🐔',
  type: 'adaptive',
  Icon: Bird,
  previewGradient: 'linear-gradient(135deg, #18181b 0%, #3f3f46 30%, #ffffff 65%, #f97316 100%)',
  previewTextColor: '#ffffff',
  bodyClass: 'theme-ducks-chickens',
  vars: {},
  css: `
    .ducks-chickens-theme-canvas {
      display: none;
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 0;
      overflow: hidden;
    }
    body.theme-ducks-chickens .ducks-chickens-theme-canvas {
      display: block;
    }
    .ducks-chickens-bg-overlay {
      position: absolute;
      inset: 0;
      background:
        radial-gradient(circle at 20% 20%, var(--accent-ruby-bg-glow), transparent 50%),
        radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.05), transparent 55%),
        radial-gradient(circle at 50% 50%, rgba(18, 18, 20, 0.4), rgba(9, 9, 11, 0.95));
    }
    .ducks-chickens-birds-container {
      position: absolute;
      inset: 0;
      overflow: hidden;
    }
    .ducks-chickens-bird-wrapper {
      position: absolute;
      left: 0;
      top: 0;
      pointer-events: none;
      will-change: transform;
      animation-fill-mode: both;
    }
    .ducks-chickens-bird-wrapper.fly-left-to-right {
      animation-name: duckChickenFlyLeftToRight;
      animation-timing-function: linear;
      animation-iteration-count: infinite;
    }
    .ducks-chickens-bird-wrapper.fly-right-to-left {
      animation-name: duckChickenFlyRightToLeft;
      animation-timing-function: linear;
      animation-iteration-count: infinite;
    }

    @keyframes duckWingFlapFar {
      0% { transform: rotate(-22deg) translateY(-2px) scale(0.95); }
      100% { transform: rotate(14deg) translateY(1px) scale(0.95); }
    }
    @keyframes duckWingFlapNear {
      0% { transform: rotate(-20deg) translateY(-1px); }
      100% { transform: rotate(16deg) translateY(1px); }
    }

    @keyframes chickenWingFlapFar {
      0% { transform: rotate(-22deg) translateY(-2px) scale(0.95); }
      100% { transform: rotate(14deg) translateY(1px) scale(0.95); }
    }
    @keyframes chickenWingFlapNear {
      0% { transform: rotate(-20deg) translateY(-1px); }
      100% { transform: rotate(16deg) translateY(1px); }
    }

    @keyframes duckChickenFlyLeftToRight {
      0% {
        transform: translate3d(-100px, calc(var(--wave-amp) * -0.5), 0) rotate(4deg);
      }
      25% {
        transform: translate3d(30vw, var(--wave-amp), 0) rotate(-3deg);
      }
      50% {
        transform: translate3d(60vw, calc(var(--wave-amp) * -0.8), 0) rotate(5deg);
      }
      75% {
        transform: translate3d(85vw, calc(var(--wave-amp) * 0.6), 0) rotate(-2deg);
      }
      100% {
        transform: translate3d(calc(100vw + 120px), calc(var(--wave-amp) * -0.5), 0) rotate(3deg);
      }
    }

    @keyframes duckChickenFlyRightToLeft {
      0% {
        transform: translate3d(calc(100vw + 100px), calc(var(--wave-amp) * 0.5), 0) scaleX(-1) rotate(-4deg);
      }
      25% {
        transform: translate3d(70vw, calc(var(--wave-amp) * -0.7), 0) scaleX(-1) rotate(3deg);
      }
      50% {
        transform: translate3d(40vw, var(--wave-amp), 0) scaleX(-1) rotate(-5deg);
      }
      75% {
        transform: translate3d(15vw, calc(var(--wave-amp) * -0.4), 0) scaleX(-1) rotate(2deg);
      }
      100% {
        transform: translate3d(-120px, calc(var(--wave-amp) * 0.5), 0) scaleX(-1) rotate(-3deg);
      }
    }

    body.theme-ducks-chickens .navbar {
      background: rgba(18, 18, 20, 0.88) !important;
      border-bottom-color: var(--border-glow) !important;
    }
  `,
  vinylLabel: null,
  getDynamicVinylLabel: () => { },
  Background: () => import('./Background.jsx'),
  apply: (currentTrack) => {
    extractAndApplyAdaptiveColor(currentTrack);
  },
};
