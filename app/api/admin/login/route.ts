import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  
  if (email === "worksunil26@gmail.com") {
    const response = NextResponse.json({ success: true });
    // Simple cookie for session
    response.cookies.set("admin_session", "true", { httpOnly: true, path: "/" });
    return response;
  }
  
  return NextResponse.json({ success: false }, { status: 401 });
}
