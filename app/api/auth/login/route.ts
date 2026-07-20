import { NextRequest, NextResponse } from "next/server";
import { getValue } from "@/lib/kv";

export const dynamic = "force-dynamic";

async function hashPassword(password: string, salt: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(salt + password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const emailKey = `user:${email.toLowerCase()}`;
    const userJson = await getValue(emailKey);

    if (!userJson) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const user = JSON.parse(userJson);

    // Verify hashed password
    const hashed = await hashPassword(password, user.salt);
    if (hashed !== user.password) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    // Set session cookie (7 days)
    const sessionToken = Buffer.from(email.toLowerCase()).toString("base64");
    const response = NextResponse.json({ success: true, name: user.name });
    response.cookies.set("user_session", sessionToken, {
      httpOnly: true,
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
      sameSite: "lax",
    });
    return response;
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
