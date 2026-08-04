import { Disc } from 'lucide-react';

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

export function getRetroPaletteForTrack(track) {
  const str = `${track?.title || ''}-${track?.artist || ''}`.toLowerCase();
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % RETRO_LABEL_PALETTES.length;
  return RETRO_LABEL_PALETTES[index];
}

export default {
  id: 'retro',
  name: 'Retro',
  visualizerMode: 'retro',
  Icon: Disc,
  previewGradient: 'linear-gradient(135deg, #3b2008, #7a4c10, #c8820a, #7a4c10)',
  previewTextColor: '#000000',
  bodyClass: 'theme-retro',
  vars: {
    '--accent-ruby': '#c8820a',
    '--accent-ruby-dark': '#9a640a',
    '--accent-ruby-glow': 'rgba(200, 130, 10, 0.55)',
    '--accent-ruby-bg-glow': 'rgba(200, 130, 10, 0.13)',
    '--border-glow': 'rgba(200, 130, 10, 0.4)',
    '--shadow-ruby': '0 4px 18px rgba(200, 130, 10, 0.35)',
  },
  css: '',
  vinylLabel: null,
  getDynamicVinylLabel: (track) => getRetroPaletteForTrack(track),
  Background: null,
  options: [],
};
