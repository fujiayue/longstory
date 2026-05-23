export default function Nebula() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        background: [
          "radial-gradient(ellipse 80% 40% at 50% 65%, rgba(107,144,128,0.06) 0%, transparent 70%)",
          "radial-gradient(ellipse 60% 50% at 75% 20%, rgba(180,190,200,0.04) 0%, transparent 60%)",
          "radial-gradient(ellipse 50% 30% at 20% 80%, rgba(80,100,120,0.05) 0%, transparent 60%)",
        ].join(", "),
      }}
    />
  );
}
