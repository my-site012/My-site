import { NextRequest, NextResponse } from "next/server";
import { incrementCounter, pushLog, setNx, getValue, incrementDailyCounter } from "@/lib/kv";

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { adContext } = body;
    
    // Get client IP address to track unique user clicks per day
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "anonymous";
    const dateStr = new Date().toISOString().split('T')[0]; // e.g. "2026-07-04"
    const userKey = `wa_user_click:${ip}:${dateStr}`;
    
    // Try to set key only if it doesn't exist, expiring in 24 hours
    const isNewToday = await setNx(userKey, "1", 86400);
    
    let newCount: number = 0;
    if (isNewToday) {
      newCount = await incrementCounter("whatsapp_clicks");
      // Also increment daily counter (TTL = 32 days so old ones auto-expire)
      const dailyKey = `whatsapp_daily:${dateStr}`;
      await incrementDailyCounter(dailyKey);
    } else {
      const currentCountStr = await getValue("whatsapp_clicks");
      newCount = currentCountStr ? Number(currentCountStr) : 0;
    }
    
    if (adContext) {
      const logEntry = {
        ...adContext,
        timestamp: new Date().toISOString(),
        isRepeat: !isNewToday
      };
      await pushLog("whatsapp_activity_logs", logEntry, 1500); // Keep last 1500 logs
    }
    
    return NextResponse.json({ success: true, count: newCount });
  } catch (error) {
    console.error("WhatsApp click error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
