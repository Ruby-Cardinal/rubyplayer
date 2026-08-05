import React, { useMemo, useState, useEffect, useRef } from 'react';

function ForestBackgroundSvg() {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      <img
        src="/UnderSea.svg"
        alt="Under Sea"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          filter: 'brightness(0.62) contrast(1.12) saturate(1.05)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(2, 18, 38, 0.25)',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}

function SharkSvg({ id = '0', type = 'great-white', swishSpeed = '1.2s', chompSpeed = '0.9s', glow = true, isScared = false }) {
  const bodyGradId = `sharkBodyGrad_${id}`;
  const finFarGradId = `sharkFinFarGrad_${id}`;
  const finNearGradId = `sharkFinNearGrad_${id}`;

  return (
    <svg
      viewBox="0 0 100 42"
      className={`shark-svg shark-type-${type}`}
      style={{
        width: '100%',
        height: '100%',
        overflow: 'visible',
        filter: glow
          ? 'drop-shadow(0 0 14px rgba(14, 165, 233, 0.55)) drop-shadow(0 6px 14px rgba(0, 0, 0, 0.75))'
          : 'none',
        transform: isScared ? 'scaleY(-1)' : 'none',
      }}
    >
      <defs>
        <linearGradient id={bodyGradId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#334155" />
          <stop offset="42%" stopColor="#475569" />
          <stop offset="68%" stopColor="#94a3b8" />
          <stop offset="100%" stopColor="#f8fafc" />
        </linearGradient>

        <linearGradient id={finFarGradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1e293b" />
          <stop offset="100%" stopColor="#334155" />
        </linearGradient>

        <linearGradient id={finNearGradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#475569" />
          <stop offset="100%" stopColor="#64748b" />
        </linearGradient>
      </defs>

      <g
        className="shark-far-fin"
        style={{
          transformOrigin: '56px 22px',
          animation: `sharkFinMoveFar ${swishSpeed} ease-in-out infinite alternate`,
        }}
      >
        <path
          d="M 56 22 L 48 10 L 42 12 L 50 23 Z"
          fill={`url(#${finFarGradId})`}
          opacity="0.85"
        />
      </g>

      <g
        className="shark-tail"
        style={{
          transformOrigin: '25px 21px',
          animation: `sharkTailSwish ${swishSpeed} ease-in-out infinite alternate`,
        }}
      >
        <path
          d="M 26 20 C 18 19 12 18 2 4 C 0 3 0 7 4 15 C 6 18 8 20 8 21 C 8 22 6 24 3 28 C -1 35 0 39 3 38 C 12 24 18 23 26 22 Z"
          fill={`url(#${bodyGradId})`}
        />
      </g>

      <path
        d="M 62 16 L 50.06 6.28 L 40 4 L 48 16 Z"
        fill={`url(#${bodyGradId})`}
      />
      <path d="M 48 16 L 40 4 L 44 14 Z" fill="#1e293b" opacity="0.4" />

      <path
        d="M 24 21 C 32 14 51.13 12.12 78.37 14.06 C 92.52 16.01 100 20 100 21 C 98 22.5 90.93 27.33 78.02 27.69 C 45.82 27.33 32 25 24 21 Z"
        fill={`url(#${bodyGradId})`}
      />

      <g stroke="#334155" strokeWidth="0.8" opacity="0.7">
        <line x1="72" y1="19" x2="71" y2="25" />
        <line x1="69" y1="19" x2="68" y2="25" />
        <line x1="66" y1="19.5" x2="65" y2="24.5" />
        <line x1="63" y1="20" x2="62" y2="24" />
        <line x1="60" y1="20.5" x2="59.5" y2="23.5" />
      </g>

      <circle cx={88} cy={20} r="1.4" fill={isScared ? '#ef4444' : '#020617'} />
      <circle cx={88.3} cy={19.6} r="0.4" fill="#ffffff" opacity="0.9" />

      <g fill="#ffffff">
        <polygon points="98,21 95,23.5 93,21.5" />
        <polygon points="93,21.5 91,24 89,22" />
        <polygon points="89,22 87,24.5 85,22.5" />
      </g>

      <g
        className="shark-lower-jaw"
        style={{
          transformOrigin: '80px 24px',
          animation: isScared
            ? 'none'
            : `sharkJawChomp ${chompSpeed} ease-in-out infinite alternate`,
          transform: isScared ? 'rotate(22deg)' : undefined,
        }}
      >
        <path d="M 80 23.5 C 88 23.5 95 22.8 98 21.5 C 93 27.5 86 28 80 26 Z" fill="#450a0a" />
        <path
          d="M 80 24 C 88 24 95 23 99 22 C 92.17 26.8 88.28 27.69 82.62 26.62 Z"
          fill={`url(#${bodyGradId})`}
        />
        <g fill="#ffffff">
          <polygon points="97,22 95,19.5 93,22.2" />
          <polygon points="93,22.2 91,20 89,22.5" />
          <polygon points="89,22.5 87,20.5 85,22.8" />
        </g>
      </g>

      <g
        className="shark-near-fin"
        style={{
          transformOrigin: '60px 24px',
          animation: `sharkFinMoveNear ${swishSpeed} ease-in-out infinite alternate`,
        }}
      >
        <path
          d="M 60 24 L 52.19 31.05 L 40 36 L 54 23 Z"
          fill={`url(#${finNearGradId})`}
        />
      </g>
    </svg>
  );
}

function FairyHeroSvg() {
  return (
    <img
      src="/Fairy.svg"
      alt="Hero Fairy"
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'contain',
        filter: 'drop-shadow(0 0 16px rgba(244, 114, 182, 0.9)) drop-shadow(0 0 28px rgba(192, 132, 252, 0.7))',
        pointerEvents: 'none',
      }}
    />
  );
}

function SparkleSvg({ color = '#fef08a' }) {
  return (
    <svg viewBox="0 0 40 40" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
      <defs>
        <radialGradient id={`sparkleGlow_${color.replace('#', '')}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="45%" stopColor={color} stopOpacity="0.8" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
      <circle cx="20" cy="20" r="18" fill={`url(#sparkleGlow_${color.replace('#', '')})`} opacity="0.85" />
      <polygon points="20,2 23,17 38,20 23,23 20,38 17,23 2,20 17,17" fill="#ffffff" />
      <polygon points="20,8 22,18 32,20 22,22 20,32 18,22 8,20 18,18" fill={color} />
    </svg>
  );
}

function FairyFlashBurstSvg() {
  return (
    <svg viewBox="0 0 240 240" style={{ width: '100%', height: '100%', overflow: 'visible', filter: 'blur(10px) drop-shadow(0 0 25px rgba(254, 240, 138, 0.9))' }}>
      <defs>
        <radialGradient id="flashBurstGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
          <stop offset="35%" stopColor="#fef08a" stopOpacity="0.85" />
          <stop offset="70%" stopColor="#f472b6" stopOpacity="0.5" />
          <stop offset="100%" stopColor="transparent" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="120" cy="120" r="110" fill="url(#flashBurstGrad)" />
      <polygon points="120,25 129,111 215,120 129,129 120,215 111,129 25,120 111,111" fill="#ffffff" opacity="0.8" />
      <polygon points="120,55 125,115 175,120 125,125 120,185 115,125 65,120 115,115" fill="#fef08a" opacity="0.85" />
    </svg>
  );
}

function BubbleSvg() {
  return (
    <svg viewBox="0 0 40 40" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
      <defs>
        <radialGradient id="bubbleGrad" cx="35%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
          <stop offset="40%" stopColor="#7dd3fc" stopOpacity="0.45" />
          <stop offset="85%" stopColor="#0284c7" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.55" />
        </radialGradient>
      </defs>
      <circle cx="20" cy="20" r="18" fill="url(#bubbleGrad)" stroke="rgba(255, 255, 255, 0.75)" strokeWidth="1.2" />
      <ellipse cx="14" cy="13" rx="5" ry="3" fill="#ffffff" opacity="0.8" transform="rotate(-30 14 13)" />
    </svg>
  );
}

function getUprightTransform(vx, vy, extraScaleY = 1) {
  const deg = (Math.atan2(vy, vx) * 180) / Math.PI;
  const isFacingLeft = vx < 0;
  const scaleY = isFacingLeft ? -extraScaleY : extraScaleY;

  return `translate3d(-50%, -50%, 0) rotate(${deg}deg) scaleY(${scaleY})`;
}

const PINKY_SHARK_MENTIONS = [22.0, 32.0, 48.0, 52.0, 63.0, 66.0, 104.0, 124.0, 128.0, 138.0, 142.0];
const SPARKLE_COLORS = ['#ffffff', '#fef08a', '#f472b6', '#c084fc', '#38bdf8'];
const SPARKLE_COUNT = 32;
const BUBBLE_COUNT = 30;

export default function ScriptedPinkySharkBackground({ currentTrack, currentTime = 0, isPlaying }) {
  const vinylCenterRef = useRef({ x: 50, y: 50, rx: 20, ry: 15 });
  const currentTimeRef = useRef(currentTime);
  const animFrameRef = useRef(null);

  const bgSharkRefs = useRef([]);
  const fgSharkRefs = useRef([]);
  const fairyRef = useRef(null);
  const flashRef = useRef(null);
  const sparkleRefs = useRef([]);
  const bubbleRefs = useRef([]);

  const sharksConfig = useMemo(() => {
    const arr = [];
    const count = 28;
    let spawnTime = 0;
    for (let i = 0; i < count; i++) {
      const mentionIdx = i % PINKY_SHARK_MENTIONS.length;
      spawnTime = PINKY_SHARK_MENTIONS[mentionIdx];

      const radiusOffset = (i % 5) * 2.5;
      const speedMultiplier = 0.52 + (i % 7) * 0.05 + (i % 3) * 0.02;
      const lineSpeed = 7 + (i % 5) * 2.2 + (i % 3) * 1.1;
      const swishSpeed = `${(0.8 + (i % 5) * 0.15).toFixed(2)}s`;
      const chompSpeed = `${(0.75 + (i % 6) * 0.12).toFixed(2)}s`;
      const baseAngle = (i / count) * Math.PI * 2;
      const size = 85 + (i % 4) * 16;
      const isLeft = i % 2 === 0;
      const startX = isLeft ? -30 : 130;
      const startY = 12 + ((i * 13) % 75);
      const lineY = 12 + ((i * 9) % 72);
      const lineDir = i % 2 === 0 ? 1 : -1;
      const scatterAngle = (i / count) * Math.PI * 2 + (i % 2 === 0 ? 0.35 : -0.35);

      arr.push({
        id: i,
        spawnTime,
        radiusOffset,
        speedMultiplier,
        baseAngle,
        size,
        swishSpeed,
        chompSpeed,
        startX,
        startY,
        lineY,
        lineDir,
        lineSpeed,
        scatterAngle,
      });
    }
    return arr;
  }, []);

  const sharksStateRef = useRef([]);
  if (sharksStateRef.current.length === 0) {
    sharksStateRef.current = sharksConfig.map((cfg) => ({
      x: cfg.startX,
      y: cfg.startY,
      vx: cfg.lineDir,
      vy: 0,
      state: 'OFF_STAGE',
    }));
  }

  const sparklesStateRef = useRef([]);
  if (sparklesStateRef.current.length === 0) {
    for (let i = 0; i < SPARKLE_COUNT; i++) {
      sparklesStateRef.current.push({
        x: -200,
        y: -200,
        vx: 0,
        vy: 0,
        life: 0,
        maxLife: 0.8,
        size: 24,
        color: SPARKLE_COLORS[i % SPARKLE_COLORS.length],
      });
    }
  }

  // Pre-allocated Kinematic Bubbles initialized across the scene at t=0
  const bubblesStateRef = useRef([]);
  if (bubblesStateRef.current.length === 0) {
    for (let i = 0; i < BUBBLE_COUNT; i++) {
      bubblesStateRef.current.push({
        x: 5 + (i * 3.1 + Math.random() * 4) % 90,
        y: (i * 3.5 + Math.random() * 10) % 105,
        speed: 4.5 + (i % 5) * 1.5 + Math.random() * 1.2,
        wobbleSpeed: 1.2 + (i % 3) * 0.6,
        wobbleAmp: 1.2 + (i % 4) * 0.8,
        size: 10 + (i % 5) * 4.5,
        opacity: 0.35 + (i % 4) * 0.12,
      });
    }
  }

  const spawnTimerRef = useRef(0);

  useEffect(() => {
    const updateVinylPosition = () => {
      const el = document.querySelector('.vinyl-container') || document.querySelector('.vinyl-outer-ring');
      if (el) {
        const rect = el.getBoundingClientRect();
        const centerX = ((rect.left + rect.width / 2) / window.innerWidth) * 100;
        const centerY = ((rect.top + rect.height / 2) / window.innerHeight) * 100;
        const radiusX = ((rect.width / 2) / window.innerWidth) * 100 + 6;
        const radiusY = radiusX * 0.75;
        vinylCenterRef.current = { x: centerX, y: centerY, rx: radiusX, ry: radiusY };
      } else {
        const isMobile = window.innerWidth < 1024;
        vinylCenterRef.current = { x: isMobile ? 50 : 25, y: isMobile ? 38 : 46, rx: 20, ry: 15 };
      }
    };

    updateVinylPosition();
    const targetEl = document.querySelector('.vinyl-container') || document.body;
    let observer;
    if (window.ResizeObserver) {
      observer = new ResizeObserver(updateVinylPosition);
      observer.observe(targetEl);
    }
    window.addEventListener('resize', updateVinylPosition);
    return () => {
      if (observer) observer.disconnect();
      window.removeEventListener('resize', updateVinylPosition);
    };
  }, []);

  useEffect(() => {
    if (typeof currentTime === 'number') {
      currentTimeRef.current = currentTime;
    }
  }, [currentTime]);

  useEffect(() => {
    let lastPerfTime = performance.now();

    const renderFrame = (now) => {
      const delta = Math.min(0.1, (now - lastPerfTime) / 1000);
      lastPerfTime = now;

      if (isPlaying) {
        currentTimeRef.current += delta;
      }

      const time = currentTimeRef.current;
      const secTime = Math.floor(time);
      const { x: centerX, y: centerY, rx: baseRx, ry: baseRy } = vinylCenterRef.current;

      // 1. Process Kinematic Underwater Bubbles (Active from t=0)
      bubblesStateRef.current.forEach((b, i) => {
        const el = bubbleRefs.current[i];
        if (!el) return;

        b.y -= b.speed * delta;
        b.x += Math.sin(time * b.wobbleSpeed + i * 1.5) * b.wobbleAmp * delta;

        if (b.y < -8) {
          b.y = 105;
          b.x = 5 + (i * 7 + Math.random() * 15) % 90;
        }

        el.style.display = 'block';
        el.style.left = `${b.x}vw`;
        el.style.top = `${b.y}vh`;
        el.style.opacity = b.opacity;
        el.style.transform = `translate3d(-50%, -50%, 0)`;
      });

      let globalSignal = 'CIRCLING';
      if (secTime >= 183) globalSignal = 'FAIRY_HUNTING';
      else if (secTime >= 172) globalSignal = 'CIRCLING';
      else if (secTime >= 149) globalSignal = 'PATROLLING';
      else if (secTime >= 106) globalSignal = 'CIRCLING';
      else if (secTime >= 74) globalSignal = 'PATROLLING';

      const huntStartTime = 183.0;
      const huntDurationPerShark = 1.9;

      // 2. Process Sharks Kinematic Steering
      sharksConfig.forEach((cfg, i) => {
        const bgEl = bgSharkRefs.current[i];
        const fgEl = fgSharkRefs.current[i];
        const sharkState = sharksStateRef.current[i];

        if (time < cfg.spawnTime) {
          sharkState.state = 'OFF_STAGE';
          sharkState.x = cfg.startX;
          sharkState.y = cfg.startY;
          if (bgEl) bgEl.style.display = 'none';
          if (fgEl) fgEl.style.display = 'none';
          return;
        }

        if (globalSignal === 'FAIRY_HUNTING') {
          const huntElapsed = Math.max(0, time - huntStartTime);
          const touchTime = (i + 1) * huntDurationPerShark;
          if (huntElapsed >= touchTime) {
            sharkState.state = 'FLEEING';
          } else {
            sharkState.state = 'CIRCLING';
          }
        } else {
          sharkState.state = globalSignal;
        }

        let tx = 0;
        let ty = 0;
        let isInFront = false;

        if (sharkState.state === 'FLEEING') {
          const huntElapsed = Math.max(0, time - huntStartTime);
          const touchTime = (i + 1) * huntDurationPerShark;
          const fleeElapsed = huntElapsed - touchTime;
          const fleeDist = fleeElapsed * 45;

          tx = centerX + Math.cos(cfg.scatterAngle) * (baseRx + 15 + fleeDist);
          ty = centerY + Math.sin(cfg.scatterAngle) * (baseRy + 15 + fleeDist);
          isInFront = true;
        } else if (sharkState.state === 'PATROLLING') {
          const startTime = time >= 149.0 ? 149.0 : 74.0;
          const lineTime = time - startTime;
          const phaseAngle = lineTime * cfg.lineSpeed * 0.08 + cfg.id * 0.45;
          const pingPong = (Math.sin(phaseAngle) + 1) / 2;
          tx = -15 + pingPong * 130;
          ty = cfg.lineY;
          isInFront = true;
        } else {
          const angle = cfg.baseAngle + time * cfg.speedMultiplier * 0.8;
          const rx = baseRx + cfg.radiusOffset;
          const ry = baseRy + cfg.radiusOffset * 0.7;

          tx = centerX + Math.cos(angle) * rx;
          ty = centerY + Math.sin(angle) * ry;
          isInFront = Math.sin(angle) >= 0;
        }

        const lerpRate = sharkState.state === 'FLEEING' ? 12.0 : 4.5;
        const newX = sharkState.x + (tx - sharkState.x) * Math.min(1.0, delta * lerpRate);
        const newY = sharkState.y + (ty - sharkState.y) * Math.min(1.0, delta * lerpRate);

        const vx = (newX - sharkState.x) || (tx - sharkState.x) || cfg.lineDir;
        const vy = (newY - sharkState.y) || (ty - sharkState.y) || 0.001;

        sharkState.x = newX;
        sharkState.y = newY;
        sharkState.vx = vx;
        sharkState.vy = vy;

        const isScared = sharkState.state === 'FLEEING';
        const transformStr = getUprightTransform(vx, vy, isScared ? -1 : 1);

        if (isInFront) {
          if (bgEl) bgEl.style.display = 'none';
          if (fgEl) {
            fgEl.style.display = 'block';
            fgEl.style.left = `${newX}vw`;
            fgEl.style.top = `${newY}vh`;
            fgEl.style.transform = transformStr;
          }
        } else {
          if (fgEl) fgEl.style.display = 'none';
          if (bgEl) {
            bgEl.style.display = 'block';
            bgEl.style.left = `${newX}vw`;
            bgEl.style.top = `${newY}vh`;
            bgEl.style.transform = transformStr;
          }
        }
      });

      // 3. Process Hero Fairy Motion & Entrance Flash Burst
      let currentFairyX = -200;
      let currentFairyY = -200;
      let fairyOpacity = 0;
      let fairyScale = 1.0;

      if (fairyRef.current) {
        if (globalSignal === 'FAIRY_HUNTING') {
          fairyOpacity = 1.0;
          const huntElapsed = Math.max(0, time - huntStartTime);
          const totalHuntTime = sharksConfig.length * huntDurationPerShark;

          if (huntElapsed < totalHuntTime) {
            const huntIdx = Math.min(sharksConfig.length - 1, Math.floor(huntElapsed / huntDurationPerShark));
            const targetSharkState = sharksStateRef.current[huntIdx];
            const subProgress = (huntElapsed % huntDurationPerShark) / huntDurationPerShark;

            let prevX = sharksStateRef.current[0].x;
            let prevY = sharksStateRef.current[0].y;
            if (huntIdx > 0) {
              prevX = sharksStateRef.current[huntIdx - 1].x;
              prevY = sharksStateRef.current[huntIdx - 1].y;
            }

            currentFairyX = prevX + (targetSharkState.x - prevX) * Math.min(1.0, subProgress * 1.2);
            currentFairyY = prevY + (targetSharkState.y - prevY) * Math.min(1.0, subProgress * 1.2);
          } else {
            const hoverElapsed = huntElapsed - totalHuntTime;
            const targetHoverX = centerX - baseRx * 0.55;
            const targetHoverY = centerY - baseRy * 0.55;

            const lastSharkState = sharksStateRef.current[sharksConfig.length - 1];
            const startHoverX = lastSharkState.x;
            const startHoverY = lastSharkState.y;

            const glideProgress = Math.min(1.0, hoverElapsed / 2.5);
            fairyScale = 1.0 + glideProgress * 0.5;

            currentFairyX = startHoverX + (targetHoverX - startHoverX) * glideProgress + Math.sin(time * 1.2) * 1.5;
            currentFairyY = startHoverY + (targetHoverY - startHoverY) * glideProgress + Math.cos(time * 1.2) * 1.5;
          }

          if (flashRef.current) {
            if (huntElapsed >= 0 && huntElapsed <= 0.75) {
              const flashProgress = huntElapsed / 0.75;
              const flashScale = 0.3 + flashProgress * 2.2;
              const flashOpacity = Math.sin(flashProgress * Math.PI);

              flashRef.current.style.display = 'block';
              flashRef.current.style.left = `${currentFairyX}vw`;
              flashRef.current.style.top = `${currentFairyY}vh`;
              flashRef.current.style.opacity = flashOpacity;
              flashRef.current.style.transform = `translate3d(-50%, -50%, 0) scale(${flashScale})`;
            } else {
              flashRef.current.style.display = 'none';
            }
          }
        } else {
          if (flashRef.current) flashRef.current.style.display = 'none';
        }

        fairyRef.current.style.left = `${currentFairyX}vw`;
        fairyRef.current.style.top = `${currentFairyY}vh`;
        fairyRef.current.style.opacity = fairyOpacity;
        fairyRef.current.style.transform = `translate3d(-50%, -50%, 0) scale(${fairyScale})`;
      }

      // 4. Process Glowing Sparkle Trail Engine
      if (globalSignal === 'FAIRY_HUNTING' && fairyOpacity > 0 && currentFairyX > -100) {
        spawnTimerRef.current += delta;
        if (spawnTimerRef.current >= 0.04) {
          spawnTimerRef.current = 0;
          const deadIdx = sparklesStateRef.current.findIndex((p) => p.life <= 0);
          if (deadIdx !== -1) {
            const p = sparklesStateRef.current[deadIdx];
            p.x = currentFairyX + (Math.random() - 0.5) * 3.5;
            p.y = currentFairyY + (Math.random() - 0.5) * 3.5;
            p.vx = (Math.random() - 0.5) * 8.0;
            p.vy = (Math.random() - 0.5) * 8.0 - 5.0;
            p.life = 0.55 + Math.random() * 0.45;
            p.maxLife = p.life;
            p.size = 14 + Math.random() * 18;
          }
        }
      }

      sparklesStateRef.current.forEach((p, i) => {
        const el = sparkleRefs.current[i];
        if (!el) return;

        if (p.life > 0) {
          p.life -= delta;
          p.x += p.vx * delta;
          p.y += p.vy * delta;

          const lifeRatio = Math.max(0, p.life / p.maxLife);
          const opacity = Math.sin(lifeRatio * Math.PI) * 0.95;
          const scale = 0.3 + lifeRatio * 0.85;

          el.style.display = 'block';
          el.style.left = `${p.x}vw`;
          el.style.top = `${p.y}vh`;
          el.style.opacity = opacity;
          el.style.transform = `translate3d(-50%, -50%, 0) scale(${scale})`;
        } else {
          el.style.display = 'none';
        }
      });

      if (isPlaying) {
        animFrameRef.current = requestAnimationFrame(renderFrame);
      }
    };

    lastPerfTime = performance.now();
    animFrameRef.current = requestAnimationFrame(renderFrame);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [isPlaying, sharksConfig]);

  return (
    <>
      <div className="pinky-shark-canvas-bg" aria-hidden="true">
        <ForestBackgroundSvg />

        {/* Kinematic Underwater Floating Bubbles (Active from t=0) */}
        {bubblesStateRef.current.map((b, i) => (
          <div
            key={`bubble_${i}`}
            ref={(el) => (bubbleRefs.current[i] = el)}
            className="pinky-shark-item"
            style={{
              display: 'block',
              width: `${b.size}px`,
              height: `${b.size}px`,
              left: `${b.x}vw`,
              top: `${b.y}vh`,
              opacity: b.opacity,
              zIndex: 1,
            }}
          >
            <BubbleSvg />
          </div>
        ))}

        {sharksConfig.map((shark, i) => (
          <div
            key={shark.id}
            ref={(el) => (bgSharkRefs.current[i] = el)}
            className="pinky-shark-item"
            style={{
              display: 'none',
              width: `${shark.size}px`,
              height: `${shark.size * 0.42}px`,
            }}
          >
            <SharkSvg id={`bg_${shark.id}`} type={shark.id % 2 === 0 ? 'great-white' : 'hammerhead'} swishSpeed={shark.swishSpeed} chompSpeed={shark.chompSpeed} />
          </div>
        ))}
      </div>

      <div className="pinky-shark-canvas-fg" aria-hidden="true">
        {sparklesStateRef.current.map((p, i) => (
          <div
            key={`sparkle_${i}`}
            ref={(el) => (sparkleRefs.current[i] = el)}
            className="pinky-shark-item"
            style={{
              display: 'none',
              width: `${p.size}px`,
              height: `${p.size}px`,
              zIndex: 998,
            }}
          >
            <SparkleSvg color={p.color} />
          </div>
        ))}

        <div
          ref={flashRef}
          className="pinky-shark-item"
          style={{
            display: 'none',
            width: '260px',
            height: '260px',
            zIndex: 1000,
          }}
        >
          <FairyFlashBurstSvg />
        </div>

        {sharksConfig.map((shark, i) => (
          <div
            key={shark.id}
            ref={(el) => (fgSharkRefs.current[i] = el)}
            className="pinky-shark-item"
            style={{
              display: 'none',
              width: `${shark.size}px`,
              height: `${shark.size * 0.42}px`,
            }}
          >
            <SharkSvg id={`fg_${shark.id}`} type={shark.id % 2 === 0 ? 'great-white' : 'hammerhead'} swishSpeed={shark.swishSpeed} chompSpeed={shark.chompSpeed} />
          </div>
        ))}

        <div
          ref={fairyRef}
          className="pinky-shark-item"
          style={{
            opacity: 0,
            width: '120px',
            height: '120px',
            zIndex: 999,
          }}
        >
          <FairyHeroSvg />
        </div>
      </div>
    </>
  );
}
