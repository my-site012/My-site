import { createClient } from "@vercel/kv";

const kvUrl = process.env.KV_REST_API_URL;
const kvToken = process.env.KV_REST_API_TOKEN;

// Initialize KV client safely
export const kv = (() => {
  try {
    if (kvUrl && kvToken) {
      return createClient({ url: kvUrl, token: kvToken });
    }
  } catch (e) {
    console.error("KV client initialization failed:", e);
  }
  return null;
})();

/**
 * Increment a numeric counter safely.
 */
export async function incrementCounter(key: string): Promise<number> {
  if (!kv) return 0;
  const current = Number(await kv.get(key)) || 0;
  const next = current + 1;
  await kv.set(key, String(next));
  return next;
}

/**
 * Set a key/value pair (string).
 */
export async function setValue(key: string, value: string): Promise<void> {
  if (!kv) return;
  await kv.set(key, value);
}

/**
 * Get a string value.
 */
export async function getValue(key: string): Promise<string | null> {
  if (!kv) return null;
  const val = await kv.get(key);
  return val ? String(val) : null;
}

/**
 * Push an object to a list (pre-pend) and trim the list to keep max length.
 */
export async function pushLog(key: string, log: any, maxLength: number = 1500): Promise<void> {
  if (!kv) return;
  try {
    await kv.lpush(key, JSON.stringify(log));
    await kv.ltrim(key, 0, maxLength - 1);
  } catch (error) {
    console.error("Failed to push log:", error);
  }
}

/**
 * Get items from a list.
 */
export async function getLogs(key: string, count: number = 100): Promise<any[]> {
  if (!kv) return [];
  try {
    const logs = await kv.lrange(key, 0, count - 1);
    // Vercel KV lrange returns array of parsed JSON if they were objects
    return Array.isArray(logs) ? logs : [];
  } catch (error) {
    console.error("Failed to get logs:", error);
    return [];
  }
}
