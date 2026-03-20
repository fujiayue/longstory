import type { PhilosopherMeta } from "../types";

interface Props {
  p: PhilosopherMeta;
  onClick: (p: PhilosopherMeta) => void;
  progress: { cards: number; chats: number };
}

export default function StarNode({ p, onClick, progress }: Props) {
  return (
    <g
      onClick={() => p.unlocked && onClick(p)}
      style={{ cursor: p.unlocked ? "pointer" : "default" }}
    >
      {p.unlocked && (
        <circle cx={p.x} cy={p.y} r="3" fill="none" stroke={p.color} strokeWidth="0.12" opacity="0.25">
          <animate attributeName="r" values="3;5;3" dur="4s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.25;0.08;0.25" dur="4s" repeatCount="indefinite" />
        </circle>
      )}
      <circle
        cx={p.x}
        cy={p.y}
        r={p.unlocked ? 1.6 : 0.9}
        fill={p.unlocked ? p.color : "#333"}
        opacity={p.unlocked ? 1 : 0.35}
      />
      {p.unlocked && (
        <circle cx={p.x} cy={p.y} r="1.6" fill="none" stroke={p.color} strokeWidth="0.18" opacity="0.4" />
      )}
      <text
        x={p.x}
        y={p.y - 3.2}
        textAnchor="middle"
        fill={p.unlocked ? "#e0e0f0" : "#505060"}
        fontSize="2"
        style={{ fontFamily: "'Noto Serif SC',serif", fontWeight: 600 }}
      >
        {p.name}
      </text>
      <text
        x={p.x}
        y={p.y + 3.5}
        textAnchor="middle"
        fill={p.unlocked ? "#8888aa" : "#383848"}
        fontSize="1"
        style={{ fontFamily: "'Cormorant Garamond',serif", fontStyle: "italic" }}
      >
        {p.en}
      </text>
      {!p.unlocked && p.requireCards && (
        <text
          x={p.x}
          y={p.y + 5}
          textAnchor="middle"
          fill="#484858"
          fontSize="0.8"
          style={{ fontFamily: "monospace" }}
        >
          {progress.cards}/{p.requireCards}✦ {progress.chats}/{p.requireChats}💬
        </text>
      )}
    </g>
  );
}
