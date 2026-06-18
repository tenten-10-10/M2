import test from "node:test";
import assert from "node:assert/strict";
import {
  formatCurrency,
  formatPercent,
  formatRatio,
  formatMonths,
} from "../src/lib/format.ts";
import { METRICS } from "../src/lib/metrics.ts";
import { GUIDES } from "../src/lib/guides.ts";
import { GLOSSARY } from "../src/lib/glossary.ts";

test("format helpers handle normal and non-finite values", () => {
  assert.equal(formatCurrency(1000), "$1,000");
  assert.equal(formatPercent(12.34), "12.3%");
  assert.equal(formatRatio(3), "3.00 : 1");
  assert.equal(formatMonths(1), "1 month");
  assert.equal(formatMonths(12), "12 months");
  assert.equal(formatCurrency(Infinity), "—");
  assert.equal(formatPercent(NaN), "—");
});

test("every metric has unique, URL-safe slug and rich content", () => {
  const slugRe = /^[a-z0-9-]+$/;
  for (const m of METRICS) {
    assert.match(m.slug, slugRe, `${m.slug} is url-safe`);
    assert.ok(m.title.length > 10, `${m.slug} has SEO title`);
    assert.ok(
      m.metaDescription.length >= 50 && m.metaDescription.length <= 200,
      `${m.slug} meta description length (${m.metaDescription.length})`,
    );
    assert.ok(m.intro.length >= 1, `${m.slug} has intro`);
    assert.ok(m.benchmarks.length >= 2, `${m.slug} has benchmarks`);
    for (const s of m.sources) assert.match(s.url, /^https:\/\//);
  }
});

test("guides reference real calculators and have substance", () => {
  const slugs = new Set(METRICS.map((m) => m.slug));
  for (const g of GUIDES) {
    assert.ok(g.body.length >= 4, `${g.slug} has body blocks`);
    assert.ok(g.takeaways.length >= 3, `${g.slug} has takeaways`);
    for (const c of g.relatedCalculators) {
      assert.ok(slugs.has(c), `${g.slug} -> ${c} exists`);
    }
  }
});

test("glossary calculator links resolve", () => {
  const slugs = new Set(METRICS.map((m) => m.slug));
  for (const t of GLOSSARY) {
    if (t.calculatorSlug) {
      assert.ok(slugs.has(t.calculatorSlug), `glossary -> ${t.calculatorSlug}`);
    }
  }
});
