import { NextRequest, NextResponse } from "next/server";
import { getJson, setJson, pushLog, getLogs } from "@/lib/kv";

export const dynamic = "force-dynamic";

// In-memory fallback if KV is temporarily unavailable
const inMemoryBookings: any[] = [];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      phone,
      serviceType,
      duration,
      state,
      city,
      address,
      date,
      timeSlot,
      category,
      advanceAmount = 1000,
      utr,
      upiSender,
      notes,
    } = body;

    // Validation
    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json({ error: "Please provide your full name" }, { status: 400 });
    }
    if (!phone || typeof phone !== "string" || phone.trim().length < 10) {
      return NextResponse.json({ error: "Please enter a valid 10-digit mobile number" }, { status: 400 });
    }
    if (!city || typeof city !== "string" || !city.trim()) {
      return NextResponse.json({ error: "Please select your location / city" }, { status: 400 });
    }

    // Generate Unique Token (e.g. BK-783921)
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const token = `BK-${randomNum}`;
    const id = `booking_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const createdAt = new Date().toISOString();

    const bookingData = {
      id,
      token,
      name: name.trim(),
      phone: phone.trim(),
      serviceType: serviceType || "Incall",
      duration: duration || "1 Hour",
      state: state || "",
      city: city.trim(),
      address: address ? address.trim() : "",
      date: date || new Date().toISOString().split("T")[0],
      timeSlot: timeSlot || "Immediate / Within 1 Hour",
      category: category || "Call Girls",
      advanceAmount: Number(advanceAmount) || 1000,
      utr: utr ? utr.trim() : "",
      upiSender: upiSender ? upiSender.trim() : "",
      notes: notes ? notes.trim() : "",
      status: "Pending Verification",
      paymentStatus: utr ? "Submitted (Awaiting Approval)" : "Pending Payment",
      createdAt,
    };

    // Save to KV Store
    try {
      await pushLog("bookings_list", bookingData, 1000);
      await setJson(`booking:${token}`, bookingData);
    } catch (kvErr) {
      console.error("KV Booking error:", kvErr);
    }

    // Also keep in memory fallback
    inMemoryBookings.unshift(bookingData);
    if (inMemoryBookings.length > 500) {
      inMemoryBookings.pop();
    }

    return NextResponse.json({
      success: true,
      token,
      booking: bookingData,
      message: "Booking submitted successfully! Please save your Token Number.",
    });
  } catch (err: any) {
    console.error("Booking API error:", err);
    return NextResponse.json(
      { error: "Failed to process booking request. Please try again." },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");

  // Query specific token
  if (token) {
    const formattedToken = token.trim().toUpperCase();
    try {
      const data = await getJson<any>(`booking:${formattedToken}`);
      if (data) {
        return NextResponse.json({ success: true, booking: data });
      }
    } catch {}

    const foundInMemory = inMemoryBookings.find(
      (b) => b.token.toUpperCase() === formattedToken
    );
    if (foundInMemory) {
      return NextResponse.json({ success: true, booking: foundInMemory });
    }

    return NextResponse.json({ error: "Booking token not found" }, { status: 404 });
  }

  // Admin query: list recent bookings
  const session = req.cookies.get("admin_session");
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const logs = await getLogs("bookings_list", 100);
    const combined = logs.length > 0 ? logs : inMemoryBookings;
    return NextResponse.json({ success: true, bookings: combined });
  } catch (err) {
    return NextResponse.json({ success: true, bookings: inMemoryBookings });
  }
}
