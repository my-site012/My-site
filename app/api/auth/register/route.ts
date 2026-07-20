import { NextRequest, NextResponse } from "next/server";
import { getValue, setValue } from "@/lib/kv";

export const dynamic = "force-dynamic";

/** SHA-256 hash using Web Crypto (available in Next.js serverless/edge) */
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
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    }

    const emailKey = `user:${email.toLowerCase()}`;

    // Check if user already exists
    const existing = await getValue(emailKey);
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    // Hash password
    const salt = Math.random().toString(36).substring(2) + Date.now().toString(36);
    const hashed = await hashPassword(password, salt);

    // Save user
    const user = {
      name,
      email: email.toLowerCase(),
      salt,
      password: hashed,
      createdAt: new Date().toISOString(),
    };
    await setValue(emailKey, JSON.stringify(user));

    // Set session cookie (7 days)
    const sessionToken = Buffer.from(email.toLowerCase()).toString("base64");
    const response = NextResponse.json({ success: true, name });
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
