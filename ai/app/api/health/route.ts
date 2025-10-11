export const dynamic = "force-dynamic";

export async function GET() {
  return new Response(JSON.stringify({ ok: true, env: {
    hasOpenAI: Boolean(process.env.OPENAI_API_KEY),
    mock: process.env.MOCK_GENERATE === "1",
  }}), { headers: { "Content-Type": "application/json" }});
}
