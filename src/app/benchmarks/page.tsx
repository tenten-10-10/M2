import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/Container";
import { EmailCapture } from "@/components/EmailCapture";
import { FaqList } from "@/components/FaqList";
import { JsonLd } from "@/components/JsonLd";
import {
  CATEGORIES,
  METRICS,
  metricsByCategory,
  type Source,
} from "@/lib/metrics";
import { buildMetadata, breadcrumbLd, faqLd } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "SaaS Metrics Benchmarks (2026) — What 'Good' Looks Like | SaaSGauge",
  description:
    "A reference of SaaS metrics benchmarks with context: LTV:CAC, CAC payback, NRR, GRR, churn, Rule of 40, burn multiple, magic number, gross margin and more — by stage and segment.",
  path: "/benchmarks",
  ogTitle: "SaaS metrics benchmarks",
  ogSubtitle: "What 'good' looks like — with the caveats that matter",
});

const FAQS = [
  {
    q: "What are good SaaS benchmarks to aim for?",
    a: "The most-cited targets: LTV:CAC ≥ 3:1, CAC payback < 12 months, gross margin 70–85%, NRR > 100% (best-in-class 110%+), GRR > 90%, Rule of 40 ≥ 40%, burn multiple < 1.5, and 18+ months of runway. But all of these shift with stage and segment.",
  },
  {
    q: "Do benchmarks differ by stage and segment?",
    a: "Significantly. SMB/self-serve SaaS runs higher churn and lower ACV than enterprise; early-stage companies prioritise growth over the Rule of 40; valuation multiples move with the market. Always compare against peers at your ARR band and motion, not the whole market.",
  },
  {
    q: "Should I optimise to a single benchmark?",
    a: "No. Metrics are best read together. A 2.5:1 LTV:CAC with a 9-month payback and 120% NRR is a better business than 4:1 with a 30-month payback and 95% NRR. Use the SaaS Health Score to see the weighted picture.",
  },
];

function SourceList() {
  const seen = new Map<string, Source>();
  for (const m of METRICS) for (const s of m.sources) seen.set(s.url, s);
  return (
    <ul className="mt-2 grid gap-1 sm:grid-cols-2">
      {[...seen.values()].map((s) => (
        <li key={s.url}>
          <a
            href={s.url}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="text-sm text-brand-700 underline underline-offset-2 hover:text-brand-800"
          >
            {s.label}
          </a>
        </li>
      ))}
    </ul>
  );
}

export default function BenchmarksPage() {
  const byCat = metricsByCategory();
  return (
    <>
      <JsonLd
        data={[
          faqLd(FAQS),
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Benchmarks", path: "/benchmarks" },
          ]),
        ]}
      />
      <Container className="py-12">
        <h1 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
          SaaS metrics benchmarks
        </h1>
        <p className="mt-3 max-w-2xl text-lg text-ink-soft">
          What &ldquo;good&rdquo; looks like for each SaaS metric — with the
          caveats that actually matter. Ranges are drawn from widely cited
          sources and vary by stage and segment, so treat them as guidance, not
          grades. Click any metric to calculate yours.
        </p>

        <div className="mt-10 space-y-10">
          {CATEGORIES.map((cat) => (
            <section key={cat}>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-brand-700">
                {cat}
              </h2>
              <div className="mt-4 grid gap-4 lg:grid-cols-2">
                {byCat[cat].map((m) => (
                  <div
                    key={m.slug}
                    className="rounded-2xl border border-slate-200 bg-white p-5"
                  >
                    <div className="flex items-baseline justify-between gap-2">
                      <Link
                        href={`/calculators/${m.slug}`}
                        className="font-semibold text-ink hover:text-brand-700"
                      >
                        {m.name}
                      </Link>
                      <Link
                        href={`/calculators/${m.slug}`}
                        className="shrink-0 text-xs font-medium text-brand-700 hover:text-brand-800"
                      >
                        Calculate →
                      </Link>
                    </div>
                    <ul className="mt-3 divide-y divide-slate-100">
                      {m.benchmarks.map((b) => (
                        <li
                          key={b.label}
                          className="flex items-center justify-between gap-3 py-1.5 text-sm"
                        >
                          <span className="text-ink-soft">{b.label}</span>
                          <span className="font-medium text-ink">{b.range}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="mt-3 text-xs leading-relaxed text-ink-muted">
                      {m.benchmarkNote}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        <section className="mt-14">
          <h2 className="text-2xl font-bold tracking-tight text-ink">
            Benchmark FAQ
          </h2>
          <div className="mt-5">
            <FaqList faqs={FAQS} />
          </div>
        </section>

        <section className="mt-12 rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-sm font-semibold text-ink">Sources</h2>
          <SourceList />
          <p className="mt-3 text-xs text-ink-muted">
            Benchmarks are directional and provided for general guidance only —
            not financial advice.
          </p>
        </section>

        <div className="mt-12">
          <EmailCapture source="benchmarks" />
        </div>
      </Container>
    </>
  );
}
