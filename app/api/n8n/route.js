export const runtime = "edge"; // opcional

export async function POST(req) {
  try {
    const body = await req.json(); // { spreadsheetId, sheetName }
    // const url = process.env.N8N_WEBHOOK_URL; // debe ser /webhook/... en prod
    const url = "https://auto.n8npoli.io/webhook-test/da35bcfb-3f79-439e-a368-712400c896b2"; // debe ser /webhook/... en prod
    if (!url) return new Response("Missing N8N_WEBHOOK_URL", { status: 500 });

    const r = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const text = await r.text();
    return new Response(text || "ok", { status: r.status });
  } catch (e) {
    return new Response("proxy error: " + e.message, { status: 500 });
  }
}