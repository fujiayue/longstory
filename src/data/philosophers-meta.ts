import type { PhilosopherMeta, ConstellationEdge } from "../types";

export const PHILOSOPHERS: PhilosopherMeta[] = [
  // ── 已上线：7 位可对话 ─────────────────────────────────────
  { id: "socrates",  name: "苏格拉底", en: "Socrates",  era: "469–399 BC",  x: 44, y: 22, unlocked: true,  avatar: "Σ", color: "#F5C542", brief: "古希腊哲学之父，以反诘法闻名于世", status: "active" },
  { id: "plato",     name: "柏拉图",   en: "Plato",     era: "428–348 BC",  x: 40, y: 34, unlocked: false, avatar: "Π", color: "#7EB8DA", brief: "理念论的创立者",        status: "active" },
  { id: "aristotle", name: "亚里士多德", en: "Aristotle", era: "384–322 BC", x: 18, y: 44, unlocked: false, avatar: "Α", color: "#A8D5A2", brief: "逻辑学之父，柏拉图的批评者", status: "active" },
  { id: "epicurus",  name: "伊壁鸠鲁", en: "Epicurus",  era: "341–270 BC",  x: 36, y: 52, unlocked: false, avatar: "Ε", color: "#E8A87C", brief: "快乐主义哲学",          status: "active" },
  { id: "marcus",    name: "马可·奥勒留", en: "Marcus Aurelius", era: "121–180", x: 56, y: 52, unlocked: false, avatar: "M", color: "#8B7D6B", brief: "哲学家皇帝，斯多葛学派的实践者", status: "active" },
  { id: "augustine", name: "奥古斯丁", en: "Augustine", era: "354–430",     x: 66, y: 40, unlocked: false, avatar: "A", color: "#D4A5C9", brief: "基督教哲学奠基者",     status: "active" },
  { id: "aquinas",   name: "阿奎那",   en: "Aquinas",   era: "1225–1274",   x: 72, y: 30, unlocked: false, avatar: "T", color: "#C4A882", brief: "经院哲学集大成者，《神学大全》作者", status: "active" },

  // ── Coming soon：22 位即将到来 ──────────────────────────────
  // 近代理性主义 / 经验主义
  { id: "descartes",  name: "笛卡尔",   en: "Descartes",  era: "1596–1650", x: 78, y: 20, unlocked: false, avatar: "D", color: "#82C4C3", brief: "我思故我在",           status: "coming-soon" },
  { id: "spinoza",    name: "斯宾诺莎", en: "Spinoza",    era: "1632–1677", x: 10, y: 30, unlocked: false, avatar: "S", color: "#A8C4A8", brief: "泛神论与几何学式伦理",  status: "coming-soon" },
  { id: "locke",      name: "洛克",     en: "Locke",      era: "1632–1704", x: 5,  y: 45, unlocked: false, avatar: "L", color: "#C4D4A8", brief: "经验主义与自然权利",    status: "coming-soon" },
  { id: "leibniz",    name: "莱布尼茨", en: "Leibniz",    era: "1646–1716", x: 10, y: 60, unlocked: false, avatar: "L", color: "#D4C4A8", brief: "单子论与充足理由律",    status: "coming-soon" },
  { id: "hume",       name: "休谟",     en: "Hume",       era: "1711–1776", x: 25, y: 20, unlocked: false, avatar: "H", color: "#C4B8D4", brief: "怀疑论与因果问题",      status: "coming-soon" },
  { id: "kant",       name: "康德",     en: "Kant",       era: "1724–1804", x: 45, y: 5,  unlocked: false, avatar: "K", color: "#A8B8D4", brief: "先验哲学与道德律令",    status: "coming-soon" },
  // 德国观念论 / 19世纪
  { id: "hegel",         name: "黑格尔",   en: "Hegel",         era: "1770–1831", x: 65, y: 5,  unlocked: false, avatar: "H", color: "#9BB5D4", brief: "辩证法与绝对精神",   status: "coming-soon" },
  { id: "schopenhauer",  name: "叔本华",   en: "Schopenhauer",  era: "1788–1860", x: 85, y: 10, unlocked: false, avatar: "S", color: "#C4A8B8", brief: "意志与悲观主义",     status: "coming-soon" },
  { id: "marx",          name: "马克思",   en: "Marx",          era: "1818–1883", x: 95, y: 30, unlocked: false, avatar: "M", color: "#B8D4A8", brief: "历史唯物主义",       status: "coming-soon" },
  { id: "nietzsche",     name: "尼采",     en: "Nietzsche",     era: "1844–1900", x: 85, y: 70, unlocked: false, avatar: "N", color: "#E87461", brief: "超人哲学与权力意志", status: "coming-soon" },
  // 实用主义 / 现象学 / 分析哲学
  { id: "william_james", name: "威廉·詹姆斯", en: "William James", era: "1842–1910", x: 92, y: 50, unlocked: false, avatar: "J", color: "#D4C8B8", brief: "实用主义与意识流",   status: "coming-soon" },
  { id: "husserl",       name: "胡塞尔",   en: "Husserl",       era: "1859–1938", x: 70, y: 85, unlocked: false, avatar: "E", color: "#A8C4D4", brief: "现象学创始人",       status: "coming-soon" },
  { id: "dewey",         name: "杜威",     en: "Dewey",         era: "1859–1952", x: 50, y: 95, unlocked: false, avatar: "D", color: "#B8D4C4", brief: "实用主义与民主教育", status: "coming-soon" },
  { id: "russell",       name: "罗素",     en: "Russell",       era: "1872–1970", x: 30, y: 90, unlocked: false, avatar: "R", color: "#D4C8A8", brief: "分析哲学奠基者",     status: "coming-soon" },
  // 20世纪
  { id: "wittgenstein",  name: "维特根斯坦", en: "Wittgenstein", era: "1889–1951", x: 15, y: 80, unlocked: false, avatar: "W", color: "#A8D4C4", brief: "语言游戏理论",       status: "coming-soon" },
  { id: "heidegger",     name: "海德格尔", en: "Heidegger",     era: "1889–1976", x: 25, y: 65, unlocked: false, avatar: "H", color: "#C4B8A8", brief: "存在与时间",         status: "coming-soon" },
  { id: "popper",        name: "波普尔",   en: "Popper",        era: "1902–1994", x: 55, y: 70, unlocked: false, avatar: "P", color: "#B8C4D4", brief: "证伪主义",           status: "coming-soon" },
  { id: "sartre",        name: "萨特",     en: "Sartre",        era: "1905–1980", x: 80, y: 45, unlocked: false, avatar: "S", color: "#D4A8A8", brief: "存在主义与自由",     status: "coming-soon" },
  { id: "beauvoir",      name: "波伏娃",   en: "Beauvoir",      era: "1908–1986", x: 70, y: 15, unlocked: false, avatar: "B", color: "#D4A8C4", brief: "存在主义女性主义",   status: "coming-soon" },
  { id: "camus",         name: "加缪",     en: "Camus",         era: "1913–1960", x: 35, y: 15, unlocked: false, avatar: "C", color: "#D4C4B8", brief: "荒诞与反抗",         status: "coming-soon" },
  { id: "foucault",      name: "福柯",     en: "Foucault",      era: "1926–1984", x: 10, y: 10, unlocked: false, avatar: "F", color: "#D4B8A8", brief: "权力与知识考古学",  status: "coming-soon" },
];

export const CONSTELLATIONS: ConstellationEdge[] = [
  // 古希腊传承
  ["socrates",  "plato"],
  ["plato",     "aristotle"],
  ["socrates",  "epicurus"],
  ["socrates",  "marcus"],
  // 中世纪线
  ["plato",     "augustine"],
  ["augustine", "aquinas"],
  // 近代理性主义
  ["aquinas",   "descartes"],
  ["descartes", "spinoza"],
  ["spinoza",   "leibniz"],
  // 近代经验主义
  ["descartes", "locke"],
  ["locke",     "hume"],
  // 理性主义与经验主义汇合
  ["hume",      "kant"],
  ["leibniz",   "kant"],
  // 德国观念论
  ["kant",      "hegel"],
  ["kant",      "schopenhauer"],
  ["hegel",     "marx"],
  ["schopenhauer", "nietzsche"],
  // 实用主义线
  ["william_james", "dewey"],
  // 现象学 → 存在主义
  ["descartes", "husserl"],
  ["husserl",   "heidegger"],
  ["heidegger", "sartre"],
  ["sartre",    "beauvoir"],
  ["sartre",    "camus"],
  // 分析哲学线
  ["russell",   "wittgenstein"],
  ["russell",   "popper"],
  // 批判理论 / 后结构主义
  ["nietzsche", "foucault"],
  ["nietzsche", "heidegger"],
];
