import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/Container";
import { EmailCapture } from "@/components/EmailCapture";
import { JsonLd } from "@/components/JsonLd";
import { buildMetadata, breadcrumbLd } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Free SaaS Metrics Cheat Sheet (PDF) | SaaSGauge",
  description:
    "Download the free SaaS Metrics Cheat Sheet: every key formula and benchmark on one page — LTV:CAC, CAC payback, NRR, Rule of 40, magic number and more.",
  path: "/resources",
});

const CONTENTS = [
  "All 16 formulas, written plainly",
  "Benchmark ranges for each metric",
  "What 'good' looks like by stage",
  "A printable one-page reference",
];

export default function ResourcesPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Resources", path: "/resources" },
        ])}
      />
      <Container className="py-12">
        <div className="grid items-start gap-10 lg:grid-cols-2">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
              The free SaaS Metrics Cheat Sheet
            </h1>
            <p className="mt-3 text-lg text-ink-soft">
              Every formula and benchmark on this site, condensed to a single,
              printable page. Stick it next to your dashboard and stop
              second-guessing definitions.
            </p>
            <ul className="mt-6 space-y-2 text-ink-soft">
              {CONTENTS.map((c) => (
                <li key={c} className="flex gap-2">
                  <span className="text-brand-600">✓</span>
                  {c}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm text-ink-soft">
              Don&apos;t want to wait for the email?{" "}
              <Link href="/cheat-sheet" className="font-semibold text-brand-700 underline">
                View the full cheat sheet now →
              </Link>
            </p>
            <p className="mt-3 text-sm text-ink-muted">
              Prefer to explore interactively? Jump straight to the{" "}
              <Link href="/calculators" className="text-brand-700 underline">
                calculators
              </Link>{" "}
              or run the{" "}
              <Link href="/health-score" className="text-brand-700 underline">
                Health Score
              </Link>
              .
            </p>
          </div>
          <div className="lg:pt-6">
            <EmailCapture
              source="resources"
              tag="cheat-sheet"
              heading="Send me the cheat sheet"
              description="Enter your email and we'll send the PDF right away, plus occasional updates when we ship new tools. No spam."
            />
          </div>
        </div>
      </Container>
    </>
  );
}
