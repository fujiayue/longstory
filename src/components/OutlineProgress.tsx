import { THOUGHT_OUTLINE } from "../data/philosophers/socrates";

interface Props {
  exploredNodes: string[];
}

export default function OutlineProgress({ exploredNodes }: Props) {
  return (
    <div style={{ display: "flex", gap: 3, alignItems: "center", flexWrap: "wrap", justifyContent: "flex-end" }}>
      {THOUGHT_OUTLINE.map((node) => {
        const explored = exploredNodes.includes(node.id);
        return (
          <div
            key={node.id}
            title={node.label}
            style={{
              width: 18,
              height: 18,
              borderRadius: 4,
              fontSize: 9,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: explored ? `${node.color}20` : "rgba(255,255,255,0.03)",
              border: `1px solid ${explored ? `${node.color}44` : "#222238"}`,
              color: explored ? node.color : "#333",
            }}
          >
            {node.icon}
          </div>
        );
      })}
    </div>
  );
}
