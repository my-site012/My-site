const KV_URL = "https://balanced-ibex-111880.upstash.io";
const KV_TOKEN = "gQAAAAAAAbUIAAIgcDJmMmE1N2NiMzM1NTM0NDAyYWUzYmRlMjE5OGQwOTljNQ";

async function run() {
  const res = await fetch(`${KV_URL}/lrange/whatsapp_activity_logs/0/10`, {
    headers: { Authorization: `Bearer ${KV_TOKEN}` }
  });
  const json = await res.json();
  console.log("Raw items from KV:", JSON.stringify(json.result, null, 2));
}

run().catch(console.error);
