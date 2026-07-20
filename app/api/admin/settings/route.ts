import { NextRequest, NextResponse } from "next/server";
import { getValue, setValue, getLogs, getDailyHits } from "@/lib/kv";
import { revalidatePath } from "next/cache";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const session = req.cookies.get("admin_session");
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const clicks = await getValue("whatsapp_clicks");
  const phone = await getValue("contact_phone");
  const callBoyPhone = await getValue("call_boy_phone");
  const jaipurPhone = await getValue("jaipur_phone");
  const logs = await getLogs("whatsapp_activity_logs", 50);
  const maintenance = (await getValue("maintenance_mode")) === "true";
  const dailyHits = await getDailyHits(30);
  
  return NextResponse.json({ 
    clicks: Number(clicks) || 0, 
    phone: phone || "+91 9232504628",
    callBoyPhone: callBoyPhone || "",
    jaipurPhone: jaipurPhone || "",
    logs: logs || [],
    maintenance: maintenance,
    dailyHits: dailyHits,
  });
}

export async function POST(req: NextRequest) {
  const session = req.cookies.get("admin_session");
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { phone, callBoyPhone, jaipurPhone, maintenance } = await req.json();
  
  if (phone !== undefined) {
    await setValue("contact_phone", phone);
  }
  if (callBoyPhone !== undefined) {
    await setValue("call_boy_phone", callBoyPhone);
  }
  if (jaipurPhone !== undefined) {
    await setValue("jaipur_phone", jaipurPhone);
  }
  if (maintenance !== undefined) {
    await setValue("maintenance_mode", maintenance ? "true" : "false");
  }
  
  // Bust ISR cache so phone number changes reflect immediately on all pages
  try {
    revalidatePath("/", "layout");
    revalidatePath("/call-girls", "layout");
    revalidatePath("/call-girls/jaipur", "page");
    revalidatePath("/call-girls/jagatpura", "page");
    revalidatePath("/call-girls/gopalpura", "page");
    revalidatePath("/call-girls/sitapura", "page");
    revalidatePath("/call-girls/sanganer", "page");
    revalidatePath("/call-girls/200-feet-bypass", "page");
    revalidatePath("/call-girls/chandpole", "page");
    revalidatePath("/call-girls/jaipur-malviya-nagar", "page");
    revalidatePath("/call-girls/jaipur-vaishali-nagar", "page");
    revalidatePath("/call-boys", "layout");
    revalidatePath("/massage", "layout");
  } catch {}
  
  return NextResponse.json({ success: true });
}
