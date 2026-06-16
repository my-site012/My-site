import { NextRequest, NextResponse } from "next/server";
import { incrementCounter, pushLog } from "@/lib/kv";

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { adContext } = body;
    
    const newCount = await incrementCounter("whatsapp_clicks");
    
    if (adContext) {
      const logEntry = {
        ...adContext,
        timestamp: new Date().toISOString()
      };
      await pushLog("whatsapp_activity_logs", logEntry, 1500); // Keep last 1500 logs
    }
    
    return NextResponse.json({ success: true, count: newCount });
  } catch (error) {
    console.error("WhatsApp click error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
