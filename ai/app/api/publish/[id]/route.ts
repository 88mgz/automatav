import { NextResponse } from 'next/server';

export async function GET(_req: Request, ctx: { params: { id: string } }) {
  const { id } = ctx.params;

  // ...your logic...

  return NextResponse.json({ ok: true, id });
}
