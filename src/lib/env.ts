/**
 * Centralised, safe access to runtime configuration. Everything is optional;
 * callers should treat empty strings as "not configured".
 */

const clean = (v: string | undefined): string => (v ?? "").trim();

// Public (client-readable) config
export const PUBLIC_ENV = {
  siteUrl: clean(process.env.NEXT_PUBLIC_SITE_URL),
  plausibleDomain: clean(process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN),
  plausibleHost:
    clean(process.env.NEXT_PUBLIC_PLAUSIBLE_HOST) || "https://plausible.io",
  gaMeasurementId: clean(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID),
  proCheckoutUrl: clean(process.env.NEXT_PUBLIC_PRO_CHECKOUT_URL),
  proPrice: clean(process.env.NEXT_PUBLIC_PRO_PRICE) || "$49",
  contactEmail:
    clean(process.env.NEXT_PUBLIC_CONTACT_EMAIL) || "hello@saasgauge.com",
};

// Server-only config (never import into client components)
export const SERVER_ENV = {
  buttondownApiKey: clean(process.env.BUTTONDOWN_API_KEY),
  convertkitApiKey: clean(process.env.CONVERTKIT_API_KEY),
  convertkitFormId: clean(process.env.CONVERTKIT_FORM_ID),
  emailWebhookUrl: clean(process.env.EMAIL_WEBHOOK_URL),
  leadWebhookUrl: clean(process.env.LEAD_WEBHOOK_URL),
  resendApiKey: clean(process.env.RESEND_API_KEY),
  leadNotifyEmail: clean(process.env.LEAD_NOTIFY_EMAIL),
};

export const hasProCheckout = (): boolean => PUBLIC_ENV.proCheckoutUrl !== "";
export const hasAnalytics = (): boolean =>
  PUBLIC_ENV.plausibleDomain !== "" || PUBLIC_ENV.gaMeasurementId !== "";
