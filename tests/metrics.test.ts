import test from "node:test";
import assert from "node:assert/strict";
import {
  METRICS,
  METRIC_SLUGS,
  getMetric,
  defaultValues,
  calcLtv,
  calcPaybackMonths,
  calcRuleOf40,
  calcRunwayMonths,
} from "../src/lib/metrics.ts";

test("calcLtv: margin-adjusted lifetime value", () => {
  // ARPA 100, 80% margin, 4% monthly churn -> 80 / 0.04 = 2000
  assert.equal(calcLtv(100, 80, 4), 2000);
});

test("calcLtv: zero churn is infinite", () => {
  assert.equal(calcLtv(100, 80, 0), Infinity);
});

test("calcPaybackMonths: CAC over monthly gross profit", () => {
  // 800 / (100 * 0.8) = 10 months
  assert.equal(calcPaybackMonths(800, 100, 80), 10);
});

test("calcRuleOf40: growth plus margin", () => {
  assert.equal(calcRuleOf40(30, 15), 45);
  assert.equal(calcRuleOf40(60, -25), 35);
});

test("calcRunwayMonths: cash over net burn; infinite when not burning", () => {
  assert.equal(calcRunwayMonths(1500000, 90000), 1500000 / 90000);
  assert.equal(calcRunwayMonths(1000000, 0), Infinity);
  assert.equal(calcRunwayMonths(1000000, -5000), Infinity);
});

test("registry is internally consistent", () => {
  // unique slugs
  assert.equal(new Set(METRIC_SLUGS).size, METRIC_SLUGS.length);
  for (const m of METRICS) {
    assert.ok(m.inputs.length > 0, `${m.slug} has inputs`);
    assert.ok(m.faqs.length > 0, `${m.slug} has faqs`);
    assert.ok(m.sources.length > 0, `${m.slug} has sources`);
    // related slugs must resolve
    for (const r of m.related) {
      assert.ok(getMetric(r), `${m.slug} related '${r}' exists`);
    }
    // compute returns a sane result for default inputs
    const res = m.compute(defaultValues(m));
    assert.ok(typeof res.display === "string" && res.display.length > 0);
    assert.ok(["great", "good", "warn", "bad", "neutral"].includes(res.status));
    assert.ok(res.verdict.length > 0, `${m.slug} produces a verdict`);
  }
});

test("ltv-cac: 3:1 reads as healthy, <1 as unsustainable", () => {
  const m = getMetric("ltv-cac")!;
  // LTV = 100*0.8/0.02 = 4000; CAC 1333 -> ~3:1
  const good = m.compute({ arpa: 100, grossMargin: 80, churn: 2, cac: 1333 });
  assert.equal(good.status, "great");
  const bad = m.compute({ arpa: 100, grossMargin: 80, churn: 10, cac: 2000 });
  assert.equal(bad.status, "bad");
});

test("churn-rate: annualised churn compounds correctly", () => {
  const m = getMetric("churn-rate")!;
  const res = m.compute({
    customersStart: 1000,
    customersLost: 30, // 3% monthly
    mrrStart: 100000,
    mrrLost: 4000,
  });
  // annualised ~ 1-(1-0.03)^12 = 30.6%
  const annual = res.extra?.find((e) => e.label.includes("Annualised"));
  assert.ok(annual);
  assert.match(annual!.display, /30\./);
});

test("rule-of-40: clears at >=40", () => {
  const m = getMetric("rule-of-40")!;
  assert.equal(m.compute({ growth: 30, margin: 15 }).status, "good"); // 45
  assert.equal(m.compute({ growth: 20, margin: 10 }).status, "warn"); // 30
  assert.equal(m.compute({ growth: 5, margin: 5 }).status, "bad"); // 10
});

test("burn-multiple: under 1.0 is great, over 2.0 is bad", () => {
  const m = getMetric("burn-multiple")!;
  assert.equal(m.compute({ netBurn: 800000, netNewArr: 1000000 }).status, "great");
  assert.equal(m.compute({ netBurn: 3000000, netNewArr: 1000000 }).status, "bad");
});
