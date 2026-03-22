/**
 * reference/thought-node.reference.ts
 * 新增哲学家 ThoughtNode 数据的标准参考模板
 * 填写每个字段时对照此文件的说明和示例
 */

import type { ThoughtNode } from "../src/types";

// ── 字段填写规范 ──────────────────────────────────────────────
//
// id:           snake_case，全小写，项目内唯一（如 "cave", "tripartite_soul"）
// label:        中文名称，2-6字（如 "洞穴寓言"）
// icon:         单个 emoji，代表该节点核心意象
// color:        十六进制，与哲学家主色调搭配（如 "#7B9ED9"）
// brief:        一句话，≤ 30字，用于思维导图悬浮提示
// description:  200-400字，用于节点详情页展示
//
// domainIntro:  ★ 最重要的字段
//   - 必须是哲学家第一人称口吻
//   - 300-500字
//   - 以具体故事/类比/论证开头，以引人深思的问题结尾
//   - 禁止百科词条式写法（"xxx是一种...的理论"）
//   - 示例好坏对比见 socrates/outline.ts → ignorance 节点
//
// keywords:     用于关键词匹配的中文词组，按重要性排序
//   - 第一批（高权重）：最核心的 3-5 个词
//   - 包含近义词/常见说法（用户不会用专业术语提问）
//   - 示例："洞穴", "影子", "囚徒", "幻象", "解放"
//
// coreQuestions: 节点对应的 3 层问题池
//   - macro（宏观）：初次触及时展示，引导用户进入话题
//   - mid（中层）：节点已触及(hitCount>0)时展示
//   - micro（深层）：节点已深入(exploredNodes)时展示
//   每层 3-5 个问题，避免与其他节点问题重复
//
// card:         知识卡片内容
//   - title: 与 label 一致或更有冲击力的标题
//   - subtitle: 英文或拉丁文原文名称（斜体显示）
//   - content: ≤ 150字，提炼最核心的哲学命题
//   - source: 精确到篇名+章节号（如"《理想国》第七卷，514a-521b"）
//   - icon: 与节点 icon 一致
//
// reframingRules: 对话重框规则
//   - userSays: 用户可能说的日常表达（口语）
//   - youHear: 哲学家听到后在心里用什么概念框架理解
//   示例：{ userSays: "我觉得眼见为实", youHear: "你相信感官世界是实在" }
//
// teachingHints: 教学提示（写入 system prompt 的指令）
//   - 当用户提到此节点时，哲学家应如何引导
//   - 1-3条，简洁有力

const EXAMPLE_NODE: ThoughtNode = {
  id: "example",
  label: "示例节点",
  icon: "🌟",
  color: "#F5C542",
  brief: "这是一个示例节点，用于说明字段规范",
  description: "详细描述，200-400字...",
  domainIntro: "第一人称，300-500字，以问题结尾...",
  keywords: ["示例", "参考", "模板"],
  coreQuestions: {
    macro: ["宏观引导问题1", "宏观引导问题2"],
    mid: ["中层深化问题1", "中层深化问题2"],
    micro: ["微层精确问题1", "微层精确问题2"],
  },
  card: {
    title: "示例节点",
    subtitle: "Example Node",
    content: "核心命题，≤150字...",
    source: "《某书》第X卷，XXX页",
    icon: "🌟",
  },
  reframingRules: [
    { userSays: "用户日常表达", youHear: "哲学概念重框" },
  ],
  teachingHints: ["当用户提到X时，引导他思考Y"],
  tension: "节点内在张力/悖论",
  avoidWhen: ["避免在什么情况下引入此节点"],
  commonMisuse: "用户最常见的误解",
  biographicalRefs: ["与哲学家生平的关联"],
};

export { EXAMPLE_NODE };
