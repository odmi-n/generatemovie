import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  console.info("[Mock] Testing OpenAI prompt", body);
  return NextResponse.json({
    preview: "OpenAIテスト: 最新ランキング案を生成しました (mock)",
    items: [
      "1位: 革新的なAIクリエイター",
      "2位: バズっている短尺ミーム",
      "3位: 今週のバイラル音源"
    ]
  });
}
