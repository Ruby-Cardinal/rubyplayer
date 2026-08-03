import React, { useEffect, useState } from 'react';

function RubyBirdSvg({ fill = '#ff2e55', flapSpeed = '0.6s', glow = true }) {
  return (
    <svg
      viewBox="0 0 44 24"
      className="cardinal-bird-svg"
      style={{
        width: '100%',
        height: '100%',
        filter: glow ? 'drop-shadow(0 0 8px rgba(255, 46, 85, 0.85)) drop-shadow(0 0 16px rgba(225, 29, 72, 0.5))' : 'none',
      }}
    >
      {/*wings*/}
      <defs>
        <linearGradient id="rubyCardinalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ff4d6d" />
          <stop offset="50%" stopColor="#ff2e55" />
          <stop offset="100%" stopColor="#9f1239" />
        </linearGradient>
      </defs>

      <g className="cardinal-left-wing" style={{ transformOrigin: '22px 12px', animation: `cardinalWingFlapLeft ${flapSpeed} ease-in-out infinite alternate` }}>
        <path
          d="M 12.019543,9.84966 C 6.0195435,0.84966 0.23452747,-0.508646 0.23452747,2.491354 1.5863185,4.235654 2.1433225,5.165263 3.8143315,6.33953 4.9739405,7.313472 5.5276865,7.918064 6.9332245,8.437282 8.7459275,8.79624 9.5195435,7.34966 12.019543,9.84966 Z"
          fill="url(#rubyCardinalGrad)"
          opacity="0.95"
        />
        <path
          d="M 12.307968,11.059576 C 5.6454687,3.8534248 0.5463824,3.8636644 1.0893481,6.7156874 c 1.4497602,1.354126 2.0852992,2.1125647 3.6996946,2.8529567 1.1491079,0.6650049 1.7230881,1.1151889 2.9962142,1.2925719 1.585706,-0.06658 1.9729055,-1.6158616 4.5227101,0.198365 z"
          fill="url(#rubyCardinalGrad)"
          opacity="0.92"
        />
        <path
          d="M 13.726849,13.503329 C 7.38949,7.854406 2.7501784,8.0780633 3.3531024,10.402154 c 1.3708431,1.053155 1.9780789,1.65047 3.4752957,2.191617 1.0709701,0.498745 1.6104246,0.84499 2.775624,0.937223 1.4403059,-0.121724 1.7334789,-1.413012 4.1228259,-0.02766 z"
          fill="url(#rubyCardinalGrad)"
          opacity="0.9"
        />
      </g>

      <path
        d="M22 3L12 10l10 13 10-13-10-7zm0 3.8L28.2 10 22 18 15.8 10 22 6.8z"
        fill="#fdbdc2ff"
        style={{ filter: 'drop-shadow(0 0 4px #ff2e55)' }}
      />

      <g className="cardinal-right-wing" style={{ transformOrigin: '22px 12px', animation: `cardinalWingFlapRight ${flapSpeed} ease-in-out infinite alternate` }}>
        <path
          d="m 32.189158,9.7124763 c 5.999999,-9.00000001 11.785016,-10.35830601 11.785016,-7.358306 -1.351792,1.7443 -1.908795,2.673909 -3.579805,3.848176 -1.159609,0.973942 -1.713354,1.578534 -3.118892,2.097752 -1.812704,0.358958 -2.58632,-1.087622 -5.086319,1.412378 z"
          fill="url(#rubyCardinalGrad)"
          opacity="0.95"
        />
        <path
          d="m 31.900733,10.922392 c 6.662499,-7.2061509 11.761586,-7.1959113 11.21862,-4.3438883 -1.44976,1.354126 -2.085299,2.1125647 -3.699695,2.8529567 -1.149108,0.6650046 -1.723088,1.1151886 -2.996214,1.2925716 -1.585706,-0.06658 -1.972905,-1.6158613 -4.52271,0.198365 z"
          fill="url(#rubyCardinalGrad)"
          opacity="0.92"
        />
        <path
          d="m 30.481852,13.366145 c 6.337359,-5.6489227 10.976671,-5.4252654 10.373747,-3.101175 -1.370843,1.053155 -1.978079,1.65047 -3.475296,2.191617 -1.07097,0.498745 -1.610425,0.84499 -2.775624,0.937223 -1.440306,-0.121724 -1.733479,-1.413012 -4.122826,-0.02766 z"
          fill="url(#rubyCardinalGrad)"
          opacity="0.9"
        />
      </g>
    </svg>
  );
}

export default function RubyCardinalBackground() {
  const [birds, setBirds] = useState([]);

  useEffect(() => {
    const birdCount = 18;
    const generated = [];

    for (let i = 0; i < birdCount; i++) {
      const isLeftToRight = i % 2 === 0;
      const size = 32 + Math.random() * 36;
      const duration = 12 + Math.random() * 16;
      const delay = -Math.random() * duration;
      const startY = 8 + Math.random() * 80;
      const waveAmplitude = 15 + Math.random() * 35;
      const flapSpeed = `${0.35 + Math.random() * 0.4}s`;
      const opacity = 0.5 + Math.random() * 0.5;

      generated.push({
        id: i,
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
    <div className="ruby-cardinal-theme-canvas" aria-hidden="true">
      <div className="ruby-cardinal-bg-overlay" />

      <div className="ruby-cardinal-birds-container">
        {birds.map((b) => (
          <div
            key={b.id}
            className={`ruby-cardinal-bird-wrapper ${b.isLeftToRight ? 'fly-left-to-right' : 'fly-right-to-left'}`}
            style={{
              top: `${b.startY}%`,
              width: `${b.size}px`,
              height: `${b.size * 0.55}px`,
              opacity: b.opacity,
              animationDuration: `${b.duration}s`,
              animationDelay: `${b.delay}s`,
              '--wave-amp': `${b.waveAmplitude}px`,
            }}
          >
            <RubyBirdSvg flapSpeed={b.flapSpeed} />
          </div>
        ))}
      </div>
    </div>
  );
}
