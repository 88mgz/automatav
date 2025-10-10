export async function generateContent(payload: {
  prompt: string
  model?: string
  system?: string
  temperature?: number
}) {
  const res = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || `Request failed with ${res.status}`)
  }
  return res.json()
}
