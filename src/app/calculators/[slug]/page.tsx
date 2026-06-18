import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/Container";
import { Calculator } from "@/components/Calculator";
import { FaqList } from "@/components/FaqList";
import { EmailCapture } from "@/components/EmailCapture";
import { ShareButtons } from "@/components/ShareButtons";
import { JsonLd } from "@/components/JsonLd";
import {
  METRIC_SLUGS,
  getMetric,
  getRelated,
} from "@/lib/metrics";
import {
  breadcrumbLd,
  buildMetadata,
  faqLd,
  softwareAppLd,
} from "@/lib/seo";

export function generateStaticParams() {
  return METRIC_SLUGS.map((slug) => ({ slug }));
}

export const dynamicParams = false;

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const metric = getMetric(slug);
  if (!metric) return {};
  return buildMetadata({
    title: metric.title,
    description: metric.metaDescription,
    path: `/calculators/${metric.slug}`,
    ogTitle: metric.h1,
    ogSubtitle: metric.shortDescription,
  });
}

export default async function CalculatorPage({ params }: Params) {
  const { slug } = await params;
  const metric = getMetric(slug);
  if (!metric) notFound();

  const related = getRelated(metric);

  return (
    <>
      <JsonLd
        data={[
          softwareAppLd(
            metric.h1,
            metric.metaDescription,
            `/calculators/${metric.slug}`,
          ),
          faqLd(metric.faqs),
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Calculators", path: "/calculators" },
            { name: metric.name, path: `/calculators/${metric.slug}` },
          ]),
        ]}
      />

      <Container className="py-10">
        {/* Breadcrumb */}
        <nav className="text-sm text-ink-muted">
          <Link href="/" className="hover:text-ink-soft">Home</Link>
          <span className="mx-1.5">/</span>
          <Link href="/calculators" className="hover:text-ink-soft">Calculators</Link>
          <span className="mx-1.5">/</span>
          <span className="text-ink-soft">{metric.name}</span>
        </nav>

        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-700">
              {metric.category}
            </span>
            <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
              {metric.h1}
            </h1>
          </div>
          <ShareButtons title={metric.title} />
        </div>

        <div className="mt-4 max-w-prose space-y-3 text-ink-soft">
          {metric.intro.map((p, i) => (
            <p key={i} className="leading-relaxed">{p}</p>
          ))}
        </div>

        <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
            Formula
          </p>
          <p className="mt-1 font-mono text-sm text-ink">{metric.formula}</p>
        </div>

        {/* Calculator */}
        <div className="mt-8">
          <Calculator slug={metric.slug} />
        </div>

        {/* FAQ */}
        <section className="mt-14">
          <h2 className="text-2xl font-bold tracking-tight text-ink">
            {metric.name}: frequently asked questions
          </h2>
          <div className="mt-5">
            <FaqList faqs={metric.faqs} />
          </div>
        </section>

        {/* Related */}
        {related.length > 0 && (
          <section className="mt-12">
            <h2 className="text-lg font-semibold text-ink">Related calculators</h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/calculators/${r.slug}`}
                  className="rounded-xl border border-slate-200 bg-white p-4 text-sm font-medium text-ink transition hover:border-brand-300 hover:text-brand-700"
                >
                  {r.name}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Sources */}
        <section className="mt-12 rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="text-sm font-semibold text-ink">Sources & further reading</h2>
          <ul className="mt-2 space-y-1">
            {metric.sources.map((s) => (
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
          <p className="mt-3 text-xs text-ink-muted">
            Benchmarks vary by company stage, segment and business model and are
            provided for general guidance only — not financial advice.
          </p>
        </section>

        {/* CTA */}
        <section className="mt-12 grid gap-6 lg:grid-cols-2">
          <EmailCapture source={`calc-${metric.slug}`} compact={false} />
          <div className="flex flex-col justify-center rounded-2xl border border-slate-200 bg-white p-6">
            <h3 className="text-lg font-semibold text-ink">
              See the whole picture
            </h3>
            <p className="mt-1 text-sm text-ink-soft">
              Combine this with every other metric in one weighted{" "}
              <strong>SaaS Health Score</strong> and get a board-ready report.
            </p>
            <Link
              href="/health-score"
              className="mt-4 inline-block w-fit rounded-lg bg-brand-600 px-5 py-2.5 font-semibold text-white transition hover:bg-brand-700"
            >
              Run my Health Score →
            </Link>
          </div>
        </section>
      </Container>
    </>
  );
}
