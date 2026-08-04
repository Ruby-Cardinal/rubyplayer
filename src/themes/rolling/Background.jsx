import React, { useEffect, useState } from 'react';

function DeciduousTreeSvg() {
  return (
    <svg viewBox="-12 -15 100 145" className="roadside-svg" style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id="deciduousTrunk" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#1a110e" />
          <stop offset="50%" stopColor="#2b1102" />
          <stop offset="100%" stopColor="#0f0600" />
        </linearGradient>
        <linearGradient id="leafGradMain" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#14532d" />
          <stop offset="60%" stopColor="#064e3b" />
          <stop offset="100%" stopColor="#022c22" />
        </linearGradient>
      </defs>

      <path d="M 33 60 L 28 120 L 47 120 L 42 60 Z" fill="url(#deciduousTrunk)" />
      <path d="M 35 68 L 18 52 M 40 72 L 57 55 M 37 58 L 26 42 M 38 52 L 48 38" stroke="#1f0d07" strokeWidth="4" strokeLinecap="round" />

      <circle cx="37" cy="55" r="28" fill="#022c22" />
      <circle cx="20" cy="48" r="24" fill="#052e16" />
      <circle cx="53" cy="48" r="24" fill="#052e16" />

      <circle cx="37" cy="42" r="26" fill="url(#leafGradMain)" />
      <circle cx="18" cy="40" r="22" fill="#064e3b" />
      <circle cx="57" cy="40" r="22" fill="#064e3b" />
      <circle cx="28" cy="28" r="22" fill="#14532d" />
      <circle cx="47" cy="28" r="22" fill="#14532d" />

      <circle cx="37" cy="18" r="20" fill="#166534" />
      <circle cx="25" cy="22" r="16" fill="#15803d" />
      <circle cx="50" cy="22" r="16" fill="#15803d" />
      <circle cx="37" cy="12" r="14" fill="#166534" />
    </svg>
  );
}

function PineTreeSvg() {
  return (
    <svg viewBox="-12 -15 95 150" className="roadside-svg" style={{ overflow: 'visible' }}>
      <rect x="31" y="75" width="8" height="55" fill="#271c19" />
      <polygon points="35,4 8,42 62,42" fill="#022c22" />
      <polygon points="35,24 6,60 64,60" fill="#052e16" />
      <polygon points="35,42 4,78 66,78" fill="#064e3b" />
      <polygon points="35,60 2,95 68,95" fill="#14532d" />
      <polygon points="35,4 35,42 62,42" fill="#011913" opacity="0.5" />
      <polygon points="35,24 35,60 64,60" fill="#022c22" opacity="0.4" />
      <polygon points="35,42 35,78 66,78" fill="#064e3b" opacity="0.3" />
    </svg>
  );
}

function AutumnTreeSvg() {
  return (
    <svg viewBox="-12 -15 100 145" className="roadside-svg" style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id="autumnTrunk" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#1a110e" />
          <stop offset="50%" stopColor="#2b1102" />
          <stop offset="100%" stopColor="#0f0600" />
        </linearGradient>
      </defs>

      <path d="M 33 60 L 28 120 L 47 120 L 42 60 Z" fill="url(#autumnTrunk)" />
      <path d="M 35 68 L 18 52 M 40 72 L 57 55 M 37 58 L 26 42" stroke="#1f0d07" strokeWidth="4" strokeLinecap="round" />

      <circle cx="37" cy="55" r="28" fill="#450a0a" />
      <circle cx="20" cy="48" r="24" fill="#7f1d1d" />
      <circle cx="55" cy="48" r="24" fill="#7f1d1d" />

      <circle cx="37" cy="42" r="26" fill="#991b1b" />
      <circle cx="18" cy="38" r="22" fill="#991b1b" />
      <circle cx="57" cy="38" r="22" fill="#991b1b" />

      <circle cx="37" cy="24" r="22" fill="#b91c1c" />
      <circle cx="25" cy="22" r="16" fill="#c2410c" />
      <circle cx="50" cy="22" r="16" fill="#c2410c" />
    </svg>
  );
}

function RoadSignSvg() {
  return (
    <svg viewBox="-10 -15 110 110" className="roadside-svg" style={{ overflow: 'visible' }}>
      <rect x="22" y="35" width="4" height="55" fill="#475569" />
      <rect x="74" y="35" width="4" height="55" fill="#475569" />

      <rect x="5" y="8" width="90" height="38" rx="4" fill="#14532d" stroke="#e2e8f0" strokeWidth="2" />
      <rect x="7" y="10" width="86" height="34" rx="3" fill="none" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="1" />

      <text x="50" y="23" fill="#ffffff" fontSize="9.5" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif" letterSpacing="0.5">
        HOME
      </text>
      <text x="50" y="36" fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif" letterSpacing="0.3">
        NEXT EXIT
      </text>
    </svg>
  );
}

function BarnSvg() {
  return (
    <svg viewBox="-10 -15 100 85" className="roadside-svg" style={{ overflow: 'visible' }}>
      <polygon points="5,32 5,75 95,75 95,32 75,18 50,5 25,18" fill="#7f1d1d" stroke="#450a0a" strokeWidth="2" />
      <polygon points="5,32 50,5 95,32 75,18 25,18" fill="#581c87" opacity="0.3" />
      <polygon points="5,32 50,5 95,32 75,18 25,18" fill="#6b21a8" opacity="0.1" />

      <rect x="34" y="44" width="32" height="31" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />
      <line x1="34" y1="44" x2="66" y2="75" stroke="#7f1d1d" strokeWidth="2.5" />
      <line x1="66" y1="44" x2="34" y2="75" stroke="#7f1d1d" strokeWidth="2.5" />
      <line x1="50" y1="44" x2="50" y2="75" stroke="#450a0a" strokeWidth="1.5" />

      <polygon points="50,14 40,24 60,24" fill="#ffffff" stroke="#94a3b8" strokeWidth="1" />
      <line x1="50" y1="14" x2="50" y2="24" stroke="#7f1d1d" strokeWidth="1.5" />
      <line x1="42" y1="20" x2="58" y2="20" stroke="#7f1d1d" strokeWidth="1.5" />

      <line x1="50" y1="5" x2="50" y2="-6" stroke="#334155" strokeWidth="1.5" />
      <polygon points="50,-6 45,-2 55,-2" fill="#d97706" />
    </svg>
  );
}

function WindmillSvg() {
  return (
    <svg viewBox="-10 -15 80 115" className="roadside-svg" style={{ overflow: 'visible' }}>
      <polygon points="25,25 35,25 40,95 20,95" fill="#475569" />
      <line x1="25" y1="25" x2="40" y2="95" stroke="#1e293b" strokeWidth="1" />
      <line x1="35" y1="25" x2="20" y2="95" stroke="#1e293b" strokeWidth="1" />
      <g style={{ transformOrigin: '30px 25px', animation: 'spinBlades 6s linear infinite' }}>
        <circle cx="30" cy="25" r="4" fill="#020617" />
        <line x1="30" y1="25" x2="30" y2="2" stroke="#64748b" strokeWidth="2.5" />
        <line x1="30" y1="25" x2="30" y2="48" stroke="#64748b" strokeWidth="2.5" />
        <line x1="30" y1="25" x2="7" y2="25" stroke="#64748b" strokeWidth="2.5" />
        <line x1="30" y1="25" x2="53" y2="25" stroke="#64748b" strokeWidth="2.5" />
      </g>
    </svg>
  );
}

function CloudSvg() {
  return (
    <svg viewBox="0 0 100 40" className="cloud-svg" style={{ overflow: 'visible' }}>
      <path
        d="M 10 30 Q 0 30 5 20 Q 10 10 25 12 Q 35 0 55 5 Q 70 0 80 12 Q 95 10 95 24 Q 100 30 90 30 Z"
        fill="rgba(255, 255, 255, 0.12)"
      />
    </svg>
  );
}

export default function RollingBackground() {
  const [scenery, setScenery] = useState([]);
  const [clouds, setClouds] = useState([]);
  const [stars, setStars] = useState([]);

  useEffect(() => {
    // 1. GENERATE TWINKLING NIGHT SKY STARS
    const starCount = 65;
    const generatedStars = [];
    for (let s = 0; s < starCount; s++) {
      generatedStars.push({
        id: s,
        top: 2 + Math.random() * 38,
        left: Math.random() * 98,
        size: 1.5 + Math.random() * 2.2,
        opacity: 0.35 + Math.random() * 0.55,
        duration: 3.0 + Math.random() * 4.5,
        delay: -Math.random() * 5.0,
      });
    }
    setStars(generatedStars);

    // 2. GENERATE CONTINUOUS SCENERY
    const generated = [];

    // EXACTLY ONE GREEN HIGHWAY SIGN READING "HOME NEXT EXIT"
    generated.push({
      id: 'single-home-next-exit-sign',
      type: 'sign',
      dist: 0.0,
      size: 95,
      bottom: 34.5,
      duration: 21.0,
      delay: -6.0,
      zIndex: 100,
    });

    // TWO BIG RED BARNS
    generated.push({
      id: 'red-barn-1',
      type: 'barn',
      dist: 0.35,
      size: 96,
      bottom: 38.5,
      duration: 47.0,
      delay: -12.0,
      zIndex: 65,
    });
    generated.push({
      id: 'red-barn-2',
      type: 'barn',
      dist: 0.50,
      size: 82,
      bottom: 40.5,
      duration: 58.0,
      delay: -35.0,
      zIndex: 50,
    });

    // TREES & WINDMILLS
    const treeTypes = ['deciduous', 'pine', 'autumn'];
    for (let i = 0; i < 38; i++) {
      const dist = Math.random() * 0.95;
      const isWindmill = i % 9 === 0 && dist > 0.4;
      const type = isWindmill ? 'windmill' : treeTypes[i % treeTypes.length];

      const bottom = 34.5 + dist * 12.5;
      const size = (1.0 - dist * 0.82) * (85 + Math.random() * 30);
      const duration = 21.0 + dist * 74.0;
      const delay = -Math.random() * duration;
      const zIndex = Math.floor((1.0 - dist) * 100);

      generated.push({
        id: `tree-item-${i}`,
        type,
        dist,
        size,
        bottom,
        duration,
        delay,
        zIndex,
      });
    }

    setScenery(generated);

    // Sky Clouds
    const cloudCount = 10;
    const generatedClouds = [];

    for (let c = 0; c < cloudCount; c++) {
      const cSize = 90 + Math.random() * 90;
      const cTop = 3 + Math.random() * 22;
      const cDuration = 120.0;
      const cDelay = -Math.random() * cDuration;

      generatedClouds.push({
        id: c,
        size: cSize,
        top: cTop,
        duration: cDuration,
        delay: cDelay,
      });
    }
    setClouds(generatedClouds);
  }, []);

  return (
    <div className="rolling-theme-canvas" aria-hidden="true">
      {/* Dark Sky Gradient */}
      <div className="rolling-sky" />

      {/* Twinkling Night Sky Stars */}
      <div className="rolling-stars-container">
        {stars.map((s) => (
          <div
            key={s.id}
            className="rolling-star"
            style={{
              top: `${s.top}%`,
              left: `${s.left}%`,
              width: `${s.size}px`,
              height: `${s.size}px`,
              opacity: s.opacity,
              animationDuration: `${s.duration}s`,
              animationDelay: `${s.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Floating Sky Clouds */}
      <div className="rolling-clouds-container">
        {clouds.map((c) => (
          <div
            key={c.id}
            className="rolling-cloud-wrapper"
            style={{
              top: `${c.top}%`,
              width: `${c.size}px`,
              animationDuration: `${c.duration}s`,
              animationDelay: `${c.delay}s`,
            }}
          >
            <CloudSvg />
          </div>
        ))}
      </div>

      {/* Atmospheric Horizon Glow behind Mountains */}
      <div className="rolling-horizon-glow" />

      {/* Snow-Capped Alpine Mountain Range with Slope-Matched Darker Snow */}
      <div className="rolling-mountains">
        <svg viewBox="0 0 1200 140" preserveAspectRatio="none" className="mountains-svg">
          {/* Main Dark Mountain Base Silhouette */}
          <polygon points="0,140 0,65 150,15 300,75 450,10 600,68 750,18 900,72 1050,12 1200,60 1200,140" fill="#1e293b" />
          <polygon points="0,140 0,85 200,45 380,95 620,40 820,90 980,48 1200,82 1200,140" fill="#0f172a" opacity="0.85" />

          {/* Peak 1 (Apex: 150, 15) - Slopes match left (78,39) and right (210,39) */}
          <polygon points="150,15 78,39 125,32 150,43 175,32 210,39" fill="#cbd5e1" />
          <polygon points="150,15 150,43 175,32 210,39" fill="#64748b" />

          {/* Peak 2 (Apex: 450, 10) - Slopes match left (390,36) and right (517,36) */}
          <polygon points="450,10 390,36 425,30 450,40 475,30 517,36" fill="#cbd5e1" />
          <polygon points="450,10 450,40 475,30 517,36" fill="#64748b" />

          {/* Peak 3 (Apex: 750, 18) - Slopes match left (678,42) and right (817,42) */}
          <polygon points="750,18 678,42 720,35 750,45 780,35 817,42" fill="#cbd5e1" />
          <polygon points="750,18 750,45 780,35 817,42" fill="#64748b" />

          {/* Peak 4 (Apex: 1050, 12) - Slopes match left (988,37) and right (1128,37) */}
          <polygon points="1050,12 988,37 1025,31 1050,41 1075,31 1128,37" fill="#cbd5e1" />
          <polygon points="1050,12 1050,41 1075,31 1128,37" fill="#64748b" />
        </svg>
      </div>

      {/* Continuous Parallax Scenery Field */}
      <div className="rolling-scenery-field">
        {scenery.map((item) => (
          <div
            key={item.id}
            className={`rolling-item-wrapper ${item.dist > 0.4 ? 'distant-item' : 'roadside-item'}`}
            style={{
              bottom: `${item.bottom}vh`,
              width: `${item.size}px`,
              height: `${item.size * 1.55}px`,
              zIndex: item.zIndex,
              animationDuration: `${item.duration}s`,
              animationDelay: `${item.delay}s`,
            }}
          >
            {item.type === 'deciduous' && <DeciduousTreeSvg />}
            {item.type === 'pine' && <PineTreeSvg />}
            {item.type === 'autumn' && <AutumnTreeSvg />}
            {item.type === 'sign' && <RoadSignSvg />}
            {item.type === 'barn' && <BarnSvg />}
            {item.type === 'windmill' && <WindmillSvg />}
          </div>
        ))}
      </div>

      {/* Asphalt Road Track */}
      <div className="rolling-road-container">
        <div className="rolling-asphalt">
          {/* Dashed Centerline */}
          <div className="rolling-road-dashes" />
        </div>
      </div>
    </div>
  );
}
