import { NextRequest, NextResponse } from "next/server";
import { getValue } from "@/lib/kv";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const sessionCookie = req.cookies.get("user_session");
    if (!sessionCookie || !sessionCookie.value) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Decode email from base64 session token
    let email = "";
    try {
      email = Buffer.from(sessionCookie.value, "base64").toString("ascii");
    } catch {
      return NextResponse.json({ error: "Invalid session" }, { status: 400 });
    }

    const emailKey = `user:${email.toLowerCase()}`;
    const userJson = await getValue(emailKey);

    if (!userJson) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const user = JSON.parse(userJson);
    return NextResponse.json({
      authenticated: true,
      user: {
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
