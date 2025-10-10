export async function GET(req: Request) {
  const url = new URL(req.url);
  const id = url.pathname.split('/').pop()!; // /api/publish/<id>
  return Response.json({ ok: true, id });
}