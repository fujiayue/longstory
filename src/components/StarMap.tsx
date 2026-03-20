import type { PhilosopherMeta } from "../types";
import ConstellationLines from "./ConstellationLines";
import StarNode from "./StarNode";

interface Props {
  philosophers: PhilosopherMeta[];
  onStarClick: (p: PhilosopherMeta) => void;
  progress: { cards: number; chats: number };
}

export default function StarMap({ philosophers, onStarClick, progress }: Props) {
  return (
    <div style={{ position: "relative", zIndex: 1, width: "100%", height: "100%" }}>
      <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }} preserveAspectRatio="xMidYMid meet">
        <ConstellationLines philosophers={philosophers} />
        {philosophers.map((p) => (
          <StarNode key={p.id} p={p} onClick={onStarClick} progress={progress} />
        ))}
      </svg>
    </div>
  );
}
