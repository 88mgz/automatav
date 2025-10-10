export function makeSlug(title: string): string {
  // <CHANGE> Add defensive check for undefined/null title
  if (!title || typeof title !== "string") {
    console.error("[v0] makeSlug: Invalid title:", title)
    throw new Error("makeSlug requires a valid string title")
  }
  
  console.log("[v0] makeSlug: Processing title:", title)
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
}
</invoke>
