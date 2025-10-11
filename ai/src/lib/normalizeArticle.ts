const allowedTypes = new Set([
  "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown",
]);

function slugify(s: string): string {
  return String(s || "").toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9\-]/g, "")
    .replace(/\-+/g, "-").replace(/^\-|\-$/g, "");
}

export function coerceForSchema(input: any): any {
  const a: any = input && typeof input === "object" ? { ...input } : {};
  if (!a.hero || typeof a.hero !== "object") a.hero = {};
  if (!a.hero.headline) a.hero.headline = a.title || "";
  if (!a.hero.subheadline && typeof a.tldr === "string") a.hero.subheadline = a.tldr;
  if (a.hero.image) {
    if (typeof a.hero.image === "string") {
      a.hero.image = { url: a.hero.image, alt: a.hero.headline || a.title || "" };
    } else if (typeof a.hero.image === "object") {
      if (!a.hero.image.url && a.hero.image.src) a.hero.image.url = a.hero.image.src;
      if (!a.hero.image.alt) a.hero.image.alt = a.hero.headline || a.title || "";
    }
  }
  if (!Array.isArray(a.toc)) a.toc = [];
  a.toc = a.toc.map((t: any) => {
    if (typeof t === "string") return { id: slugify(t), label: t };
    const label = t?.label ?? t?.title ?? "";
    const id = t?.id ?? slugify(label);
    return { id, label };
  });
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowedTypes.has(t)) {
      const content = b?.content ?? b?.md ?? b?.html ?? b?.text ?? (typeof b === "string" ? b : JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro")       return { ...b, type: "intro", text: String(b?.text ?? b?.content ?? b?.md ?? b?.html ?? "") };
    if (t === "markdown")    return { ...b, type: "markdown", content: String(b?.content ?? b?.md ?? b?.html ?? b?.text ?? "") };
    if (t === "specGrid")    return { ...b, type: "specGrid", columns: Array.isArray(b?.columns) ? b.columns : [], rows: Array.isArray(b?.rows) ? b.rows : [] };
    if (t === "comparisonTable") return { ...b, type: "comparisonTable", items: Array.isArray(b?.items) ? b.items : [] };
    if (t === "prosCons")    return { ...b, type: "prosCons", pros: Array.isArray(b?.pros) ? b.pros : [], cons: Array.isArray(b?.cons) ? b.cons : [] };
    if (t === "gallery")     return { ...b, type: "gallery", images: Array.isArray(b?.images) ? b.images : [] };
    if (t === "faq")         return { ...b, type: "faq", items: Array.isArray(b?.items) ? b.items : [] };
    if (t === "ctaBanner")   return { ...b, type: "ctaBanner", text: b?.text ?? "", href: b?.href ?? "" };
    return b;
  });
  return a;
}
