interface Props {
  size?: number;
}

export default function Logo({ size = 48 }: Props) {
  const cx = 50, cy = 50;
  const petalDist = 23;
  const petalRx = 18, petalRy = 22;

  const petals = Array.from({ length: 5 }, (_, i) => {
    const angle = (i * 72 - 90) * Math.PI / 180;
    return {
      x: cx + petalDist * Math.cos(angle),
      y: cy + petalDist * Math.sin(angle),
      rot: i * 72,
    };
  });

  const stamens = Array.from({ length: 8 }, (_, i) => {
    const angle = (i * 45) * Math.PI / 180;
    return {
      x1: cx + 8 * Math.cos(angle),
      y1: cy + 8 * Math.sin(angle),
      x2: cx + 17 * Math.cos(angle),
      y2: cy + 17 * Math.sin(angle),
    };
  });

  return (
    <svg
      width={size}
      height={size * 1.15}
      viewBox="0 0 100 115"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient id="sahejPetal" cx="50%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#FDE8F0" />
          <stop offset="60%" stopColor="#F9A8D4" />
          <stop offset="100%" stopColor="#F472B6" />
        </radialGradient>
        <linearGradient id="sahejLeafL" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#4ADE80" />
          <stop offset="100%" stopColor="#14532D" />
        </linearGradient>
        <linearGradient id="sahejLeafR" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4ADE80" />
          <stop offset="100%" stopColor="#14532D" />
        </linearGradient>
      </defs>

      {/* Left leaf */}
      <path
        d="M 50 92 C 32 88 12 74 18 56 C 28 66 40 80 50 92 Z"
        fill="url(#sahejLeafL)"
      />
      {/* Right leaf */}
      <path
        d="M 50 92 C 68 88 88 74 82 56 C 72 66 60 80 50 92 Z"
        fill="url(#sahejLeafR)"
      />

      {/* Petals */}
      {petals.map((p, i) => (
        <ellipse
          key={i}
          cx={p.x}
          cy={p.y}
          rx={petalRx}
          ry={petalRy}
          fill="url(#sahejPetal)"
          transform={`rotate(${p.rot}, ${p.x}, ${p.y})`}
          opacity={0.92}
        />
      ))}

      {/* Yellow center base */}
      <circle cx={cx} cy={cy} r={13} fill="#FCD34D" />

      {/* Stamens */}
      {stamens.map((s, i) => (
        <g key={i}>
          <line x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} stroke="#166534" strokeWidth="1.4" strokeLinecap="round" />
          <circle cx={s.x2} cy={s.y2} r={2.2} fill="#EAB308" />
        </g>
      ))}

      {/* Dark green center */}
      <circle cx={cx} cy={cy} r={7} fill="#166534" />
      {/* Golden pip */}
      <circle cx={cx} cy={cy} r={3} fill="#FCD34D" />
    </svg>
  );
}
