import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/Container";
import { buildMetadata } from "@/lib/seo";
import { CONTACT_EMAIL, SITE_NAME } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Terms of Use | SaaSGauge",
  description:
    "The terms governing your use of SaaSGauge's free SaaS metrics calculators, Health Score, guides and related content.",
  path: "/legal/terms",
});

export default function TermsPage() {
  return (
    <Container className="py-12">
      <h1 className="text-3xl font-extrabold tracking-tight text-ink">
        Terms of Use
      </h1>
      <p className="mt-2 text-sm text-ink-muted">Last updated: June 2026</p>
      <div className="prose-page mt-6">
        <p>
          By accessing or using {SITE_NAME} (the &ldquo;Service&rdquo;), you agree
          to these Terms of Use. If you do not agree, please do not use the
          Service.
        </p>

        <h2>Use of the Service</h2>
        <p>
          We grant you a personal, non-exclusive, non-transferable licence to use
          the Service for lawful business and informational purposes. You agree
          not to misuse the Service, including by attempting to disrupt it, scrape
          it at scale, reverse engineer it, or use it to build a competing
          dataset in violation of applicable law.
        </p>

        <h2>No professional advice</h2>
        <p>
          The Service provides educational tools and general information only and
          does not constitute financial, investment, accounting, tax or legal
          advice. See our <Link href="/legal/disclaimer">Disclaimer</Link>.
        </p>

        <h2>Intellectual property</h2>
        <p>
          The Service, including its design, text, calculators and templates, is
          owned by {SITE_NAME} and protected by applicable laws. You may use
          calculator outputs for your own business. You may not republish or
          resell the Service&apos;s content or templates as your own.
        </p>

        <h2>Paid products</h2>
        <p>
          Optional paid products (such as the Pro Pack) are governed by the terms
          presented at the point of purchase, including any refund policy of the
          checkout provider. Calculators and the Health Score remain free.
        </p>

        <h2>Disclaimer of warranties</h2>
        <p>
          The Service is provided &ldquo;as is&rdquo; and &ldquo;as
          available&rdquo; without warranties of any kind, express or implied,
          including accuracy, fitness for a particular purpose, or
          non-infringement.
        </p>

        <h2>Limitation of liability</h2>
        <p>
          To the maximum extent permitted by law, {SITE_NAME} shall not be liable
          for any indirect, incidental, special or consequential damages, or any
          loss arising from your use of, or reliance on, the Service.
        </p>

        <h2>Changes</h2>
        <p>
          We may modify the Service or these Terms at any time. Continued use
          after changes constitutes acceptance.
        </p>

        <h2>Contact</h2>
        <p>
          Questions about these Terms? Email{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>

        <p className="text-sm text-ink-muted">
          This is a general template and should be reviewed by qualified counsel
          before you rely on it for your business.
        </p>
      </div>
    </Container>
  );
}
