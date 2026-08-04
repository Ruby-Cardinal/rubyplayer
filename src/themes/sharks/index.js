import { Waves } from 'lucide-react';
import { getSavedThemeOption } from '../../services/themeService.js';

export default {
  id: 'sharks',
  name: 'Ocean Sharks 🦈',
  Icon: Waves,
  previewGradient: 'linear-gradient(135deg, #021329 0%, #032b53 35%, #0ea5e9 70%, #0284c7 100%)',
  previewTextColor: '#ffffff',
  bodyClass: 'theme-sharks',
  vars: {
    '--accent-ruby': '#0ea5e9',
    '--accent-ruby-dark': '#0369a1',
    '--accent-ruby-glow': 'rgba(14, 165, 233, 0.65)',
    '--accent-ruby-bg-glow': 'rgba(14, 165, 233, 0.16)',
    '--border-glow': 'rgba(56, 189, 248, 0.45)',
    '--shadow-ruby': '0 0 28px rgba(14, 165, 233, 0.4)',
    '--bg-primary': '#020c16',
    '--text-primary': '#f0f9ff',
  },
  css: `
    .sharks-theme-canvas {
      display: none;
      position: fixed;
      inset: 0;
      pointer-events: none;
      overflow: hidden;
    }
    body.theme-sharks .sharks-theme-canvas {
      display: block;
    }
    .sharks-bg-canvas {
      z-index: 0;
    }
    .sharks-fg-canvas {
      z-index: 10 !important;
      pointer-events: none;
    }

    body.theme-sharks .playlist-column-wrapper,
    body.theme-sharks .col-playlist {
      position: relative;
      z-index: 15 !important;
    }
    body.theme-sharks .navbar {
      position: relative;
      z-index: 20 !important;
      background: rgba(2, 18, 38, 0.88) !important;
      border-bottom-color: rgba(14, 165, 233, 0.35) !important;
    }
    body.theme-sharks .player-bar {
      position: relative;
      z-index: 20 !important;
    }

    .sharks-bg-overlay {
      position: absolute;
      inset: 0;
      background:
        radial-gradient(circle at 50% 0%, rgba(14, 165, 233, 0.22), transparent 60%),
        radial-gradient(circle at 20% 80%, rgba(3, 105, 161, 0.25), transparent 50%),
        radial-gradient(circle at 80% 90%, rgba(2, 132, 199, 0.18), transparent 55%),
        linear-gradient(180deg, #031e38 0%, #020c16 80%, #01060c 100%);
    }
    .sharks-caustics-light {
      position: absolute;
      inset: 0;
      background: repeating-linear-gradient(
        45deg,
        rgba(56, 189, 248, 0.03) 0px,
        rgba(56, 189, 248, 0.03) 80px,
        transparent 80px,
        transparent 160px
      );
      filter: blur(12px);
      animation: oceanCausticsWave 16s ease-in-out infinite alternate;
    }

    .sharks-bubbles-container {
      position: absolute;
      inset: 0;
      overflow: hidden;
    }
    .ocean-bubble {
      position: absolute;
      bottom: -30px;
      background: radial-gradient(circle at 35% 35%, rgba(255, 255, 255, 0.8), rgba(56, 189, 248, 0.25));
      border-radius: 50%;
      box-shadow: 0 0 6px rgba(56, 189, 248, 0.4);
      animation: oceanBubbleFloat linear infinite;
    }

    .sharks-container {
      position: absolute;
      inset: 0;
      overflow: hidden;
    }
    .shark-wrapper {
      position: absolute;
      left: 0;
      top: 0;
      pointer-events: none;
      will-change: transform;
      animation-fill-mode: both;
    }
    .shark-wrapper.is-foreground-shark {
      filter: drop-shadow(0 15px 30px rgba(0, 0, 0, 0.85)) drop-shadow(0 0 15px rgba(14, 165, 233, 0.6)) !important;
    }
    .shark-wrapper.swim-left-to-right {
      animation-name: sharkSwimLeftToRight;
      animation-timing-function: linear;
      animation-iteration-count: infinite;
    }
    .shark-wrapper.swim-right-to-left {
      animation-name: sharkSwimRightToLeft;
      animation-timing-function: linear;
      animation-iteration-count: infinite;
    }
    .shark-wrapper.turnaround-left {
      animation-name: sharkTurnaroundLeftToRight;
      animation-timing-function: ease-in-out;
      animation-iteration-count: infinite;
    }
    .shark-wrapper.turnaround-right {
      animation-name: sharkTurnaroundRightToLeft;
      animation-timing-function: ease-in-out;
      animation-iteration-count: infinite;
    }

    @keyframes sharkTailSwish {
      0% { transform: rotate(-8deg); }
      100% { transform: rotate(8deg); }
    }
    @keyframes sharkFinMoveNear {
      0% { transform: rotate(-6deg); }
      100% { transform: rotate(6deg); }
    }
    @keyframes sharkFinMoveFar {
      0% { transform: rotate(5deg); }
      100% { transform: rotate(-5deg); }
    }

    @keyframes oceanCausticsWave {
      0% { transform: scale(1) translate(0, 0); opacity: 0.7; }
      50% { transform: scale(1.08) translate(15px, -10px); opacity: 0.9; }
      100% { transform: scale(1.03) translate(-10px, 15px); opacity: 0.75; }
    }

    @keyframes oceanBubbleFloat {
      0% {
        transform: translateY(0) translateX(0);
        opacity: 0;
      }
      10% {
        opacity: 0.6;
      }
      90% {
        opacity: 0.6;
      }
      100% {
        transform: translateY(-105vh) translateX(35px);
        opacity: 0;
      }
    }

    @keyframes sharkSwimLeftToRight {
      0% {
        transform: translate3d(-140px, calc(var(--wave-amp) * -0.5), 0) rotate(2deg);
      }
      25% {
        transform: translate3d(30vw, var(--wave-amp), 0) rotate(-2deg);
      }
      50% {
        transform: translate3d(60vw, calc(var(--wave-amp) * -0.8), 0) rotate(3deg);
      }
      75% {
        transform: translate3d(85vw, calc(var(--wave-amp) * 0.5), 0) rotate(-1deg);
      }
      100% {
        transform: translate3d(calc(100vw + 160px), calc(var(--wave-amp) * -0.5), 0) rotate(2deg);
      }
    }

    @keyframes sharkSwimRightToLeft {
      0% {
        transform: translate3d(calc(100vw + 140px), calc(var(--wave-amp) * 0.5), 0) scaleX(-1) rotate(-2deg);
      }
      25% {
        transform: translate3d(70vw, calc(var(--wave-amp) * -0.7), 0) scaleX(-1) rotate(2deg);
      }
      50% {
        transform: translate3d(40vw, var(--wave-amp), 0) scaleX(-1) rotate(-3deg);
      }
      75% {
        transform: translate3d(15vw, calc(var(--wave-amp) * -0.4), 0) scaleX(-1) rotate(1deg);
      }
      100% {
        transform: translate3d(-160px, calc(var(--wave-amp) * 0.5), 0) scaleX(-1) rotate(-2deg);
      }
    }

    @keyframes sharkTurnaroundLeftToRight {
      0% {
        transform: translate3d(-140px, calc(var(--wave-amp) * -0.5), 0) scaleX(1) rotate(2deg);
      }
      42% {
        transform: translate3d(62vw, var(--wave-amp), 0) scaleX(1) rotate(-2deg);
      }
      50% {
        transform: translate3d(65vw, calc(var(--wave-amp) * 0.2), 0) scaleX(-1) rotate(6deg);
      }
      92% {
        transform: translate3d(10vw, calc(var(--wave-amp) * -0.6), 0) scaleX(-1) rotate(-2deg);
      }
      100% {
        transform: translate3d(-160px, calc(var(--wave-amp) * -0.5), 0) scaleX(-1) rotate(2deg);
      }
    }

    @keyframes sharkTurnaroundRightToLeft {
      0% {
        transform: translate3d(calc(100vw + 140px), calc(var(--wave-amp) * 0.5), 0) scaleX(-1) rotate(-2deg);
      }
      42% {
        transform: translate3d(38vw, calc(var(--wave-amp) * -0.7), 0) scaleX(-1) rotate(3deg);
      }
      50% {
        transform: translate3d(35vw, calc(var(--wave-amp) * 0.1), 0) scaleX(1) rotate(-6deg);
      }
      92% {
        transform: translate3d(88vw, calc(var(--wave-amp) * 0.6), 0) scaleX(1) rotate(2deg);
      }
      100% {
        transform: translate3d(calc(100vw + 160px), calc(var(--wave-amp) * 0.5), 0) scaleX(1) rotate(-2deg);
      }
    }
  `,
  vinylLabel: null,
  getDynamicVinylLabel: () => { },
  Background: () => import('./Background.jsx'),
};
