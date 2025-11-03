import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const payload = await request.json();
  console.info("[Mock] Received kie.ai webhook", payload);
  return NextResponse.json({ ok: true });
}
