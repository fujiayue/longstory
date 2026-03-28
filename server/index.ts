import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { chatRouter } from "./routes/chat";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const IS_PROD = process.env.NODE_ENV === "production";

app.use(cors());
app.use(express.json({ limit: "100kb" }));

// API Routes
app.use("/api", chatRouter);

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

// 生产环境：托管前端静态文件
if (IS_PROD) {
  const distPath = path.join(process.cwd(), "dist");
  app.use(express.static(distPath));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`[server] running on http://localhost:${PORT} (${IS_PROD ? "production" : "development"})`);
});
