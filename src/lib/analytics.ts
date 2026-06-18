/**
 * Tiny, provider-agnostic event tracker. Works with Plausible and/or GA4 if
 * configured, and is a no-op otherwise. Safe to call from any client component.
 */

type Props = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    plausible?: (event: string, opts?: { props?: Props }) => void;
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export const EVENTS = {
  calcUsed: "calculator_used",
  healthScoreRun: "health_score_run",
  emailSubmit: "email_submit",
  leadSubmit: "lead_submit",
  proClick: "pro_cta_click",
  reportPrint: "report_print",
  shareClick: "share_click",
} as const;

export function track(event: string, props?: Props): void {
  if (typeof window === "undefined") return;
  try {
    if (typeof window.plausible === "function") {
      window.plausible(event, props ? { props } : undefined);
    }
    if (typeof window.gtag === "function") {
      window.gtag("event", event, props || {});
    }
  } catch {
    // Analytics must never break the app.
  }
}
