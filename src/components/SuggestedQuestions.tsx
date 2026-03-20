export const MAP_TRIGGER_SENTINEL = "__OPEN_THOUGHT_MAP__";

export function getMapTriggerLabel(turnCount: number): string {
  if (turnCount <= 2) return "你被判死刑，到底是因为什么？";
  if (turnCount <= 6) return "你的这些想法，彼此之间有联系吗？";
  return "你刚才说的这些，在你的整个思想里是什么位置？";
}

interface Props {
  questions: string[];
  turnCount: number;
  onSelect: (q: string) => void;
}

export default function SuggestedQuestions({ questions, turnCount, onSelect }: Props) {
  if (questions.length === 0) return null;

  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10, animation: "fadeIn 0.4s ease" }}>
      {questions.map((q, i) => {
        if (q === MAP_TRIGGER_SENTINEL) {
          const label = getMapTriggerLabel(turnCount);
          return (
            <button
              key="map-trigger"
              onClick={() => onSelect(q)}
              style={{
                padding: "7px 14px",
                borderRadius: 18,
                fontSize: 12.5,
                cursor: "pointer",
                background: "rgba(245,197,66,0.08)",
                border: "1px solid rgba(245,197,66,0.2)",
                color: "#F5C542",
                fontFamily: "'Noto Serif SC',serif",
                maxWidth: "100%",
                textAlign: "left",
                lineHeight: 1.5,
                fontWeight: 500,
              }}
            >
              ✦ {label}
            </button>
          );
        }
        return (
          <button
            key={i}
            onClick={() => onSelect(q)}
            style={{
              padding: "7px 14px",
              borderRadius: 18,
              fontSize: 12.5,
              cursor: "pointer",
              background: "rgba(245,197,66,0.05)",
              border: "1px solid rgba(245,197,66,0.12)",
              color: "#9898b0",
              fontFamily: "'Noto Serif SC',serif",
              maxWidth: "100%",
              textAlign: "left",
              lineHeight: 1.5,
            }}
          >
            {q}
          </button>
        );
      })}
    </div>
  );
}
