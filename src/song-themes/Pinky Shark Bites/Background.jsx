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

      {/* 6. REAL BROWN WOOD TRUNKS & BRANCHES */}
      <g fill="url(#treeBarkGrad)" style={{ filter: 'drop-shadow(4px 0 8px rgba(0,0,0,0.4))' }}>
        {/* Left Pines & Oak Trunks */}
        <polygon points="40,900 52,320 68,320 80,900" />
        <polygon points="120,900 135,250 155,250 170,900" />
        <path d="M 220 900 L 245 380 L 270 380 L 300 900 Z" />
        <path d="M 250 490 Q 200 440 170 410 L 182 395 Q 215 425 254 468 Z" />

        {/* Center Midground Trunks */}
        <polygon points="480,900 492,340 508,340 520,900" />
        <polygon points="760,900 772,330 788,330 800,900" />
        <polygon points="980,900 992,350 1008,350 1020,900" />

        {/* Right Pines & Maple Trunks */}
        <path d="M 1160 900 L 1185 380 L 1210 380 L 1240 900 Z" />
        <path d="M 1195 490 Q 1145 440 1115 410 L 1127 395 Q 1160 425 1199 468 Z" />
        <polygon points="1290,900 1305,250 1325,250 1340,900" />
        <polygon points="1380,900 1392,320 1408,320 1420,900" />
      </g>

      {/* 7. FOREGROUND DENSE TREE CANOPY (SHARP PINES & RICH DECIDUOUS LEAVES OVER ALL TRUNKS) */}
      <g>
        {/* Left Giant Oak & Pine Cluster */}
        <path
          d="M 180 390 C 140 340 150 260 220 240 C 260 220 320 250 330 300 C 380 290 410 350 390 410 C 370 470 300 490 250 470 C 200 490 160 440 180 390 Z"
          fill="url(#deciduousLeafGrad)"
          style={{ filter: 'drop-shadow(0 6px 14px rgba(0,0,0,0.4))' }}
        />
        <polygon points="-40,390 60,130 160,390" fill="url(#darkFoliageGrad)" />
        <polygon points="20,350 145,100 270,350" fill="url(#deciduousLeafGrad)" />

        {/* Center Pines & Oak Canopy */}
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

        {/* Right Giant Maple & Pine Cluster */}
        <path
          d="M 1100 390 C 1060 340 1070 260 1140 240 C 1180 220 1240 250 1250 300 C 1300 290 1330 350 1310 410 C 1290 470 1220 490 1170 470 C 1120 490 1080 440 1100 390 Z"
          fill="url(#deciduousLeafGrad)"
          style={{ filter: 'drop-shadow(0 6px 14px rgba(0,0,0,0.4))' }}
        />
        <polygon points="1230,410 1315,150 1400,410" fill="url(#darkFoliageGrad)" />
        <polygon points="1310,390 1400,140 1490,390" fill="url(#deciduousLeafGrad)" />

        {/* Lush Grass Forest Floor Silhouette */}
        <path d="M 0 710 Q 360 650 720 690 Q 1080 630 1440 670 L 1440 900 L 0 900 Z" fill="#022c22" />
      </g>
    </svg>
  );
}

// SharkSvg component with unique instance gradient IDs to prevent DOM SVG fill target collisions
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

// Brand-New Hero Fairy SVG with Smooth Translucent Wings, Short Bouncy Curls, and Magic Star Wand
function FairyHeroSvg() {
  return (
    <svg viewBox="0 0 160 160" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
      <defs>
        {/* Soft Bioluminescent Fairy Aura */}
        <radialGradient id="fairyAuraGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(244, 114, 182, 0.75)" />
          <stop offset="55%" stopColor="rgba(192, 132, 252, 0.35)" />
          <stop offset="85%" stopColor="rgba(250, 204, 21, 0.15)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>

        {/* Luminous Wing Gradient */}
        <linearGradient id="fairyWingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(255, 255, 255, 0.95)" />
          <stop offset="35%" stopColor="rgba(244, 114, 182, 0.7)" />
          <stop offset="75%" stopColor="rgba(192, 132, 252, 0.6)" />
          <stop offset="100%" stopColor="rgba(250, 204, 21, 0.8)" />
        </linearGradient>

        {/* Magic Wand Star Burst Glow */}
        <radialGradient id="wandStarGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="35%" stopColor="#fef08a" />
          <stop offset="70%" stopColor="#f472b6" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>

      {/* Outer Glowing Magical Backlight */}
      <circle cx="80" cy="80" r="72" fill="url(#fairyAuraGrad)" />

      {/* LUMINOUS CRYSTAL WINGS (BEHIND BODY) */}
      <g style={{ filter: 'drop-shadow(0 0 12px #f472b6) drop-shadow(0 0 22px #c084fc)' }}>
        {/* Left Upper Wing */}
        <path
          d="M 78 62 C 35 15 10 20 8 45 C 6 70 52 75 76 68 Z"
          fill="url(#fairyWingGrad)"
          stroke="#fbcfe8"
          strokeWidth="1.2"
        />

        {/* Right Upper Wing */}
        <path
          d="M 82 62 C 125 15 150 20 152 45 C 154 70 108 75 84 68 Z"
          fill="url(#fairyWingGrad)"
          stroke="#fbcfe8"
          strokeWidth="1.2"
        />

        {/* Left Lower Wing */}
        <path d="M 78 68 C 30 75 25 105 45 120 C 65 125 75 95 78 76 Z" fill="url(#fairyWingGrad)" stroke="#facc15" strokeWidth="1" opacity="0.85" />
        {/* Right Lower Wing */}
        <path d="M 82 68 C 130 75 135 105 115 120 C 95 125 85 95 82 76 Z" fill="url(#fairyWingGrad)" stroke="#facc15" strokeWidth="1" opacity="0.85" />
      </g>

      {/* SHORT BOUNCY CURLY GOLDEN HAIR */}
      <g className="fairy-curly-hair" fill="none" strokeLinecap="round">
        {/* Base Volume */}
        <path d="M 72 37 C 62 30 58 42 62 52 C 65 60 74 62 76 56" stroke="#fbbf24" strokeWidth="5" opacity="0.95" />
        {/* Curl Ringlets & Wisps */}
        <path d="M 78 34 C 70 28 62 34 65 42 C 68 46 75 42 74 38" stroke="#fef08a" strokeWidth="3" />
        <path d="M 72 40 C 60 38 56 48 60 55 C 64 60 72 58 70 52" stroke="#fbbf24" strokeWidth="3.5" />
        <path d="M 68 50 C 58 52 56 62 64 66 C 70 65 72 58 68 54" stroke="#fef08a" strokeWidth="2.5" />
        <path d="M 82 35 C 88 30 94 36 90 42 C 86 46 80 42 82 38" stroke="#fbbf24" strokeWidth="3" />
        <path d="M 76 32 C 80 27 86 31 84 36" stroke="#fef08a" strokeWidth="2.5" />
      </g>

      {/* FAIRY BODY */}
      <g>
        {/* Slender Ballet Legs */}
        <path d="M 76 90 Q 72 112 68 132 M 84 90 Q 86 112 90 130" stroke="#fed7aa" strokeWidth="3.5" strokeLinecap="round" fill="none" />

        {/* Floating Layered Pink Dress / Skirt */}
        <path d="M 74 64 C 55 85 62 96 80 96 C 98 96 105 85 86 64 Z" fill="#ec4899" style={{ filter: 'drop-shadow(0 4px 10px rgba(236, 72, 153, 0.6))' }} />
        <path d="M 76 64 C 62 80 68 90 80 92 C 92 90 98 80 84 64 Z" fill="#f472b6" opacity="0.8" />

        {/* Bodice / Corset */}
        <path d="M 75 50 Q 80 47 85 50 L 86 64 L 74 64 Z" fill="#f472b6" />

        {/* Slender Neck & Head */}
        <ellipse cx="80" cy="42" rx="6" ry="7" fill="#fed7aa" />

        {/* Left Arm Resting Softly */}
        <path d="M 74 52 Q 65 62 68 70" fill="none" stroke="#fed7aa" strokeWidth="2.5" strokeLinecap="round" />

        {/* Right Arm Reaching Forward Holding Magic Wand */}
        <path d="M 86 52 Q 98 44 110 36" fill="none" stroke="#fed7aa" strokeWidth="2.5" strokeLinecap="round" />
        {/* Hand */}
        <circle cx="110" cy="36" r="2" fill="#fed7aa" />
      </g>

      {/* MAGIC WAND (HELD NATURALLY IN RIGHT HAND AT 110, 36) */}
      <g>
        {/* Wand Handle & Shaft */}
        <line x1="102" y1="42" x2="124" y2="24" stroke="#facc15" strokeWidth="2" strokeLinecap="round" />

        {/* Wand Star Tip & Glow */}
        <circle cx="124" cy="24" r="18" fill="url(#wandStarGlow)" />
        <polygon points="124,12 127,20 136,24 127,28 124,36 121,28 112,24 121,20" fill="#ffffff" style={{ filter: 'drop-shadow(0 0 12px #ffffff)' }} />
      </g>

      {/* Ambient Fairy Sparkles */}
      <circle cx="24" cy="35" r="2.5" fill="#fef08a" style={{ filter: 'drop-shadow(0 0 5px #fef08a)' }} />
      <circle cx="140" cy="72" r="2.2" fill="#f472b6" style={{ filter: 'drop-shadow(0 0 4px #f472b6)' }} />
      <circle cx="40" cy="115" r="2.5" fill="#ffffff" style={{ filter: 'drop-shadow(0 0 4px #ffffff)' }} />
      <circle cx="120" cy="122" r="3" fill="#fef08a" style={{ filter: 'drop-shadow(0 0 6px #fef08a)' }} />
    </svg>
  );
}

// Correct Upright Rotation: Head always leads direction of travel (vx, vy), back always points UP
function getUprightTransform(vx, vy, extraScaleY = 1) {
  const deg = (Math.atan2(vy, vx) * 180) / Math.PI;
  const isFacingLeft = vx < 0;
  const scaleY = isFacingLeft ? -extraScaleY : extraScaleY;

  return `translate3d(-50%, -50%, 0) rotate(${deg}deg) scaleY(${scaleY})`;
}

export default function ScriptedPinkySharkBackground({ currentTrack, currentTime = 0, isPlaying }) {
  const vinylCenterRef = useRef({ x: 50, y: 50, rx: 20, ry: 15 });
  const currentTimeRef = useRef(currentTime);
  const animFrameRef = useRef(null);

  const bgSharkRefs = useRef([]);
  const fgSharkRefs = useRef([]);
  const fairyRef = useRef(null);

  // Static Sharks Configuration Data with Outward Expanded Orbit Radii
  const sharksData = useMemo(() => {
    const arr = [];
    const count = 18;
    for (let i = 0; i < count; i++) {
      let spawnTime = 22;
      if (i >= 4 && i < 10) spawnTime = 48;
      else if (i >= 10) spawnTime = 91; // Wave 3 joins at first re-swarm "Aiming for my skin" (91s / 01:31)

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
        scatterAngle: (i / count) * Math.PI * 2 + (i % 2 === 0 ? 0.35 : -0.35),
      });
    }
    return arr;
  }, []);

  // Efficient Layout Tracking with ResizeObserver
  useEffect(() => {
    const updateVinylPosition = () => {
      const el = document.querySelector('.vinyl-container') || document.querySelector('.vinyl-outer-ring');
      if (el) {
        const rect = el.getBoundingClientRect();
        const centerX = ((rect.left + rect.width / 2) / window.innerWidth) * 100;
        const centerY = ((rect.top + rect.height / 2) / window.innerHeight) * 100;
        const radiusX = ((rect.width / 2) / window.innerWidth) * 100 + 6; // Base orbit starts 6vw clear of record rim
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

  // Keep internal time synced on audio Seek / Track change / Resume
  useEffect(() => {
    if (typeof currentTime === 'number') {
      currentTimeRef.current = currentTime;
    }
  }, [currentTime]);

  // Smooth 60fps requestAnimationFrame Engine
  useEffect(() => {
    let lastPerfTime = performance.now();

    const renderFrame = (now) => {
      const delta = (now - lastPerfTime) / 1000;
      lastPerfTime = now;

      if (isPlaying) {
        currentTimeRef.current += delta;
      }

      const time = currentTimeRef.current;
      const secTime = Math.floor(time);
      const { x: centerX, y: centerY, rx: baseRx, ry: baseRy } = vinylCenterRef.current;

      // Calculate Story Phase Timeline:
      // 0s-22s: Stage 0
      // 22s-48s: Stage 1 (Wave 1 swim-in)
      // 48s-77s: Stage 2 (Wave 2 swim-in)
      // 77s-91s: Stage 3 (Linear patrol lines)
      // 91s-118s: Stage 4 (First re-swarm vinyl circle on "Aiming for my skin")
      // 118s-142s: Return to Stage 3 (Linear patrol lines right after "Make them go away")
      // 142s-180s: Return to Stage 4 (Re-swarm vinyl circle just before "so watch out")
      // 180s+: Stage 5 (Fairy sequential hunting arc & vinyl upper-left hover)
      let phase = 0;
      if (secTime >= 180) phase = 5;
      else if (secTime >= 142) phase = 4;
      else if (secTime >= 118) phase = 3;
      else if (secTime >= 91) phase = 4;
      else if (secTime >= 77) phase = 3;
      else if (secTime >= 48) phase = 2;
      else if (secTime >= 22) phase = 1;

      const huntStartTime = 180.0;
      const huntDurationPerShark = 1.9; // ~1.9s per hunted shark

      // Update Sharks Positions & Upright Rotations via direct DOM styling
      sharksData.forEach((shark, i) => {
        const bgEl = bgSharkRefs.current[i];
        const fgEl = fgSharkRefs.current[i];

        if (time < shark.spawnTime) {
          if (bgEl) bgEl.style.display = 'none';
          if (fgEl) fgEl.style.display = 'none';
          return;
        }

        let x = 0;
        let y = 0;
        let transformStr = '';
        let isInFront = false;

        if (phase >= 5) {
          // Sequential Fairy Attack & Hunting Phase (180s+)
          const huntElapsed = Math.max(0, time - huntStartTime);
          const sharkTouchTime = (i + 1) * huntDurationPerShark;
          const isTouched = huntElapsed >= sharkTouchTime;

          if (isTouched) {
            // Touched by Fairy! Flee off-screen at high speed along scatter angle
            const fleeElapsed = huntElapsed - sharkTouchTime;
            const fleeDist = fleeElapsed * 45;

            x = centerX + Math.cos(shark.scatterAngle) * (baseRx + 15 + fleeDist);
            y = centerY + Math.sin(shark.scatterAngle) * (baseRy + 15 + fleeDist);
            const vx = Math.cos(shark.scatterAngle);
            const vy = Math.sin(shark.scatterAngle);
            transformStr = getUprightTransform(vx, vy, -1);
            isInFront = true;
          } else {
            // Still orbiting until Fairy arrives to hunt this shark
            const angle = shark.baseAngle + time * shark.speedMultiplier * 0.8;
            const rx = baseRx + shark.radiusOffset;
            const ry = baseRy + shark.radiusOffset * 0.7;

            x = centerX + Math.cos(angle) * rx;
            y = centerY + Math.sin(angle) * ry;
            isInFront = Math.sin(angle) >= 0;

            const vx = -Math.sin(angle) * rx;
            const vy = Math.cos(angle) * ry;
            transformStr = getUprightTransform(vx, vy);
          }
        } else if (phase === 3) {
          // Stage 3: Linear Patrol Lines Across Screen ("Swarm Plotting")
          const stage3StartTime = time >= 118.0 ? 118.0 : 77.0;
          const lineTime = time - stage3StartTime;
          const rawX = ((lineTime * shark.lineSpeed + shark.id * 35) % 160) - 30;
          const lineX = shark.lineDir === 1 ? rawX : 100 - rawX;
          const lineY = shark.lineY;

          const transitionProgress = Math.min(1.0, lineTime / 2.5);

          const orbitAngle = shark.baseAngle + stage3StartTime * shark.speedMultiplier * 0.8;
          const orbitRx = baseRx + shark.radiusOffset;
          const orbitRy = baseRy + shark.radiusOffset * 0.7;
          const orbitX = centerX + Math.cos(orbitAngle) * orbitRx;
          const orbitY = centerY + Math.sin(orbitAngle) * orbitRy;

          x = orbitX + (lineX - orbitX) * transitionProgress;
          y = orbitY + (lineY - orbitY) * transitionProgress;

          const vx = shark.lineDir === 1 ? 1 : -1;
          const vy = 0;
          transformStr = getUprightTransform(vx, vy);
          isInFront = true;
        } else {
          // Stages 1, 2, and 4 -> Orbiting around Vinyl Record Disc
          const angle = shark.baseAngle + time * shark.speedMultiplier * 0.8;
          const rx = baseRx + shark.radiusOffset;
          const ry = baseRy + shark.radiusOffset * 0.7;

          const targetX = centerX + Math.cos(angle) * rx;
          const targetY = centerY + Math.sin(angle) * ry;

          const stage4StartTime = time >= 142.0 ? 142.0 : 91.0;
          if (phase === 4 && (time - stage4StartTime) < 3.0 && shark.spawnTime < stage4StartTime) {
            // Smooth 3s transition from Linear Lines back to Vinyl Circle for existing sharks
            const returnProgress = (time - stage4StartTime) / 3.0;
            const prevStage3Start = stage4StartTime === 142.0 ? 118.0 : 77.0;
            const lineTime = stage4StartTime - prevStage3Start;
            const rawX = ((lineTime * shark.lineSpeed + shark.id * 35) % 160) - 30;
            const lineX = shark.lineDir === 1 ? rawX : 100 - rawX;
            const lineY = shark.lineY;

            x = lineX + (targetX - lineX) * returnProgress;
            y = lineY + (targetY - lineY) * returnProgress;

            const vx = targetX - lineX;
            const vy = targetY - lineY;
            transformStr = getUprightTransform(vx, vy);
            isInFront = true;
          } else {
            // Check initial entry swim-in for this shark's spawnTime
            const entryDuration = 4.0;
            const entryProgress = Math.min(1.0, Math.max(0.0, (time - shark.spawnTime) / entryDuration));

            if (entryProgress < 1.0) {
              x = shark.startX + (targetX - shark.startX) * entryProgress;
              y = shark.startY + (targetY - shark.startY) * entryProgress;
              const vx = targetX - shark.startX;
              const vy = targetY - shark.startY;
              transformStr = getUprightTransform(vx, vy);
              isInFront = true;
            } else {
              x = targetX;
              y = targetY;
              isInFront = Math.sin(angle) >= 0;
              const vx = -Math.sin(angle) * rx;
              const vy = Math.cos(angle) * ry;
              transformStr = getUprightTransform(vx, vy);
            }
          }
        }

        if (isInFront) {
          if (bgEl) bgEl.style.display = 'none';
          if (fgEl) {
            fgEl.style.display = 'block';
            fgEl.style.left = `${x}vw`;
            fgEl.style.top = `${y}vh`;
            fgEl.style.transform = transformStr;
          }
        } else {
          if (fgEl) fgEl.style.display = 'none';
          if (bgEl) {
            bgEl.style.display = 'block';
            bgEl.style.left = `${x}vw`;
            bgEl.style.top = `${y}vh`;
            bgEl.style.transform = transformStr;
          }
        }
      });

      // Update Fairy Position & Hover Logic
      if (fairyRef.current) {
        let fairyX = -200;
        let fairyY = -200;
        let fairyOpacity = 0;

        if (phase >= 5) {
          fairyOpacity = 1.0;
          const huntElapsed = Math.max(0, time - huntStartTime);
          const totalHuntTime = sharksData.length * huntDurationPerShark;

          if (huntElapsed < totalHuntTime) {
            // Currently hunting target shark in sequence
            const currentHuntIndex = Math.min(sharksData.length - 1, Math.floor(huntElapsed / huntDurationPerShark));
            const targetShark = sharksData[currentHuntIndex];

            const targetAngle = targetShark.baseAngle + time * targetShark.speedMultiplier * 0.8;
            const targetRx = baseRx + targetShark.radiusOffset;
            const targetRy = baseRy + targetShark.radiusOffset * 0.7;

            const sharkX = centerX + Math.cos(targetAngle) * targetRx;
            const sharkY = centerY + Math.sin(targetAngle) * targetRy;

            const subProgress = (huntElapsed % huntDurationPerShark) / huntDurationPerShark;

            // Start position from previous target or entry point
            let prevX = centerX - baseRx - 15;
            let prevY = centerY - baseRy - 15;
            if (currentHuntIndex > 0) {
              const prevShark = sharksData[currentHuntIndex - 1];
              const prevAngle = prevShark.baseAngle + time * prevShark.speedMultiplier * 0.8;
              prevX = centerX + Math.cos(prevAngle) * (baseRx + prevShark.radiusOffset);
              prevY = centerY + Math.sin(prevAngle) * (baseRy + prevShark.radiusOffset * 0.7);
            }

            fairyX = prevX + (sharkX - prevX) * Math.min(1.0, subProgress * 1.2);
            fairyY = prevY + (sharkY - prevY) * Math.min(1.0, subProgress * 1.2);
          } else {
            // Hunt Complete! Hover closer to the vinyl record rim
            const hoverElapsed = huntElapsed - totalHuntTime;
            const targetHoverX = centerX - baseRx * 0.55;
            const targetHoverY = centerY - baseRy * 0.55;

            const lastShark = sharksData[sharksData.length - 1];
            const lastAngle = lastShark.baseAngle + time * lastShark.speedMultiplier * 0.8;
            const startHoverX = centerX + Math.cos(lastAngle) * (baseRx + lastShark.radiusOffset);
            const startHoverY = centerY + Math.sin(lastAngle) * (baseRy + lastShark.radiusOffset * 0.7);

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
  }, [isPlaying, sharksData]);

  return (
    <>
      {/* 1. BACKGROUND CANVAS LAYER (z-index: 0, behind vinyl record disc) */}
      <div className="pinky-shark-canvas-bg" aria-hidden="true">
        {/* Forest & Blue Sky Layer */}
        <ForestBackgroundSvg />

        {sharksData.map((shark, i) => (
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

      {/* 2. FOREGROUND CANVAS LAYER (z-index: 999, in front of vinyl record disc) */}
      <div className="pinky-shark-canvas-fg" aria-hidden="true">
        {sharksData.map((shark, i) => (
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

        {/* Hero Fairy (Sized up to 120px x 120px) */}
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
