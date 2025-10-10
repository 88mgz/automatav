import { NextResponse } from "next/server"

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const body = await request.json()

  // Stub: Update item
  const updated = {
    id: params.id,
    ...body,
    updatedAt: new Date().toISOString(),
  }

  return NextResponse.json(updated)
}
