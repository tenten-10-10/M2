export const SITE_NAME = "SaaSGauge";
export const SITE_TAGLINE =
  "Free SaaS metrics calculators & a board-ready health score";
export const SITE_DESCRIPTION =
  "Free, accurate SaaS metrics calculators — LTV:CAC, CAC payback, MRR, ARR, churn, NRR, Rule of 40, burn rate, runway and more. Get an instant, board-ready SaaS Health Score with benchmark context.";

/**
 * Canonical site URL. Falls back to a sensible default so the app builds and
 * renders even before a domain is connected.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://saasgauge.com"
).replace(/\/$/, "");

export const CONTACT_EMAIL =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL || "hello@saasgauge.com";

export const TWITTER_HANDLE = "@saasgauge";

export type NavItem = { href: string; label: string };

export const PRIMARY_NAV: NavItem[] = [
  { href: "/calculators", label: "Calculators" },
  { href: "/health-score", label: "Health Score" },
  { href: "/benchmarks", label: "Benchmarks" },
  { href: "/guides", label: "Guides" },
  { href: "/pricing", label: "Pro Pack" },
];

export const FOOTER_NAV: { heading: string; items: NavItem[] }[] = [
  {
    heading: "Tools",
    items: [
      { href: "/health-score", label: "SaaS Health Score" },
      { href: "/calculators", label: "All calculators" },
      { href: "/calculators/ltv-cac", label: "LTV:CAC ratio" },
      { href: "/calculators/cac-payback", label: "CAC payback period" },
      { href: "/calculators/rule-of-40", label: "Rule of 40" },
      { href: "/calculators/runway", label: "Cash runway" },
    ],
  },
  {
    heading: "Learn",
    items: [
      { href: "/benchmarks", label: "Benchmarks" },
      { href: "/guides", label: "Guides" },
      { href: "/glossary", label: "Metrics glossary" },
      { href: "/cheat-sheet", label: "Cheat sheet" },
      { href: "/resources", label: "Free PDF" },
    ],
  },
  {
    heading: "Company",
    items: [
      { href: "/about", label: "About" },
      { href: "/contact", label: "Contact" },
      { href: "/pricing", label: "Pro Pack" },
    ],
  },
  {
    heading: "Legal",
    items: [
      { href: "/legal/terms", label: "Terms" },
      { href: "/legal/privacy", label: "Privacy" },
      { href: "/legal/disclaimer", label: "Disclaimer" },
      { href: "/legal/affiliate-disclosure", label: "Disclosure" },
    ],
  },
];
