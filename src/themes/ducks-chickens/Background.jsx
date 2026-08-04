import React, { useEffect, useState } from 'react';

function DuckSvg({ flapSpeed = '0.45s', glow = true }) {
  return (
    <svg
      viewBox="0 0 64 56"
      className="duck-bird-svg"
      style={{
        width: '100%',
        height: '100%',
        filter: glow
          ? 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.85)) drop-shadow(0 3px 8px rgba(0, 0, 0, 0.45))'
          : 'none',
      }}
    >
      <defs>
        <linearGradient id="duckBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="70%" stopColor="#f8fafc" />
          <stop offset="100%" stopColor="#cbd5e1" />
        </linearGradient>

        <linearGradient id="duckWingFarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#e2e8f0" />
          <stop offset="60%" stopColor="#cbd5e1" />
          <stop offset="100%" stopColor="#94a3b8" />
        </linearGradient>

        <linearGradient id="duckWingNearGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="70%" stopColor="#f1f5f9" />
          <stop offset="100%" stopColor="#cbd5e1" />
        </linearGradient>
      </defs>

      {/* 1. FAR BIRD WING (High V-Shape Background Wing with Primary Feather Fan) */}
      <g
        className="duck-far-wing"
        style={{
          transformOrigin: '28px 30px',
          animation: `duckWingFlapFar ${flapSpeed} ease-in-out infinite alternate`,
        }}
      >
        <path
          d="M 28 30 L 16 8 L 12 11 L 9 15 L 7 20 L 6 25 L 8 29 L 14 33 Z"
          fill="url(#duckWingFarGrad)"
          stroke="#64748b"
          strokeWidth="0.5"
          opacity="0.92"
        />
        <path
          d="M 24 24 L 16 8 M 22 26 L 12 11 M 21 27 L 9 15 M 20 28 L 7 20"
          stroke="#94a3b8"
          strokeWidth="0.4"
          opacity="0.7"
        />
      </g>

      {/* 2. TAIL FEATHERS */}
      <path
        d="M 16 42 L 8 46 L 10 50 L 14 51 L 20 46 Z"
        fill="#cbd5e1"
        stroke="#94a3b8"
        strokeWidth="0.4"
      />

      {/* 3. TUCKED ORANGE FEET */}
      <g className="duck-tucked-feet">
        <path
          d="M 22 44 L 17 50 L 22 52 L 20 48 M 24 45 L 21 52 L 25 53"
          stroke="#f97316"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </g>

      {/* 4. MAIN BODY, CHEST, NECK & HEAD */}
      {/* Plump Body & Chest */}
      <path
        d="M 16 42 C 16 48 30 50 40 40 C 46 34 40 28 30 32 C 22 35 18 38 16 42 Z"
        fill="url(#duckBodyGrad)"
      />

      {/* Graceful Forward-Curving Duck Neck & Head */}
      <path
        d="M 32 31 C 38 27 44 24 53 25 C 58 25 60 30 52 34 C 44 37 36 36 32 31 Z"
        fill="url(#duckBodyGrad)"
      />

      {/* ORANGE DUCK/GOOSE BILL */}
      <path
        d="M 57 26 C 61 26 64 28 65 30 C 65 31 60 33 55 31 Z"
        fill="#f97316"
        stroke="#ea580c"
        strokeWidth="0.4"
      />
      <line x1="57" y1="29" x2="63" y2="30" stroke="#7c2d12" strokeWidth="0.5" />
      <circle cx="58.5" cy="27.8" r="0.4" fill="#7c2d12" />

      {/* EYE */}
      <circle cx="53" cy="28" r="1.5" fill="#0f172a" />
      <circle cx="53.3" cy="27.5" r="0.5" fill="#ffffff" />

      {/* 5. NEAR BIRD WING (Foreground High V-Wing with Fanned Primary Feathers) */}
      <g
        className="duck-near-wing"
        style={{
          transformOrigin: '30px 32px',
          animation: `duckWingFlapNear ${flapSpeed} ease-in-out infinite alternate`,
        }}
      >
        <path
          d="M 30 32 L 44 2 L 39 5 L 35 9 L 31 14 L 27 19 L 24 24 L 22 29 Z"
          fill="url(#duckWingNearGrad)"
          stroke="#94a3b8"
          strokeWidth="0.6"
        />
        <path
          d="M 30 32 L 40 12 C 35 15 28 20 23 28 Z"
          fill="url(#duckWingNearGrad)"
          opacity="0.9"
        />
        <path
          d="M 30 30 L 44 2 M 29 30 L 39 5 M 28 31 L 35 9 M 27 31 L 31 14 M 26 31 L 27 19"
          stroke="#cbd5e1"
          strokeWidth="0.5"
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

        <linearGradient id="chickenWingFarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a1a1aa" />
          <stop offset="100%" stopColor="#3f3f46" />
        </linearGradient>

        <linearGradient id="chickenWingNearGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#464646ff" />
          <stop offset="60%" stopColor="#71717a" />
          <stop offset="100%" stopColor="#27272a" />
        </linearGradient>
      </defs>

      {/* 1. FAR BIRD WING (Behind body) */}
      <g
        className="chicken-far-wing"
        style={{
          transformOrigin: '24px 16px',
          animation: `chickenWingFlapFar ${flapSpeed} ease-in-out infinite alternate`,
        }}
      >
        <path
          d="M 24 16 L 15 2 C 10 -2 5 -2 2 1 C 0 3 2 6 5 7 L 9 10 L 13 13 L 18 15 Z"
          fill="url(#chickenWingFarGrad)"
          stroke="#e4e4e7"
          strokeWidth="0.5"
          opacity="0.95"
        />
        <path d="M 15 2 L 5 7 M 13 6 L 9 10 M 16 10 L 13 13" stroke="#71717a" strokeWidth="0.4" opacity="0.6" />
      </g>

      {/* 2. TAIL TUFT FEATHERS */}
      <path d="M 7 20 Q 1 9 9 14 Q 2 16 8 21 Q 0 22 7 25 Z" fill="#18181b" />

      {/* 3. MAIN BODY & HEAD */}
      <path
        d="M 9 22 C 8 33 32 35 40 24 C 44 17 39 12 33 16 C 23 18 12 15 9 22 Z"
        fill="url(#chickenBodyGrad)"
      />
      <path
        d="M 31 17 Q 35 8 42 8 C 48 8 48 17 39 20 Z"
        fill="url(#chickenBodyGrad)"
      />
      <path
        d="M 38 8 Q 38 2 41 5 Q 43 1 45 5 Q 47 3 47 8 Z"
        fill="#ef4444"
      />
      <path
        d="M 46 15 Q 49 19 46 21 Q 44 19 45 15 Z"
        fill="#dc2626"
      />
      <path
        d="M 46 11 L 54 13 L 46 15 Z"
        fill="#f59e0b"
      />
      <circle cx="43" cy="12" r="1.6" fill="#fef08a" />
      <circle cx="43.3" cy="11.7" r="0.7" fill="#09090b" />

      {/* 4. NEAR BIRD WING (Foreground Avian Wing) */}
      <g
        className="chicken-near-wing"
        style={{
          transformOrigin: '25px 17px',
          animation: `chickenWingFlapNear ${flapSpeed} ease-in-out infinite alternate`,
        }}
      >
        <path
          d="M 25 17 L 15 2 C 11 -3 6 -3 2 0 C 0 2 2 5 5 6 L 9 10 L 13 13 L 18 16 Z"
          fill="url(#chickenWingNearGrad)"
          stroke="#a1a1aa"
          strokeWidth="0.6"
        />
        <path
          d="M 25 17 C 19 6 12 6 9 10 C 11 13 16 16 25 17 Z"
          fill="url(#chickenWingNearGrad)"
          opacity="0.85"
        />
        <path d="M 15 2 L 5 6 M 13 6 L 9 10 M 16 10 L 13 13" stroke="#e4e4e7" strokeWidth="0.5" />
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
