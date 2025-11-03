import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const payload = await request.json();
  console.info("[Mock] Queue video generation", payload);
  return NextResponse.json({ jobId: "job-mock-123", status: "queued" });
}
