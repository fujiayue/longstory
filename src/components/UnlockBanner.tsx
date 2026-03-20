import type { PhilosopherMeta } from "../types";

interface Props {
  philosopher: PhilosopherMeta | null;
  onDismiss: () => void;
}

export default function UnlockBanner({ philosopher, onDismiss }: Props) {
  if (!philosopher) return null;
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 300,
        display: "flex",
        justifyContent: "center",
        padding: 24,
        animation: "slideDown 0.5s ease",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          background: "linear-gradient(140deg,#141428,#0f1a2e)",
          border: `1px solid ${philosopher.color}44`,
          borderRadius: 18,
          padding: "22px 34px",
          display: "flex",
          alignItems: "center",
          gap: 18,
          boxShadow: `0 0 70px ${philosopher.color}20`,
          pointerEvents: "auto",
        }}
      >
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: "50%",
            background: `linear-gradient(140deg,${philosopher.color},${philosopher.color}77)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 24,
            fontFamily: "serif",
            color: "#0f0f1e",
            fontWeight: 700,
          }}
        >
          {philosopher.avatar}
        </div>
        <div>
          <div style={{ color: philosopher.color, fontSize: 13, fontWeight: 600, letterSpacing: "0.12em", marginBottom: 5 }}>
            ✦ 新的星辰已经亮起 ✦
          </div>
          <div style={{ color: "#e8e8f0", fontSize: 18, fontFamily: "'Noto Serif SC',serif" }}>
            {philosopher.name}正在等待你的到来
          </div>
        </div>
        <button
          onClick={onDismiss}
          style={{
            marginLeft: 16,
            background: "none",
            border: "1px solid #3a3a50",
            borderRadius: 9,
            color: "#777",
            padding: "7px 16px",
            cursor: "pointer",
            fontSize: 12.5,
          }}
        >
          知道了
        </button>
      </div>
    </div>
  );
}
