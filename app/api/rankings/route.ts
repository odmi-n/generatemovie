import { NextResponse } from "next/server";

const mockRankings = [
  {
    id: "trend-explorers",
    title: "Z世代トレンド速報",
    description: "週次のTikTokトレンドを要約した縦型動画",
    lastRun: "2024-04-18 09:30",
    totalVideos: 42,
    slackChannel: "#reels-z",
    status: "processing"
  }
];

export async function GET() {
  return NextResponse.json(mockRankings);
}

export async function POST(request: Request) {
  const payload = await request.json();
  console.info("[Mock] Creating ranking", payload);
  return NextResponse.json({ id: "mock-ranking", ...payload });
}
