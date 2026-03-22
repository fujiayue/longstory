/**
 * reference/modal.reference.tsx
 * 弹窗组件标准实现参考（底部滑入式）
 * 新增弹窗类组件时参照此文件的结构和样式规范
 */

// ── 标准底部弹窗结构 ──────────────────────────────────────────
// <遮罩层 onClick=onClose>
//   <内容卡片 onClick=stopPropagation>
//     <头部区域 />
//     <内容区域 />
//     <底部操作栏 />
//   </内容卡片>
// </遮罩层>

// ── 尺寸规范 ──────────────────────────────────────────────────
// 卡片宽度：  width: "min(440px, 92vw)"
// 卡片圆角：  borderRadius: 18（顶部两角；底部可贴边或加 marginBottom: 20）
// 头部 padding：  "26px 30px 18px"
// 内容 padding：  "22px 30px"
// 底部 padding：  "14px 30px"

// ── 颜色规范 ──────────────────────────────────────────────────
// 卡片背景：  "linear-gradient(145deg,#141428,#0f1a2e)"
// 遮罩背景：  "rgba(0,0,0,0.75)" + backdropFilter: "blur(10px)"
// 强调色：    通过 props 传入 nodeColor（默认 "#F5C542"）
// 边框：      `1px solid ${color}30`
// 阴影：      `0 0 50px ${color}12`

// ── 动画规范 ──────────────────────────────────────────────────
// 遮罩淡入：  animation: "fadeIn 0.3s ease"
// 卡片滑入：  animation: "slideUp 0.35s ease"
// CSS keyframes 在 index.css 中统一定义

// ── 关闭按钮规范 ──────────────────────────────────────────────
// padding: "8px 18px", background: "transparent"
// border: "1px solid #3a3a50", borderRadius: 9
// color: "#777", fontSize: 13, cursor: "pointer"
// 文字："关闭"

// ── NodeTouchNotice 规范（底部通知，非弹窗）──────────────────
// 固定定位：  position: "fixed", bottom: 90, left: "50%", transform: "translateX(-50%)"
// 背景：      "rgba(20,20,40,0.95)" + border: "1px solid #2a2a50"
// 图标前缀：  "💡 "
// 持续时间：  3500ms 后自动消失
// 可点击关闭

export {};
