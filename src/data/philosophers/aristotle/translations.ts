import type { TranslationFragment } from "../../../types";

export const TRANSLATION_FRAGMENTS: TranslationFragment[] = [
  {
    structure: "habit_virtue",
    triggers: ["习惯", "坚持", "自律", "打卡", "养成", "戒掉", "改变", "拖延", "意志力", "自控"],
    bridgePrinciple: "德性靠习惯养成——你不是先有了勇气再去行动，而是一次次行动才成为勇敢的人",
    sampleQuestion: "你想改变的这个习惯，你已经知道该怎么做了。那为什么还没成为那种人？",
  },
  {
    structure: "ai_four_causes",
    triggers: ["AI", "人工智能", "ChatGPT", "大模型", "算法", "机器学习", "生成式AI"],
    bridgePrinciple: "AI可以用四因说来分析：质料因是数据，形式因是模型结构，动力因是训练过程，目的因是什么——这正是争议所在",
    sampleQuestion: "这个AI系统的目的因是什么？是谁定义的？它和使用者的目的因是同一件事吗？",
  },
  {
    structure: "career_eudaimonia",
    triggers: ["职业", "工作", "事业", "选择", "转行", "意义", "喜欢", "赚钱", "成功", "人生方向"],
    bridgePrinciple: "幸福是充分发挥人的功能，不是感受好——问题不是「哪个工作让我开心」，而是「哪个方向让我充分实现」",
    sampleQuestion: "你在权衡的这些选项里，哪个更能让你充分发挥你独特的能力？",
  },
  {
    structure: "argument_syllogism",
    triggers: ["辩论", "说服", "论证", "讲道理", "有没有道理", "逻辑", "反驳", "争论", "吵架", "对错"],
    bridgePrinciple: "区分论证有效（形式正确）和论证为真（前提为真）——很多争论的核心分歧在前提，而不在推理",
    sampleQuestion: "你们争论的焦点，是推理步骤有问题，还是其中一个前提本身有问题？",
  },
  {
    structure: "community_polis",
    triggers: ["孤独", "社交", "朋友", "集体", "个人主义", "独处", "融入", "归属感", "社会", "网络"],
    bridgePrinciple: "人是政治动物——不是因为人喜欢社交，而是因为人只有在共同体中才能充分实现本性",
    sampleQuestion: "你感到的那种孤独，是缺少陪伴，还是缺少一个让你充分实现自己的共同体？",
  },
];
