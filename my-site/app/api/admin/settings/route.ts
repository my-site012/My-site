import { NextRequest, NextResponse } from "next/server";
import { getValue, setValue, kv } from "@/lib/kv";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const session = req.cookies.get("admin_session");
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const clicks = await getValue("whatsapp_clicks");
  const phone = await getValue("contact_phone");
  
  return NextResponse.json({ 
    clicks: Number(clicks) || 0, 
    phone: phone || "+918905586425" 
  });
}

export async function POST(req: NextRequest) {
  const session = req.cookies.get("admin_session");
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { phone } = await req.json();
  if (phone) {
    await setValue("contact_phone", phone);
    return NextResponse.json({ success: true });
  }
  
  return NextResponse.json({ success: false }, { status: 400 });
}
