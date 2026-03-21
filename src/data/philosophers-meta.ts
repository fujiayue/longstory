import type { PhilosopherMeta, ConstellationEdge } from "../types";

export const PHILOSOPHERS: PhilosopherMeta[] = [
  // ── Phase 1: 已有内容或正在制作 ─────────────────────────────
  { id: "socrates",  name: "苏格拉底", en: "Socrates",  era: "469–399 BC",  x: 50, y: 38, unlocked: true,  avatar: "Σ", color: "#F5C542", brief: "古希腊哲学之父，以反诘法闻名于世", status: "active" },
  { id: "plato",     name: "柏拉图",   en: "Plato",     era: "428–348 BC",  x: 35, y: 24, unlocked: false, avatar: "Π", color: "#7EB8DA", brief: "理念论的创立者",        status: "active", requireCards: 3, requireChats: 6 },
  { id: "aristotle", name: "亚里士多德", en: "Aristotle", era: "384–322 BC", x: 20, y: 40, unlocked: false, avatar: "Α", color: "#A8D5A2", brief: "逻辑学之父",            status: "active" },
  { id: "epicurus",  name: "伊壁鸠鲁", en: "Epicurus",  era: "341–270 BC",  x: 66, y: 20, unlocked: false, avatar: "Ε", color: "#E8A87C", brief: "快乐主义哲学",          status: "active" },
  { id: "zeno",      name: "芝诺",     en: "Zeno",      era: "334–262 BC",  x: 76, y: 42, unlocked: false, avatar: "Ζ", color: "#B8B8D1", brief: "斯多葛学派创始人",     status: "active" },
  { id: "augustine", name: "奥古斯丁", en: "Augustine", era: "354–430",     x: 40, y: 56, unlocked: false, avatar: "A", color: "#D4A5C9", brief: "基督教哲学奠基者",     status: "active" },
  { id: "aquinas",   name: "阿奎那",   en: "Aquinas",   era: "1225–1274",   x: 60, y: 62, unlocked: false, avatar: "T", color: "#C4A882", brief: "信仰与理性的综合者",   status: "active" },
  { id: "kant",      name: "康德",     en: "Kant",      era: "1724–1804",   x: 26, y: 70, unlocked: false, avatar: "K", color: "#F0E6AA", brief: "批判哲学",              status: "active" },

  // ── Phase 2+: Coming soon ────────────────────────────────────
  { id: "descartes",     name: "笛卡尔",    en: "Descartes",     era: "1596–1650", x: 56, y: 68, unlocked: false, avatar: "D", color: "#82C4C3", brief: "我思故我在",             status: "coming-soon" },
  { id: "hegel",         name: "黑格尔",    en: "Hegel",         era: "1770–1831", x: 14, y: 80, unlocked: false, avatar: "H", color: "#9BB5D4", brief: "辩证法与绝对精神",     status: "coming-soon" },
  { id: "schopenhauer",  name: "叔本华",    en: "Schopenhauer",  era: "1788–1860", x: 40, y: 82, unlocked: false, avatar: "S", color: "#C4A8B8", brief: "意志与悲观主义",       status: "coming-soon" },
  { id: "marx",          name: "马克思",    en: "Marx",          era: "1818–1883", x: 58, y: 78, unlocked: false, avatar: "M", color: "#B8D4A8", brief: "历史唯物主义",         status: "coming-soon" },
  { id: "nietzsche",     name: "尼采",      en: "Nietzsche",     era: "1844–1900", x: 74, y: 72, unlocked: false, avatar: "N", color: "#E87461", brief: "超人哲学与权力意志",   status: "coming-soon" },
  { id: "husserl",       name: "胡塞尔",    en: "Husserl",       era: "1859–1938", x: 20, y: 88, unlocked: false, avatar: "E", color: "#A8C4D4", brief: "现象学创始人",         status: "coming-soon" },
  { id: "russell",       name: "罗素",      en: "Russell",       era: "1872–1970", x: 50, y: 90, unlocked: false, avatar: "R", color: "#D4C8A8", brief: "分析哲学奠基者",       status: "coming-soon" },
  { id: "wittgenstein",  name: "维特根斯坦", en: "Wittgenstein",  era: "1889–1951", x: 66, y: 86, unlocked: false, avatar: "W", color: "#A8D4C4", brief: "语言游戏理论",         status: "coming-soon" },
  { id: "heidegger",     name: "海德格尔",  en: "Heidegger",     era: "1889–1976", x: 34, y: 92, unlocked: false, avatar: "H", color: "#C4B8A8", brief: "存在与时间",           status: "coming-soon" },
  { id: "sartre",        name: "萨特",      en: "Sartre",        era: "1905–1980", x: 76, y: 88, unlocked: false, avatar: "S", color: "#D4A8A8", brief: "存在主义与自由",       status: "coming-soon" },
  { id: "beauvoir",      name: "波伏瓦",    en: "Beauvoir",      era: "1908–1986", x: 86, y: 78, unlocked: false, avatar: "B", color: "#D4A8C4", brief: "存在主义女性主义",     status: "coming-soon" },
  { id: "popper",        name: "波普尔",    en: "Popper",        era: "1902–1994", x: 8,  y: 70, unlocked: false, avatar: "P", color: "#B8C4D4", brief: "证伪主义",             status: "coming-soon" },
  { id: "quine",         name: "蒯因",      en: "Quine",         era: "1908–2000", x: 10, y: 85, unlocked: false, avatar: "Q", color: "#C8D4B8", brief: "自然主义认识论",       status: "coming-soon" },
  { id: "foucault",      name: "福柯",      en: "Foucault",      era: "1926–1984", x: 82, y: 94, unlocked: false, avatar: "F", color: "#D4B8A8", brief: "权力与知识考古学",     status: "coming-soon" },
];

export const CONSTELLATIONS: ConstellationEdge[] = [
  // 古希腊传承
  ["socrates",  "plato"],
  ["plato",     "aristotle"],
  ["socrates",  "epicurus"],
  ["socrates",  "zeno"],
  // 中世纪线
  ["plato",     "augustine"],
  ["augustine", "aquinas"],
  // 近代线
  ["aquinas",   "kant"],
  // 德国观念论
  ["kant",      "hegel"],
  ["kant",      "schopenhauer"],
  ["hegel",     "marx"],
  ["schopenhauer", "nietzsche"],
  // 现象学线
  ["kant",      "husserl"],
  ["husserl",   "heidegger"],
  ["heidegger", "sartre"],
  ["sartre",    "beauvoir"],
  // 分析哲学线
  ["russell",   "wittgenstein"],
  ["russell",   "quine"],
  // 批判理性主义
  ["kant",      "popper"],
];
