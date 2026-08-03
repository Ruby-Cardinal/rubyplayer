import { Diamond } from 'lucide-react';
import CardinalBackground from './Background.jsx';

export default {
  id: 'ruby-cardinal',
  name: 'Ruby Cardinal',
  Icon: Diamond,
  previewGradient: 'linear-gradient(135deg, #2b060d, #e11d48, #ff2e55, #9f1239, #170307)',
  previewTextColor: '#ffffff',
  bodyClass: 'theme-ruby-cardinal',
  vars: {
    '--accent-ruby': '#ff2e55',
    '--accent-ruby-dark': '#be123c',
    '--accent-ruby-glow': 'rgba(255, 46, 85, 0.65)',
    '--accent-ruby-bg-glow': 'rgba(255, 46, 85, 0.16)',
    '--border-glow': 'rgba(244, 63, 94, 0.45)',
    '--shadow-ruby': '0 0 28px rgba(255, 46, 85, 0.4)',
    '--bg-primary': '#140306',
    '--text-primary': '#fff1f2',
  },
  css: `
    .ruby-cardinal-theme-canvas {
      display: none;
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 0;
      overflow: hidden;
    }
    body.theme-ruby-cardinal .ruby-cardinal-theme-canvas {
      display: block;
    }
    .ruby-cardinal-bg-overlay {
      position: absolute;
      inset: 0;
      background:
        radial-gradient(circle at 20% 20%, rgba(255, 46, 85, 0.15), transparent 50%),
        radial-gradient(circle at 80% 80%, rgba(225, 29, 72, 0.12), transparent 55%),
        radial-gradient(circle at 50% 50%, rgba(20, 3, 6, 0.5), rgba(12, 2, 4, 0.96));
    }
    .ruby-cardinal-birds-container {
      position: absolute;
      inset: 0;
      overflow: hidden;
    }
    .ruby-cardinal-bird-wrapper {
      position: absolute;
      left: 0;
      top: 0;
      pointer-events: none;
      will-change: transform;
      animation-fill-mode: both;
    }
    .ruby-cardinal-bird-wrapper.fly-left-to-right {
      animation-name: cardinalFlyLeftToRight;
      animation-timing-function: linear;
      animation-iteration-count: infinite;
    }
    .ruby-cardinal-bird-wrapper.fly-right-to-left {
      animation-name: cardinalFlyRightToLeft;
      animation-timing-function: linear;
      animation-iteration-count: infinite;
    }

    @keyframes cardinalWingFlapLeft {
      0% { transform: rotate(0deg) scaleY(1); }
      100% { transform: rotate(-28deg) scaleY(0.65); }
    }
    @keyframes cardinalWingFlapRight {
      0% { transform: rotate(0deg) scaleY(1); }
      100% { transform: rotate(28deg) scaleY(0.65); }
    }

    @keyframes cardinalFlyLeftToRight {
      0% {
        transform: translate3d(-100px, calc(var(--wave-amp) * -0.5), 0) rotate(5deg);
      }
      25% {
        transform: translate3d(30vw, var(--wave-amp), 0) rotate(-3deg);
      }
      50% {
        transform: translate3d(60vw, calc(var(--wave-amp) * -0.8), 0) rotate(6deg);
      }
      75% {
        transform: translate3d(85vw, calc(var(--wave-amp) * 0.6), 0) rotate(-2deg);
      }
      100% {
        transform: translate3d(calc(100vw + 120px), calc(var(--wave-amp) * -0.5), 0) rotate(4deg);
      }
    }

    @keyframes cardinalFlyRightToLeft {
      0% {
        transform: translate3d(calc(100vw + 100px), calc(var(--wave-amp) * 0.5), 0) scaleX(-1) rotate(-5deg);
      }
      25% {
        transform: translate3d(70vw, calc(var(--wave-amp) * -0.7), 0) scaleX(-1) rotate(4deg);
      }
      50% {
        transform: translate3d(40vw, var(--wave-amp), 0) scaleX(-1) rotate(-6deg);
      }
      75% {
        transform: translate3d(15vw, calc(var(--wave-amp) * -0.4), 0) scaleX(-1) rotate(3deg);
      }
      100% {
        transform: translate3d(-120px, calc(var(--wave-amp) * 0.5), 0) scaleX(-1) rotate(-4deg);
      }
    }

    body.theme-ruby-cardinal .navbar {
      background: rgba(26, 4, 8, 0.85) !important;
      border-bottom-color: rgba(255, 46, 85, 0.3) !important;
    }
  `,
  vinylLabel: null,
  getDynamicVinylLabel: () => {
    try {
      const enabled = localStorage.getItem('rubyplayer_theme_ruby-cardinal_cardinalRetroLabel') === 'true';
      if (enabled) {
        return {
          name: 'Ruby Cardinal High Fidelity 🐦',
          background: 'radial-gradient(circle at 38% 35%, #ff4d6d 0%, #e11d48 40%, #9f1239 75%, #180307 100%)',
          textColor: '#fff1f2',
          subtextColor: 'rgba(255, 241, 242, 0.85)',
          dividerColor: 'rgba(255, 241, 242, 0.4)',
          spindleBg: '#120205',
          spindleBorder: 'rgba(255, 77, 109, 0.6)',
        };
      }
    } catch (e) { }
    return null;
  },
  Background: CardinalBackground,
  options: [
    {
      id: 'cardinalRetroLabel',
      label: 'Use Ruby Cardinal Vinyl Label',
      description: 'Displays classic Ruby Cardinal vinyl center label instead of album cover art.',
    },
  ],
};
