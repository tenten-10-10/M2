import Link from "next/link";
import { Container } from "@/components/Container";
import { METRICS } from "@/lib/metrics";

export default function NotFound() {
  const popular = METRICS.slice(0, 6);
  return (
    <Container className="py-24">
      <div className="mx-auto max-w-xl text-center">
        <p className="text-sm font-semibold text-brand-700">404</p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
          We couldn&apos;t find that page
        </h1>
        <p className="mt-3 text-ink-soft">
          The link may be broken or the page may have moved. Here are some
          popular tools to get you back on track.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="rounded-lg bg-brand-600 px-6 py-3 font-semibold text-white transition hover:bg-brand-700"
          >
            Go home
          </Link>
          <Link
            href="/calculators"
            className="rounded-lg border border-slate-300 bg-white px-6 py-3 font-semibold text-ink-soft transition hover:bg-slate-50"
          >
            All calculators
          </Link>
        </div>
        <div className="mt-10 flex flex-wrap justify-center gap-2">
          {popular.map((m) => (
            <Link
              key={m.slug}
              href={`/calculators/${m.slug}`}
              className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm text-ink-soft transition hover:border-brand-300 hover:text-brand-700"
            >
              {m.name}
            </Link>
          ))}
        </div>
      </div>
    </Container>
  );
}
