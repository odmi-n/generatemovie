import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    slackBotToken: "xoxb-SLACK_BOT_TOKEN",
    defaultChannel: "C0123456789",
    messageTemplate: "{{rankingTitle}} の最新動画が完成しました！ :camera_with_flash:",
    emoji: ":film_projector:",
    mentionUser: "@channel"
  });
}

export async function PUT(request: Request) {
  const payload = await request.json();
  console.info("[Mock] Saving Slack notification settings", payload);
  return NextResponse.json({ message: "Slack通知設定を保存しました (mock)" });
}
