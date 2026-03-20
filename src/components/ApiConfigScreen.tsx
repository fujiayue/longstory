import { useState } from "react";
import { PROVIDER_PRESETS } from "../data/philosophers-meta";
import { setApiConfig } from "../engine/ai-client";
import type { ApiConfig } from "../types";

interface Props {
  onReady: () => void;
}

export default function ApiConfigScreen({ onReady }: Props) {
  const [provider, setProvider] = useState("anthropic");
  const [key, setKey] = useState("");
  const [endpoint, setEndpoint] = useState("");
  const [model, setModel] = useState("");
  const [showKey, setShowKey] = useState(false);

  const preset = PROVIDER_PRESETS[provider];
  const effectiveEndpoint = provider === "custom" ? endpoint : preset.endpoint;
  const effectiveModel = provider === "custom" ? model : preset.model;
  const canSubmit = key.trim() && effectiveEndpoint && effectiveModel;

  function handleSubmit() {
    if (!canSubmit) return;
    const cfg: ApiConfig = {
      provider: provider === "anthropic" ? "anthropic" : "openai-compat",
      apiKey: key.trim(),
      endpoint: effectiveEndpoint,
      model: effectiveModel,
      temperature: preset.temperature,
    };
    setApiConfig(cfg);
    onReady();
  }

  return (
    <div
      style={{
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        background: "#080810",
        position: "relative",
        zIndex: 10,
      }}
    >
      <div style={{ fontSize: 13, color: "#F5C542", letterSpacing: "0.2em", marginBottom: 8, fontWeight: 600 }}>
        ✦ DIALOGUE WITH THE STARS ✦
      </div>
      <div style={{ fontSize: 28, color: "#e0e0f0", fontFamily: "'Noto Serif SC',serif", fontWeight: 700, marginBottom: 6 }}>
        群星对话
      </div>
      <div style={{ fontSize: 13, color: "#666", marginBottom: 36 }}>与历代思想家进行哲学对话</div>

      <div style={{ width: "min(420px,90vw)" }}>
        {/* Provider buttons */}
        <div style={{ display: "flex", gap: 8, marginBottom: 18, flexWrap: "wrap", justifyContent: "center" }}>
          {Object.entries(PROVIDER_PRESETS).map(([k, v]) => (
            <button
              key={k}
              onClick={() => setProvider(k)}
              style={{
                padding: "8px 16px",
                borderRadius: 20,
                fontSize: 12.5,
                cursor: "pointer",
                background: provider === k ? "rgba(245,197,66,0.12)" : "rgba(255,255,255,0.03)",
                border: provider === k ? "1px solid rgba(245,197,66,0.35)" : "1px solid #222238",
                color: provider === k ? "#F5C542" : "#666",
                fontWeight: provider === k ? 600 : 400,
              }}
            >
              {v.label}
            </button>
          ))}
        </div>

        {/* API Key */}
        <div style={{ position: "relative", marginBottom: 16 }}>
          <input
            type={showKey ? "text" : "password"}
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="输入 API Key"
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            style={{
              width: "100%",
              padding: "12px 50px 12px 16px",
              borderRadius: 12,
              background: "rgba(20,20,35,0.8)",
              border: "1px solid #2a2a40",
              color: "#d0d0e4",
              fontSize: 14,
              fontFamily: "monospace",
            }}
          />
          <button
            onClick={() => setShowKey(!showKey)}
            style={{
              position: "absolute",
              right: 12,
              top: "50%",
              transform: "translateY(-50%)",
              background: "none",
              border: "none",
              color: "#555",
              cursor: "pointer",
              fontSize: 12,
            }}
          >
            {showKey ? "隐藏" : "显示"}
          </button>
        </div>

        {/* Custom provider fields */}
        {provider === "custom" && (
          <>
            <input
              value={endpoint}
              onChange={(e) => setEndpoint(e.target.value)}
              placeholder="API Endpoint URL"
              style={{
                width: "100%", padding: "12px 16px", borderRadius: 12,
                background: "rgba(20,20,35,0.8)", border: "1px solid #2a2a40",
                color: "#d0d0e4", fontSize: 13, fontFamily: "monospace", marginBottom: 10,
              }}
            />
            <input
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder="model-name"
              style={{
                width: "100%", padding: "12px 16px", borderRadius: 12,
                background: "rgba(20,20,35,0.8)", border: "1px solid #2a2a40",
                color: "#d0d0e4", fontSize: 13, fontFamily: "monospace", marginBottom: 16,
              }}
            />
          </>
        )}

        {provider !== "custom" && (
          <div style={{ fontSize: 12, color: "#555", marginBottom: 20, lineHeight: 1.8, textAlign: "center" }}>
            模型: <span style={{ color: "#777" }}>{preset.model}</span>&nbsp;·&nbsp;Temperature:{" "}
            <span style={{ color: "#777" }}>{preset.temperature}</span>
            {preset.helpUrl && (
              <>
                &nbsp;·&nbsp;
                <a href={preset.helpUrl} target="_blank" rel="noopener" style={{ color: "#7EB8DA", textDecoration: "none" }}>
                  获取 Key →
                </a>
              </>
            )}
          </div>
        )}
      </div>

      <button
        onClick={handleSubmit}
        disabled={!canSubmit}
        style={{
          padding: "14px 40px",
          borderRadius: 28,
          background: canSubmit ? "linear-gradient(140deg,#F5C542,#C89520)" : "#1a1a28",
          border: canSubmit ? "none" : "1px solid #2a2a3a",
          color: "#0f0f1e",
          fontSize: 16,
          fontWeight: 700,
          fontFamily: "'Noto Serif SC',serif",
          cursor: canSubmit ? "pointer" : "default",
          letterSpacing: "0.08em",
          marginBottom: 24,
        }}
      >
        进入星图
      </button>

      <div style={{ fontSize: 11, color: "#444", textAlign: "center", maxWidth: 400, lineHeight: 1.8 }}>
        你的 API Key 仅在当前页面会话中使用，不会被存储或发送到任何第三方服务。
      </div>
    </div>
  );
}
