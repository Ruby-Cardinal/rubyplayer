import { Palette } from 'lucide-react';
import { getCoverArtUrl, getFolderCoverUrl, updateMetaThemeColor } from '../../services/mediaService';

function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

function applyHSLAccent(hue, saturation, lightness) {
  const root = document.documentElement;
  const mainColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  const darkColor = `hsl(${hue}, ${saturation}%, ${Math.max(15, lightness - 18)}%)`;
  const glow = `hsla(${hue}, ${saturation}%, ${lightness}%, 0.6)`;
  const bgGlow = `hsla(${hue}, ${saturation}%, ${lightness}%, 0.15)`;
  const borderGlow = `hsla(${hue}, ${saturation}%, ${lightness}%, 0.45)`;

  root.style.setProperty('--accent-ruby', mainColor);
  root.style.setProperty('--accent-ruby-dark', darkColor);
  root.style.setProperty('--accent-ruby-glow', glow);
  root.style.setProperty('--accent-ruby-bg-glow', bgGlow);
  root.style.setProperty('--border-glow', borderGlow);
  root.style.setProperty('--shadow-ruby', `0 0 30px ${glow}`);

  updateMetaThemeColor(mainColor);
}

export async function extractAndApplyAdaptiveColor(currentTrack) {
  if (!currentTrack) {
    applyHSLAccent(200, 85, 60);
    return;
  }

  const imgUrl = currentTrack.hasCover
    ? getCoverArtUrl(currentTrack.id)
    : getFolderCoverUrl(currentTrack.id);

  if (!imgUrl) {
    applyHSLAccent(200, 85, 60);
    return;
  }

  try {
    const response = await fetch(imgUrl);
    if (!response.ok) {
      applyHSLAccent(340, 85, 60);
      return;
    }

    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);

    const img = new Image();
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = 50;
        canvas.height = 50;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, 50, 50);
        const imageData = ctx.getImageData(0, 0, 50, 50).data;
        URL.revokeObjectURL(objectUrl);

        let rSum = 0, gSum = 0, bSum = 0, count = 0;

        for (let i = 0; i < imageData.length; i += 4) {
          const r = imageData[i];
          const g = imageData[i + 1];
          const b = imageData[i + 2];
          const a = imageData[i + 3];

          if (a < 128) continue;
          if ((r < 15 && g < 15 && b < 15) || (r > 240 && g > 240 && b > 240)) continue;

          rSum += r;
          gSum += g;
          bSum += b;
          count++;
        }

        let avgR = 255, avgG = 46, avgB = 85;
        if (count > 0) {
          avgR = Math.round(rSum / count);
          avgG = Math.round(gSum / count);
          avgB = Math.round(bSum / count);
        }

        const [h, s] = rgbToHsl(avgR, avgG, avgB);
        const analogousHue = (h + 30) % 360;
        const compSat = Math.max(s, 80);
        const compLight = 58;

        applyHSLAccent(analogousHue, compSat, compLight);
      } catch (e) {
        URL.revokeObjectURL(objectUrl);
        applyHSLAccent(340, 85, 60);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      applyHSLAccent(340, 85, 60);
    };

    img.src = objectUrl;
  } catch (err) {
    applyHSLAccent(340, 85, 60);
  }
}

export default {
  id: 'adaptive',
  name: 'Adaptive Art',
  type: 'adaptive',
  Icon: Palette,
  previewGradient: 'linear-gradient(135deg, #00f2fe, #4facfe, #ff0844, #ffb199)',
  previewTextColor: '#ffffff',
  bodyClass: 'theme-adaptive',
  vars: {},
  css: '',
  vinylLabel: null,
  Background: null,
  options: [],
  apply: (currentTrack) => {
    extractAndApplyAdaptiveColor(currentTrack);
  },
};
