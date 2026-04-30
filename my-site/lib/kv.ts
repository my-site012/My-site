import { Kv } from "@vercel/kv";

// Initialize KV client (ensure KV_URL and KV_REST_API_TOKEN are set in env)
export const kv = new Kv({
  url: process.env.KV_URL ?? "",
  token: process.env.KV_REST_API_TOKEN ?? "",
});

/**
 * Increment a numeric counter safely.
 */
export async function incrementCounter(key: string): Promise<number> {
  const current = Number(await kv.get(key)) || 0;
  const next = current + 1;
  await kv.set(key, String(next));
  return next;
}

/**
 * Set a key/value pair (string).
 */
export async function setValue(key: string, value: string): Promise<void> {
  await kv.set(key, value);
}

/**
 * Get a string value.
 */
export async function getValue(key: string): Promise<string | null> {
  const val = await kv.get(key);
  return val ? String(val) : null;
}
