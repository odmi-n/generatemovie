import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    templateName: "default-v1",
    backgroundStyle: "Neon gradient with particle effects",
    sceneCount: 5,
    bgmType: "Future bass",
    textPlacement: "center",
    notes: "Hook scene uses animated subtitles"
  });
}

export async function PUT(request: Request) {
  const payload = await request.json();
  console.info("[Mock] Saving video prompt", payload);
  return NextResponse.json({ message: "動画プロンプト設定を保存しました (mock)" });
}
