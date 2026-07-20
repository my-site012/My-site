import { NextRequest, NextResponse } from "next/server";
import { setJson, lPush } from "@/lib/kv";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const sessionCookie = req.cookies.get("user_session");
    if (!sessionCookie || !sessionCookie.value) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let email = "";
    try {
      email = Buffer.from(sessionCookie.value, "base64").toString("ascii");
    } catch {
      return NextResponse.json({ error: "Invalid session" }, { status: 400 });
    }

    const { title, description, category, price, state, city, phone } = await req.json();

    if (!title || !description || !category || !price || !state || !city || !phone) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const adId = crypto.randomUUID();
    const adKey = `ad:${adId}`;

    const adData = {
      id: adId,
      title,
      description,
      category,
      price: Number(price),
      state,
      city,
      phone,
      userEmail: email.toLowerCase(),
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    // Save ad object
    await setJson(adKey, adData);

    // Save to user's ads list
    await lPush(`user_ads:${email.toLowerCase()}`, adId);

    // Save to global pending queue for admin review
    await lPush("ads:pending", adId);

    return NextResponse.json({ success: true, adId });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
