import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { AppView, ChatMessage, PhilosopherMeta } from "../types";
import { PHILOSOPHERS } from "../data/philosophers-meta";
import { idbStorage } from "./persistence";

/* ----------------------------------------------------------------
   Which fields to persist vs. treat as ephemeral:

   PERSISTED (survives page refresh — progress data):
     - philosophers        (unlock state)
     - collectedCards
     - exploredNodes
     - chatCount

   EPHEMERAL (reset on refresh — conversation is per-session):
     - messages, turnCount, lastCardTurn, recentMatchedNodes
     - usedQuestions, suggestedQs
     - view, activePhilosopher
     - input, loading
     - showThoughtMap, showCardNodeId, unlockNotif
   ---------------------------------------------------------------- */

export interface AppState {
  // Navigation
  view: AppView;
  setView: (v: AppView) => void;

  // Star map
  philosophers: PhilosopherMeta[];
  setPhilosophers: (fn: (prev: PhilosopherMeta[]) => PhilosopherMeta[]) => void;
  activePhilosopher: PhilosopherMeta | null;
  setActivePhilosopher: (p: PhilosopherMeta | null) => void;

  // Chat
  messages: ChatMessage[];
  setMessages: (msgs: ChatMessage[]) => void;
  addMessage: (msg: ChatMessage) => void;
  input: string;
  setInput: (v: string) => void;
  loading: boolean;
  setLoading: (v: boolean) => void;
  turnCount: number;
  incrementTurn: () => void;
  chatCount: number;
  incrementChatCount: () => void;

  // Knowledge cards & exploration
  collectedCards: string[];
  collectCard: (nodeId: string) => void;
  exploredNodes: string[];
  markExplored: (nodeId: string) => void;
  lastCardTurn: number;
  setLastCardTurn: (n: number) => void;
  recentMatchedNodes: string[];
  pushRecentMatch: (nodeId: string) => void;

  // Suggested questions
  suggestedQs: string[];
  setSuggestedQs: (qs: string[]) => void;
  usedQuestions: Set<string>;
  markQuestionUsed: (q: string) => void;

  // Node hit counts (session-level, for three-state card trigger)
  nodeHitCounts: Record<string, number>;
  incrementNodeHit: (nodeId: string) => void;

  // Preset question click tracking (persisted, per philosopher, for unlock conditions)
  clickedPresetQsByPhilosopher: Record<string, string[]>;
  markPresetClicked: (philosopherId: string, question: string) => void;

  // Modals
  showThoughtMap: boolean;
  setShowThoughtMap: (v: boolean) => void;
  showCardNodeId: string | null;
  setShowCardNodeId: (id: string | null) => void;
  unlockNotif: PhilosopherMeta | null;
  setUnlockNotif: (p: PhilosopherMeta | null) => void;

  // Reset
  resetProgress: () => void;

  // Hydration tracking (for async IDB)
  _hydrated: boolean;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Navigation
      view: "sky" as AppView,
      setView: (v) => set({ view: v }),

      // Star map
      philosophers: PHILOSOPHERS,
      setPhilosophers: (fn) =>
        set((s) => ({ philosophers: fn(s.philosophers) })),
      activePhilosopher: null,
      setActivePhilosopher: (p) => set({ activePhilosopher: p }),

      // Chat
      messages: [],
      setMessages: (msgs) => set({ messages: msgs }),
      addMessage: (msg) => set((s) => ({ messages: [...s.messages, msg] })),
      input: "",
      setInput: (v) => set({ input: v }),
      loading: false,
      setLoading: (v) => set({ loading: v }),
      turnCount: 0,
      incrementTurn: () => set((s) => ({ turnCount: s.turnCount + 1 })),
      chatCount: 0,
      incrementChatCount: () => set((s) => ({ chatCount: s.chatCount + 1 })),

      // Knowledge
      collectedCards: [],
      collectCard: (nodeId) =>
        set((s) =>
          s.collectedCards.includes(nodeId)
            ? s
            : { collectedCards: [...s.collectedCards, nodeId] },
        ),
      exploredNodes: [],
      markExplored: (nodeId) =>
        set((s) =>
          s.exploredNodes.includes(nodeId)
            ? s
            : { exploredNodes: [...s.exploredNodes, nodeId] },
        ),
      lastCardTurn: -10,
      setLastCardTurn: (n) => set({ lastCardTurn: n }),
      recentMatchedNodes: [],
      pushRecentMatch: (nodeId) =>
        set((s) => ({
          recentMatchedNodes: [...s.recentMatchedNodes.slice(-2), nodeId],
        })),

      // Suggested questions
      suggestedQs: [],
      setSuggestedQs: (qs) => set({ suggestedQs: qs }),
      usedQuestions: new Set<string>(),
      markQuestionUsed: (q) =>
        set((s) => ({ usedQuestions: new Set([...s.usedQuestions, q]) })),

      // Node hit counts (session-level)
      nodeHitCounts: {},
      incrementNodeHit: (nodeId) =>
        set((s) => ({
          nodeHitCounts: {
            ...s.nodeHitCounts,
            [nodeId]: (s.nodeHitCounts[nodeId] || 0) + 1,
          },
        })),

      // Preset question click tracking (persisted, per philosopher)
      clickedPresetQsByPhilosopher: {},
      markPresetClicked: (philosopherId, question) =>
        set((s) => {
          const existing = s.clickedPresetQsByPhilosopher[philosopherId] || [];
          if (existing.includes(question)) return s;
          return {
            clickedPresetQsByPhilosopher: {
              ...s.clickedPresetQsByPhilosopher,
              [philosopherId]: [...existing, question],
            },
          };
        }),
      // Modals
      showThoughtMap: false,
      setShowThoughtMap: (v) => set({ showThoughtMap: v }),
      showCardNodeId: null,
      setShowCardNodeId: (id) => set({ showCardNodeId: id }),
      unlockNotif: null,
      setUnlockNotif: (p) => set({ unlockNotif: p }),

      // Reset all persisted progress
      resetProgress: () =>
        set({
          philosophers: PHILOSOPHERS,
          collectedCards: [],
          exploredNodes: [],
          messages: [],
          turnCount: 0,
          chatCount: 0,
          lastCardTurn: -10,
          recentMatchedNodes: [],
          usedQuestions: new Set<string>(),
          suggestedQs: [],
          view: "sky" as AppView,
          activePhilosopher: null,
          nodeHitCounts: {},
          clickedPresetQsByPhilosopher: {},
        }),

      // Hydration tracking
      _hydrated: false,
    }),
    {
      name: "dialogue-with-stars",
      storage: createJSONStorage(() => idbStorage),

      // Persist version for future migrations
      version: 1,

      // Custom serialiser: Set<string> → string[]
      // Custom deserialiser: string[] → Set<string>
      // partialize controls which keys are persisted
      // Only persist progress — conversation resets each session
      partialize: (state) => ({
        philosophers: state.philosophers,
        collectedCards: state.collectedCards,
        exploredNodes: state.exploredNodes,
        chatCount: state.chatCount,
        clickedPresetQsByPhilosopher: state.clickedPresetQsByPhilosopher,
      }),

      // Merge persisted progress back, all conversation fields stay default
      merge: (persisted: any, current) => {
        if (!persisted) return current;
        // Merge philosophers: use code definitions as base, only restore unlocked status from persisted
        const unlockedSet = new Set(
          (persisted.philosophers ?? [])
            .filter((p: any) => p.unlocked)
            .map((p: any) => p.id),
        );
        const mergedPhilosophers = current.philosophers.map((p) =>
          unlockedSet.has(p.id) ? { ...p, unlocked: true } : p,
        );
        return {
          ...current,
          philosophers: mergedPhilosophers,
          collectedCards: persisted.collectedCards ?? current.collectedCards,
          exploredNodes: persisted.exploredNodes ?? current.exploredNodes,
          chatCount: persisted.chatCount ?? current.chatCount,
          clickedPresetQsByPhilosopher: persisted.clickedPresetQsByPhilosopher ?? current.clickedPresetQsByPhilosopher,
          _hydrated: true,
        };
      },

      // Mark hydration complete (also handles case where IDB is empty)
      onRehydrateStorage: () => {
        return (_state, error) => {
          if (error) {
            console.warn("[persist] Hydration error:", error);
          }
          // Always mark as hydrated, even on error
          useAppStore.setState({ _hydrated: true });
        };
      },
    },
  ),
);
