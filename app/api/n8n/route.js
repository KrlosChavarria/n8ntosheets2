export const runtime = "edge";

export async function POST(req) {
  try {
    const body = await req.json();
    
    // 🔍 Devuelve el body recibido para debug
    return new Response(JSON.stringify({
      received: body,
      modeloIA: body.modeloIA,
      message: "Debug: esto es lo que llegó a Next.js"
    }, null, 2), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (e) {
    return new Response("proxy error: " + e.message, { status: 500 });
  }
}