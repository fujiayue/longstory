import type { PhilosopherMeta, ConstellationEdge } from "../types";

export const PHILOSOPHERS: PhilosopherMeta[] = [
  { id: "socrates", name: "苏格拉底", en: "Socrates", era: "469-399 BC", x: 50, y: 38, unlocked: true, avatar: "Σ", color: "#F5C542", brief: "古希腊哲学之父，以反诘法闻名于世" },
  { id: "plato", name: "柏拉图", en: "Plato", era: "428-348 BC", x: 35, y: 28, unlocked: false, avatar: "Π", color: "#7EB8DA", brief: "理念论的创立者", requireCards: 3, requireChats: 6 },
  { id: "aristotle", name: "亚里士多德", en: "Aristotle", era: "384-322 BC", x: 22, y: 42, unlocked: false, avatar: "Α", color: "#A8D5A2", brief: "逻辑学之父" },
  { id: "epicurus", name: "伊壁鸠鲁", en: "Epicurus", era: "341-270 BC", x: 65, y: 22, unlocked: false, avatar: "Ε", color: "#E8A87C", brief: "快乐主义哲学" },
  { id: "zeno", name: "芝诺", en: "Zeno", era: "334-262 BC", x: 73, y: 45, unlocked: false, avatar: "Ζ", color: "#B8B8D1", brief: "斯多葛学派" },
  { id: "augustine", name: "奥古斯丁", en: "Augustine", era: "354-430", x: 42, y: 55, unlocked: false, avatar: "A", color: "#D4A5C9", brief: "基督教哲学" },
  { id: "descartes", name: "笛卡尔", en: "Descartes", era: "1596-1650", x: 58, y: 62, unlocked: false, avatar: "D", color: "#82C4C3", brief: "我思故我在" },
  { id: "kant", name: "康德", en: "Kant", era: "1724-1804", x: 28, y: 68, unlocked: false, avatar: "K", color: "#F0E6AA", brief: "批判哲学" },
  { id: "nietzsche", name: "尼采", en: "Nietzsche", era: "1844-1900", x: 75, y: 70, unlocked: false, avatar: "N", color: "#E87461", brief: "超人哲学" },
];

export const CONSTELLATIONS: ConstellationEdge[] = [
  ["socrates", "plato"],
  ["plato", "aristotle"],
  ["socrates", "epicurus"],
  ["socrates", "zeno"],
  ["plato", "augustine"],
  ["augustine", "descartes"],
  ["descartes", "kant"],
  ["kant", "nietzsche"],
];

