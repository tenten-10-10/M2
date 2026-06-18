import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/Container";
import { PrintButton } from "@/components/PrintButton";
import { EmailCapture } from "@/components/EmailCapture";
import { JsonLd } from "@/components/JsonLd";
import { CATEGORIES, metricsByCategory } from "@/lib/metrics";
import { buildMetadata, breadcrumbLd } from "@/lib/seo";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "SaaS Metrics Cheat Sheet — Every Formula & Benchmark | SaaSGauge",
  description:
    "The free SaaS metrics cheat sheet: every key formula and benchmark on one page — LTV:CAC, CAC payback, NRR, GRR, Rule of 40, burn multiple, magic number and more. Print to PDF.",
  path: "/cheat-sheet",
});

export default function CheatSheetPage() {
  const byCat = metricsByCategory();
  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Cheat sheet", path: "/cheat-sheet" },
        ])}
      />
      <Container className="py-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
              SaaS Metrics Cheat Sheet
            </h1>
            <p className="mt-2 max-w-2xl text-ink-soft">
              Every formula and benchmark on {SITE_NAME}, on one printable page.
              Use the button to save it as a PDF.
            </p>
          </div>
          <PrintButton />
        </div>

        <div className="mt-8 space-y-8">
          {CATEGORIES.map((cat) => (
            <section key={cat} className="break-inside-avoid">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-brand-700">
                {cat}
              </h2>
              <div className="mt-3 overflow-hidden rounded-xl border border-slate-200">
                <table className="w-full border-collapse text-sm">
                  <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-ink-muted">
                    <tr>
                      <th className="px-4 py-2 font-semibold">Metric</th>
                      <th className="px-4 py-2 font-semibold">Formula</th>
                      <th className="px-4 py-2 font-semibold">Healthy benchmark</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {byCat[cat].map((m) => {
                      const healthy =
                        m.benchmarks.find((b) =>
                          /healthy|good|best|comfortable|passing|efficient/i.test(
                            b.label,
                          ),
                        ) ?? m.benchmarks[0];
                      return (
                        <tr key={m.slug} className="align-top">
                          <td className="px-4 py-3 font-medium text-ink">
                            <Link
                              href={`/calculators/${m.slug}`}
                              className="hover:text-brand-700"
                            >
                              {m.name}
                            </Link>
                          </td>
                          <td className="px-4 py-3 font-mono text-xs text-ink-soft">
                            {m.formula}
                          </td>
                          <td className="px-4 py-3 text-ink-soft">
                            <span className="font-medium text-ink">
                              {healthy.label}:
                            </span>{" "}
                            {healthy.range}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          ))}
        </div>

        <p className="mt-8 text-xs text-ink-muted">
          Benchmarks vary by stage, segment and model and are for general
          guidance only — not financial advice. Source: {SITE_URL}.
        </p>

        <div className="no-print mt-10">
          <EmailCapture
            source="cheat-sheet"
            tag="cheat-sheet"
            heading="Want the polished PDF version emailed to you?"
            description="Drop your email and we'll send the designed one-pager, plus a note when we ship new calculators."
          />
        </div>
      </Container>
    </>
  );
}
