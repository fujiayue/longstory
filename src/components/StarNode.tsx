import type { PhilosopherMeta, UnlockProgress } from "../types";

interface Props {
  p: PhilosopherMeta;
  onClick: (p: PhilosopherMeta) => void;
  unlockProgress?: UnlockProgress;
}

/** 4-pointed sparkle star polygon */
function sparklePoints(cx: number, cy: number, R: number, ir = 0.22): string {
  const pts: string[] = [];
  for (let i = 0; i < 8; i++) {
    const a = (i * 45 - 90) * (Math.PI / 180);
    const r = i % 2 === 0 ? R : R * ir;
    pts.push(`${(cx + r * Math.cos(a)).toFixed(3)},${(cy + r * Math.sin(a)).toFixed(3)}`);
  }
  return pts.join(" ");
}

function pct(ratio: number): string {
  return `${Math.round(ratio * 100)}%`;
}

export default function StarNode({ p, onClick, unlockProgress }: Props) {
  // 亮/暗完全由用户解锁状态决定，与 status 无关
  const lit = p.unlocked;
  const isClickable = lit;
  const R = lit ? 2.0 : 1.1;

  return (
    <g
      onClick={() => isClickable && onClick(p)}
      style={{ cursor: isClickable ? "pointer" : "default" }}
    >
      {/* 脉冲光环 — 仅解锁时 */}
      {lit && (
        <circle cx={p.x} cy={p.y} r="3.5" fill="none" stroke={p.color} strokeWidth="0.12" opacity="0.25">
          <animate attributeName="r" values="3.5;5.5;3.5" dur="4s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.25;0.06;0.25" dur="4s" repeatCount="indefinite" />
        </circle>
      )}

      {/* 发光晕 — 仅解锁时 */}
      {lit && (
        <circle cx={p.x} cy={p.y} r="2.2" fill={p.color} opacity="0.12" />
      )}

      {/* 四角星 */}
      <polygon
        points={sparklePoints(p.x, p.y, R)}
        fill={p.color}
        opacity={lit ? 1 : 0.28}
      />

      {/* 中文名 */}
      <text
        x={p.x} y={p.y - 3.2}
        textAnchor="middle"
        fill={lit ? "#e8e8f8" : "#3a3a55"}
        fontSize={lit ? "2.2" : "1.7"}
        style={{ fontFamily: "'Noto Serif SC',serif", fontWeight: lit ? 600 : 400 }}
      >
        {p.name}
      </text>

      {/* 英文名 — 仅解锁时显示 */}
      {lit && (
        <text
          x={p.x} y={p.y + 4.2}
          textAnchor="middle"
          fill="#8888aa"
          fontSize="1.1"
          style={{ fontFamily: "'Cormorant Garamond',serif", fontStyle: "italic" }}
        >
          {p.en}
        </text>
      )}

      {/* 解锁进度提示 — 仅 active 且未解锁且有进度时 */}
      {!lit && p.status === "active" && unlockProgress && (
        <text
          x={p.x} y={p.y + 5.5}
          textAnchor="middle"
          fill="#404058"
          fontSize="0.85"
          style={{ fontFamily: "monospace" }}
        >
          节点 {pct(unlockProgress.nodeRatio)} · 提问 {pct(unlockProgress.presetRatio)}
        </text>
      )}
    </g>
  );
}
