import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  console.info("[Mock] Sending Slack test message", body);
  return NextResponse.json({ message: "Slackへテスト通知を送信しました (mock)" });
}
