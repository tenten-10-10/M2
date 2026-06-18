import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/Container";
import { HealthScore } from "@/components/HealthScore";
import { FaqList } from "@/components/FaqList";
import { JsonLd } from "@/components/JsonLd";
import { buildMetadata, breadcrumbLd, faqLd, softwareAppLd } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "SaaS Health Score Calculator (Free) — Board-Ready Report | SaaSGauge",
  description:
    "Get an instant SaaS Health Score (0–100) across unit economics, retention, efficiency and cash. Free, private, with a prioritised action list and printable PDF report.",
  path: "/health-score",
  ogTitle: "Your SaaS Health Score",
  ogSubtitle: "One weighted score across economics, retention, efficiency & cash",
});

const FAQS = [
  {
    q: "How is the SaaS Health Score calculated?",
    a: "We score five weighted areas: LTV:CAC ratio (25 pts), CAC payback (20 pts), annual churn / retention (20 pts), Rule of 40 (20 pts), and cash runway (15 pts). Each area is scored against widely cited benchmarks, then summed to a 0–100 score and an A–F grade.",
  },
  {
    q: "What inputs do I need?",
    a: "Eight numbers: monthly ARPA, gross margin, monthly customer churn, CAC, YoY revenue growth, profit margin, cash on hand, and net monthly burn. Most teams have all of these in their billing tool and finance model.",
  },
  {
    q: "Is my data private?",
    a: "Yes. The entire calculation runs in your browser. Your numbers are never sent to our servers. You only share data if you opt in to the cheat sheet or request a metrics review.",
  },
  {
    q: "Can I share or save the report?",
    a: "Yes — use the Save / print button to export a clean, board-ready PDF, or copy the page link to share the tool with your team.",
  },
];

export default function HealthScorePage() {
  return (
    <>
      <JsonLd
        data={[
          softwareAppLd(
            "SaaS Health Score",
            "Free weighted SaaS health score across unit economics, retention, efficiency and cash.",
            "/health-score",
          ),
          faqLd(FAQS),
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "SaaS Health Score", path: "/health-score" },
          ]),
        ]}
      />

      <Container className="py-10">
        <div className="max-w-3xl">
          <span className="text-xs font-semibold uppercase tracking-wider text-brand-700">
            Flagship tool
          </span>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            SaaS Health Score
          </h1>
          <p className="mt-3 text-lg text-ink-soft">
            Eight numbers in, one weighted score out. See how your unit
            economics, retention, efficiency and cash stack up against SaaS
            benchmarks — and exactly what to fix first.
          </p>
        </div>

        <div className="mt-8">
          <HealthScore />
        </div>

        <section className="mt-16">
          <h2 className="text-2xl font-bold tracking-tight text-ink">
            How the score works
          </h2>
          <div className="mt-5">
            <FaqList faqs={FAQS} />
          </div>
        </section>

        <p className="mt-8 max-w-prose text-sm text-ink-muted">
          The SaaS Health Score is an educational, directional tool based on
          widely cited benchmarks that vary by stage and segment. It is not
          financial, investment or accounting advice. Prefer to dig into a single
          metric? Browse the{" "}
          <Link href="/calculators" className="text-brand-700 underline">
            full calculator set
          </Link>
          .
        </p>
      </Container>
    </>
  );
}
