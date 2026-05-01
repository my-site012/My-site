import { NextRequest, NextResponse } from "next/server";
import { incrementCounter } from "@/lib/kv";

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const newCount = await incrementCounter("whatsapp_clicks");
    return NextResponse.json({ success: true, count: newCount });
  } catch (error) {
    console.error("WhatsApp click error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
