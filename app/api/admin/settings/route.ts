import { NextRequest, NextResponse } from "next/server";
import { getValue, setValue, getLogs, getDailyHits } from "@/lib/kv";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const session = req.cookies.get("admin_session");
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const clicks = await getValue("whatsapp_clicks");
  const phone = await getValue("contact_phone");
  const callBoyPhone = await getValue("call_boy_phone");
  const logs = await getLogs("whatsapp_activity_logs", 50); // Get latest 50 logs
  const maintenance = (await getValue("maintenance_mode")) === "true";
  const dailyHits = await getDailyHits(30); // Last 30 days
  
  return NextResponse.json({ 
    clicks: Number(clicks) || 0, 
    phone: phone || "+91 8058506045",
    callBoyPhone: callBoyPhone || "",
    logs: logs || [],
    maintenance: maintenance,
    dailyHits: dailyHits,
  });
}


export async function POST(req: NextRequest) {
  const session = req.cookies.get("admin_session");
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { phone, callBoyPhone, maintenance } = await req.json();
  
  if (phone !== undefined) {
    await setValue("contact_phone", phone);
  }
  if (callBoyPhone !== undefined) {
    await setValue("call_boy_phone", callBoyPhone);
  }
  if (maintenance !== undefined) {
    await setValue("maintenance_mode", maintenance ? "true" : "false");
  }
  
  return NextResponse.json({ success: true });
}
