// app/api/n8n/route.js
export const runtime = "edge";

const N8N_URL = "https://auto.n8npoli.io/webhook/da35bcfb-3f79-439e-a368-712400c896b2?waitForExecution=true";

export async function POST(req) {
  try {
    const body = await req.json();

    const r = await fetch(N8N_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const text = await r.text();
    // Devuelve tal cual lo que responda n8n
    return new Response(text || "OK", {
      status: r.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: "proxy error", message: e.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// opcional: healthcheck
export async function GET() {
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
