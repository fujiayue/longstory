import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { AppView, ChatMessage, PhilosopherMeta } from "../types";
import { PHILOSOPHERS } from "../data/philosophers-meta";
import { idbStorage } from "./persistence";

/* ----------------------------------------------------------------
   Which fields to persist vs. treat as ephemeral:

   PERSISTED (survives page refresh):
     - philosophers        (unlock state)
     - collectedCards
     - exploredNodes
     - chatCount
     - messages            (resume conversation)
     - turnCount
     - lastCardTurn
     - recentMatchedNodes
     - usedQuestions        (serialised as array, rehydrated as Set)

   EPHEMERAL (reset on refresh):
     - view, apiReady, activePhilosopher  (re-enter from sky)
     - input, loading                     (UI transient)
     - suggestedQs                        (regenerated)
     - showThoughtMap, showCardNodeId, unlockNotif (modals)
   ---------------------------------------------------------------- */

export interface AppState {
  // Navigation
  view: AppView;
  setView: (v: AppView) => void;

  // API ready
  apiReady: boolean;
  setApiReady: (v: boolean) => void;

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

      // API
      apiReady: false,
      setApiReady: (v) => set({ apiReady: v }),

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
      partialize: (state) => ({
        philosophers: state.philosophers,
        collectedCards: state.collectedCards,
        exploredNodes: state.exploredNodes,
        chatCount: state.chatCount,
        messages: state.messages,
        turnCount: state.turnCount,
        lastCardTurn: state.lastCardTurn,
        recentMatchedNodes: state.recentMatchedNodes,
        // Serialize Set as array for JSON storage
        usedQuestions: [...state.usedQuestions] as any,
      }),

      // Merge persisted state back, converting arrays to Sets
      merge: (persisted: any, current) => {
        if (!persisted) return current;
        return {
          ...current,
          ...persisted,
          // Rehydrate Set from persisted array
          usedQuestions: new Set<string>(
            Array.isArray(persisted.usedQuestions)
              ? persisted.usedQuestions
              : [],
          ),
          // Ensure ephemeral fields stay at defaults
          view: "sky" as AppView,
          apiReady: false,
          activePhilosopher: null,
          input: "",
          loading: false,
          suggestedQs: [],
          showThoughtMap: false,
          showCardNodeId: null,
          unlockNotif: null,
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
