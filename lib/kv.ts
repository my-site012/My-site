/**
 * Direct Upstash REST API client — no @vercel/kv library needed.
 * Uses plain fetch() calls which always work in Next.js Edge/Serverless.
 */
import { unstable_cache } from "next/cache";

const KV_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || "https://balanced-ibex-111880.upstash.io";
const KV_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || "gQAAAAAAAbUIAAIgcDJmMmE1N2NiMzM1NTM0NDAyYWUzYmRlMjE5OGQwOTljNQ";

export function isKvAvailable(): boolean {
  return !!(KV_URL && KV_TOKEN);
}

/**
 * Execute a Redis command by POSTing a JSON array of arguments to the root Upstash endpoint.
 * This is the standard, safest way to send commands and handles all argument serialization.
 */
async function kvCommand(args: any[]): Promise<any> {
  if (!KV_URL || !KV_TOKEN) {
    console.error("KV env vars missing: KV_REST_API_URL or KV_REST_API_TOKEN not set");
    return null;
  }
  try {
    const res = await fetch(KV_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${KV_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(args),
      cache: "no-store",
    });
    if (!res.ok) {
      console.error(`KV command error: ${res.status} ${res.statusText}`);
      return null;
    }
    const json = await res.json();
    if (json?.error) {
      console.error("KV Redis error:", json.error);
      return null;
    }
    return json?.result ?? null;
  } catch (err) {
    console.error("KV command exception:", err);
    return null;
  }
}

/** Increment a numeric counter using INCR */
export async function incrementCounter(key: string): Promise<number> {
  const result = await kvCommand(["INCR", key]);
  return result ? Number(result) : 0;
}

/** Increment a daily counter key and set 32-day TTL (so it auto-expires after 30+ days) */
export async function incrementDailyCounter(key: string): Promise<number> {
  const result = await kvCommand(["INCR", key]);
  const count = result ? Number(result) : 0;
  // Set TTL only on first creation (count===1), so we don't reset it on every hit
  if (count === 1) {
    await kvCommand(["EXPIRE", key, 32 * 24 * 3600]); // 32 days
  }
  return count;
}

/** Get WhatsApp hits for the last 30 days. Returns array of {date, hits} */
export async function getDailyHits(days: number = 30): Promise<{ date: string; hits: number }[]> {
  const dates: string[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setUTCDate(d.getUTCDate() - i);
    dates.push(d.toISOString().split("T")[0]);
  }
  const keys = dates.map((d) => `whatsapp_daily:${d}`);
  const values = await mGet(keys);
  return dates.map((date, idx) => ({
    date,
    hits: values[idx] ? Number(values[idx]) : 0,
  }));
}

/** Set a key/value pair */
export async function setValue(key: string, value: string): Promise<void> {
  await kvCommand(["SET", key, value]);
}

/** Set a key with EX (expiry) and NX (only if not exists) options. Returns true if key was set. */
export async function setNx(key: string, value: string, expirySeconds: number): Promise<boolean> {
  const result = await kvCommand(["SET", key, value, "EX", expirySeconds, "NX"]);
  return result === "OK";
}

/** Set a key to a JSON-serialized object */
export async function setJson(key: string, value: any): Promise<void> {
  await kvCommand(["SET", key, JSON.stringify(value)]);
}

/** Get a string value */
export async function getValue(key: string): Promise<string | null> {
  const result = await kvCommand(["GET", key]);
  return result !== null ? String(result) : null;
}

/** Get a JSON value */
export async function getJson<T = any>(key: string): Promise<T | null> {
  const result = await kvCommand(["GET", key]);
  if (result === null) return null;
  try {
    return (typeof result === "string" ? JSON.parse(result) : result) as T;
  } catch {
    return result as T;
  }
}

/** Push items to a list (LPUSH) */
export async function lPush(key: string, ...values: string[]): Promise<void> {
  if (!values.length) return;
  await kvCommand(["LPUSH", key, ...values]);
}

/** Get items from a list (LRANGE) */
export async function lRange(key: string, start: number, stop: number): Promise<string[]> {
  const result = await kvCommand(["LRANGE", key, start, stop]);
  return Array.isArray(result) ? result : [];
}

/** Trim a list (LTRIM) */
export async function lTrim(key: string, start: number, stop: number): Promise<void> {
  await kvCommand(["LTRIM", key, start, stop]);
}

/** Get list length (LLEN) */
export async function lLen(key: string): Promise<number> {
  const result = await kvCommand(["LLEN", key]);
  return result ? Number(result) : 0;
}

/** Get multiple keys (MGET) */
export async function mGet(keys: string[]): Promise<(string | null)[]> {
  if (!keys.length) return [];
  const result = await kvCommand(["MGET", ...keys]);
  return Array.isArray(result) ? result : [];
}

/** Push an object to a list (prepend) and trim to keep max length. */
export async function pushLog(key: string, log: any, maxLength: number = 1500): Promise<void> {
  try {
    await lPush(key, JSON.stringify(log));
    await lTrim(key, 0, maxLength - 1);
  } catch (error) {
    console.error("Failed to push log:", error);
  }
}

/** Get items from a list, auto-parsing JSON and handling double-encoded legacy formats. */
export async function getLogs(key: string, count: number = 100): Promise<any[]> {
  try {
    const items = await lRange(key, 0, count - 1);
    return items.map((item) => {
      try {
        let parsed = typeof item === "string" ? JSON.parse(item) : item;
        // Handle double-encoded array format from the previous LPUSH payload structure
        if (Array.isArray(parsed) && parsed.length > 0) {
          const inner = parsed[0];
          parsed = typeof inner === "string" ? JSON.parse(inner) : inner;
        }
        return parsed;
      } catch {
        return item;
      }
    });
  } catch (error) {
    console.error("Failed to get logs:", error);
    return [];
  }
}

// Legacy export — kept for compatibility
export const kv = null;

/**
 * Cached version of getValue — safe to use in ISR pages (revalidate = 3600).
 * Wraps the Upstash KV fetch in unstable_cache so Next.js can participate in ISR.
 * Cache is keyed by the KV key and revalidated every hour.
 */
export const cachedGetValue = unstable_cache(
  async (key: string): Promise<string | null> => getValue(key),
  ["kv-value"],
  { revalidate: 3600 }
);
