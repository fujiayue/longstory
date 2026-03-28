import { useRef, useEffect } from "react";
import type { ChatMessage } from "../types";
import { useAppStore } from "../store/app-store";
import { callAI } from "../engine/ai-client";
import { selectFragments } from "../engine/fragment-selector";
import { getSuggestedQuestions } from "../engine/question-generator";
import { evaluateCardTrigger } from "../engine/card-trigger";
import { loadPhilosopher, getPresetAnswer } from "../data/philosophers";
import { COORDINATE_PROMPT } from "../prompts/coordinate";
import ChatBubble from "./ChatBubble";
import OutlineProgress from "./OutlineProgress";
import SuggestedQuestions, { MAP_TRIGGER_SENTINEL } from "./SuggestedQuestions";

export default function ChatView() {
  const store = useAppStore();
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const philosopher = loadPhilosopher(store.activePhilosopher?.id ?? "");

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [store.messages]);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 150);
  }, []);

  function pickRandomMacroQs(count: number): string[] {
    const all = philosopher!.outline.flatMap((n) => n.macroQs || []);
    for (let i = all.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [all[i], all[j]] = [all[j], all[i]];
    }
    return all.slice(0, count);
  }

  // Initialize first message — wait for IDB hydration first
  useEffect(() => {
    if (!store._hydrated || !philosopher) return;
    if (store.messages.length === 0) {
      store.setMessages([{ role: "assistant", content: philosopher.greeting }]);
      const initQs = pickRandomMacroQs(2);
      // Mark shown questions as used to prevent repeats
      for (const q of initQs) {
        if (q && q !== MAP_TRIGGER_SENTINEL) store.markQuestionUsed(q);
      }
      store.setSuggestedQs([...initQs, MAP_TRIGGER_SENTINEL]);
    } else if (store.suggestedQs.length === 0) {
      const snap = useAppStore.getState();
      const lastUserMsg = [...snap.messages].reverse().find((m) => m.role === "user");
      if (lastUserMsg) {
        const sel = selectFragments(
          lastUserMsg.content,
          snap.messages,
          snap.exploredNodes,
          snap.turnCount,
          snap.recentMatchedNodes,
          { outline: philosopher.outline, translations: philosopher.translations, deepFrameworks: philosopher.deepFrameworks },
        );
        const qs = getSuggestedQuestions({
          mainNode: sel.mainNode,
          stage: sel.stage,
          focusTerm: sel.focusTerm,
          exploredNodes: snap.exploredNodes,
          usedQuestions: snap.usedQuestions,
          allNodes: philosopher.outline,
          nodeHitCounts: snap.nodeHitCounts || {},
        });
        // Mark shown questions as used to prevent repeats
        for (const q of qs) {
          if (q && q !== MAP_TRIGGER_SENTINEL) store.markQuestionUsed(q);
        }
        store.setSuggestedQs([...qs.slice(0, 2), MAP_TRIGGER_SENTINEL]);
      } else {
        const initQs = pickRandomMacroQs(2);
        // Mark shown questions as used to prevent repeats
        for (const q of initQs) {
          if (q && q !== MAP_TRIGGER_SENTINEL) store.markQuestionUsed(q);
        }
        store.setSuggestedQs([...initQs, MAP_TRIGGER_SENTINEL]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store._hydrated]);

  const handleSuggestedClick = (q: string) => {
    if (q === MAP_TRIGGER_SENTINEL) {
      store.setShowThoughtMap(true);
    } else {
      const preset = getPresetAnswer(store.activePhilosopher?.id ?? "", q);
      if (preset) {
        doPreset(q, preset);
      } else {
        doSend(q);
      }
    }
  };

  const doPreset = async (question: string, answer: string) => {
    if (!philosopher) return;
    store.setInput("");
    store.setSuggestedQs([]);
    store.markQuestionUsed(question.trim());
    store.incrementChatCount();
    store.incrementTurn();

    const userMsg: ChatMessage = { role: "user", content: question.trim() };
    const prevMessages = useAppStore.getState().messages;

    // 先显示"思考中"状态，模拟 AI 响应延迟
    store.setMessages([...prevMessages, userMsg, { role: "assistant", content: "", thinking: true }]);
    store.setLoading(true);

    // 根据答案长度计算延迟：800ms~2500ms
    const delay = Math.min(800 + answer.length * 8, 2500);
    await new Promise((r) => setTimeout(r, delay));

    const newMsgs: ChatMessage[] = [...prevMessages, userMsg, { role: "assistant", content: answer }];
    store.setMessages(newMsgs);
    store.setLoading(false);

    // 用 selectFragments 做节点匹配，生成下一轮建议问题
    const snap = useAppStore.getState();
    const sel = selectFragments(
      question + " " + answer,
      newMsgs,
      snap.exploredNodes,
      snap.turnCount,
      snap.recentMatchedNodes,
      { outline: philosopher.outline, translations: philosopher.translations, deepFrameworks: philosopher.deepFrameworks },
    );
    if (sel.matchedNodeId) store.pushRecentMatch(sel.matchedNodeId);

    // Card trigger logic (same as doSend)
    const snap2 = useAppStore.getState();
    const cardResult = evaluateCardTrigger({
      matchedNodeId: sel.matchedNodeId,
      nodeHitCounts: snap2.nodeHitCounts,
      exploredNodes: snap2.exploredNodes,
      outline: philosopher.outline,
    });
    if (cardResult.node) {
      store.incrementNodeHit(cardResult.node.id);
    }
    if (cardResult.markExplored && cardResult.node) {
      store.markExplored(cardResult.node.id);
      store.collectCard(cardResult.node.id);
      if (cardResult.showCard) {
        setTimeout(() => useAppStore.getState().setShowCardNodeId(cardResult.node!.id), 1500);
      }
    }

    const latestState = useAppStore.getState();
    const nextQs = getSuggestedQuestions({
      mainNode: sel.mainNode,
      stage: sel.stage,
      focusTerm: sel.focusTerm,
      exploredNodes: latestState.exploredNodes,
      usedQuestions: latestState.usedQuestions,
      allNodes: philosopher.outline,
      nodeHitCounts: latestState.nodeHitCounts || {},
    });
    for (const q of nextQs) {
      if (q && q !== MAP_TRIGGER_SENTINEL) store.markQuestionUsed(q);
    }
    store.setSuggestedQs([...nextQs.slice(0, 2), MAP_TRIGGER_SENTINEL]);
  };

  const doSend = async (text: string) => {
    if (!text.trim() || store.loading || !philosopher) return;
    store.setInput("");
    store.setSuggestedQs([]);
    store.markQuestionUsed(text.trim());

    const userMsg: ChatMessage = { role: "user", content: text.trim() };
    const prevMessages = useAppStore.getState().messages;
    const newMsgs: ChatMessage[] = [...prevMessages, userMsg];
    store.setMessages([...newMsgs, { role: "assistant", content: "", thinking: true }]);
    store.setLoading(true);
    store.incrementChatCount();
    store.incrementTurn();
    const newTurn = useAppStore.getState().turnCount;

    try {
      const fullPrompt = philosopher.buildPrompt(
        text,
        prevMessages,
        useAppStore.getState().exploredNodes,
        newTurn,
        useAppStore.getState().recentMatchedNodes,
      );
      const apiMsgs = newMsgs
        .filter((m) => !m.isCoordinate)
        .map((m) => ({ role: m.role, content: m.content }));
      const reply = await callAI(fullPrompt, apiMsgs, 1024);
      // Parse AI node tag [NODE:xxx]
      const nodeTagMatch = (reply || "").match(/\[NODE:(\w+)\]/);
      const aiTaggedNodeId = nodeTagMatch ? nodeTagMatch[1] : null;
      // Strip tag from displayed reply
      const cleanReply = (reply || "").replace(/\s*\[NODE:\w+\]\s*$/, "").trim() || "……让我想想。";
      let finalMsgs: ChatMessage[] = [
        ...newMsgs,
        { role: "assistant", content: cleanReply },
      ];

      const postAwaitSnap = useAppStore.getState();
      const selection = selectFragments(
        text + " " + reply,
        newMsgs,
        postAwaitSnap.exploredNodes,
        newTurn,
        postAwaitSnap.recentMatchedNodes,
        { outline: philosopher.outline, translations: philosopher.translations, deepFrameworks: philosopher.deepFrameworks },
      );
      // AI tag takes priority over keyword match
      const effectiveNodeId = aiTaggedNodeId
        && philosopher.outline.some(n => n.id === aiTaggedNodeId)
        ? aiTaggedNodeId
        : selection.matchedNodeId;
      const effectiveMainNode = effectiveNodeId
        ? philosopher.outline.find(n => n.id === effectiveNodeId) ?? selection.mainNode
        : selection.mainNode;
      const { stage, focusTerm } = selection;
      if (effectiveNodeId) store.pushRecentMatch(effectiveNodeId);

      const snap2 = useAppStore.getState();
      const cardResult = evaluateCardTrigger({
        matchedNodeId: effectiveNodeId,
        nodeHitCounts: snap2.nodeHitCounts,
        exploredNodes: snap2.exploredNodes,
        outline: philosopher.outline,
      });

      let nextExploredNodes = [...snap2.exploredNodes];
      // Always increment hit count if a node was matched
      if (cardResult.node) {
        store.incrementNodeHit(cardResult.node.id);
      }
      if (cardResult.markExplored && cardResult.node) {
        store.markExplored(cardResult.node.id);
        store.collectCard(cardResult.node.id);
        nextExploredNodes = [...snap2.exploredNodes, cardResult.node.id];
        if (cardResult.showCard) {
          setTimeout(() => useAppStore.getState().setShowCardNodeId(cardResult.node!.id), 1500);
        }
      }

      if (newTurn > 0 && newTurn % 5 === 0) {
        try {
          const cc = finalMsgs
            .filter((m) => !m.isCoordinate)
            .slice(-8)
            .map((m) => `${m.role === "user" ? "用户" : "哲人"}：${m.content}`)
            .join("\n");
          const coord = await callAI(COORDINATE_PROMPT, [{ role: "user", content: cc }], 200);
          if (coord) {
            finalMsgs = [...finalMsgs, { role: "assistant" as const, content: coord, isCoordinate: true }];
          }
        } catch {
          // ignore coordinate errors
        }
      }

      store.setMessages(finalMsgs);

      setTimeout(() => {
        const latestState = useAppStore.getState();
        const qs = getSuggestedQuestions({
          mainNode: effectiveMainNode,
          stage,
          focusTerm,
          exploredNodes: nextExploredNodes,
          usedQuestions: latestState.usedQuestions,
          allNodes: philosopher.outline,
          nodeHitCounts: latestState.nodeHitCounts || {},
        });
        // Mark shown questions as used to prevent repeats
        for (const q of qs) {
          if (q && q !== MAP_TRIGGER_SENTINEL) store.markQuestionUsed(q);
        }
        store.setSuggestedQs([...qs.slice(0, 2), MAP_TRIGGER_SENTINEL]);
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

  if (!philosopher) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100dvh", color: "#555" }}>
        哲学家内容尚未载入
      </div>
    );
  }

  return (
    <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", height: "100dvh" }}>
      {/* Header */}
      <div style={{
        padding: "12px 16px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        background: "rgba(8,8,16,0.92)",
        borderBottom: "1px solid #1a1a2a",
        flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button
            onClick={() => store.setView("sky")}
            style={{
              background: "none", border: "1px solid #2a2a40", borderRadius: 8,
              color: "#7a7a9a", padding: "5px 10px", cursor: "pointer", fontSize: 11,
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
        <OutlineProgress outline={philosopher.outline} exploredNodes={store.exploredNodes} />
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px 8px", maxWidth: 680, width: "100%", margin: "0 auto" }}>
        {store.messages.map((m, i) => (
          <ChatBubble key={i} msg={m} philosopher={store.activePhilosopher} />
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
        <div style={{
          display: "flex", gap: 10, alignItems: "flex-end",
          background: "rgba(14,14,26,0.85)", border: "1px solid #222238",
          borderRadius: 16, padding: "12px 16px", backdropFilter: "blur(12px)",
        }}>
          <textarea
            ref={inputRef}
            value={store.input}
            onChange={(e) => store.setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); doSend(store.input); }
            }}
            placeholder="说点什么……"
            rows={1}
            style={{
              flex: 1, background: "transparent", border: "none",
              color: "#c8c8e0", fontSize: 15, fontFamily: "'Noto Serif SC',serif",
              resize: "none", lineHeight: 1.65, maxHeight: 120,
            }}
          />
          <button
            onClick={() => doSend(store.input)}
            disabled={store.loading || !store.input.trim()}
            style={{
              width: 42, height: 42, borderRadius: 11,
              background: store.loading || !store.input.trim() ? "#1a1a28" : "linear-gradient(140deg,#F5C542,#C89520)",
              border: store.loading || !store.input.trim() ? "1px solid #2a2a3a" : "none",
              cursor: store.loading || !store.input.trim() ? "default" : "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 20, color: "#0f0f1e", flexShrink: 0,
            }}
          >
            {store.loading ? <span className="thinking-dots" style={{ color: "#555" }}>·</span> : "↑"}
          </button>
        </div>
      </div>
    </div>
  );
}
