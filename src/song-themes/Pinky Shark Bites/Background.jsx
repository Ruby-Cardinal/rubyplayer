import React, { useMemo, useState, useEffect, useRef } from 'react';

// Forest & Blue Sky SVG Layer (Dense Woodland Forest, Pines & Deciduous Oaks, Brown Wood Trunks, Sunbeams & Floating Clouds)
function ForestBackgroundSvg() {
  return (
    <svg
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
    >
      <defs>
        {/* Sky Gradient */}
        <linearGradient id="forestSkyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#0369a1" />
          <stop offset="35%" stopColor="#0284c7" />
          <stop offset="65%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#bae6fd" />
        </linearGradient>

        {/* Sunbeam Light Rays */}
        <linearGradient id="sunbeamGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(254, 240, 138, 0.35)" />
          <stop offset="50%" stopColor="rgba(253, 230, 138, 0.15)" />
          <stop offset="100%" stopColor="transparent" />
        </linearGradient>

        {/* Brown Wood Bark Trunk Gradient */}
        <linearGradient id="treeBarkGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#291d09" />
          <stop offset="45%" stopColor="#452715" />
          <stop offset="80%" stopColor="#603813" />
          <stop offset="100%" stopColor="#1e1406" />
        </linearGradient>

        {/* Distant Misty Mountain & Ridge Gradient */}
        <linearGradient id="mistyForestGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#0d9488" />
          <stop offset="100%" stopColor="#0f766e" />
        </linearGradient>

        {/* Midground Foliage Gradient */}
        <linearGradient id="midFoliageGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#059669" />
          <stop offset="100%" stopColor="#047857" />
        </linearGradient>

        {/* Foreground Deciduous Leaf Gradient */}
        <linearGradient id="deciduousLeafGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="50%" stopColor="#047857" />
          <stop offset="100%" stopColor="#064e3b" />
        </linearGradient>

        <linearGradient id="darkFoliageGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#064e3b" />
          <stop offset="100%" stopColor="#022c22" />
        </linearGradient>
      </defs>

      {/* 1. BLUE SKY BASE */}
      <rect width="1440" height="900" fill="url(#forestSkyGrad)" />

      {/* 2. GOLDEN SUNBEAMS THROUGH CANOPY */}
      <polygon points="0,0 280,0 650,900 0,900" fill="url(#sunbeamGrad)" />
      <polygon points="120,0 450,0 950,900 350,900" fill="url(#sunbeamGrad)" opacity="0.6" />
      <polygon points="600,0 880,0 1250,900 750,900" fill="url(#sunbeamGrad)" opacity="0.4" />

      {/* 3. FLUFFY DRIFTING SKY CLOUDS */}
      <g fill="rgba(255, 255, 255, 0.75)" style={{ filter: 'drop-shadow(0 4px 12px rgba(255, 255, 255, 0.4))' }}>
        <path d="M 150 140 Q 180 100 230 110 Q 280 90 330 120 Q 380 110 400 150 Q 420 180 370 190 L 140 190 Q 110 170 150 140 Z" opacity="0.8" />
        <path d="M 850 90 Q 880 50 930 60 Q 980 40 1030 70 Q 1080 60 1100 100 Q 1120 130 1070 140 L 840 140 Q 810 120 850 90 Z" opacity="0.65" />
        <path d="M 520 200 Q 550 170 590 180 Q 630 160 670 190 Q 700 180 720 210 Q 730 230 690 240 L 500 240 Q 480 220 520 200 Z" opacity="0.75" />
      </g>

      {/* 4. DISTANT MISTY MOUNTAIN & RIDGE SILHOUETTE */}
      <path
        d="M 0 520 Q 220 440 440 490 Q 660 430 880 470 Q 1100 410 1300 460 Q 1380 440 1440 470 L 1440 900 L 0 900 Z"
        fill="url(#mistyForestGrad)"
        opacity="0.45"
      />

      {/* 5. DENSE MIDGROUND FOREST (PINES & DECIDUOUS CANOPY ACROSS ENTIRE HORIZON) */}
      <g fill="url(#midFoliageGrad)" opacity="0.85">
        <polygon points="10,580 90,380 170,580" />
        <polygon points="50,600 140,360 230,600" />
        <polygon points="180,620 260,390 340,620" />
        <polygon points="320,600 400,370 480,600" />
        <polygon points="450,620 530,400 610,620" />
        <polygon points="580,590 660,380 740,590" />
        <polygon points="710,610 790,390 870,610" />
        <polygon points="840,580 920,360 1000,580" />
        <polygon points="970,620 1050,400 1130,620" />
        <polygon points="1100,590 1180,370 1260,590" />
        <polygon points="1230,610 1310,380 1390,610" />
        <polygon points="1350,580 1420,390 1490,580" />

        <path d="M 140 480 C 100 430 120 360 180 350 C 240 340 280 400 260 460 C 310 480 300 550 240 580 Z" />
        <path d="M 420 490 C 380 440 400 370 460 360 C 520 350 560 410 540 470 C 590 490 580 560 520 590 Z" />
        <path d="M 720 480 C 680 430 700 360 760 350 C 820 340 860 400 840 460 C 890 480 880 550 820 580 Z" />
        <path d="M 1020 490 C 980 440 1000 370 1060 360 C 1120 350 1160 410 1140 470 C 1190 490 1180 560 1120 590 Z" />
      </g>

      <g fill="url(#treeBarkGrad)" style={{ filter: 'drop-shadow(4px 0 8px rgba(0,0,0,0.4))' }}>
        <polygon points="40,900 52,320 68,320 80,900" />
        <polygon points="120,900 135,250 155,250 170,900" />
        <path d="M 220 900 L 245 380 L 270 380 L 300 900 Z" />
        <path d="M 250 490 Q 200 440 170 410 L 182 395 Q 215 425 254 468 Z" />

        <polygon points="480,900 492,340 508,340 520,900" />
        <polygon points="760,900 772,330 788,330 800,900" />
        <polygon points="980,900 992,350 1008,350 1020,900" />

        <path d="M 1160 900 L 1185 380 L 1210 380 L 1240 900 Z" />
        <path d="M 1195 490 Q 1145 440 1115 410 L 1127 395 Q 1160 425 1199 468 Z" />
        <polygon points="1290,900 1305,250 1325,250 1340,900" />
        <polygon points="1380,900 1392,320 1408,320 1420,900" />
      </g>

      <g>
        <path
          d="M 180 390 C 140 340 150 260 220 240 C 260 220 320 250 330 300 C 380 290 410 350 390 410 C 370 470 300 490 250 470 C 200 490 160 440 180 390 Z"
          fill="url(#deciduousLeafGrad)"
          style={{ filter: 'drop-shadow(0 6px 14px rgba(0,0,0,0.4))' }}
        />
        <polygon points="-40,390 60,130 160,390" fill="url(#darkFoliageGrad)" />
        <polygon points="20,350 145,100 270,350" fill="url(#deciduousLeafGrad)" />

        <polygon points="420,410 500,160 580,410" fill="url(#darkFoliageGrad)" />
        <path
          d="M 440 400 C 400 350 410 270 480 250 C 520 230 580 260 590 310 C 640 300 670 360 650 420 C 630 480 560 500 510 480 C 460 500 420 450 440 400 Z"
          fill="url(#deciduousLeafGrad)"
          style={{ filter: 'drop-shadow(0 6px 14px rgba(0,0,0,0.35))' }}
        />
        <polygon points="700,410 780,150 860,410" fill="url(#darkFoliageGrad)" />
        <path
          d="M 920 410 C 880 360 890 280 960 260 C 1000 240 1060 270 1070 320 C 1120 310 1150 370 1130 430 C 1110 490 1040 510 990 490 C 940 510 900 460 920 410 Z"
          fill="url(#deciduousLeafGrad)"
          style={{ filter: 'drop-shadow(0 6px 14px rgba(0,0,0,0.35))' }}
        />

        <path
          d="M 1100 390 C 1060 340 1070 260 1140 240 C 1180 220 1240 250 1250 300 C 1300 290 1330 350 1310 410 C 1290 470 1220 490 1170 470 C 1120 490 1080 440 1100 390 Z"
          fill="url(#deciduousLeafGrad)"
          style={{ filter: 'drop-shadow(0 6px 14px rgba(0,0,0,0.4))' }}
        />
        <polygon points="1230,410 1315,150 1400,410" fill="url(#darkFoliageGrad)" />
        <polygon points="1310,390 1400,140 1490,390" fill="url(#deciduousLeafGrad)" />

        <path d="M 0 710 Q 360 650 720 690 Q 1080 630 1440 670 L 1440 900 L 0 900 Z" fill="#022c22" />
      </g>
    </svg>
  );
}

function SharkSvg({ id = '0', type = 'great-white', swishSpeed = '1.2s', glow = true, isScared = false }) {
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
        d="M 62 16 L 50 1 L 40 4 L 48 16 Z"
        fill={`url(#${bodyGradId})`}
      />
      <path d="M 48 16 L 40 4 L 44 14 Z" fill="#1e293b" opacity="0.4" />

      <path
        d="M 24 21 C 32 14 52 14 78 17 C 92 19 100 21 100 22 C 100 23 90 27 75 29 C 52 32 32 30 24 21 Z"
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

      <path d="M 94 22 L 92 22.5" stroke="#1e293b" strokeWidth="0.5" />

      <g
        className="shark-near-fin"
        style={{
          transformOrigin: '60px 24px',
          animation: `sharkFinMoveNear ${swishSpeed} ease-in-out infinite alternate`,
        }}
      >
        <path
          d="M 60 24 L 46 38 L 40 36 L 54 23 Z"
          fill={`url(#${finNearGradId})`}
        />
      </g>
    </svg>
  );
}

function FairyHeroSvg() {
  return (
    <svg viewBox="0 0 160 160" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
      <defs>
        <radialGradient id="fairyAuraGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(244, 114, 182, 0.75)" />
          <stop offset="55%" stopColor="rgba(192, 132, 252, 0.35)" />
          <stop offset="85%" stopColor="rgba(250, 204, 21, 0.15)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>

        <linearGradient id="fairyWingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(255, 255, 255, 0.95)" />
          <stop offset="35%" stopColor="rgba(244, 114, 182, 0.7)" />
          <stop offset="75%" stopColor="rgba(192, 132, 252, 0.6)" />
          <stop offset="100%" stopColor="rgba(250, 204, 21, 0.8)" />
        </linearGradient>

        <radialGradient id="wandStarGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="35%" stopColor="#fef08a" />
          <stop offset="70%" stopColor="#f472b6" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>

      <circle cx="80" cy="80" r="72" fill="url(#fairyAuraGrad)" />

      <g style={{ filter: 'drop-shadow(0 0 12px #f472b6) drop-shadow(0 0 22px #c084fc)' }}>
        <path d="M 78 62 C 35 15 10 20 8 45 C 6 70 52 75 76 68 Z" fill="url(#fairyWingGrad)" stroke="#fbcfe8" strokeWidth="1.2" />
        <path d="M 82 62 C 125 15 150 20 152 45 C 154 70 108 75 84 68 Z" fill="url(#fairyWingGrad)" stroke="#fbcfe8" strokeWidth="1.2" />
        <path d="M 78 68 C 30 75 25 105 45 120 C 65 125 75 95 78 76 Z" fill="url(#fairyWingGrad)" stroke="#facc15" strokeWidth="1" opacity="0.85" />
        <path d="M 82 68 C 130 75 135 105 115 120 C 95 125 85 95 82 76 Z" fill="url(#fairyWingGrad)" stroke="#facc15" strokeWidth="1" opacity="0.85" />
      </g>

      <g className="fairy-curly-hair" fill="none" strokeLinecap="round">
        <path d="M 72 37 C 62 30 58 42 62 52 C 65 60 74 62 76 56" stroke="#fbbf24" strokeWidth="5" opacity="0.95" />
        <path d="M 78 34 C 70 28 62 34 65 42 C 68 46 75 42 74 38" stroke="#fef08a" strokeWidth="3" />
        <path d="M 72 40 C 60 38 56 48 60 55 C 64 60 72 58 70 52" stroke="#fbbf24" strokeWidth="3.5" />
        <path d="M 68 50 C 58 52 56 62 64 66 C 70 65 72 58 68 54" stroke="#fef08a" strokeWidth="2.5" />
        <path d="M 82 35 C 88 30 94 36 90 42 C 86 46 80 42 82 38" stroke="#fbbf24" strokeWidth="3" />
        <path d="M 76 32 C 80 27 86 31 84 36" stroke="#fef08a" strokeWidth="2.5" />
      </g>

      <g>
        <path d="M 76 90 Q 72 112 68 132 M 84 90 Q 86 112 90 130" stroke="#fed7aa" strokeWidth="3.5" strokeLinecap="round" fill="none" />
        <path d="M 74 64 C 55 85 62 96 80 96 C 98 96 105 85 86 64 Z" fill="#ec4899" style={{ filter: 'drop-shadow(0 4px 10px rgba(236, 72, 153, 0.6))' }} />
        <path d="M 76 64 C 62 80 68 90 80 92 C 92 90 98 80 84 64 Z" fill="#f472b6" opacity="0.8" />
        <path d="M 75 50 Q 80 47 85 50 L 86 64 L 74 64 Z" fill="#f472b6" />
        <ellipse cx="80" cy="42" rx="6" ry="7" fill="#fed7aa" />
        <path d="M 74 52 Q 65 62 68 70" fill="none" stroke="#fed7aa" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M 86 52 Q 98 44 110 36" fill="none" stroke="#fed7aa" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="110" cy="36" r="2" fill="#fed7aa" />
      </g>

      <g>
        <line x1="102" y1="42" x2="124" y2="24" stroke="#facc15" strokeWidth="2" strokeLinecap="round" />
        <circle cx="124" cy="24" r="18" fill="url(#wandStarGlow)" />
        <polygon points="124,12 127,20 136,24 127,28 124,36 121,28 112,24 121,20" fill="#ffffff" style={{ filter: 'drop-shadow(0 0 12px #ffffff)' }} />
      </g>

      <circle cx="24" cy="35" r="2.5" fill="#fef08a" style={{ filter: 'drop-shadow(0 0 5px #fef08a)' }} />
      <circle cx="140" cy="72" r="2.2" fill="#f472b6" style={{ filter: 'drop-shadow(0 0 4px #f472b6)' }} />
      <circle cx="40" cy="115" r="2.5" fill="#ffffff" style={{ filter: 'drop-shadow(0 0 4px #ffffff)' }} />
      <circle cx="120" cy="122" r="3" fill="#fef08a" style={{ filter: 'drop-shadow(0 0 6px #fef08a)' }} />
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

export default function ScriptedPinkySharkBackground({ currentTrack, currentTime = 0, isPlaying }) {
  const vinylCenterRef = useRef({ x: 50, y: 50, rx: 20, ry: 15 });
  const currentTimeRef = useRef(currentTime);
  const animFrameRef = useRef(null);

  const bgSharkRefs = useRef([]);
  const fgSharkRefs = useRef([]);
  const fairyRef = useRef(null);

  const sharksConfig = useMemo(() => {
    const arr = [];
    const count = 29;
    let spawnTime = 0;
    for (let i = 0; i < count; i++) {
      const mentionIdx = i % PINKY_SHARK_MENTIONS.length; // map to lyric mentions
      spawnTime = PINKY_SHARK_MENTIONS[mentionIdx];


      const radiusOffset = (i % 5) * 2.5;
      const speedMultiplier = 0.52 + (i % 7) * 0.05 + (i % 3) * 0.02;
      const lineSpeed = 16 + (i % 7) * 4 + (i % 3) * 2;
      const swishSpeed = `${(0.8 + (i % 5) * 0.15).toFixed(2)}s`;
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
      state: 'OFF_STAGE', // OFF_STAGE, ENTERING, CIRCLING, PATROLLING, FLEEING
    }));
  }

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

  // Behavior Engine & Kinematic Damped Steering (60fps rAF)
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

      let globalSignal = 'CIRCLING';
      if (secTime >= 183) globalSignal = 'FAIRY_HUNTING';
      else if (secTime >= 172) globalSignal = 'CIRCLING';
      else if (secTime >= 149) globalSignal = 'PATROLLING';
      else if (secTime >= 106) globalSignal = 'CIRCLING';
      else if (secTime >= 74) globalSignal = 'PATROLLING';

      const huntStartTime = 180.0;
      const huntDurationPerShark = 1.9;

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
          const startTime = time >= 118.0 ? 118.0 : 77.0;
          const lineTime = time - startTime;
          const rawX = ((lineTime * cfg.lineSpeed + cfg.id * 35) % 160) - 30;
          tx = cfg.lineDir === 1 ? rawX : 100 - rawX;
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

      if (fairyRef.current) {
        let fairyX = -200;
        let fairyY = -200;
        let fairyOpacity = 0;

        if (globalSignal === 'FAIRY_HUNTING') {
          fairyOpacity = 1.0;
          const huntElapsed = Math.max(0, time - huntStartTime);
          const totalHuntTime = sharksConfig.length * huntDurationPerShark;

          if (huntElapsed < totalHuntTime) {
            const huntIdx = Math.min(sharksConfig.length - 1, Math.floor(huntElapsed / huntDurationPerShark));
            const targetSharkState = sharksStateRef.current[huntIdx];
            const targetSharkConfig = sharksConfig[huntIdx];

            const subProgress = (huntElapsed % huntDurationPerShark) / huntDurationPerShark;

            let prevX = centerX - baseRx - 15;
            let prevY = centerY - baseRy - 15;
            if (huntIdx > 0) {
              prevX = sharksStateRef.current[huntIdx - 1].x;
              prevY = sharksStateRef.current[huntIdx - 1].y;
            }

            fairyX = prevX + (targetSharkState.x - prevX) * Math.min(1.0, subProgress * 1.2);
            fairyY = prevY + (targetSharkState.y - prevY) * Math.min(1.0, subProgress * 1.2);
          } else {
            const hoverElapsed = huntElapsed - totalHuntTime;
            const targetHoverX = centerX - baseRx * 0.55;
            const targetHoverY = centerY - baseRy * 0.55;

            const lastSharkState = sharksStateRef.current[sharksConfig.length - 1];
            const startHoverX = lastSharkState.x;
            const startHoverY = lastSharkState.y;

            const glideProgress = Math.min(1.0, hoverElapsed / 2.5);

            fairyX = startHoverX + (targetHoverX - startHoverX) * glideProgress + Math.sin(time * 1.2) * 1.5;
            fairyY = startHoverY + (targetHoverY - startHoverY) * glideProgress + Math.cos(time * 1.2) * 1.5;
          }
        }

        fairyRef.current.style.left = `${fairyX}vw`;
        fairyRef.current.style.top = `${fairyY}vh`;
        fairyRef.current.style.opacity = fairyOpacity;
        fairyRef.current.style.transform = `translate3d(-50%, -50%, 0)`;
      }

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
            <SharkSvg id={`bg_${shark.id}`} type={shark.id % 2 === 0 ? 'great-white' : 'hammerhead'} swishSpeed={shark.swishSpeed} />
          </div>
        ))}
      </div>

      <div className="pinky-shark-canvas-fg" aria-hidden="true">
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
            <SharkSvg id={`fg_${shark.id}`} type={shark.id % 2 === 0 ? 'great-white' : 'hammerhead'} swishSpeed={shark.swishSpeed} />
          </div>
        ))}

        <div
          ref={fairyRef}
          className="pinky-shark-item"
          style={{
            opacity: 0,
            width: '120px',
            height: '120px',
          }}
        >
          <FairyHeroSvg />
        </div>
      </div>
    </>
  );
}
