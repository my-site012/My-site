import { NextRequest } from "next/server";

/**
 * Validates if the request originates from the official site domain to prevent direct API scraping and abuse.
 */
export function isRequestAllowed(req: NextRequest): boolean {
  // Allow local development check as fallback if NODE_ENV is set to development
  if (process.env.NODE_ENV === "development") {
    return true;
  }

  const origin = req.headers.get("origin") || "";
  const referer = req.headers.get("referer") || "";

  const allowedOrigins = [
    "https://callgirl4u.com",
    "https://www.callgirl4u.com",
  ];

  // Match request origin
  if (origin && allowedOrigins.some(o => origin.startsWith(o))) {
    return true;
  }

  // Match referer (fallback if Origin header is missing)
  if (referer && allowedOrigins.some(r => referer.startsWith(r))) {
    return true;
  }

  return false;
}
