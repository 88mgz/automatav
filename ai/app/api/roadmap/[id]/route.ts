export async function PATCH(req: Request) {
  const url = new URL(req.url);
  const id = url.pathname.split('/').pop()!; // /api/roadmap/<id>

  // TODO: keep/restore your original logic here, replacing any `params.id` uses with `id`
  return Response.json({ ok: true, id });
}
