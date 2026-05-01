import { createClient } from "@vercel/kv";

const kvUrl = process.env.KV_URL;
const kvToken = process.env.KV_REST_API_TOKEN;

// Initialize KV client safely
export const kv = (kvUrl && kvToken) 
  ? createClient({ url: kvUrl, token: kvToken })
  : null;

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
