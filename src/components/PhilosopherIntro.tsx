import type { PhilosopherMeta } from "../types";

interface Props {
  philosopher: PhilosopherMeta;
  onStart: () => void;
}

export default function PhilosopherIntro({ philosopher, onStart }: Props) {
  return (
    <div
      style={{
        position: "relative",
        zIndex: 2,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100dvh",
        padding: 24,
      }}
    >
      <div
        style={{
          width: 80,
          height: 80,
          borderRadius: "50%",
          background: `linear-gradient(140deg, ${philosopher.color}, ${philosopher.color}77)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 40,
          fontFamily: "serif",
          color: "#0f0f1e",
          fontWeight: 700,
          boxShadow: `0 0 40px ${philosopher.color}30`,
          marginBottom: 20,
          animation: "glow 3s ease-in-out infinite",
        }}
      >
        {philosopher.avatar}
      </div>
      <div
        style={{
          color: "#e0e0f0",
          fontSize: 28,
          fontWeight: 700,
          fontFamily: "'Noto Serif SC',serif",
          marginBottom: 4,
        }}
      >
        {philosopher.name}
      </div>
      <div
        style={{
          color: "#7a7a9a",
          fontSize: 14,
          fontFamily: "'Cormorant Garamond',serif",
          fontStyle: "italic",
          marginBottom: 6,
        }}
      >
        {philosopher.en} · {philosopher.era}
      </div>
      <div
        style={{
          color: "#888",
          fontSize: 14,
          marginBottom: 40,
          textAlign: "center",
          maxWidth: 360,
          lineHeight: 1.8,
        }}
      >
        {philosopher.brief}
      </div>
      <button
        onClick={onStart}
        style={{
          padding: "14px 40px",
          borderRadius: 28,
          background: `linear-gradient(140deg, ${philosopher.color}, ${philosopher.color}88)`,
          border: "none",
          color: "#0f0f1e",
          fontSize: 16,
          fontWeight: 700,
          fontFamily: "'Noto Serif SC',serif",
          cursor: "pointer",
          boxShadow: `0 0 30px ${philosopher.color}25`,
          letterSpacing: "0.08em",
        }}
      >
        开始对话
      </button>
    </div>
  );
}
