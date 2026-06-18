import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/Container";
import { EmailCapture } from "@/components/EmailCapture";
import { JsonLd } from "@/components/JsonLd";
import { GUIDES, getGuide, type Block } from "@/lib/guides";
import { getMetric } from "@/lib/metrics";
import { buildMetadata, breadcrumbLd } from "@/lib/seo";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }));
}

export const dynamicParams = false;

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) return {};
  return buildMetadata({
    title: guide.metaTitle,
    description: guide.description,
    path: `/guides/${guide.slug}`,
    ogTitle: guide.title,
  });
}

function BlockView({ block }: { block: Block }) {
  switch (block.type) {
    case "h2":
      return <h2>{block.text}</h2>;
    case "p":
      return <p>{block.text}</p>;
    case "ul":
      return (
        <ul>
          {block.items.map((i) => (
            <li key={i}>{i}</li>
          ))}
        </ul>
      );
    case "ol":
      return (
        <ol>
          {block.items.map((i) => (
            <li key={i}>{i}</li>
          ))}
        </ol>
      );
    case "callout":
      return (
        <div className="my-6 rounded-xl border border-brand-100 bg-brand-50 p-4 text-sm text-brand-900">
          {block.text}
        </div>
      );
  }
}

export default async function GuidePage({ params }: Params) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) notFound();

  const related = guide.relatedCalculators
    .map((s) => getMetric(s))
    .filter((m): m is NonNullable<typeof m> => Boolean(m));

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.description,
    datePublished: guide.updated,
    dateModified: guide.updated,
    author: { "@type": "Organization", name: SITE_NAME },
    publisher: { "@type": "Organization", name: SITE_NAME },
    mainEntityOfPage: `${SITE_URL}/guides/${guide.slug}`,
  };

  return (
    <>
      <JsonLd
        data={[
          articleLd,
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Guides", path: "/guides" },
            { name: guide.title, path: `/guides/${guide.slug}` },
          ]),
        ]}
      />
      <Container className="py-10">
        <nav className="text-sm text-ink-muted">
          <Link href="/" className="hover:text-ink-soft">Home</Link>
          <span className="mx-1.5">/</span>
          <Link href="/guides" className="hover:text-ink-soft">Guides</Link>
        </nav>

        <article className="mt-4">
          <p className="text-xs font-medium text-brand-700">
            {guide.readingMinutes} min read · Updated{" "}
            {new Date(guide.updated).toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </p>
          <h1 className="mt-1 max-w-3xl text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            {guide.title}
          </h1>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
              Key takeaways
            </p>
            <ul className="mt-2 space-y-1.5">
              {guide.takeaways.map((t) => (
                <li key={t} className="flex gap-2 text-sm text-ink-soft">
                  <span className="text-brand-600">✓</span>
                  {t}
                </li>
              ))}
            </ul>
          </div>

          <div className="prose-page mt-8">
            {guide.body.map((block, i) => (
              <BlockView key={i} block={block} />
            ))}
          </div>
        </article>

        {related.length > 0 && (
          <section className="mt-12">
            <h2 className="text-lg font-semibold text-ink">
              Calculators for this guide
            </h2>
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

        <div className="mt-12">
          <EmailCapture source={`guide-${guide.slug}`} />
        </div>
      </Container>
    </>
  );
}
