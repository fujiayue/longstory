# CLAUDE.md — 群星对话项目工作规范

> Claude 在此项目工作时必须遵守以下规则。优先级高于默认行为。

---

## 文档同步规则（最高优先级）

**每次完成以下任何一类改动后，必须同步更新三份文档：**

| 改动类型 | 必须更新的文档 |
|---------|-------------|
| 新增功能 / 修改功能逻辑 | PD.md（F章节验收标准） + project.md（变更记录） |
| 修改架构 / 新增文件 / 改数据模型 | 2K.md（对应章节） + project.md（变更记录） |
| 完成一个里程碑 | project.md（周次状态从"待"改"✅"） |
| 发现已知问题 | project.md（已知问题表） |
| 解决已知问题 | project.md（问题状态改"✅ 已解决"） |

**不允许**在对话中说"稍后更新文档"——必须在同一轮完成。

---

## 开发规范

- **TypeScript**：严格模式，`tsc --noEmit` 零错误后才能提交
- **文件大小**：单文件 ≤ 300 行，超过则拆分
- **组件命名**：PascalCase，文件名与组件名一致
- **数据与 UI 分离**：`components/` 不直接 import `data/`，通过 props 或 store 获取
- **API Key**：绝不出现在任何前端文件、日志、响应体中

## 新建哲学家模块必做清单

每次开发新哲学家时，以下步骤**全部完成**才算模块完成，不得遗漏：

1. **数据文件**：outline.ts / lineage.ts / translations.ts / frameworks.ts / module.ts / index.ts / answers.ts
2. **Prompt 文件**：`src/prompts/{id}.ts`（basePrompt + buildPrompt）
3. **注册模块**：`src/data/philosophers/index.ts` 中添加 module + presetAnswer
4. **解锁条件**：`src/data/philosophers-meta.ts` 中设置 `requireCards` 和 `requireChats`（通用解锁循环自动生效，无需改 App.tsx）
5. **中文引号**：字符串中的中文内层引号使用全角 `""` ，不得使用 ASCII `"` 作为内层引号
6. **类型检查**：`tsc --noEmit` 零错误
7. **文档同步**：2K.md + project.md + PD.md（如涉及功能变更）

## 验证规则

- 每个 MVP 功能完成后必须提供验证清单，等用户确认通过后才提交 Git
- 新建哲学家模块：参照 `reference/thought-node.reference.ts` 逐字段填写
- 新建弹窗组件：参照 `reference/modal.reference.tsx` 的样式规范

## Git 提交规范

- 每个可验证的小功能完成后提交一次
- commit message 中文，格式：`[类型] 简短描述`
- 类型：feat / fix / refactor / docs / content

## 当前待办（优先级顺序）

1. ✅ 修复 Plato 解锁 Bug
2. ✅ P0-P4 卡片系统重构
3. ✅ 统一卡片弹窗
4. ✅ 移除 bridgeTemplates 动态问题生成
5. ✅ 解锁条件重构（节点≥80% + 预设问题≥50%）
6. ✅ Coming-soon 哲学家星图可见
7. 星图节点改为十字星（✦）形状（视觉调整）

---

*最后更新：2026-03-22*
