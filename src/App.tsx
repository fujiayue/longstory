import { useEffect, useMemo, useRef, useState } from "react";
import type { UnlockProgress } from "./types";
import { useAppStore } from "./store/app-store";
import { loadPhilosopher } from "./data/philosophers";
import StarField from "./components/StarField";
import Nebula from "./components/Nebula";
import StarMap from "./components/StarMap";
import PhilosopherIntro from "./components/PhilosopherIntro";
import ChatView from "./components/ChatView";
import ThoughtMapModal from "./components/ThoughtMapModal";
import KnowledgeCardModal from "./components/KnowledgeCardModal";
import UnlockBanner from "./components/UnlockBanner";
import type { PhilosopherMeta, ThoughtNode } from "./types";

function AppInner() {
  const store = useAppStore();

  const collectedCardsCount = store.collectedCards.length;

  // ── Drag / pan state ──
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const drag = useRef({ active: false, lastX: 0, lastY: 0, velX: 0, velY: 0 });
  const inertiaId = useRef(0);

  function startInertia() {
    cancelAnimationFrame(inertiaId.current);
    function step() {
      drag.current.velX *= 0.92;
      drag.current.velY *= 0.92;
      if (Math.abs(drag.current.velX) < 0.3 && Math.abs(drag.current.velY) < 0.3) return;
      setOffset((prev) => ({ x: prev.x + drag.current.velX, y: prev.y + drag.current.velY }));
      inertiaId.current = requestAnimationFrame(step);
    }
    inertiaId.current = requestAnimationFrame(step);
  }

  function onTouchStart(e: React.TouchEvent) {
    cancelAnimationFrame(inertiaId.current);
    const t = e.touches[0];
    drag.current = { active: true, lastX: t.clientX, lastY: t.clientY, velX: 0, velY: 0 };
    setIsDragging(true);
  }

  function onTouchMove(e: React.TouchEvent) {
    if (!drag.current.active) return;
    const t = e.touches[0];
    const dx = t.clientX - drag.current.lastX;
    const dy = t.clientY - drag.current.lastY;
    drag.current.velX = dx;
    drag.current.velY = dy;
    drag.current.lastX = t.clientX;
    drag.current.lastY = t.clientY;
    setOffset((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
  }

  function onTouchEnd() {
    drag.current.active = false;
    setIsDragging(false);
    startInertia();
  }

  const activePhilosophers = useMemo(
    () => store.philosophers.filter((p) => p.status === "active"),
    [store.philosophers],
  );

  const unlockProgressMap = useMemo(() => {
    const result: Record<string, UnlockProgress> = {};
    const exploredSet = new Set(store.exploredNodes);
    for (let i = 1; i < activePhilosophers.length; i++) {
      const p = activePhilosophers[i];
      if (p.unlocked) continue;
      const prev = activePhilosophers[i - 1];
      const prevModule = loadPhilosopher(prev.id);
      if (!prevModule) continue;
      const totalNodes = prevModule.outline.length;
      const exploredCount = prevModule.outline.filter((n) => exploredSet.has(n.id)).length;
      const nodeRatio = totalNodes > 0 ? exploredCount / totalNodes : 0;
      const allMacroQs = prevModule.outline.flatMap((n) => n.macroQs || []);
      const totalMacroQs = allMacroQs.length;
      const clickedCount = (store.clickedPresetQsByPhilosopher[prev.id] || []).length;
      const presetRatio = totalMacroQs > 0 ? clickedCount / totalMacroQs : 0;
      result[p.id] = { nodeRatio, presetRatio, prevName: prev.name };
    }
    return result;
  }, [activePhilosophers, store.exploredNodes, store.clickedPresetQsByPhilosopher]);

  useEffect(() => {
    for (const [id, prog] of Object.entries(unlockProgressMap)) {
      const p = store.philosophers.find((x) => x.id === id);
      if (!p || p.unlocked) continue;
      if (prog.nodeRatio >= 0.8 && prog.presetRatio >= 0.5) {
        store.setPhilosophers((prev) =>
          prev.map((x) => (x.id === id ? { ...x, unlocked: true } : x)),
        );
        setTimeout(
          () => store.setUnlockNotif({ ...p, unlocked: true }),
          600,
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unlockProgressMap]);

  const onStarClick = (p: PhilosopherMeta) => {
    store.setActivePhilosopher(p);
    store.setView("intro");
  };

  const startChat = () => {
    store.setMessages([]);
    store.setSuggestedQs([]);
    store.setView("chat");
  };

  const activeModule = loadPhilosopher(store.activePhilosopher?.id ?? "");
  const cardNode: ThoughtNode | null = store.showCardNodeId && activeModule
    ? activeModule.outline.find((n) => n.id === store.showCardNodeId) ?? null
    : null;

  const handleMapNodeClick = (node: ThoughtNode) => {
    store.setShowThoughtMap(false);
    if (node.domainIntro) {
      store.setMessages([
        ...store.messages,
        { role: "assistant", content: node.domainIntro },
      ]);
      const usedQs = useAppStore.getState().usedQuestions;
      const qs = (node.macroQs || []).slice(0, 2).filter(q => !usedQs.has(q));
      store.setSuggestedQs([...qs, "__OPEN_THOUGHT_MAP__"]);
      if (!store.exploredNodes.includes(node.id)) {
        store.markExplored(node.id);
      }
      store.collectCard(node.id);
    }
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100dvh",
        overflow: "hidden",
        background: "#0d1117",
        fontFamily: "'Noto Serif SC','ZCOOL XiaoWei',serif",
        position: "relative",
      }}
    >
      <StarField offsetX={offset.x} offsetY={offset.y} />
      <Nebula />

      {/* ===== SKY VIEW ===== */}
      {store.view === "sky" && (
        <div
          style={{ position: "absolute", inset: 0, zIndex: 1 }}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              zIndex: 100,
              padding: "20px 24px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              background:
                "linear-gradient(to bottom, rgba(13,17,23,0.95) 0%, transparent 100%)",
            }}
          >
            <span
              style={{
                color: "#d8d0c0",
                fontSize: 22,
                fontWeight: 600,
                fontFamily: "'Noto Serif SC',serif",
                letterSpacing: "0.2em",
              }}
            >
              长 话
            </span>
            <span
              style={{
                color: "#5a6a70",
                fontSize: 11,
                marginLeft: 16,
                fontFamily: "'Noto Serif SC',serif",
                letterSpacing: "0.05em",
              }}
            >
              Long Story
            </span>
            {collectedCardsCount > 0 && (
              <span style={{
                position: "absolute",
                right: 24,
                fontSize: 11,
                color: "#4a5a60",
              }}>
                ◯ {collectedCardsCount}
              </span>
            )}
          </div>
          <StarMap
            philosophers={store.philosophers}
            onStarClick={onStarClick}
            unlockProgressMap={unlockProgressMap}
            offsetX={offset.x}
            offsetY={offset.y}
            isDragging={isDragging}
          />
          <div
            style={{
              position: "fixed",
              bottom: 28,
              left: 0,
              right: 0,
              textAlign: "center",
              zIndex: 10,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 12,
            }}
          >
            <div
              style={{
                color: "#4a5a68",
                fontSize: 14,
                fontFamily: "'Noto Serif SC',serif",
              }}
            >
              点亮处，可问道
            </div>
            {(collectedCardsCount > 0 || store.chatCount > 0) && (
              <button
                onClick={() => {
                  if (window.confirm("确定要重置所有进度吗？")) {
                    store.resetProgress();
                  }
                }}
                style={{
                  padding: "5px 14px",
                  borderRadius: 12,
                  background: "transparent",
                  border: "1px solid #1a2830",
                  color: "#3a4a50",
                  fontSize: 11,
                  cursor: "pointer",
                }}
              >
                重置进度
              </button>
            )}
          </div>
        </div>
      )}

      {/* ===== INTRO VIEW ===== */}
      {store.view === "intro" && store.activePhilosopher && (
        <PhilosopherIntro
          philosopher={store.activePhilosopher}
          onStart={startChat}
        />
      )}

      {/* ===== CHAT VIEW ===== */}
      {store.view === "chat" && <ChatView />}

      {/* ===== MODALS ===== */}
      {store.showThoughtMap && activeModule && (
        <ThoughtMapModal
          philosopher={activeModule}
          exploredNodes={store.exploredNodes}
          onClose={() => store.setShowThoughtMap(false)}
          onNodeClick={handleMapNodeClick}
        />
      )}

      <KnowledgeCardModal
        card={cardNode?.card ?? null}
        nodeColor={cardNode?.color ?? "#6b9080"}
        onClose={() => store.setShowCardNodeId(null)}
      />

      <UnlockBanner
        philosopher={store.unlockNotif}
        onDismiss={() => store.setUnlockNotif(null)}
      />
    </div>
  );
}

export default function App() {
  return <AppInner />;
}
