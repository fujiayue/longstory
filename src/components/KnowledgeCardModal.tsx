import type { KnowledgeCard } from "../types";

interface Props {
  card: KnowledgeCard | null;
  nodeColor: string;
  onClose: () => void;
  onCollect: () => void;
}

export default function KnowledgeCardModal({ card, nodeColor, onClose, onCollect }: Props) {
  if (!card) return null;
  const color = nodeColor || "#F5C542";

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,0,0,0.75)",
        backdropFilter: "blur(10px)",
        animation: "fadeIn 0.3s ease",
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "min(440px,92vw)",
          background: "linear-gradient(145deg,#141428,#0f1a2e)",
          borderRadius: 18,
          border: `1px solid ${color}30`,
          overflow: "hidden",
          boxShadow: `0 0 50px ${color}12`,
          animation: "slideUp 0.35s ease",
        }}
      >
        <div
          style={{
            padding: "26px 30px 18px",
            borderBottom: `1px solid ${color}18`,
            background: `linear-gradient(135deg,${color}10,transparent)`,
          }}
        >
          <div style={{ fontSize: 30, marginBottom: 6 }}>{card.icon}</div>
          <div style={{ fontSize: 21, fontWeight: 700, color: "#e8e8f0", fontFamily: "'Noto Serif SC',serif" }}>
            {card.title}
          </div>
          <div style={{ fontSize: 13.5, color, marginTop: 5, fontFamily: "'Cormorant Garamond',serif", fontStyle: "italic" }}>
            {card.subtitle}
          </div>
        </div>
        <div style={{ padding: "22px 30px", color: "#b0b0c8", fontSize: 14.5, lineHeight: 1.9, fontFamily: "'Noto Serif SC',serif" }}>
          {card.content}
        </div>
        <div
          style={{
            padding: "14px 30px",
            borderTop: `1px solid ${color}12`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ fontSize: 11.5, color: "#555", fontStyle: "italic" }}>📖 {card.source}</span>
          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={onClose}
              style={{
                padding: "8px 18px",
                background: "transparent",
                border: "1px solid #3a3a50",
                borderRadius: 9,
                color: "#777",
                cursor: "pointer",
                fontSize: 13,
              }}
            >
              关闭
            </button>
            <button
              onClick={() => {
                onCollect();
                onClose();
              }}
              style={{
                padding: "8px 20px",
                background: `${color}18`,
                border: `1px solid ${color}44`,
                borderRadius: 9,
                color,
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              收藏卡片 ✦
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
