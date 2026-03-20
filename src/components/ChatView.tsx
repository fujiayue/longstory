import { useRef, useEffect } from "react";
import type { ChatMessage } from "../types";
import { useAppStore } from "../store/app-store";
import { callAI } from "../engine/ai-client";
import { selectFragments } from "../engine/fragment-selector";
import { getSuggestedQuestions } from "../engine/question-generator";
import { evaluateCardTrigger } from "../engine/card-trigger";
import { buildSocratesPrompt } from "../prompts/socrates";
import { COORDINATE_PROMPT } from "../prompts/coordinate";
import {
  THOUGHT_OUTLINE,
  TRANSLATION_FRAGMENTS,
  DEEP_FRAMEWORKS,
} from "../data/philosophers/socrates";
import ChatBubble from "./ChatBubble";
import OutlineProgress from "./OutlineProgress";
import SuggestedQuestions, { MAP_TRIGGER_SENTINEL } from "./SuggestedQuestions";

export default function ChatView() {
  const store = useAppStore();
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [store.messages]);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 150);
  }, []);

  // Initialize first message — wait for IDB hydration first
  useEffect(() => {
    if (!store._hydrated) return;
    if (store.messages.length === 0) {
      // Fresh start — show greeting
      store.setMessages([
        {
          role: "assistant",
          content:
            "你好，朋友。你来找我，是有什么困惑，还是只是路过雅典的市集？不过我得提醒你——跟我聊天的人，最后往往比开始时更困惑。",
        },
      ]);
      const initQs = [
        THOUGHT_OUTLINE[0].macroQs[0],
        THOUGHT_OUTLINE[3].macroQs[0],
      ];
      store.setSuggestedQs([...initQs, MAP_TRIGGER_SENTINEL]);
    } else if (store.suggestedQs.length === 0) {
      // Resuming persisted conversation — regenerate suggestions
      const snap = useAppStore.getState();
      const lastUserMsg = [...snap.messages].reverse().find((m) => m.role === "user");
      if (lastUserMsg) {
        const sel = selectFragments(
          lastUserMsg.content,
          snap.messages,
          snap.exploredNodes,
          snap.turnCount,
          snap.recentMatchedNodes,
          { outline: THOUGHT_OUTLINE, translations: TRANSLATION_FRAGMENTS, deepFrameworks: DEEP_FRAMEWORKS },
        );
        const qs = getSuggestedQuestions({
          mainNode: sel.mainNode,
          stage: sel.stage,
          focusTerm: sel.focusTerm,
          exploredNodes: snap.exploredNodes,
          usedQuestions: snap.usedQuestions,
          hitKeywords: sel.hitKeywords,
          allNodes: THOUGHT_OUTLINE,
        });
        store.setSuggestedQs([...qs.slice(0, 2), MAP_TRIGGER_SENTINEL]);
      } else {
        // Only assistant messages — offer starting questions
        const initQs = [
          THOUGHT_OUTLINE[0].macroQs[0],
          THOUGHT_OUTLINE[3].macroQs[0],
        ];
        store.setSuggestedQs([...initQs, MAP_TRIGGER_SENTINEL]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store._hydrated]);

  const handleSuggestedClick = (q: string) => {
    if (q === MAP_TRIGGER_SENTINEL) {
      store.setShowThoughtMap(true);
    } else {
      doSend(q);
    }
  };

  const doSend = async (text: string) => {
    if (!text.trim() || store.loading) return;
    store.setInput("");
    store.setSuggestedQs([]);
    store.markQuestionUsed(text.trim());

    const userMsg: ChatMessage = { role: "user", content: text.trim() };
    const prevMessages = useAppStore.getState().messages;
    const newMsgs: ChatMessage[] = [...prevMessages, userMsg];
    store.setMessages([
      ...newMsgs,
      { role: "assistant", content: "", thinking: true },
    ]);
    store.setLoading(true);
    store.incrementChatCount();
    store.incrementTurn();
    // Read the updated turnCount from store directly after sync batch
    const newTurn = useAppStore.getState().turnCount;

    try {
      const fullPrompt = buildSocratesPrompt(
        text,
        prevMessages, // context = conversation before this user message
        useAppStore.getState().exploredNodes,
        newTurn,
        useAppStore.getState().recentMatchedNodes,
      );
      const apiMsgs = newMsgs
        .filter((m) => !m.isCoordinate)
        .map((m) => ({ role: m.role, content: m.content }));
      const reply = await callAI(fullPrompt, apiMsgs, 1024);
      let finalMsgs: ChatMessage[] = [
        ...newMsgs,
        { role: "assistant", content: reply || "……让我想想。" },
      ];

      // Fragment selection — use fresh state after await
      const postAwaitSnap = useAppStore.getState();
      const selection = selectFragments(
        text + " " + reply,
        newMsgs,
        postAwaitSnap.exploredNodes,
        newTurn,
        postAwaitSnap.recentMatchedNodes,
        { outline: THOUGHT_OUTLINE, translations: TRANSLATION_FRAGMENTS, deepFrameworks: DEEP_FRAMEWORKS },
      );
      const { matchedNodeId, mainNode, stage, focusTerm, hitKeywords } = selection;
      if (matchedNodeId) store.pushRecentMatch(matchedNodeId);

      // Card trigger
      const snap2 = useAppStore.getState();
      const cardResult = evaluateCardTrigger({
        matchedNodeId,
        exploredNodes: snap2.exploredNodes,
        turnCount: newTurn,
        lastCardTurn: snap2.lastCardTurn,
        outline: THOUGHT_OUTLINE,
      });

      let nextExploredNodes = [...snap2.exploredNodes];
      if (cardResult.markExplored && cardResult.node) {
        store.markExplored(cardResult.node.id);
        nextExploredNodes = [...snap2.exploredNodes, cardResult.node.id];
        if (cardResult.showCard) {
          store.setLastCardTurn(newTurn);
          setTimeout(() => useAppStore.getState().setShowCardNodeId(cardResult.node!.id), 1500);
        }
      }

      // Thought coordinate (every 5 turns)
      if (newTurn > 0 && newTurn % 5 === 0) {
        try {
          const cc = finalMsgs
            .filter((m) => !m.isCoordinate)
            .slice(-8)
            .map((m) => `${m.role === "user" ? "用户" : "哲人"}：${m.content}`)
            .join("\n");
          const coord = await callAI(COORDINATE_PROMPT, [{ role: "user", content: cc }], 200);
          if (coord) {
            finalMsgs = [
              ...finalMsgs,
              { role: "assistant" as const, content: coord, isCoordinate: true },
            ];
          }
        } catch {
          // ignore coordinate errors
        }
      }

      store.setMessages(finalMsgs);

      // Suggested questions
      setTimeout(() => {
        const latestState = useAppStore.getState();
        const qs = getSuggestedQuestions({
          mainNode,
          stage,
          focusTerm,
          exploredNodes: nextExploredNodes,
          usedQuestions: latestState.usedQuestions,
          hitKeywords,
          allNodes: THOUGHT_OUTLINE,
        });
        const finalQs = qs.slice(0, 2);
        finalQs.push(MAP_TRIGGER_SENTINEL);
        store.setSuggestedQs(finalQs);
      }, 300);
    } catch (e: any) {
      console.error("API error:", e);
      store.setMessages([
        ...newMsgs,
        { role: "assistant", content: `（连接出了问题：${e.message}）` },
      ]);
    }
    store.setLoading(false);
  };

  return (
    <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", height: "100dvh" }}>
      {/* Header */}
      <div
        style={{
          padding: "12px 16px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "rgba(8,8,16,0.92)",
          borderBottom: "1px solid #1a1a2a",
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button
            onClick={() => store.setView("sky")}
            style={{
              background: "none",
              border: "1px solid #2a2a40",
              borderRadius: 8,
              color: "#7a7a9a",
              padding: "5px 10px",
              cursor: "pointer",
              fontSize: 11,
            }}
          >
            ← 星图
          </button>
          <span style={{ color: "#c8c8e0", fontSize: 14, fontWeight: 600, fontFamily: "'Noto Serif SC',serif" }}>
            {store.activePhilosopher?.name}
          </span>
          <span style={{ color: "#555", fontSize: 11 }}>
            ✦{store.collectedCards.length} 💬{store.chatCount}
          </span>
        </div>
        <OutlineProgress exploredNodes={store.exploredNodes} />
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px 8px", maxWidth: 680, width: "100%", margin: "0 auto" }}>
        {store.messages.map((m, i) => (
          <ChatBubble key={i} msg={m} />
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Bottom input */}
      <div style={{ padding: "8px 20px 18px", maxWidth: 680, width: "100%", margin: "0 auto", flexShrink: 0 }}>
        {store.suggestedQs.length > 0 && !store.loading && (
          <SuggestedQuestions
            questions={store.suggestedQs}
            turnCount={store.turnCount}
            onSelect={handleSuggestedClick}
          />
        )}
        <div
          style={{
            display: "flex",
            gap: 10,
            alignItems: "flex-end",
            background: "rgba(14,14,26,0.85)",
            border: "1px solid #222238",
            borderRadius: 16,
            padding: "12px 16px",
            backdropFilter: "blur(12px)",
          }}
        >
          <textarea
            ref={inputRef}
            value={store.input}
            onChange={(e) => store.setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                doSend(store.input);
              }
            }}
            placeholder="说点什么……"
            rows={1}
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              color: "#c8c8e0",
              fontSize: 15,
              fontFamily: "'Noto Serif SC',serif",
              resize: "none",
              lineHeight: 1.65,
              maxHeight: 120,
            }}
          />
          <button
            onClick={() => doSend(store.input)}
            disabled={store.loading || !store.input.trim()}
            style={{
              width: 42,
              height: 42,
              borderRadius: 11,
              background:
                store.loading || !store.input.trim()
                  ? "#1a1a28"
                  : "linear-gradient(140deg,#F5C542,#C89520)",
              border:
                store.loading || !store.input.trim()
                  ? "1px solid #2a2a3a"
                  : "none",
              cursor:
                store.loading || !store.input.trim() ? "default" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 20,
              color: "#0f0f1e",
              flexShrink: 0,
            }}
          >
            {store.loading ? (
              <span className="thinking-dots" style={{ color: "#555" }}>·</span>
            ) : (
              "↑"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
