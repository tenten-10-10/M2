import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/Container";
import { EmailCapture } from "@/components/EmailCapture";
import { JsonLd } from "@/components/JsonLd";
import { CATEGORIES, METRICS, metricsByCategory } from "@/lib/metrics";
import { buildMetadata, breadcrumbLd, itemListLd } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Free SaaS Metrics Calculators (16 tools) | SaaSGauge",
  description:
    "A complete set of free SaaS metrics calculators: LTV:CAC, CAC payback, MRR, ARR, churn, NRR, GRR, Rule of 40, burn rate, runway, magic number, quick ratio and more.",
  path: "/calculators",
  ogTitle: "Free SaaS metrics calculators",
  ogSubtitle: `${METRICS.length} tools — LTV:CAC, payback, churn, Rule of 40 & more`,
});

export default function CalculatorsPage() {
  const byCat = metricsByCategory();
  return (
    <>
      <JsonLd
        data={[
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Calculators", path: "/calculators" },
          ]),
          itemListLd(
            "SaaS metrics calculators",
            METRICS.map((m) => ({
              name: m.name,
              path: `/calculators/${m.slug}`,
            })),
          ),
        ]}
      />
      <Container className="py-12">
        <h1 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
          SaaS metrics calculators
        </h1>
        <p className="mt-3 max-w-2xl text-lg text-ink-soft">
          {METRICS.length} free, benchmark-backed calculators. Pick one to crunch
          a single number, or run the{" "}
          <Link href="/health-score" className="font-semibold text-brand-700 hover:text-brand-800">
            SaaS Health Score
          </Link>{" "}
          to see the whole picture at once.
        </p>

        <div className="mt-10 space-y-10">
          {CATEGORIES.map((cat) => (
            <section key={cat}>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-ink-muted">
                {cat}
              </h2>
              <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {byCat[cat].map((m) => (
                  <Link
                    key={m.slug}
                    href={`/calculators/${m.slug}`}
                    className="group flex flex-col rounded-xl border border-slate-200 bg-white p-5 transition hover:border-brand-300 hover:shadow-card"
                  >
                    <span className="font-semibold text-ink group-hover:text-brand-700">
                      {m.name}
                    </span>
                    <span className="mt-1 text-sm text-ink-muted">
                      {m.shortDescription}
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-14">
          <EmailCapture source="calculators-index" />
        </div>
      </Container>
    </>
  );
}
