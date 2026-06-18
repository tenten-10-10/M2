import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/Container";
import { JsonLd } from "@/components/JsonLd";
import { buildMetadata, breadcrumbLd } from "@/lib/seo";
import { CONTACT_EMAIL, SITE_NAME } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "About SaaSGauge — Free, Honest SaaS Metrics Tools | SaaSGauge",
  description:
    "SaaSGauge is an independent project building free, accurate, benchmark-backed SaaS metrics calculators — with no logins, no paywalled tools, and no selling of your data.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
        ])}
      />
      <Container className="py-12">
        <h1 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
          About {SITE_NAME}
        </h1>
        <div className="prose-page mt-6">
          <p>
            {SITE_NAME} is an independent project that builds free, accurate SaaS
            metrics tools for founders, operators and finance teams. Most metrics
            calculators online are either oversimplified, gated behind a signup,
            or wrapped in a sales pitch. We wanted the opposite: rigorous
            formulas, honest benchmark context, and zero friction.
          </p>

          <h2>What we believe</h2>
          <ul>
            <li>
              <strong>Tools should be free and private.</strong> Every
              calculation runs in your browser. We never see or store the numbers
              you type.
            </li>
            <li>
              <strong>Benchmarks need context.</strong> A 3:1 LTV:CAC isn&apos;t a
              pass/fail grade. We show ranges, explain caveats, and link our
              sources so you can verify them yourself.
            </li>
            <li>
              <strong>No dark patterns.</strong> No fake countdowns, no invented
              testimonials, no &ldquo;you won&apos;t believe this revenue&rdquo;
              claims. Just useful tools.
            </li>
          </ul>

          <h2>How we sustain this</h2>
          <p>
            The calculators are free forever. We fund the project through an
            optional{" "}
            <Link href="/pricing">Pro Pack</Link> of templates and a deeper
            benchmark database, and through paid metrics reviews for teams that
            want a second opinion before a board meeting or raise. We deliberately
            do not rely on advertising.
          </p>

          <h2>A note on advice</h2>
          <p>
            {SITE_NAME} provides educational tools and general benchmark context
            only. It is not financial, investment, accounting, tax or legal
            advice. Always validate important decisions with a qualified
            professional. See our{" "}
            <Link href="/legal/disclaimer">disclaimer</Link> for details.
          </p>

          <h2>Get in touch</h2>
          <p>
            Spotted a formula you&apos;d refine, or a metric we should add? We&apos;d
            genuinely like to hear it — email{" "}
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> or use the{" "}
            <Link href="/contact">contact page</Link>.
          </p>
        </div>
      </Container>
    </>
  );
}
