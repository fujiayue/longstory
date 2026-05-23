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
      {/* Ink circle avatar */}
      <div
        style={{
          width: 90,
          height: 90,
          borderRadius: "50%",
          border: `2px solid ${philosopher.color}`,
          background: `radial-gradient(circle at 40% 40%, ${philosopher.color}18, transparent 70%)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 42,
          fontFamily: "'Noto Serif SC',serif",
          color: philosopher.color,
          fontWeight: 700,
          boxShadow: `0 0 50px ${philosopher.color}15`,
          marginBottom: 24,
          animation: "glow 4s ease-in-out infinite",
        }}
      >
        {philosopher.avatar}
      </div>
      <div
        style={{
          color: "#d8d0c0",
          fontSize: 30,
          fontWeight: 700,
          fontFamily: "'Noto Serif SC',serif",
          marginBottom: 6,
          letterSpacing: "0.15em",
        }}
      >
        {philosopher.name}
      </div>
      <div
        style={{
          color: "#6a7a80",
          fontSize: 14,
          fontFamily: "'Noto Serif SC',serif",
          marginBottom: 8,
        }}
      >
        {philosopher.en} · {philosopher.era}
      </div>
      <div
        style={{
          color: "#8a9098",
          fontSize: 14,
          marginBottom: 44,
          textAlign: "center",
          maxWidth: 360,
          lineHeight: 2,
        }}
      >
        {philosopher.brief}
      </div>
      <button
        onClick={onStart}
        style={{
          padding: "14px 44px",
          borderRadius: 24,
          background: "transparent",
          border: `1px solid ${philosopher.color}88`,
          color: philosopher.color,
          fontSize: 16,
          fontWeight: 600,
          fontFamily: "'Noto Serif SC',serif",
          cursor: "pointer",
          boxShadow: `0 0 30px ${philosopher.color}10`,
          letterSpacing: "0.15em",
        }}
      >
        问道
      </button>
    </div>
  );
}
