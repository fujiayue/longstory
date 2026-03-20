# project.md — 项目状态追踪
> 群星对话 · dialogue-with-stars
> 最后更新：2026-03-21

---

## 当前版本：Phase 1 Week 1 完成

### 已完成
- [x] Vite + React + TypeScript 项目初始化
- [x] 完整目录结构搭建（components / data / engine / prompts / store / types）
- [x] TypeScript 类型系统定义（PhilosopherModule, ThoughtNode, AppState 等）
- [x] 苏格拉底数据模块完整迁移（outline, lineage, translations, frameworks）
- [x] Zustand store + IndexedDB 持久化层
- [x] 对话引擎（ai-client, fragment-selector, question-generator, card-trigger, stage）
- [x] 全部 UI 组件从 v0.7 迁移
- [x] Git 初始化 + 初始提交（2026-03-21）
- [x] PD.md / 2K.md / project.md 文档创建

### 进行中
- [ ] **架构变更**：从"本地自用 + 用户自填 Key"改为"线上部署 + 后端代理 Key"
  - [ ] 搭建 Express 后端（`server/`）
  - [ ] 实现 `POST /api/chat` 代理接口
  - [ ] 前端 `ai-client.ts` 改调 `/api/chat`
  - [ ] 删除 `ApiConfigScreen.tsx` 和相关 store 字段
  - [ ] 创建 `.env`（本地，gitignored），填入 DeepSeek Key
- [ ] **Phase 1 Week 2**：持久化验证 + 数据模块解耦验证

---

## Phase 路线图

### Phase 1：架构升级与内容管线建立（第 1-3 周）
- Week 1：工程化迁移 ✅
- Week 2：持久化 + 数据架构 + 内容规范
- Week 3：苏格拉底内容完善 + 柏拉图数据制作

### Phase 2：多哲学家扩展（第 4-8 周）
- 按《哲学家内容模块制作手册》逐一添加：亚里士多德、伊壁鸠鲁、芝诺...

### Phase 3：产品化（第 9-12 周）
- UI 精细化、动画优化、限流（rate limit）、上线部署

---

## 已知问题 & 待决策

| # | 问题 | 优先级 | 状态 |
|---|------|--------|------|
| 1 | v0.7 迁移后功能是否完全一致未做完整验证 | 高 | 待验证 |
| 2 | 柏拉图解锁条件（requireCards/requireChats）是否合理？ | 中 | 待决策 |
| 3 | 其余 7 位哲学家的解锁条件尚未设计 | 中 | 待设计 |
| 4 | ~~API Key 安全存储~~ | - | ✅ 已决策：后端 .env 存储 |
| 5 | 多哲学家对话历史是否按哲学家分开存储（目前共用一套 messages） | 中 | 待决策 |

---

## 变更记录

| 日期 | 变更内容 | 原因 |
|------|---------|------|
| 2026-03-21 | 初始化 Git，创建 PD/2K/project.md | 补齐 Vibe Coding 前置规范步骤 |
| 2026-03-21 | 架构改为线上部署 + 后端代理 Key | 避免 API Key 暴露在前端；改善用户体验（无需填 Key） |
