import type { Status } from "@/lib/metrics";

export const STATUS_STYLES: Record<
  Status,
  { label: string; badge: string; ring: string; text: string; dot: string }
> = {
  great: {
    label: "Strong",
    badge: "bg-emerald-100 text-emerald-800",
    ring: "ring-emerald-200",
    text: "text-emerald-700",
    dot: "bg-emerald-500",
  },
  good: {
    label: "Healthy",
    badge: "bg-green-100 text-green-800",
    ring: "ring-green-200",
    text: "text-green-700",
    dot: "bg-green-500",
  },
  warn: {
    label: "Watch",
    badge: "bg-amber-100 text-amber-800",
    ring: "ring-amber-200",
    text: "text-amber-700",
    dot: "bg-amber-500",
  },
  bad: {
    label: "At risk",
    badge: "bg-rose-100 text-rose-800",
    ring: "ring-rose-200",
    text: "text-rose-700",
    dot: "bg-rose-500",
  },
  neutral: {
    label: "Result",
    badge: "bg-slate-100 text-slate-700",
    ring: "ring-slate-200",
    text: "text-slate-700",
    dot: "bg-slate-400",
  },
};
