import { Fish } from 'lucide-react';

export default {
  songTitle: 'Pinky Shark Bites',
  id: 'pinky-shark-bites',
  name: 'Pinky Shark Bites 🦈',
  Icon: Fish,
  previewGradient: 'linear-gradient(135deg, #0369a1 0%, #38bdf8 50%, #059669 100%)',
  previewTextColor: '#ffffff',
  bodyClass: 'theme-pinky-shark-bites',
  vars: {
    '--accent-ruby': '#38bdf8',
    '--accent-ruby-dark': '#0284c7',
    '--accent-ruby-glow': 'rgba(56, 189, 248, 0.65)',
    '--accent-ruby-bg-glow': 'rgba(56, 189, 248, 0.15)',
    '--border-glow': 'rgba(56, 189, 248, 0.45)',
    '--shadow-ruby': '0 0 30px rgba(56, 189, 248, 0.5)',
    '--bg-primary': '#0369a1',
    '--text-primary': '#f0f9ff',
  },
  css: `
    .pinky-shark-canvas-bg {
      display: block;
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 0;
      overflow: hidden;
      background: linear-gradient(180deg, #0369a1 0%, #0284c7 35%, #38bdf8 70%, #7dd3fc 100%);
    }

    .pinky-shark-canvas-fg {
      display: block;
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 999;
      overflow: hidden;
    }

    body.theme-pinky-shark-bites .vinyl-outer-ring {
      border-color: #0284c7 !important;
      box-shadow: 0 0 35px rgba(56, 189, 248, 0.5), inset 0 0 20px rgba(0, 0, 0, 0.8) !important;
    }

    .pinky-shark-item {
      position: fixed;
      pointer-events: none;
      will-change: transform, left, top;
    }

    .pinky-shark-canvas-fg .pinky-shark-item {
      filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.65)) drop-shadow(0 0 12px rgba(56, 189, 248, 0.4)) !important;
    }

    .pinky-shark-canvas-bg .pinky-shark-item {
      filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.55)) drop-shadow(0 0 8px rgba(56, 189, 248, 0.3)) !important;
    }

    @keyframes sharkTailSwish {
      0% { transform: rotate(-10deg); }
      100% { transform: rotate(10deg); }
    }
    @keyframes sharkFinMoveNear {
      0% { transform: rotate(-7deg); }
      100% { transform: rotate(7deg); }
    }
    @keyframes sharkFinMoveFar {
      0% { transform: rotate(6deg); }
      100% { transform: rotate(-6deg); }
    }
  `,
  Background: () => import('./Background.jsx'),
};
