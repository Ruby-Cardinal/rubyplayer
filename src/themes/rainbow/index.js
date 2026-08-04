import { Sparkles } from 'lucide-react';

export default {
  id: 'rainbow',
  name: 'Rainbow 🌈',
  visualizerMode: 'rainbow',
  type: 'animated',
  Icon: Sparkles,
  previewGradient: 'linear-gradient(135deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #8b00ff)',
  previewTextColor: '#000000',
  bodyClass: 'theme-rainbow',
  vars: {},
  css: '',
  vinylLabel: null,
  Background: null,
  options: [
    {
      id: 'freeze',
      label: 'Freeze Rainbow Motion',
      description: 'Holds last active state to reduce battery drain.',
    },
  ],
};
