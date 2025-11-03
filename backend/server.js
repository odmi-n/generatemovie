import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT ?? 4000;

app.get("/health", (_req, res) => {
  res.json({ status: "ok", uptime: process.uptime() });
});

app.post("/jobs/openai", (req, res) => {
  const { topic } = req.body;
  console.log("[Mock Backend] Received OpenAI job", { topic, apiKey: process.env.OPEN_AI_YOUR_API_KEY });
  res.json({ jobId: "openai-job-1", status: "queued" });
});

app.post("/jobs/kie-ai", (req, res) => {
  const { script } = req.body;
  console.log("[Mock Backend] Received kie.ai job", { script, apiKey: process.env.KIE_AI_API_KEY });
  res.json({ jobId: "kie-ai-job-1", status: "queued" });
});

app.post("/notifications/slack", (req, res) => {
  const { channel, message } = req.body;
  console.log("[Mock Backend] Sending Slack message", {
    channel,
    message,
    token: process.env.SLACK_BOT_TOKEN
  });
  res.json({ ok: true, message: "Slack通知を送信しました (mock)" });
});

app.listen(PORT, () => {
  console.log(`Mock backend listening on http://localhost:${PORT}`);
});
