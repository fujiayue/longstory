import type { ChatMessage } from "../types";

interface Props {
  msg: ChatMessage;
}

export default function ChatBubble({ msg }: Props) {
  const isUser = msg.role === "user";

  if (msg.isCoordinate) {
    return (
      <div style={{ width: "100%", textAlign: "center", padding: "10px 20px", margin: "6px 0", animation: "fadeIn 0.4s ease" }}>
        <div style={{ display: "inline-block", padding: "8px 18px", borderRadius: 12, background: "rgba(245,197,66,0.05)", border: "1px solid rgba(245,197,66,0.1)" }}>
          <span style={{ fontSize: 10, color: "#F5C542", letterSpacing: "0.12em", fontWeight: 600 }}>✦ 思想坐标 · </span>
          <span style={{ fontSize: 12.5, color: "#9090a8", fontFamily: "'Noto Serif SC',serif" }}>{msg.content}</span>
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
            background: "linear-gradient(140deg,#F5C542,#C89520)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 18,
            marginRight: 12,
            flexShrink: 0,
            fontFamily: "serif",
            color: "#0f0f1e",
            fontWeight: 700,
            boxShadow: "0 0 16px rgba(245,197,66,0.2)",
          }}
        >
          Σ
        </div>
      )}
      <div
        style={{
          maxWidth: "82%",
          padding: "12px 17px",
          background: isUser ? "rgba(80,120,210,0.15)" : "rgba(245,197,66,0.06)",
          border: isUser ? "1px solid rgba(80,120,210,0.2)" : "1px solid rgba(245,197,66,0.12)",
          borderRadius: isUser ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
          color: "#d0d0e4",
          fontSize: 15,
          lineHeight: 1.8,
          fontFamily: "'Noto Serif SC',serif",
          whiteSpace: "pre-wrap",
        }}
      >
        {msg.content}
        {msg.thinking && (
          <span className="thinking-dots" style={{ color: "#F5C542", marginLeft: 4 }}>
            ···
          </span>
        )}
      </div>
    </div>
  );
}
