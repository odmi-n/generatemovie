import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    accountId: "creator-lab",
    displayName: "クリエイターズラボ",
    persona: "Z世代に刺さるトーンで、明るくテンポよく情報を伝えるMC",
    rules: "ランキングは必ずトップ5を提示し、各項目に15秒以内のナレーションを設定",
    rankingFormat: "Top5 / Hook -> Body -> CTA",
    testTopic: "今週のバズワード"
  });
}

export async function PUT(request: Request) {
  const payload = await request.json();
  console.info("[Mock] Saving prompt settings", payload);
  return NextResponse.json({ message: "OpenAIプロンプト設定を保存しました (mock)" });
}
