import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/Container";
import { JsonLd } from "@/components/JsonLd";
import { GLOSSARY } from "@/lib/glossary";
import { buildMetadata, breadcrumbLd, faqLd } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "SaaS Metrics Glossary — Plain-English Definitions | SaaSGauge",
  description:
    "A plain-English glossary of SaaS metrics: ARR, MRR, CAC, LTV, LTV:CAC, NRR, GRR, churn, Rule of 40, burn rate, runway, magic number, quick ratio and more.",
  path: "/glossary",
});

export default function GlossaryPage() {
  const faqs = GLOSSARY.map((t) => ({
    q: `What is ${t.term}${t.abbr ? ` (${t.abbr})` : ""}?`,
    a: t.definition,
  }));

  return (
    <>
      <JsonLd
        data={[
          faqLd(faqs),
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Glossary", path: "/glossary" },
          ]),
        ]}
      />
      <Container className="py-12">
        <h1 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
          SaaS metrics glossary
        </h1>
        <p className="mt-3 max-w-2xl text-lg text-ink-soft">
          Clear definitions for the metrics that run a subscription business.
          Each links to a free calculator where relevant.
        </p>

        <dl className="mt-10 divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white">
          {GLOSSARY.map((t) => (
            <div key={t.term} className="p-5">
              <dt className="flex flex-wrap items-baseline gap-2">
                <span className="text-lg font-semibold text-ink">{t.term}</span>
                {t.abbr && (
                  <span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-medium text-ink-muted">
                    {t.abbr}
                  </span>
                )}
              </dt>
              <dd className="mt-1.5 text-sm text-ink-soft">
                {t.definition}
                {t.calculatorSlug && (
                  <>
                    {" "}
                    <Link
                      href={`/calculators/${t.calculatorSlug}`}
                      className="font-medium text-brand-700 underline underline-offset-2 hover:text-brand-800"
                    >
                      Open calculator →
                    </Link>
                  </>
                )}
              </dd>
            </div>
          ))}
        </dl>
      </Container>
    </>
  );
}
