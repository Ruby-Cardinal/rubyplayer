import React, { useEffect, useRef } from 'react';
import { getOrCreateWebAudio } from '../services/mediaService';
import { getActiveTheme } from '../services/themeService';

export default function AudioVisualizer({ audioRef, isPlaying, mode = 'waveform' }) {
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);
  const smoothedBarsRef = useRef(new Float32Array(64));

  useEffect(() => {
    const audio = audioRef?.current;
    if (!audio) return;

    const setupCtx = () => {
      getOrCreateWebAudio(audio);
    };

    setupCtx();
    audio.addEventListener('play', setupCtx);

    return () => {
      audio.removeEventListener('play', setupCtx);
    };
  }, [audioRef?.current]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const updateSize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      if (mode === 'circular' || mode === 'inner-circular') {
        const size = Math.floor(Math.max(rect.width, rect.height) * dpr);
        if (size > 0 && (canvas.width !== size || canvas.height !== size)) {
          canvas.width = size;
          canvas.height = size;
        }
      } else {
        const w = Math.floor(rect.width * dpr) || 380;
        const h = Math.floor(rect.height * dpr) || 240;
        if (canvas.width !== w || canvas.height !== h) {
          canvas.width = w;
          canvas.height = h;
        }
      }
    };

    updateSize();
    const observer = new ResizeObserver(updateSize);
    if (canvas.parentElement) {
      observer.observe(canvas.parentElement);
    }
    window.addEventListener('resize', updateSize);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateSize);
    };
  }, [mode]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const draw = () => {
      if (document.hidden) {
        animationFrameRef.current = null;
        return;
      }

      animationFrameRef.current = requestAnimationFrame(draw);

      const width = canvas.width;
      const height = canvas.height;
      if (width === 0 || height === 0) return;

      ctx.clearRect(0, 0, width, height);

      const rawBins = new Uint8Array(128);
      const { analyser } = getOrCreateWebAudio(audioRef?.current);
      if (analyser && isPlaying) {
        analyser.getByteFrequencyData(rawBins);
      }
      if (mode === 'circular' || mode === 'inner-circular') {
        const barCount = 64;
        const halfCount = 32;
        const halfValues = new Float32Array(halfCount);

        for (let i = 0; i < halfCount; i++) {
          const floatIndex = (i / (halfCount - 1)) * 48;
          const indexLow = Math.floor(floatIndex);
          const indexHigh = Math.min(63, Math.ceil(floatIndex));
          const fraction = floatIndex - indexLow;

          const valLow = rawBins[indexLow] || 0;
          const valHigh = rawBins[indexHigh] || 0;
          const interpolatedRaw = valLow + (valHigh - valLow) * fraction;

          const normalized = interpolatedRaw / 255;
          const spikedVal = Math.pow(normalized, 1.2);
          const trebleBoost = 1.0 + (i / halfCount) * 1.3;
          let val = spikedVal * trebleBoost;
          if (val > 1.0) val = 1.0;

          const isMotionDisabled = document.body.classList.contains('disable-visualizer-motion');

          if (!isPlaying || isMotionDisabled) {
            val = 0;
          }

          const currentSmooth = smoothedBarsRef.current[i];
          smoothedBarsRef.current[i] = currentSmooth + (val - currentSmooth) * 0.35;
          halfValues[i] = smoothedBarsRef.current[i];
        }

        const rawSymmetrical = new Float32Array(barCount);
        for (let i = 0; i < halfCount; i++) {
          const val = halfValues[i];
          rawSymmetrical[halfCount - 1 - i] = val;
          rawSymmetrical[halfCount + i] = val;
        }

        const gaussianBars = new Float32Array(barCount);
        for (let i = 0; i < barCount; i++) {
          const prev = i > 0 ? rawSymmetrical[i - 1] : rawSymmetrical[barCount - 1];
          const curr = rawSymmetrical[i];
          const next = i < barCount - 1 ? rawSymmetrical[i + 1] : rawSymmetrical[0];
          gaussianBars[i] = prev * 0.25 + curr * 0.50 + next * 0.25;
        }

        const centerX = width / 2;
        const centerY = height / 2;
        const isInner = mode === 'inner-circular';

        const innerRadius = isInner ? width * 0.288 : width * 0.22;
        const outerRadius = isInner ? width * 0.480 : width * 0.38;
        const totalSpan = outerRadius - innerRadius;
        const maxAllowedR = outerRadius - width * 0.001;

        const accentColor = getComputedStyle(document.documentElement).getPropertyValue('--accent-ruby').trim() || '#ff2e55';
        const accentGlow = getComputedStyle(document.documentElement).getPropertyValue('--accent-ruby-glow').trim() || 'rgba(255, 46, 85, 0.5)';

        const activeThemeObj = getActiveTheme();
        const themeId = activeThemeObj?.id?.toLowerCase() || '';
        const visMode = activeThemeObj?.visualizerMode || document.body.getAttribute('data-visualizer-mode') || 'neon';

        const isRainbow = visMode === 'rainbow';
        const isRetro = visMode === 'retro';

        const grooveColor = 'rgba(56, 56, 56, 0.75)';
        const grooveGlow = 'rgba(75, 75, 74, 0.18)';

        const layers = 10;

        for (let l = 0; l < layers; l++) {
          const t = l / (layers - 1);
          const layerBaseR = innerRadius + totalSpan * t;
          const layerHue = (l / layers) * 360;

          ctx.beginPath();
          ctx.lineWidth = (l === 0 || l === layers - 1) ? 2.4 : 2.0;

          for (let i = 0; i < barCount; i++) {
            const idx = i;
            const nextIdx = (i + 1) % barCount;

            const angle1 = (i / barCount) * Math.PI * 2 - Math.PI / 2;
            const angle2 = ((i + 1) / barCount) * Math.PI * 2 - Math.PI / 2;

            const val1 = gaussianBars[idx];
            const val2 = gaussianBars[nextIdx];

            const rawR1 = layerBaseR + val1 * (totalSpan * 0.38) * Math.sin(t * Math.PI);
            const rawR2 = layerBaseR + val2 * (totalSpan * 0.38) * Math.sin(t * Math.PI);

            const r1 = Math.min(maxAllowedR, rawR1);
            const r2 = Math.min(maxAllowedR, rawR2);

            const x1 = centerX + Math.cos(angle1) * r1;
            const y1 = centerY + Math.sin(angle1) * r1;

            const midAngle = (angle1 + angle2) / 2;
            const midR = (r1 + r2) / 2;
            const cx = centerX + Math.cos(midAngle) * midR;
            const cy = centerY + Math.sin(midAngle) * midR;

            if (i === 0) {
              ctx.moveTo(x1, y1);
            } else {
              ctx.quadraticCurveTo(x1, y1, cx, cy);
            }
          }

          const dynamicHue = (layerHue + (isPlaying ? Date.now() * 0.05 : 0)) % 360;

          ctx.closePath();
          ctx.shadowColor = isRetro
            ? grooveGlow
            : isRainbow
              ? `hsla(${dynamicHue}, 95%, 65%, 0.6)`
              : accentGlow;
          ctx.shadowBlur = isRetro ? 0 : (isPlaying ? 4 : 1);
          ctx.strokeStyle = isRetro
            ? grooveColor
            : isRainbow
              ? `hsl(${dynamicHue}, 95%, 60%)`
              : accentColor;
          ctx.globalAlpha = isRetro
            ? (0.25 + Math.sin(t * Math.PI) * 0.35)
            : isRainbow
              ? (0.35 + Math.sin(t * Math.PI) * 0.45)
              : (0.15 + Math.sin(t * Math.PI) * 0.35);
          ctx.stroke();
          ctx.globalAlpha = 1.0;
        }

        ctx.strokeStyle = isRetro ? grooveColor : accentColor;
        ctx.lineWidth = 1.4;
        ctx.shadowColor = isRetro ? 'transparent' : accentGlow;
        ctx.shadowBlur = isRetro ? 0 : 3;
        ctx.globalAlpha = isRetro ? 0.3 : 0.4;

        ctx.beginPath();
        ctx.arc(centerX, centerY, innerRadius, 0, Math.PI * 2);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(centerX, centerY, outerRadius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = 1.0;
      } else {
        const barCount = 34;
        const barWidth = 5;
        const gap = 5;
        const totalWidth = barCount * (barWidth + gap) - gap;
        let startX = (width - totalWidth) / 2;
        const baselineY = 160;

        const halfCount = barCount / 2;
        const halfValues = new Float32Array(halfCount);

        for (let i = 0; i < halfCount; i++) {
          const floatIndex = (i / (halfCount - 1)) * 48;
          const indexLow = Math.floor(floatIndex);
          const indexHigh = Math.min(63, Math.ceil(floatIndex));
          const fraction = floatIndex - indexLow;

          const valLow = rawBins[indexLow] || 0;
          const valHigh = rawBins[indexHigh] || 0;
          const interpolatedRaw = valLow + (valHigh - valLow) * fraction;

          const normalized = interpolatedRaw / 255;
          const spikedVal = Math.pow(normalized, 1.35);

          const trebleBoost = 1.0 + (i / halfCount) * 1.6;
          let val = spikedVal * trebleBoost;
          if (val > 1.0) val = 1.0;

          if (!isPlaying) {
            val = 0;
          }

          const currentSmooth = smoothedBarsRef.current[i];
          smoothedBarsRef.current[i] = currentSmooth + (val - currentSmooth) * 0.32;
          halfValues[i] = smoothedBarsRef.current[i];
        }

        const rawSymmetrical = new Float32Array(barCount);
        for (let i = 0; i < halfCount; i++) {
          const val = halfValues[i];
          rawSymmetrical[halfCount - 1 - i] = val;
          rawSymmetrical[halfCount + i] = val;
        }

        const gaussianBars = new Float32Array(barCount);
        for (let i = 0; i < barCount; i++) {
          const prev = i > 0 ? rawSymmetrical[i - 1] : rawSymmetrical[i];
          const curr = rawSymmetrical[i];
          const next = i < barCount - 1 ? rawSymmetrical[i + 1] : rawSymmetrical[i];
          gaussianBars[i] = prev * 0.18 + curr * 0.64 + next * 0.18;
        }

        for (let i = 0; i < barCount; i++) {
          const val = gaussianBars[i];
          const topHeight = Math.max(4, val * 135);
          const reflectionHeight = topHeight * 0.52;

          const topY = baselineY - topHeight;
          const topGradient = ctx.createLinearGradient(0, topY, 0, baselineY);
          topGradient.addColorStop(0, '#ff4d6d');
          topGradient.addColorStop(0.6, '#e11d48');
          topGradient.addColorStop(1, '#be123c');

          ctx.shadowColor = 'rgba(255, 46, 85, 0.7)';
          ctx.shadowBlur = isPlaying ? 12 : 3;
          ctx.fillStyle = topGradient;

          ctx.beginPath();
          ctx.roundRect(startX, topY, barWidth, topHeight, [3, 3, 0, 0]);
          ctx.fill();

          const reflGradient = ctx.createLinearGradient(0, baselineY, 0, baselineY + reflectionHeight);
          reflGradient.addColorStop(0, 'rgba(225, 29, 72, 0.55)');
          reflGradient.addColorStop(0.7, 'rgba(190, 18, 60, 0.18)');
          reflGradient.addColorStop(1, 'rgba(159, 18, 57, 0.02)');

          ctx.shadowColor = 'transparent';
          ctx.shadowBlur = 0;
          ctx.fillStyle = reflGradient;

          ctx.beginPath();
          ctx.roundRect(startX, baselineY + 1, barWidth, reflectionHeight, [0, 0, 3, 3]);
          ctx.fill();

          startX += barWidth + gap;
        }
      }
    };

    const handleVisibilityChange = () => {
      if (!document.hidden && !animationFrameRef.current) {
        draw();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    draw();

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [isPlaying, mode]);

  return (
    <div className={`visualizer-container ${(mode === 'circular' || mode === 'inner-circular') ? 'mode-circular' : ''}`}>
      <canvas ref={canvasRef} className="visualizer-canvas" />
    </div>
  );
}
