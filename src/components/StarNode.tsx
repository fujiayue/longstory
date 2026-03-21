import type { PhilosopherMeta } from "../types";

interface Props {
  p: PhilosopherMeta;
  onClick: (p: PhilosopherMeta) => void;
  progress: { cards: number; chats: number };
}

/** Generate points string for a 4-pointed sparkle star polygon */
function sparklePoints(cx: number, cy: number, R: number, ir = 0.22): string {
  const pts: string[] = [];
  for (let i = 0; i < 8; i++) {
    const a = (i * 45 - 90) * (Math.PI / 180);
    const r = i % 2 === 0 ? R : R * ir;
    pts.push(`${(cx + r * Math.cos(a)).toFixed(3)},${(cy + r * Math.sin(a)).toFixed(3)}`);
  }
  return pts.join(" ");
}

export default function StarNode({ p, onClick, progress }: Props) {
  const isComingSoon = p.status === "coming-soon";
  const isClickable = p.unlocked && !isComingSoon;

  if (isComingSoon) {
    return (
      <g style={{ cursor: "default" }}>
        <polygon
          points={sparklePoints(p.x, p.y, 0.7)}
          fill={p.color}
          opacity="0.18"
        />
        <text
          x={p.x} y={p.y - 2.4}
          textAnchor="middle"
          fill="#2e2e42"
          fontSize="1.5"
          style={{ fontFamily: "'Noto Serif SC',serif" }}
        >
          {p.name}
        </text>
      </g>
    );
  }

  const R = p.unlocked ? 2.0 : 1.3;

  return (
    <g
      onClick={() => isClickable && onClick(p)}
      style={{ cursor: isClickable ? "pointer" : "default" }}
    >
      {/* Pulse ring for unlocked */}
      {p.unlocked && (
        <circle cx={p.x} cy={p.y} r="3.5" fill="none" stroke={p.color} strokeWidth="0.12" opacity="0.25">
          <animate attributeName="r" values="3.5;5.5;3.5" dur="4s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.25;0.06;0.25" dur="4s" repeatCount="indefinite" />
        </circle>
      )}

      {/* Glow behind star */}
      {p.unlocked && (
        <circle cx={p.x} cy={p.y} r="2.2" fill={p.color} opacity="0.12" />
      )}

      {/* 4-pointed sparkle star */}
      <polygon
        points={sparklePoints(p.x, p.y, R)}
        fill={p.color}
        opacity={p.unlocked ? 1 : 0.5}
      />

      {/* Name */}
      <text
        x={p.x} y={p.y - 3.8}
        textAnchor="middle"
        fill={p.unlocked ? "#e8e8f8" : "#8888a8"}
        fontSize={p.unlocked ? "2.2" : "1.9"}
        style={{ fontFamily: "'Noto Serif SC',serif", fontWeight: 600 }}
      >
        {p.name}
      </text>

      {/* English name */}
      <text
        x={p.x} y={p.y + 4.2}
        textAnchor="middle"
        fill={p.unlocked ? "#8888aa" : "#505068"}
        fontSize="1.1"
        style={{ fontFamily: "'Cormorant Garamond',serif", fontStyle: "italic" }}
      >
        {p.en}
      </text>

      {/* Unlock requirement */}
      {!p.unlocked && p.requireCards && (
        <text
          x={p.x} y={p.y + 6}
          textAnchor="middle"
          fill="#606075"
          fontSize="0.85"
          style={{ fontFamily: "monospace" }}
        >
          {progress.cards}/{p.requireCards}✦ {progress.chats}/{p.requireChats}💬
        </text>
      )}
    </g>
  );
}
