import React, { useEffect, useState } from 'react';

export default function SakuraBackground() {
  const [petals, setPetals] = useState([]);

  useEffect(() => {
    // Generate randomized falling Sakura petals
    const petalCount = 28;
    const generated = [];
    for (let i = 0; i < petalCount; i++) {
      generated.push({
        id: i,
        left: Math.random() * 100, // horizontal start %
        animationDuration: 7 + Math.random() * 9, // 7s - 16s drift
        animationDelay: Math.random() * 10,
        size: 10 + Math.random() * 14, // 10px - 24px
        rotation: Math.random() * 360,
        swayAmount: 20 + Math.random() * 40,
        opacity: 0.55 + Math.random() * 0.45,
      });
    }
    setPetals(generated);
  }, []);

  return (
    <div className="sakura-theme-canvas" aria-hidden="true">
      {/* Background Ink Wash Texture */}
      <div className="sakura-ink-wash-overlay" />

      {/* Top-Left Sumi-e Japanese Ink Branch & Blossom Clusters */}
      <svg className="sakura-branch-svg top-left-branch" viewBox="0 0 700 500" preserveAspectRatio="none">
        <defs>
          <linearGradient id="sakuraPetalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fff0f5" />
            <stop offset="60%" stopColor="#ffb7c5" />
            <stop offset="100%" stopColor="#f472b6" />
          </linearGradient>

          <radialGradient id="sakuraCenterGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ec4899" />
            <stop offset="70%" stopColor="#be185d" />
            <stop offset="100%" stopColor="#831843" />
          </radialGradient>

          <linearGradient id="inkBranchGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1a141a" />
            <stop offset="50%" stopColor="#2a1e28" />
            <stop offset="100%" stopColor="#120c12" />
          </linearGradient>

          {/* Reusable Sakura Flower Symbol */}
          <g id="sakuraFlower">
            {/* 5 Petals */}
            {[0, 72, 144, 216, 288].map((angle, idx) => (
              <path
                key={idx}
                d="M0,0 C-8,-16 -12,-32 0,-42 C12,-32 8,-16 0,0"
                fill="url(#sakuraPetalGrad)"
                transform={`rotate(${angle})`}
                stroke="#f472b6"
                strokeWidth="0.5"
                opacity="0.95"
              />
            ))}
            {/* Center Pistil & Gold Stamen Dot */}
            <circle cx="0" cy="0" r="6" fill="url(#sakuraCenterGrad)" />
            <circle cx="0" cy="0" r="2.5" fill="#fef08a" />
            {[0, 45, 90, 135, 180, 225, 270, 315].map((ang, i) => (
              <line
                key={i}
                x1="0"
                y1="0"
                x2={7 * Math.cos((ang * Math.PI) / 180)}
                y2={7 * Math.sin((ang * Math.PI) / 180)}
                stroke="#fef08a"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
            ))}
          </g>
        </defs>

        {/* Sumi-e Main Trunk & Curved Branches (Top Left) */}
        <g stroke="url(#inkBranchGrad)" strokeLinecap="round" fill="none">
          {/* Primary Trunk */}
          <path d="M-50,-20 Q120,40 240,110 T460,140 Q550,180 620,230" strokeWidth="22" opacity="0.9" />
          <path d="M-50,-20 Q120,40 240,110 T460,140 Q550,180 620,230" strokeWidth="16" stroke="#2d1f2b" opacity="0.6" />

          {/* Sub-branches */}
          <path d="M140,70 Q200,160 290,220" strokeWidth="10" />
          <path d="M240,110 Q320,60 410,40" strokeWidth="8" />
          <path d="M360,125 Q450,220 540,280" strokeWidth="7" />
          <path d="M460,140 Q500,80 580,70" strokeWidth="6" />
          <path d="M290,220 Q330,280 390,320" strokeWidth="4" />
          <path d="M410,40 Q470,20 530,10" strokeWidth="3" />
        </g>

        {/* Blossom Clusters along Branches */}
        <use href="#sakuraFlower" x="140" y="70" transform="scale(1.2)" />
        <use href="#sakuraFlower" x="180" y="95" transform="scale(0.9) rotate(15)" />
        <use href="#sakuraFlower" x="240" y="110" transform="scale(1.3) rotate(-20)" />
        <use href="#sakuraFlower" x="290" y="150" transform="scale(1.1) rotate(40)" />
        <use href="#sakuraFlower" x="320" y="60" transform="scale(1.4) rotate(10)" />
        <use href="#sakuraFlower" x="360" y="125" transform="scale(1.25) rotate(-35)" />
        <use href="#sakuraFlower" x="410" y="40" transform="scale(1.1) rotate(25)" />
        <use href="#sakuraFlower" x="450" y="220" transform="scale(1.3) rotate(-15)" />
        <use href="#sakuraFlower" x="460" y="140" transform="scale(1.35) rotate(50)" />
        <use href="#sakuraFlower" x="500" y="80" transform="scale(1.05) rotate(-10)" />
        <use href="#sakuraFlower" x="540" y="280" transform="scale(1.2) rotate(30)" />
        <use href="#sakuraFlower" x="580" y="70" transform="scale(1.15) rotate(-45)" />
        <use href="#sakuraFlower" x="620" y="230" transform="scale(1.4) rotate(18)" />
        <use href="#sakuraFlower" x="390" y="320" transform="scale(1.1) rotate(5)" />
        <use href="#sakuraFlower" x="530" y="10" transform="scale(1.0) rotate(-22)" />
      </svg>

      {/* Bottom-Right Branch Accent */}
      <svg className="sakura-branch-svg bottom-right-branch" viewBox="0 0 600 400" preserveAspectRatio="none">
        <g stroke="url(#inkBranchGrad)" strokeLinecap="round" fill="none">
          <path d="M650,420 Q450,300 320,240 T100,160" strokeWidth="18" opacity="0.88" />
          <path d="M450,300 Q380,180 290,130" strokeWidth="8" />
          <path d="M320,240 Q250,320 180,360" strokeWidth="6" />
        </g>
        <use href="#sakuraFlower" x="450" y="300" transform="scale(1.3) rotate(33)" />
        <use href="#sakuraFlower" x="380" y="180" transform="scale(1.1) rotate(-15)" />
        <use href="#sakuraFlower" x="320" y="240" transform="scale(1.35) rotate(45)" />
        <use href="#sakuraFlower" x="290" y="130" transform="scale(1.0) rotate(-30)" />
        <use href="#sakuraFlower" x="250" y="320" transform="scale(1.2) rotate(12)" />
        <use href="#sakuraFlower" x="180" y="360" transform="scale(1.15) rotate(-25)" />
        <use href="#sakuraFlower" x="100" y="160" transform="scale(1.4) rotate(20)" />
      </svg>

      {/* Animated Falling Sakura Petals (Hanafubuki) */}
      <div className="sakura-falling-petals-container">
        {petals.map((p) => (
          <div
            key={p.id}
            className="sakura-petal"
            style={{
              left: `${p.left}%`,
              width: `${p.size}px`,
              height: `${p.size * 1.3}px`,
              opacity: p.opacity,
              animationDuration: `${p.animationDuration}s`,
              animationDelay: `${p.animationDelay}s`,
              transform: `rotate(${p.rotation}deg)`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
