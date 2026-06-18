import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/Container";
import { EmailCapture } from "@/components/EmailCapture";
import { ProButton } from "@/components/ProButton";
import { FaqList } from "@/components/FaqList";
import { JsonLd } from "@/components/JsonLd";
import { PUBLIC_ENV, hasProCheckout } from "@/lib/env";
import { buildMetadata, breadcrumbLd, faqLd } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "SaaS Metrics Pro Pack — Board Report + Model Templates | SaaSGauge",
  description:
    "All calculators stay free. The Pro Pack adds a board-ready report template, a plug-and-play SaaS metrics & financial model spreadsheet, a Notion dashboard, and a benchmark database.",
  path: "/pricing",
});

const FREE_FEATURES = [
  "All 16 SaaS metrics calculators",
  "Full SaaS Health Score with grade",
  "Benchmark context on every result",
  "Printable health report (PDF)",
  "Guides & glossary",
];

const PRO_FEATURES = [
  "Board-ready metrics report template (Google Slides + PDF)",
  "Plug-and-play SaaS model spreadsheet (Sheets + Excel)",
  "Notion SaaS metrics dashboard template",
  "Expanded benchmark database by stage & segment",
  "Fundraising metrics one-pager template",
  "Free updates for a year",
];

const FAQS = [
  {
    q: "Are the calculators ever going behind a paywall?",
    a: "No. Every calculator and the SaaS Health Score are free forever. The Pro Pack is an optional set of templates and a deeper benchmark database for teams that want to operationalise their metrics.",
  },
  {
    q: "What format are the templates?",
    a: "Editable Google Sheets/Slides and Notion templates, plus Excel and PDF exports. You get your own copy to duplicate and customise.",
  },
  {
    q: "Can I expense this?",
    a: "Yes — you'll get a receipt at checkout. It's a one-time purchase, not a subscription.",
  },
];

export default function PricingPage() {
  const proLive = hasProCheckout();
  const price = PUBLIC_ENV.proPrice;

  return (
    <>
      <JsonLd
        data={[
          faqLd(FAQS),
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Pro Pack", path: "/pricing" },
          ]),
        ]}
      />
      <Container className="py-12">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            The tools are free. The templates are the upgrade.
          </h1>
          <p className="mt-3 text-lg text-ink-soft">
            Use every calculator and the full Health Score for nothing. When
            you're ready to put your metrics in front of a board or investor,
            the Pro Pack gives you the templates to do it in minutes.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-4xl gap-6 lg:grid-cols-2">
          {/* Free */}
          <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-8">
            <h2 className="text-lg font-semibold text-ink">Free</h2>
            <p className="mt-2 text-4xl font-bold text-ink">$0</p>
            <p className="mt-1 text-sm text-ink-muted">Forever. No signup.</p>
            <ul className="mt-6 space-y-3 text-sm text-ink-soft">
              {FREE_FEATURES.map((f) => (
                <li key={f} className="flex gap-2">
                  <span className="text-emerald-600">✓</span>
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href="/health-score"
              className="mt-8 inline-block w-full rounded-lg border border-slate-300 bg-white px-6 py-3 text-center font-semibold text-ink-soft transition hover:bg-slate-50"
            >
              Start free →
            </Link>
          </div>

          {/* Pro */}
          <div className="relative flex flex-col rounded-2xl border-2 border-brand-500 bg-white p-8 shadow-card">
            <span className="absolute -top-3 left-8 rounded-full bg-brand-600 px-3 py-1 text-xs font-semibold text-white">
              Pro Pack
            </span>
            <h2 className="text-lg font-semibold text-ink">Pro Pack</h2>
            <p className="mt-2 text-4xl font-bold text-ink">
              {price}
              <span className="text-base font-normal text-ink-muted"> one-time</span>
            </p>
            <p className="mt-1 text-sm text-ink-muted">Lifetime access + 1 year of updates.</p>
            <ul className="mt-6 space-y-3 text-sm text-ink-soft">
              {PRO_FEATURES.map((f) => (
                <li key={f} className="flex gap-2">
                  <span className="text-brand-600">✓</span>
                  {f}
                </li>
              ))}
            </ul>
            <div className="mt-8">
              {proLive ? (
                <ProButton href={PUBLIC_ENV.proCheckoutUrl} label={`Get the Pro Pack — ${price}`} />
              ) : (
                <div>
                  <p className="mb-3 rounded-lg bg-amber-50 px-3 py-2 text-center text-sm text-amber-800">
                    Launching soon — join the waitlist for early-bird pricing.
                  </p>
                  <EmailCapture
                    source="pro-waitlist"
                    tag="pro-waitlist"
                    compact
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mx-auto mt-12 max-w-2xl">
          <h2 className="text-center text-2xl font-bold tracking-tight text-ink">
            Pricing FAQ
          </h2>
          <div className="mt-6">
            <FaqList faqs={FAQS} />
          </div>
        </div>
      </Container>
    </>
  );
}
