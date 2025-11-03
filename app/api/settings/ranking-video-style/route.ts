import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    titleColor: "#ffffff",
    bodyColor: "#cbd5f5",
    borderColor: "#6366f1",
    ctaText: "今すぐチェック",
    insertPromoVideo: true,
    promoVideoUrl: "https://example.com/promo.mp4"
  });
}

export async function PUT(request: Request) {
  const payload = await request.json();
  console.info("[Mock] Saving ranking video style", payload);
  return NextResponse.json({ message: "ランキング動画編集設定を保存しました (mock)" });
}
