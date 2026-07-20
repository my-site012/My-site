import { NextRequest, NextResponse } from "next/server";
import { getJson, setJson, lRange, kvCommand } from "@/lib/kv";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const session = req.cookies.get("admin_session");
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    // Get all pending ad IDs using the unified connection
    const pendingIds = await lRange("ads:pending", 0, -1);
    
    // Fetch full data for each ad ID
    const ads = [];
    for (const adId of pendingIds) {
      const ad = await getJson(`ad:${adId}`);
      if (ad) {
        ads.push(ad);
      }
    }

    return NextResponse.json({ ads });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = req.cookies.get("admin_session");
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { adId, action } = await req.json();

    if (!adId || !["approve", "reject"].includes(action)) {
      return NextResponse.json({ error: "Invalid parameters" }, { status: 400 });
    }

    const adKey = `ad:${adId}`;
    const ad = await getJson(adKey);

    if (!ad) {
      return NextResponse.json({ error: "Ad not found" }, { status: 404 });
    }

    // Update status
    ad.status = action === "approve" ? "approved" : "rejected";
    await setJson(adKey, ad);

    // Remove from pending queue using the unified connection
    await kvCommand(["LREM", "ads:pending", 0, adId]);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
