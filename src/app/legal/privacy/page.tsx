import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/Container";
import { buildMetadata } from "@/lib/seo";
import { CONTACT_EMAIL, SITE_NAME } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Privacy Policy | SaaSGauge",
  description:
    "How SaaSGauge handles your data: calculator inputs stay in your browser, email is only collected when you opt in, and analytics are privacy-friendly.",
  path: "/legal/privacy",
});

export default function PrivacyPage() {
  return (
    <Container className="py-12">
      <h1 className="text-3xl font-extrabold tracking-tight text-ink">
        Privacy Policy
      </h1>
      <p className="mt-2 text-sm text-ink-muted">Last updated: June 2026</p>
      <div className="prose-page mt-6">
        <p>
          {SITE_NAME} (&ldquo;we&rdquo;, &ldquo;us&rdquo;) respects your privacy.
          This policy explains what we collect and why. In short: the numbers you
          enter into our calculators never leave your device, and we only collect
          personal data you choose to give us.
        </p>

        <h2>Calculator inputs stay in your browser</h2>
        <p>
          All calculators and the SaaS Health Score run entirely client-side in
          your browser. The financial figures you enter are <strong>not</strong>{" "}
          transmitted to or stored on our servers.
        </p>

        <h2>Information you choose to provide</h2>
        <ul>
          <li>
            <strong>Email address</strong> — if you sign up for the cheat sheet or
            updates. We use it to send the resource and occasional product
            updates, via an email service provider. You can unsubscribe at any
            time.
          </li>
          <li>
            <strong>Contact / metrics-review details</strong> — if you submit the
            contact form (name, email, company, optional details). We use these
            solely to respond to your request.
          </li>
        </ul>

        <h2>Analytics</h2>
        <p>
          We may use privacy-friendly analytics (such as Plausible) and/or Google
          Analytics to understand aggregate usage — pages viewed, tools used. Where
          we use Plausible, no cookies are set and no personal data is collected.
          If Google Analytics is enabled, it may set cookies and process data
          subject to Google&apos;s policies; we enable IP anonymisation where
          available.
        </p>

        <h2>Cookies</h2>
        <p>
          The site functions without advertising cookies. Any cookies are limited
          to optional analytics as described above.
        </p>

        <h2>Third-party processors</h2>
        <p>
          We rely on reputable third parties to operate the site, which may
          include our hosting provider, email service provider, and analytics
          provider. These processors handle data only as needed to provide their
          service.
        </p>

        <h2>Your rights</h2>
        <p>
          Depending on your location (e.g. under the GDPR or CCPA/CPRA), you may
          have rights to access, correct, delete, or restrict processing of your
          personal data, and to opt out of marketing. To exercise any right,
          email{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>

        <h2>Data retention</h2>
        <p>
          We keep email-list and contact data only as long as needed for the
          purposes above or until you ask us to delete it.
        </p>

        <h2>Children</h2>
        <p>The Service is intended for business users and not directed at children.</p>

        <h2>Changes</h2>
        <p>
          We may update this policy; material changes will be reflected by the
          date above.
        </p>

        <p>
          Questions? Email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
          See also our <Link href="/legal/terms">Terms of Use</Link>.
        </p>

        <p className="text-sm text-ink-muted">
          This policy is a general template. Have it reviewed by qualified counsel
          and tailored to your actual data practices and jurisdiction before
          relying on it.
        </p>
      </div>
    </Container>
  );
}
