import React, { useEffect, useState } from 'react';

function DuckSvg({ flapSpeed = '0.45s', glow = true }) {
  return (
    <svg
      viewBox="0 0 56 42"
      className="duck-bird-svg"
      style={{
        width: '100%',
        height: '100%',
        filter: glow
          ? 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.8)) drop-shadow(0 3px 8px rgba(0, 0, 0, 0.45))'
          : 'none',
      }}
    >
      <defs>
        <linearGradient id="duckBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="65%" stopColor="#f1f5f9" />
          <stop offset="100%" stopColor="#cbd5e1" />
        </linearGradient>

        {/* Far Wing Gradient (Darker Shaded / Other Side) */}
        <linearGradient id="duckWingFarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="70%" stopColor="#e2e8f0" />
          <stop offset="100%" stopColor="#cbd5e1" />
        </linearGradient>

        {/* Near Wing Gradient (Bright Foreground / Near Side) */}
        <linearGradient id="duckWingNearGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="70%" stopColor="#e2e8f0" />
          <stop offset="100%" stopColor="#cbd5e1" />
        </linearGradient>
      </defs>

      {/* 1. FAR WING (On the OTHER side of body - Darker & Attached behind back) */}
      <g
        className="duck-far-wing"
        style={{
          transformOrigin: '24px 16px',
          animation: `duckWingFlapFar ${flapSpeed} ease-in-out infinite alternate`,
        }}
      >
        <path
          d="M 24 16 C 15 -1 4 0 1 7 C -1 12 7 15 24 16 Z"
          fill="url(#duckWingFarGrad)"
          stroke="#475569"
          strokeWidth="0.5"
          opacity="0.9"
        />
        <path
          d="M 24 16 C 17 2 7 2 5 8 C 6 12 13 15 24 16 Z"
          fill="url(#duckWingFarGrad)"
          opacity="0.8"
        />
      </g>

      {/* 2. TAIL FEATHERS */}
      <path d="M 8 20 Q 1 13 3 20 Q 1 24 9 24 Z" fill="#cbd5e1" />

      {/* 3. MAIN BODY & HEAD (Occludes the Far Wing) */}
      {/* Main Torso */}
      <path
        d="M 10 21 C 10 31 35 33 42 22 C 46 16 39 12 33 16 C 24 18 14 15 10 21 Z"
        fill="url(#duckBodyGrad)"
      />

      {/* Head & Neck */}
      <path
        d="M 30 17 Q 36 8 42 8 C 48 8 49 17 40 20 Z"
        fill="url(#duckBodyGrad)"
      />

      {/* Orange Beak */}
      <path
        d="M 46 11 Q 54 11 53 15 Q 46 16 44 14 Z"
        fill="#f97316"
      />

      {/* Eye */}
      <circle cx="44" cy="11" r="1.6" fill="#0f172a" />
      <circle cx="44.4" cy="10.6" r="0.6" fill="#ffffff" />

      {/* 4. NEAR WING (On THIS side of body - Bright White Foreground) */}
      <g
        className="duck-near-wing"
        style={{
          transformOrigin: '28px 21px',
          animation: `duckWingFlapNear ${flapSpeed} ease-in-out infinite alternate`,
        }}
      >
        <path
          d="M 28 21 C 18 3 5 3 2 10 C 1 15 10 19 28 21 Z"
          fill="url(#duckWingNearGrad)"
          stroke="#cbd5e1"
          strokeWidth="0.6"
        />
        <path
          d="M 28 21 C 20 6 8 6 5 12 C 7 16 15 19 28 21 Z"
          fill="url(#duckWingNearGrad)"
          opacity="0.85"
        />
      </g>
    </svg>
  );
}

function ChickenSvg({ flapSpeed = '0.4s', glow = true }) {
  return (
    <svg
      viewBox="0 0 56 44"
      className="chicken-bird-svg"
      style={{
        width: '100%',
        height: '100%',
        filter: glow
          ? 'drop-shadow(0 0 9px rgba(60, 60, 60, 0.85)) drop-shadow(0 3px 8px rgba(0, 0, 0, 0.65))'
          : 'none',
      }}
    >
      <defs>
        <linearGradient id="chickenBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#52525b" />
          <stop offset="50%" stopColor="#3f3f46" />
          <stop offset="100%" stopColor="#18181b" />
        </linearGradient>

        {/* Far Wing Gradient (Darker Shaded / Other Side) */}
        <linearGradient id="chickenWingFarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#71717a" />
          <stop offset="100%" stopColor="#27272a" />
        </linearGradient>

        {/* Near Wing Gradient (Near Side Foreground) */}
        <linearGradient id="chickenWingNearGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#71717a" />
          <stop offset="100%" stopColor="#27272a" />
        </linearGradient>
      </defs>

      {/* 1. FAR WING (On OTHER side of body - Dark Charcoal behind back) */}
      <g
        className="chicken-far-wing"
        style={{
          transformOrigin: '23px 16px',
          animation: `chickenWingFlapFar ${flapSpeed} ease-in-out infinite alternate`,
        }}
      >
        <path
          d="M 23 16 C 14 -1 3 0 1 7 C -1 12 7 15 23 16 Z"
          fill="url(#chickenWingFarGrad)"
          stroke="#09090b"
          strokeWidth="0.5"
          opacity="0.95"
        />
        <path
          d="M 23 16 C 16 2 6 2 4 8 C 5 12 12 15 23 16 Z"
          fill="url(#chickenWingFarGrad)"
          opacity="0.8"
        />
      </g>

      {/* 2. TAIL TUFT FEATHERS */}
      <path d="M 7 20 Q 1 9 9 14 Q 2 16 8 21 Q 0 22 7 25 Z" fill="#18181b" />

      {/* 3. MAIN BODY & HEAD (Occludes Far Wing) */}
      {/* Plump Body */}
      <path
        d="M 9 22 C 8 33 32 35 40 24 C 44 17 39 12 33 16 C 23 18 12 15 9 22 Z"
        fill="url(#chickenBodyGrad)"
      />

      {/* Head */}
      <path
        d="M 31 17 Q 35 8 42 8 C 48 8 48 17 39 20 Z"
        fill="url(#chickenBodyGrad)"
      />

      {/* Red Comb */}
      <path
        d="M 38 8 Q 38 2 41 5 Q 43 1 45 5 Q 47 3 47 8 Z"
        fill="#ef4444"
      />

      {/* Red Wattle */}
      <path
        d="M 46 15 Q 49 19 46 21 Q 44 19 45 15 Z"
        fill="#dc2626"
      />

      {/* Pointy Yellow Beak */}
      <path
        d="M 46 11 L 54 13 L 46 15 Z"
        fill="#f59e0b"
      />

      {/* Eye */}
      <circle cx="43" cy="12" r="1.6" fill="#fef08a" />
      <circle cx="43.3" cy="11.7" r="0.7" fill="#09090b" />

      {/* 4. NEAR WING (On THIS side of body - Foreground Slate Grey) */}
      <g
        className="chicken-near-wing"
        style={{
          transformOrigin: '27px 20px',
          animation: `chickenWingFlapNear ${flapSpeed} ease-in-out infinite alternate`,
        }}
      >
        <path
          d="M 27 20 C 18 3 5 3 2 10 C 1 15 9 19 27 20 Z"
          fill="url(#chickenWingNearGrad)"
          stroke="#52525b"
          strokeWidth="0.6"
        />
        <path
          d="M 27 20 C 20 6 9 6 6 12 C 7 16 14 19 27 20 Z"
          fill="url(#chickenWingNearGrad)"
          opacity="0.85"
        />
      </g>
    </svg>
  );
}

export default function DucksChickensBackground() {
  const [birds, setBirds] = useState([]);

  useEffect(() => {
    const totalCount = 20;
    const generated = [];

    for (let i = 0; i < totalCount; i++) {
      const isDuck = i % 2 === 0;
      const isLeftToRight = Math.random() > 0.5;
      const size = 42 + Math.random() * 36;
      const duration = 11 + Math.random() * 16;
      const delay = -Math.random() * duration;
      const startY = 6 + Math.random() * 82;
      const waveAmplitude = 15 + Math.random() * 35;
      const flapSpeed = `${0.32 + Math.random() * 0.32}s`;
      const opacity = 0.65 + Math.random() * 0.35;

      generated.push({
        id: i,
        type: isDuck ? 'duck' : 'chicken',
        isLeftToRight,
        size,
        duration,
        delay,
        startY,
        waveAmplitude,
        flapSpeed,
        opacity,
      });
    }

    setBirds(generated);
  }, []);

  return (
    <div className="ducks-chickens-theme-canvas" aria-hidden="true">
      <div className="ducks-chickens-bg-overlay" />

      <div className="ducks-chickens-birds-container">
        {birds.map((b) => (
          <div
            key={b.id}
            className={`ducks-chickens-bird-wrapper ${b.isLeftToRight ? 'fly-left-to-right' : 'fly-right-to-left'}`}
            style={{
              top: `${b.startY}%`,
              width: `${b.size}px`,
              height: `${b.size * 0.75}px`,
              opacity: b.opacity,
              animationDuration: `${b.duration}s`,
              animationDelay: `${b.delay}s`,
              '--wave-amp': `${b.waveAmplitude}px`,
            }}
          >
            {b.type === 'duck' ? (
              <DuckSvg flapSpeed={b.flapSpeed} />
            ) : (
              <ChickenSvg flapSpeed={b.flapSpeed} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
