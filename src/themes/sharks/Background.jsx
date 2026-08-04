import React, { useEffect, useState } from 'react';

function SharkSvg({ type = 'great-white', swishSpeed = '1.2s', glow = true }) {
  return (
    <svg
      viewBox="0 0 100 42"
      className={`shark-svg shark-type-${type}`}
      style={{
        width: '100%',
        height: '100%',
        filter: glow
          ? 'drop-shadow(0 0 14px rgba(14, 165, 233, 0.55)) drop-shadow(0 6px 14px rgba(0, 0, 0, 0.75))'
          : 'none',
      }}
    >
      <defs>
        <linearGradient id="sharkBodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#334155" />
          <stop offset="42%" stopColor="#475569" />
          <stop offset="68%" stopColor="#94a3b8" />
          <stop offset="100%" stopColor="#f8fafc" />
        </linearGradient>

        <linearGradient id="sharkFinFarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1e293b" />
          <stop offset="100%" stopColor="#334155" />
        </linearGradient>

        <linearGradient id="sharkFinNearGrad" x1="0%" y1="0%" x2="100%" y2="100%">
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
          fill="url(#sharkFinFarGrad)"
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
          fill="url(#sharkBodyGrad)"
        />
      </g>

      <path
        d="M 62 16 L 50 1 L 40 4 L 48 16 Z"
        fill="url(#sharkBodyGrad)"
      />
      <path d="M 48 16 L 40 4 L 44 14 Z" fill="#1e293b" opacity="0.4" />

      <path
        d="M 24 21 C 32 14 52 14 78 17 C 92 19 100 21 100 22 C 100 23 90 27 75 29 C 52 32 32 30 24 21 Z"
        fill="url(#sharkBodyGrad)"
      />

      {type === 'hammerhead' && (
        <path
          d="M 94 15 L 98 12 L 100 22 L 98 32 L 94 29 Z"
          fill="url(#sharkBodyGrad)"
        />
      )}

      <g stroke="#334155" strokeWidth="0.8" opacity="0.7">
        <line x1="72" y1="19" x2="71" y2="25" />
        <line x1="69" y1="19" x2="68" y2="25" />
        <line x1="66" y1="19.5" x2="65" y2="24.5" />
        <line x1="63" y1="20" x2="62" y2="24" />
        <line x1="60" y1="20.5" x2="59.5" y2="23.5" />
      </g>

      <circle cx={type === 'hammerhead' ? 97 : 88} cy={20} r="1.4" fill="#020617" />
      <circle cx={type === 'hammerhead' ? 97.3 : 88.3} cy={19.6} r="0.4" fill="#ffffff" opacity="0.9" />

      <path d="M 94 22 L 92 22.5" stroke="#1e293b" strokeWidth="0.5" />

      <g
        className="shark-near-fin"
        style={{
          transformOrigin: '60px 24px',
          animation: `sharkFinMoveNear ${swishSpeed} ease-in-out infinite alternate`,
        }}
      >
        <path
          d="M 60 24 L 46 38 L 40 37 L 52 24 Z"
          fill="url(#sharkFinNearGrad)"
          stroke="#334155"
          strokeWidth="0.5"
        />
      </g>

      <path d="M 38 27 L 32 34 L 30 33 L 34 27 Z" fill="url(#sharkFinNearGrad)" opacity="0.85" />
      <path d="M 32 17 L 28 12 L 26 13 L 29 18 Z" fill="url(#sharkFinFarGrad)" opacity="0.8" />
    </svg>
  );
}

export default function SharksBackground() {
  const [sharks, setSharks] = useState([]);
  const [bubbles, setBubbles] = useState([]);

  useEffect(() => {
    const sharkCount = 24;
    const generatedSharks = [];

    for (let i = 0; i < sharkCount; i++) {
      const isHammerhead = i % 3 === 0;

      let pattern = 'swim-left-to-right';
      if (i % 4 === 1) pattern = 'swim-right-to-left';
      if (i % 4 === 2) pattern = 'turnaround-left';
      if (i % 4 === 3) pattern = 'turnaround-right';

      const isForeground = i % 3 === 0;

      const startY = isForeground
        ? 15 + Math.random() * 50
        : 5 + Math.random() * 85;

      const size = isForeground ? 110 + Math.random() * 70 : 60 + Math.random() * 50;
      const duration = isForeground ? 10 + Math.random() * 12 : 14 + Math.random() * 18;
      const delay = -Math.random() * duration;
      const waveAmplitude = 12 + Math.random() * 30;
      const swishSpeed = `${0.7 + Math.random() * 0.6}s`;
      const opacity = isForeground ? 0.92 : 0.55 + Math.random() * 0.35;

      generatedSharks.push({
        id: i,
        type: isHammerhead ? 'hammerhead' : 'great-white',
        pattern,
        isForeground,
        size,
        duration,
        delay,
        startY,
        waveAmplitude,
        swishSpeed,
        opacity,
      });
    }

    setSharks(generatedSharks);

    const bubbleCount = 30;
    const generatedBubbles = [];

    for (let j = 0; j < bubbleCount; j++) {
      const bSize = 4 + Math.random() * 14;
      const bLeft = Math.random() * 100;
      const bDuration = 7 + Math.random() * 14;
      const bDelay = -Math.random() * bDuration;
      const bOpacity = 0.2 + Math.random() * 0.45;

      generatedBubbles.push({
        id: j,
        size: bSize,
        left: bLeft,
        duration: bDuration,
        delay: bDelay,
        opacity: bOpacity,
      });
    }

    setBubbles(generatedBubbles);
  }, []);

  const bgSharks = sharks.filter((s) => !s.isForeground);
  const fgSharks = sharks.filter((s) => s.isForeground);

  return (
    <>
      <div className="sharks-theme-canvas sharks-bg-canvas" aria-hidden="true">
        <div className="sharks-bg-overlay" />
        <div className="sharks-caustics-light" />

        <div className="sharks-bubbles-container">
          {bubbles.map((b) => (
            <div
              key={b.id}
              className="ocean-bubble"
              style={{
                left: `${b.left}%`,
                width: `${b.size}px`,
                height: `${b.size}px`,
                opacity: b.opacity,
                animationDuration: `${b.duration}s`,
                animationDelay: `${b.delay}s`,
              }}
            />
          ))}
        </div>

        <div className="sharks-container">
          {bgSharks.map((s) => (
            <div
              key={s.id}
              className={`shark-wrapper ${s.pattern}`}
              style={{
                top: `${s.startY}%`,
                width: `${s.size}px`,
                height: `${s.size * 0.42}px`,
                opacity: s.opacity,
                animationDuration: `${s.duration}s`,
                animationDelay: `${s.delay}s`,
                '--wave-amp': `${s.waveAmplitude}px`,
              }}
            >
              <SharkSvg type={s.type} swishSpeed={s.swishSpeed} />
            </div>
          ))}
        </div>
      </div>

      <div className="sharks-theme-canvas sharks-fg-canvas" aria-hidden="true">
        <div className="sharks-container">
          {fgSharks.map((s) => (
            <div
              key={s.id}
              className={`shark-wrapper ${s.pattern} is-foreground-shark`}
              style={{
                top: `${s.startY}%`,
                width: `${s.size}px`,
                height: `${s.size * 0.42}px`,
                opacity: s.opacity,
                animationDuration: `${s.duration}s`,
                animationDelay: `${s.delay}s`,
                '--wave-amp': `${s.waveAmplitude}px`,
              }}
            >
              <SharkSvg type={s.type} swishSpeed={s.swishSpeed} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
