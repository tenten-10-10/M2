import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/Container";
import { JsonLd } from "@/components/JsonLd";
import { GUIDES } from "@/lib/guides";
import { buildMetadata, breadcrumbLd } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "SaaS Metrics Guides — Practical, No-Fluff Playbooks | SaaSGauge",
  description:
    "Practical SaaS metrics guides: which metrics matter by stage, how to improve LTV:CAC, shorten CAC payback, and reduce churn. Tied to free calculators.",
  path: "/guides",
});

export default function GuidesPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Guides", path: "/guides" },
        ])}
      />
      <Container className="py-12">
        <h1 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
          Guides
        </h1>
        <p className="mt-3 max-w-2xl text-lg text-ink-soft">
          Short, practical playbooks on the metrics that move the business —
          each one tied to a calculator so you can act on it immediately.
        </p>
        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {GUIDES.map((g) => (
            <Link
              key={g.slug}
              href={`/guides/${g.slug}`}
              className="group rounded-2xl border border-slate-200 bg-white p-6 transition hover:border-brand-300 hover:shadow-card"
            >
              <p className="text-xs font-medium text-brand-700">
                {g.readingMinutes} min read
              </p>
              <h2 className="mt-1 text-xl font-semibold text-ink group-hover:text-brand-700">
                {g.title}
              </h2>
              <p className="mt-2 text-sm text-ink-soft">{g.description}</p>
            </Link>
          ))}
        </div>
      </Container>
    </>
  );
}
