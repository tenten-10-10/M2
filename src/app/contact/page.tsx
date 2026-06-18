import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { LeadForm } from "@/components/LeadForm";
import { JsonLd } from "@/components/JsonLd";
import { buildMetadata, breadcrumbLd } from "@/lib/seo";
import { CONTACT_EMAIL } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Contact & Free Metrics Review | SaaSGauge",
  description:
    "Get in touch with SaaSGauge, suggest a calculator, or request a free, no-obligation SaaS metrics review before your next board meeting or raise.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Contact", path: "/contact" },
        ])}
      />
      <Container className="py-12">
        <div className="grid items-start gap-12 lg:grid-cols-2">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
              Request a free metrics review
            </h1>
            <p className="mt-3 text-lg text-ink-soft">
              Tell us what you&apos;re trying to decide and share the numbers you&apos;re
              comfortable with. We&apos;ll come back with the two or three things that
              matter most — no obligation, no hard sell.
            </p>
            <div className="mt-6 space-y-2 text-sm text-ink-soft">
              <p>
                Prefer email? Reach us at{" "}
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="font-medium text-brand-700 underline underline-offset-2"
                >
                  {CONTACT_EMAIL}
                </a>
                .
              </p>
              <p className="text-ink-muted">
                We typically reply within two business days. Anything you submit
                is used only to respond to you.
              </p>
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
            <LeadForm />
          </div>
        </div>
      </Container>
    </>
  );
}
