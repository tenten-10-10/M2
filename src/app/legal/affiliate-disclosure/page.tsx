import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/Container";
import { buildMetadata } from "@/lib/seo";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Disclosure | SaaSGauge",
  description:
    "How SaaSGauge makes money and our position on advertising, affiliate links, and sponsored content — full transparency.",
  path: "/legal/affiliate-disclosure",
});

export default function DisclosurePage() {
  return (
    <Container className="py-12">
      <h1 className="text-3xl font-extrabold tracking-tight text-ink">
        Disclosure
      </h1>
      <p className="mt-2 text-sm text-ink-muted">Last updated: June 2026</p>
      <div className="prose-page mt-6">
        <p>
          We believe you should know exactly how {SITE_NAME} makes money, so you
          can judge our content for yourself.
        </p>

        <h2>How we fund this site</h2>
        <ul>
          <li>
            <strong>Pro Pack.</strong> An optional one-time purchase of templates
            and an extended benchmark database. See{" "}
            <Link href="/pricing">pricing</Link>.
          </li>
          <li>
            <strong>Paid metrics reviews.</strong> Fee-based, hands-on reviews for
            teams who request one via our <Link href="/contact">contact page</Link>.
          </li>
        </ul>

        <h2>Advertising</h2>
        <p>
          We deliberately do <strong>not</strong> run display advertising. The
          calculators are free because we&apos;d rather earn trust and revenue from
          genuinely useful paid products than from ads.
        </p>

        <h2>Affiliate links</h2>
        <p>
          At present we do not rely on affiliate links as a revenue source. If we
          ever recommend a third-party tool through an affiliate link, we will
          clearly label it as such at the point of the link, and we will only
          recommend tools we would suggest regardless of any commission. Any such
          relationship will never change the benchmark figures or calculator logic
          we publish.
        </p>

        <h2>Editorial independence</h2>
        <p>
          Our formulas, benchmarks and recommendations are not influenced by any
          commercial relationship. Sources are linked on each calculator so you
          can verify them independently.
        </p>
      </div>
    </Container>
  );
}
