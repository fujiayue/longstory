import type { PhilosopherMeta, UnlockProgress } from "../types";

function pct(ratio: number): string {
  return `${Math.round(ratio * 100)}%`;
}

export default function StarNode({ p, onClick, unlockProgress }: {
  p: PhilosopherMeta;
  onClick: (p: PhilosopherMeta) => void;
  unlockProgress?: UnlockProgress;
}) {
  const lit = p.unlocked;
  const isClickable = lit;
  const R = lit ? 2.8 : 1.6;

  return (
    <g
      onClick={() => isClickable && onClick(p)}
      style={{ cursor: isClickable ? "pointer" : "default" }}
    >
      {/* Ink ripple — lit only */}
      {lit && (
        <circle cx={p.x} cy={p.y} r="4" fill="none" stroke={p.color} strokeWidth="0.08" opacity="0.2">
          <animate attributeName="r" values="4;6.5;4" dur="5s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.2;0.05;0.2" dur="5s" repeatCount="indefinite" />
        </circle>
      )}

      {/* Ink wash glow */}
      {lit && (
        <circle cx={p.x} cy={p.y} r="3.2" fill={p.color} opacity="0.08" />
      )}

      {/* Ink circle (seal style) */}
      <circle
        cx={p.x} cy={p.y} r={R}
        fill="none"
        stroke={p.color}
        strokeWidth={lit ? "0.35" : "0.15"}
        opacity={lit ? 0.8 : 0.25}
      />

      {/* Center dot */}
      <circle
        cx={p.x} cy={p.y} r={lit ? 0.8 : 0.4}
        fill={p.color}
        opacity={lit ? 0.9 : 0.3}
      />

      {/* Name */}
      <text
        x={p.x} y={p.y - 4.5}
        textAnchor="middle"
        fill={lit ? "#d8d0c0" : "#3a4050"}
        fontSize={lit ? "2.5" : "1.8"}
        style={{ fontFamily: "'Noto Serif SC',serif", fontWeight: lit ? 600 : 400 }}
      >
        {p.name}
      </text>

      {/* Era — lit only */}
      {lit && (
        <text
          x={p.x} y={p.y + 5}
          textAnchor="middle"
          fill="#6a7a80"
          fontSize="1.2"
          style={{ fontFamily: "'Noto Serif SC',serif" }}
        >
          {p.era}
        </text>
      )}

      {/* Unlock progress */}
      {!lit && p.status === "active" && unlockProgress && (
        <text
          x={p.x} y={p.y + 5.5}
          textAnchor="middle"
          fill="#3a4858"
          fontSize="0.85"
          style={{ fontFamily: "monospace" }}
        >
          节点 {pct(unlockProgress.nodeRatio)} · 提问 {pct(unlockProgress.presetRatio)}
        </text>
      )}
    </g>
  );
}
