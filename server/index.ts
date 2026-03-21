import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { chatRouter } from "./routes/chat";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: "100kb" }));

// Routes
app.use("/api", chatRouter);

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`[server] running on http://localhost:${PORT}`);
});
