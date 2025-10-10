"use client";

import { toast as sonner } from "sonner";

type LegacyArgs = {
  title?: string;
  description?: string;
  /** shadcn variants we map to sonner */
  variant?: "default" | "success" | "info" | "warning" | "destructive";
};

type SonnerOpts = {
  description?: string;
  action?: { label: string; onClick: () => void };
  duration?: number;
  closeButton?: boolean;
};

/** Accepts both:
 *   toast("Msg", { description: "More" })
 *   toast({ title: "Msg", description: "More", variant: "success" })
 */
function emit(arg: string | LegacyArgs, opts?: SonnerOpts) {
  if (typeof arg === "string") {
    return sonner(arg, opts);
  }
  const { title, description, variant } = arg;
  const msg = title ?? description ?? "";

  switch (variant) {
    case "success":
      return sonner.success(msg, { description });
    case "destructive":
      return sonner.error(msg, { description });
    case "warning":
      // @ts-ignore sonner has warning in v2; if not, fall back
      return (sonner.warning ?? sonner)(msg, { description });
    case "info":
      // @ts-ignore info in some versions; fallback to default
      return (sonner.info ?? sonner)(msg, { description });
    default:
      return sonner(msg, { description });
  }
}

/** Hook API */
export function useToast() {
  return {
    toast: emit,
    // convenience methods
    success: (m: string, o?: SonnerOpts) => sonner.success(m, o),
    error: (m: string, o?: SonnerOpts) => sonner.error(m, o),
    message: (m: string, o?: SonnerOpts) => sonner(m, o)
  };
}

/** Direct import option: `import { toast } from "@/hooks/use-toast"` */
export const toast = Object.assign(emit, {
  success: (m: string, o?: SonnerOpts) => sonner.success(m, o),
  error: (m: string, o?: SonnerOpts) => sonner.error(m, o),
  message: (m: string, o?: SonnerOpts) => sonner(m, o)
});
