export default function Nebula() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        background: [
          "radial-gradient(ellipse 60% 50% at 30% 30%, rgba(90,50,140,0.18) 0%, transparent 70%)",
          "radial-gradient(ellipse 50% 60% at 70% 60%, rgba(40,80,140,0.14) 0%, transparent 70%)",
          "radial-gradient(ellipse 40% 40% at 55% 35%, rgba(140,100,50,0.08) 0%, transparent 60%)",
        ].join(", "),
      }}
    />
  );
}
