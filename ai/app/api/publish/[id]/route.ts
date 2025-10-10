import { NextResponse } from 'next/server';

// Note: Next expects (request, context) where context.params has your segments.
// Keep the inline type on the destructured argument.
export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  // TODO: replace this with your real publish logic
  return NextResponse.json({ ok: true, id });
}
