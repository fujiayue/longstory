import type { ChatMessage, PhilosopherMeta } from "../types";

interface Props {
  msg: ChatMessage;
  philosopher?: PhilosopherMeta | null;
}

export default function ChatBubble({ msg, philosopher }: Props) {
  const avatarChar = philosopher?.avatar ?? "◯";
  const avatarColor = philosopher?.color ?? "#6b9080";
  const isUser = msg.role === "user";

  if (msg.isCoordinate) {
    return (
      <div style={{ width: "100%", textAlign: "center", padding: "10px 20px", margin: "6px 0", animation: "fadeIn 0.4s ease" }}>
        <div style={{ display: "inline-block", padding: "8px 18px", borderRadius: 12, background: `${avatarColor}08`, border: `1px solid ${avatarColor}15` }}>
          <span style={{ fontSize: 10, color: avatarColor, letterSpacing: "0.12em", fontWeight: 600 }}>◯ 思想坐标 · </span>
          <span style={{ fontSize: 12.5, color: "#8a9098", fontFamily: "'Noto Serif SC',serif" }}>{msg.content}</span>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
        marginBottom: 16,
        animation: "fadeIn 0.3s ease",
        paddingLeft: isUser ? 48 : 0,
        paddingRight: isUser ? 0 : 48,
      }}
    >
      {!isUser && (
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            border: `1.5px solid ${avatarColor}`,
            background: `radial-gradient(circle at 40% 40%, ${avatarColor}15, transparent 70%)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 18,
            marginRight: 12,
            flexShrink: 0,
            fontFamily: "'Noto Serif SC',serif",
            color: avatarColor,
            fontWeight: 700,
          }}
        >
          {avatarChar}
        </div>
      )}
      <div
        style={{
          maxWidth: "82%",
          padding: "12px 17px",
          background: isUser ? "rgba(60,80,100,0.12)" : `${avatarColor}08`,
          border: isUser ? "1px solid rgba(60,80,100,0.18)" : `1px solid ${avatarColor}12`,
          borderRadius: isUser ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
          color: "#d0ccc0",
          fontSize: 15,
          lineHeight: 1.9,
          fontFamily: "'Noto Serif SC',serif",
          whiteSpace: "pre-wrap",
        }}
      >
        {msg.content}
        {msg.thinking && (
          <span className="thinking-dots" style={{ color: avatarColor, marginLeft: 4 }}>
            ···
          </span>
        )}
      </div>
    </div>
  );
}
