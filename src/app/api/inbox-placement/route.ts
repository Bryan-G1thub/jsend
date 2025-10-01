import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ message: "Inbox placement test endpoint" });
}
