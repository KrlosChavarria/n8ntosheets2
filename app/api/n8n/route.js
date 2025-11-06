export const runtime = "edge";

const REQUIRED = [
  "spreadsheetId",
  "sheetName",
  "preguntaColumna",
  "preguntaHeader",
  "preguntaFila",
  "preguntaValor",
  "respuestaColumna",
  "respuestaHeader",
  "respuestaFila",
  "rangoCompleto",
  "tipoPregunta",       // <- ya no usamos modeloIA
];

export async function POST(req) {
  try {
    const body = await req.json();

    // 1) Validar campos mínimos (ayuda a evitar 400 “raros” en n8n)
    const missing = REQUIRED.filter(k => body[k] === undefined || body[k] === null);
    if (missing.length) {
      return new Response(
        JSON.stringify({ ok:false, error:"missing_fields", missing }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // 2) URL del webhook de n8n (en .env, p.ej. N8N_WEBHOOK_URL="https://auto.n8npoli.io/webhook/da35bcfb-...").
    const url = process.env.N8N_WEBHOOK_URL;
    if (!url) {
      return new Response(
        JSON.stringify({ ok:false, error:"missing_env", hint:"Define N8N_WEBHOOK_URL en el entorno" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // 3) Reenviar tal cual a n8n
    const r = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // 👇 Reenvía el payload tal cual lo construyes en el front
      body: JSON.stringify(body),
      // Opcional: timeout pequeño para evitar colgar el edge
      // @ts-ignore
      next: { revalidate: 0 },
    });

    // 4) Propagar respuesta tal cual
    const ct = r.headers.get("content-type") || "";
    const resBody = ct.includes("application/json") ? await r.json() : await r.text();

    return new Response(
      ct.includes("application/json") ? JSON.stringify(resBody) : String(resBody),
      {
        status: r.status,
        headers: { "Content-Type": ct.includes("application/json") ? "application/json" : "text/plain" }
      }
    );
  } catch (e) {
    return new Response(
      JSON.stringify({ ok:false, error:"proxy_error", message: e.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
