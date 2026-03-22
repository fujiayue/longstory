import { useMemo } from "react";
import type { ThoughtNode, PhilosopherModule } from "../types";
import { useAppStore } from "../store/app-store";

interface Props {
  philosopher: PhilosopherModule;
  exploredNodes: string[];
  onClose: () => void;
  onNodeClick: (node: ThoughtNode) => void;
}

function makeBgStars() {
  const stars: { x: number; y: number; r: number; opacity: number }[] = [];
  let s = 42;
  for (let i = 0; i < 80; i++) {
    s = (s * 16807 + 0) % 2147483647;
    const x = (s % 1000) / 10;
    s = (s * 16807 + 0) % 2147483647;
    const y = (s % 1300) / 10;
    s = (s * 16807 + 0) % 2147483647;
    const r = 0.15 + (s % 100) / 200;
    s = (s * 16807 + 0) % 2147483647;
    const opacity = 0.15 + (s % 100) / 250;
    stars.push({ x, y, r, opacity });
  }
  return stars;
}

export default function ThoughtMapModal({ philosopher, exploredNodes, onClose, onNodeClick }: Props) {
  const { outline, lineageConnections, lineageOrder, mapTitle, mapSubtitle } = philosopher;
  const store = useAppStore();

  const bgStars = useMemo(makeBgStars, []);

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 200,
        display: "flex", alignItems: "center", justifyContent: "center",
        background: "rgba(0,0,0,0.85)", backdropFilter: "blur(14px)",
        animation: "fadeIn 0.3s ease",
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "min(520px,94vw)", maxHeight: "92dvh",
          background: "linear-gradient(160deg,#06060f,#080c1a,#060810)",
          borderRadius: 20, border: "1px solid rgba(245,197,66,0.12)",
          overflow: "hidden",
          boxShadow: "0 0 100px rgba(245,197,66,0.06), inset 0 0 60px rgba(20,20,40,0.5)",
          animation: "slideUp 0.35s ease",
          display: "flex", flexDirection: "column",
        }}
      >
        {/* Header */}
        <div style={{ padding: "18px 24px 12px", borderBottom: "1px solid rgba(245,197,66,0.08)", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: 10, color: "#F5C542", letterSpacing: "0.18em", fontWeight: 600, marginBottom: 3 }}>
                ✦ {mapTitle} ✦
              </div>
              <div style={{ fontSize: 16, color: "#e0e0f0", fontFamily: "'Noto Serif SC',serif", fontWeight: 700 }}>
                {mapSubtitle}
              </div>
            </div>
            <div style={{ fontSize: 11, color: "#555", background: "rgba(245,197,66,0.06)", padding: "4px 12px", borderRadius: 10, border: "1px solid rgba(245,197,66,0.1)" }}>
              {exploredNodes.length}/{lineageOrder.length} 已探索
            </div>
          </div>
          <div style={{ fontSize: 11, color: "#555", marginTop: 8, lineHeight: 1.6 }}>
            点击任意星辰，进入深度对话。数字为推荐路径。
          </div>
        </div>

        {/* SVG Map */}
        <div style={{ flex: 1, overflowY: "auto", position: "relative" }}>
          <svg viewBox="0 0 100 130" style={{ width: "100%", height: "auto", display: "block" }} preserveAspectRatio="xMidYMid meet">
            <defs>
              <radialGradient id="nebula1" cx="30%" cy="25%" r="40%"><stop offset="0%" stopColor="rgba(90,50,140,0.12)" /><stop offset="100%" stopColor="transparent" /></radialGradient>
              <radialGradient id="nebula2" cx="75%" cy="65%" r="35%"><stop offset="0%" stopColor="rgba(40,80,140,0.10)" /><stop offset="100%" stopColor="transparent" /></radialGradient>
              <filter id="nodeGlow" x="-100%" y="-100%" width="300%" height="300%">
                <feGaussianBlur stdDeviation="1.5" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>

            <rect x="0" y="0" width="100" height="130" fill="url(#nebula1)" />
            <rect x="0" y="0" width="100" height="130" fill="url(#nebula2)" />

            {bgStars.map((s, i) => (
              <circle key={i} cx={s.x} cy={s.y} r={s.r} fill={`rgba(210,215,245,${s.opacity})`} />
            ))}

            {/* Connections */}
            {lineageConnections.map(([ai, bi], i) => {
              const a = outline[ai];
              const b = outline[bi];
              if (!a || !b) return null;
              const aE = exploredNodes.includes(a.id);
              const bE = exploredNodes.includes(b.id);
              const both = aE && bE;
              const either = aE || bE;
              const isMain = i < 10;
              return (
                <line key={i}
                  x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                  stroke={both ? "rgba(245,197,66,0.25)" : either ? "rgba(200,210,255,0.12)" : "rgba(200,210,255,0.04)"}
                  strokeWidth={isMain ? (both ? "0.4" : "0.25") : "0.18"}
                  strokeDasharray={both ? "none" : either ? "1.5,1" : "0.8,1.2"}
                />
              );
            })}

            {/* Nodes */}
            {outline.map((node, idx) => {
              const explored = exploredNodes.includes(node.id);
              const nr = explored ? 2.8 : 1.8;
              return (
                <g key={node.id}
                  onClick={(e) => { e.stopPropagation(); onNodeClick(node); }}
                  style={{ cursor: "pointer" }}
                >
                  {explored && (
                    <>
                      <circle cx={node.x} cy={node.y} r={nr + 3} fill="none" stroke={node.color} strokeWidth="0.12" opacity="0.2">
                        <animate attributeName="r" values={`${nr+3};${nr+5};${nr+3}`} dur="4s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.2;0.06;0.2" dur="4s" repeatCount="indefinite" />
                      </circle>
                      <circle cx={node.x} cy={node.y} r={nr + 1.5} fill={node.color} opacity="0.06" />
                    </>
                  )}
                  <circle cx={node.x} cy={node.y} r={nr}
                    fill={explored ? node.color : "#222235"}
                    opacity={explored ? 1 : 0.6}
                    filter={explored ? "url(#nodeGlow)" : "none"}
                    stroke={explored ? node.color : "#333348"}
                    strokeWidth={explored ? "0.3" : "0.15"}
                  />
                  <text x={node.x} y={node.y + (explored ? 1 : 0.7)} textAnchor="middle" fontSize={explored ? "2.4" : "1.8"} fontWeight="700" fontFamily="'Cormorant Garamond',serif" fill={explored ? "#0a0a18" : "#555"}>
                    {idx + 1}
                  </text>
                  <text x={node.x} y={node.y - nr - 1.8} textAnchor="middle" fontSize="3.2" opacity={explored ? 1 : 0.25}>
                    {node.icon}
                  </text>
                  <text x={node.x} y={node.y + nr + 3.5} textAnchor="middle" fontSize="2.2" fontWeight="600" fontFamily="'Noto Serif SC',serif" fill={explored ? node.color : "#505065"}>
                    {node.label}
                  </text>
                  <text x={node.x} y={node.y + nr + 5.8} textAnchor="middle" fontSize="1.5" fontFamily="'Noto Serif SC',serif" fontStyle="italic" fill={explored ? "#7a7a95" : "#2e2e40"}>
                    {node.brief}
                  </text>
                  {explored && (
                    <g
                      onClick={(e) => {
                        e.stopPropagation();
                        store.setShowCardNodeId(node.id);
                      }}
                      style={{ cursor: "pointer" }}
                    >
                      <rect
                        x={node.x - 8}
                        y={node.y + nr + 7.2}
                        width="16"
                        height="3.2"
                        rx="1"
                        fill="rgba(168,197,226,0.12)"
                        stroke="rgba(168,197,226,0.25)"
                        strokeWidth="0.15"
                      />
                      <text
                        x={node.x}
                        y={node.y + nr + 9.3}
                        textAnchor="middle"
                        fontSize="1.6"
                        fontFamily="'Noto Serif SC',serif"
                        fill="#A8C5E2"
                      >
                        📖 查看知识卡片
                      </text>
                    </g>
                  )}
                  <circle cx={node.x} cy={node.y} r="7" fill="transparent" />
                </g>
              );
            })}

            <text x="50" y="1.5" textAnchor="middle" fontSize="1.3" fill="#F5C542" opacity="0.5" fontFamily="'Cormorant Garamond',serif" fontWeight="600" letterSpacing="0.3">ORIGIN</text>
            <text x="50" y="122" textAnchor="middle" fontSize="1.3" fill="#8B9DAF" opacity="0.4" fontFamily="'Cormorant Garamond',serif" fontWeight="600" letterSpacing="0.3">TERMINUS</text>
          </svg>
        </div>

        {/* Footer */}
        <div style={{ padding: "12px 24px 16px", borderTop: "1px solid rgba(245,197,66,0.06)", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 16 }}>
          <div style={{ fontSize: 11, color: "#444", display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#F5C542", display: "inline-block" }} />已探索
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#222235", border: "1px solid #333348", display: "inline-block", marginLeft: 10 }} />待探索
            <span style={{ width: 20, height: 1, background: "rgba(200,210,255,0.12)", display: "inline-block", marginLeft: 10 }} />思想关联
          </div>
          <button onClick={onClose} style={{ padding: "7px 20px", background: "transparent", border: "1px solid #3a3a50", borderRadius: 10, color: "#777", cursor: "pointer", fontSize: 12 }}>
            返回对话
          </button>
        </div>
      </div>
    </div>
  );
}
