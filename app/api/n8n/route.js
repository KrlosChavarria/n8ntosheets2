export const runtime = "edge";

export async function POST(req) {
  try {
    const body = await req.json();
    const url = process.env.N8N_WEBHOOK_URL;
    if (!url) return new Response("Missing N8N_WEBHOOK_URL", { status: 500 });

    const r = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const text = await r.text();
    return new Response(text || "OK", { status: r.status });
  } catch (e) {
    return new Response("proxy error: " + e.message, { status: 500 });
  }
}
