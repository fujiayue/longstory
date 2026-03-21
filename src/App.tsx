import { useEffect, useMemo } from "react";
import { useAppStore } from "./store/app-store";
import { THOUGHT_OUTLINE } from "./data/philosophers/socrates";
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

  const progress = useMemo(
    () => ({ cards: store.collectedCards.length, chats: store.chatCount }),
    [store.collectedCards.length, store.chatCount],
  );

  // Check Plato unlock
  useEffect(() => {
    const plato = store.philosophers.find((p) => p.id === "plato");
    if (
      plato &&
      !plato.unlocked &&
      progress.cards >= (plato.requireCards ?? 99) &&
      progress.chats >= (plato.requireChats ?? 99)
    ) {
      store.setPhilosophers((prev) =>
        prev.map((p) => (p.id === "plato" ? { ...p, unlocked: true } : p)),
      );
      setTimeout(
        () => store.setUnlockNotif({ ...plato, unlocked: true }),
        600,
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress.cards, progress.chats]);

  const onStarClick = (p: PhilosopherMeta) => {
    store.setActivePhilosopher(p);
    // Always show intro page first
    store.setView("intro");
  };

  const startChat = () => {
    // Fresh conversation each time
    store.setMessages([]);
    store.setSuggestedQs([]);
    store.setView("chat");
  };

  // Resolve card node for the modal
  const cardNode: ThoughtNode | null = store.showCardNodeId
    ? THOUGHT_OUTLINE.find((n) => n.id === store.showCardNodeId) ?? null
    : null;

  // Handle map node click — inject domain intro
  const handleMapNodeClick = (node: ThoughtNode) => {
    store.setShowThoughtMap(false);
    if (node.domainIntro) {
      store.setMessages([
        ...store.messages,
        { role: "assistant", content: node.domainIntro },
      ]);
      const qs = (node.coreQuestions || node.macroQs || []).slice(0, 2);
      store.setSuggestedQs([...qs, "__OPEN_THOUGHT_MAP__"]);
      if (!store.exploredNodes.includes(node.id)) {
        store.markExplored(node.id);
      }
    }
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100dvh",
        overflow: "hidden",
        background: "#080810",
        fontFamily: "'Noto Serif SC','Cormorant Garamond',serif",
        position: "relative",
      }}
    >
      <StarField />
      <Nebula />

      {/* ===== SKY VIEW ===== */}
      {store.view === "sky" && (
        <>
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              zIndex: 100,
              padding: "18px 24px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              background:
                "linear-gradient(to bottom, rgba(8,8,16,0.92) 0%, transparent 100%)",
            }}
          >
            <span
              style={{
                color: "#d8d8f0",
                fontSize: 22,
                fontWeight: 700,
                fontFamily: "'Cormorant Garamond',serif",
                letterSpacing: "0.12em",
              }}
            >
              ✦ DIALOGUE WITH THE STARS ✦
            </span>
            {/* Progress indicator */}
            {(progress.cards > 0 || progress.chats > 0) && (
              <span style={{
                position: "absolute",
                right: 24,
                fontSize: 11,
                color: "#555",
              }}>
                ✦{progress.cards} 💬{progress.chats}
              </span>
            )}
          </div>
          <StarMap
            philosophers={store.philosophers}
            onStarClick={onStarClick}
            progress={progress}
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
                color: "#505068",
                fontSize: 14,
                fontFamily: "'Cormorant Garamond',serif",
                fontStyle: "italic",
              }}
            >
              点击亮起的星辰，开始对话
            </div>
            {/* Reset button — only show when there's progress */}
            {(progress.cards > 0 || progress.chats > 0) && (
              <button
                onClick={() => {
                  if (window.confirm("确定要重置所有进度吗？对话记录、卡片收藏、解锁状态都会清空。")) {
                    store.resetProgress();
                  }
                }}
                style={{
                  padding: "5px 14px",
                  borderRadius: 12,
                  background: "transparent",
                  border: "1px solid #2a2a3a",
                  color: "#444",
                  fontSize: 11,
                  cursor: "pointer",
                }}
              >
                重置进度
              </button>
            )}
          </div>
        </>
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
      {store.showThoughtMap && (
        <ThoughtMapModal
          exploredNodes={store.exploredNodes}
          onClose={() => store.setShowThoughtMap(false)}
          onNodeClick={handleMapNodeClick}
        />
      )}

      <KnowledgeCardModal
        card={cardNode?.card ?? null}
        nodeColor={cardNode?.color ?? "#F5C542"}
        onClose={() => store.setShowCardNodeId(null)}
        onCollect={() => {
          if (cardNode) store.collectCard(cardNode.id);
        }}
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
