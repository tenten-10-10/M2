import Link from "next/link";
import { Container } from "@/components/Container";
import { EmailCapture } from "@/components/EmailCapture";
import { CtaBanner } from "@/components/CtaBanner";
import { FaqList } from "@/components/FaqList";
import { JsonLd } from "@/components/JsonLd";
import { METRICS, metricsByCategory, CATEGORIES } from "@/lib/metrics";
import { GUIDES } from "@/lib/guides";
import { SITE_NAME } from "@/lib/site";
import { faqLd, softwareAppLd } from "@/lib/seo";

const HOME_FAQS = [
  {
    q: "Are these SaaS calculators really free?",
    a: "Yes. Every calculator and the full SaaS Health Score are free, with no signup required. Calculations run in your browser, so your numbers never leave your device.",
  },
  {
    q: "Where do the benchmarks come from?",
    a: "We draw on widely cited SaaS sources (David Skok's SaaS Metrics 2.0, Wall Street Prep, Corporate Finance Institute, and published benchmark reports) and present ranges with context. Benchmarks vary by stage and segment, so we show them as guidance, not pass/fail grades.",
  },
  {
    q: "Is this financial advice?",
    a: "No. SaaSGauge provides educational calculators and general benchmark context only. It is not financial, investment, accounting, tax or legal advice. Always validate decisions with a qualified professional.",
  },
  {
    q: "Do you store the numbers I enter?",
    a: "No. All calculations happen client-side in your browser. We only receive data you explicitly submit, such as your email for the cheat sheet or a metrics-review request.",
  },
];

function CalcCard({
  slug,
  name,
  shortDescription,
}: {
  slug: string;
  name: string;
  shortDescription: string;
}) {
  return (
    <Link
      href={`/calculators/${slug}`}
      className="group flex flex-col rounded-xl border border-slate-200 bg-white p-4 transition hover:border-brand-300 hover:shadow-card"
    >
      <span className="font-semibold text-ink group-hover:text-brand-700">
        {name}
      </span>
      <span className="mt-1 text-sm text-ink-muted">{shortDescription}</span>
    </Link>
  );
}

export default function HomePage() {
  const byCat = metricsByCategory();

  return (
    <>
      <JsonLd
        data={[
          softwareAppLd(
            `${SITE_NAME} — SaaS metrics calculators`,
            "Free SaaS metrics calculators and a board-ready SaaS Health Score.",
            "/",
          ),
          faqLd(HOME_FAQS),
        ]}
      />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-b from-brand-50/70 to-white">
        <Container className="py-16 sm:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center rounded-full border border-brand-200 bg-white px-3 py-1 text-xs font-medium text-brand-700">
              {METRICS.length} free calculators · no signup · runs in your browser
            </span>
            <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
              Know your SaaS numbers cold.
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-ink-soft">
              Free, accurate calculators for every SaaS metric that matters —
              LTV:CAC, CAC payback, MRR, ARR, churn, NRR, Rule of 40, burn and
              runway. Then get an instant, board-ready{" "}
              <strong className="text-ink">SaaS Health Score</strong> with
              benchmark context.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/health-score"
                className="w-full rounded-lg bg-brand-600 px-6 py-3 text-center font-semibold text-white shadow-sm transition hover:bg-brand-700 sm:w-auto"
              >
                Get your free Health Score →
              </Link>
              <Link
                href="/calculators"
                className="w-full rounded-lg border border-slate-300 bg-white px-6 py-3 text-center font-semibold text-ink-soft transition hover:bg-slate-50 sm:w-auto"
              >
                Browse all calculators
              </Link>
            </div>
            <p className="mt-4 text-xs text-ink-muted">
              Built for founders, operators and finance teams. Educational tools
              — not financial advice.
            </p>
          </div>
        </Container>
      </section>

      {/* Value props */}
      <Container className="py-14">
        <div className="grid gap-6 sm:grid-cols-3">
          {[
            {
              t: "Accurate, not hand-wavy",
              d: "Margin-adjusted LTV, gross-profit CAC payback, annualised churn — the rigorous formulas investors expect.",
            },
            {
              t: "Benchmark-backed",
              d: "Every result is interpreted against widely cited SaaS benchmarks, with the sources linked so you can verify.",
            },
            {
              t: "Private & free",
              d: "No login, no paywall, no tracking of your numbers. Everything is computed locally in your browser.",
            },
          ].map((v) => (
            <div key={v.t} className="rounded-2xl border border-slate-200 bg-white p-6">
              <h3 className="font-semibold text-ink">{v.t}</h3>
              <p className="mt-2 text-sm text-ink-soft">{v.d}</p>
            </div>
          ))}
        </div>
      </Container>

      {/* Calculators by category */}
      <Container className="py-8">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-ink">
              The complete SaaS metrics toolkit
            </h2>
            <p className="mt-2 text-ink-soft">
              {METRICS.length} calculators, organised by what they tell you.
            </p>
          </div>
          <Link
            href="/calculators"
            className="hidden text-sm font-semibold text-brand-700 hover:text-brand-800 sm:block"
          >
            View all →
          </Link>
        </div>

        <div className="mt-8 space-y-10">
          {CATEGORIES.map((cat) => (
            <div key={cat}>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
                {cat}
              </h3>
              <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {byCat[cat].map((m) => (
                  <CalcCard
                    key={m.slug}
                    slug={m.slug}
                    name={m.name}
                    shortDescription={m.shortDescription}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </Container>

      {/* Health score promo */}
      <Container className="py-14">
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-50">
          <div className="grid items-center gap-8 p-8 sm:p-12 lg:grid-cols-2">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-brand-700">
                Flagship tool
              </span>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-ink sm:text-3xl">
                Your SaaS Health Score, in 60 seconds
              </h2>
              <p className="mt-3 text-ink-soft">
                Enter eight numbers and get a single weighted score (0–100)
                across unit economics, retention, efficiency and cash — plus a
                prioritised list of what to fix first. Print it as a clean,
                board-ready PDF.
              </p>
              <Link
                href="/health-score"
                className="mt-6 inline-block rounded-lg bg-brand-600 px-6 py-3 font-semibold text-white transition hover:bg-brand-700"
              >
                Run my Health Score →
              </Link>
            </div>
            <div className="rounded-2xl bg-white p-6 shadow-card">
              <div className="flex items-center gap-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-2xl font-bold text-emerald-700">
                  82
                </div>
                <div>
                  <p className="text-sm text-ink-muted">Example score</p>
                  <p className="text-xl font-bold text-emerald-700">Grade B</p>
                </div>
              </div>
              <ul className="mt-4 space-y-2 text-sm text-ink-soft">
                <li className="flex justify-between"><span>LTV:CAC ratio</span><span className="font-medium text-ink">4.1 : 1</span></li>
                <li className="flex justify-between"><span>CAC payback</span><span className="font-medium text-ink">11 months</span></li>
                <li className="flex justify-between"><span>Rule of 40</span><span className="font-medium text-ink">38%</span></li>
                <li className="flex justify-between"><span>Cash runway</span><span className="font-medium text-ink">17 months</span></li>
              </ul>
            </div>
          </div>
        </div>
      </Container>

      {/* Guides */}
      <Container className="py-8">
        <div className="flex items-end justify-between">
          <h2 className="text-2xl font-bold tracking-tight text-ink">
            Guides that go deeper
          </h2>
          <Link href="/guides" className="text-sm font-semibold text-brand-700 hover:text-brand-800">
            All guides →
          </Link>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {GUIDES.slice(0, 4).map((g) => (
            <Link
              key={g.slug}
              href={`/guides/${g.slug}`}
              className="group rounded-2xl border border-slate-200 bg-white p-6 transition hover:border-brand-300 hover:shadow-card"
            >
              <p className="text-xs font-medium text-brand-700">
                {g.readingMinutes} min read
              </p>
              <h3 className="mt-1 text-lg font-semibold text-ink group-hover:text-brand-700">
                {g.title}
              </h3>
              <p className="mt-2 text-sm text-ink-soft">{g.description}</p>
            </Link>
          ))}
        </div>
      </Container>

      {/* Email capture */}
      <Container className="py-14">
        <EmailCapture source="home" />
      </Container>

      {/* Lead-gen CTA */}
      <Container className="pb-14">
        <CtaBanner
          title="Want a second opinion before your next board meeting or raise?"
          text="Request a free, no-obligation metrics review. We'll look at your numbers and flag the two or three things that matter most."
          href="/contact"
          cta="Request a metrics review"
        />
      </Container>

      {/* FAQ */}
      <Container className="pb-20">
        <h2 className="text-2xl font-bold tracking-tight text-ink">
          Frequently asked questions
        </h2>
        <div className="mt-6">
          <FaqList faqs={HOME_FAQS} />
        </div>
      </Container>
    </>
  );
}
