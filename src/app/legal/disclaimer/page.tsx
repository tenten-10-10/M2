import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/Container";
import { buildMetadata } from "@/lib/seo";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Disclaimer | SaaSGauge",
  description:
    "SaaSGauge provides educational SaaS metrics tools and general benchmark context only — not financial, investment, accounting, tax or legal advice.",
  path: "/legal/disclaimer",
});

export default function DisclaimerPage() {
  return (
    <Container className="py-12">
      <h1 className="text-3xl font-extrabold tracking-tight text-ink">Disclaimer</h1>
      <p className="mt-2 text-sm text-ink-muted">Last updated: June 2026</p>
      <div className="prose-page mt-6">
        <p>
          The calculators, benchmarks, scores, guides and other content provided
          by {SITE_NAME} (the &ldquo;Service&rdquo;) are for general
          informational and educational purposes only.
        </p>
        <h2>Not professional advice</h2>
        <p>
          Nothing on this Service constitutes financial, investment, accounting,
          tax, legal or other professional advice, and it must not be relied upon
          as such. The outputs are simplified models based on the inputs you
          provide and on widely cited industry benchmarks that vary by company
          stage, segment and business model. Your actual circumstances may
          differ materially.
        </p>
        <h2>No guarantee of accuracy</h2>
        <p>
          While we strive for accurate formulas and well-sourced benchmarks, we
          make no warranties about the completeness, reliability or accuracy of
          any results. Benchmark figures are drawn from third-party sources and
          general industry knowledge and may be out of date or not applicable to
          your situation.
        </p>
        <h2>Make your own decisions</h2>
        <p>
          Any decision you make based on the Service is your sole responsibility.
          Before making financial, fundraising, hiring, pricing or strategic
          decisions, consult a qualified professional who can consider your
          specific facts and circumstances. To the maximum extent permitted by
          law, {SITE_NAME} disclaims all liability for any loss or damage arising
          from use of, or reliance on, the Service.
        </p>
        <h2>External links</h2>
        <p>
          We link to third-party sources for reference. We do not control and are
          not responsible for the content of external sites.
        </p>
        <p>
          See also our{" "}
          <Link href="/legal/terms">Terms of Use</Link> and{" "}
          <Link href="/legal/privacy">Privacy Policy</Link>.
        </p>
        <p className="text-sm text-ink-muted">
          This page is a general template and should be reviewed by your own
          legal counsel before you rely on it for your business.
        </p>
      </div>
    </Container>
  );
}
