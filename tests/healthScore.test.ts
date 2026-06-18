import test from "node:test";
import assert from "node:assert/strict";
import {
  HS_INPUTS,
  computeHealthScore,
  topPriorities,
  statusFromRatio,
} from "../src/lib/healthScore.ts";

const defaults = Object.fromEntries(HS_INPUTS.map((i) => [i.id, i.default]));

test("statusFromRatio thresholds", () => {
  assert.equal(statusFromRatio(0.9), "great");
  assert.equal(statusFromRatio(0.7), "good");
  assert.equal(statusFromRatio(0.5), "warn");
  assert.equal(statusFromRatio(0.2), "bad");
});

test("score is 0-100 and area points sum to the total bands", () => {
  const r = computeHealthScore(defaults);
  assert.ok(r.total >= 0 && r.total <= 100);
  const maxSum = r.areas.reduce((s, a) => s + a.max, 0);
  assert.equal(maxSum, 100);
  for (const a of r.areas) {
    assert.ok(a.score >= 0 && a.score <= a.max, `${a.key} within bounds`);
  }
});

test("excellent inputs earn grade A", () => {
  const great = computeHealthScore({
    arpa: 500,
    grossMargin: 85,
    churn: 0.5, // very low churn
    cac: 1500,
    growth: 60,
    margin: 10,
    cash: 5000000,
    netBurn: 100000, // 50 months runway
  });
  assert.equal(great.grade, "A");
  assert.equal(great.gradeStatus, "great");
});

test("poor inputs earn a failing grade", () => {
  const bad = computeHealthScore({
    arpa: 30,
    grossMargin: 50,
    churn: 8, // high churn
    cac: 3000,
    growth: 5,
    margin: -60,
    cash: 200000,
    netBurn: 100000, // 2 months runway
  });
  assert.ok(["D", "F"].includes(bad.grade), `got ${bad.grade}`);
});

test("topPriorities returns the weakest areas", () => {
  const r = computeHealthScore(defaults);
  const top = topPriorities(r.areas, 2);
  assert.equal(top.length, 2);
  // weakest first
  assert.ok(top[0].score / top[0].max <= top[1].score / top[1].max);
});

test("infinite runway (no burn) does not break scoring", () => {
  const r = computeHealthScore({ ...defaults, netBurn: 0 });
  const runway = r.areas.find((a) => a.key === "runway")!;
  assert.equal(runway.display, "∞");
  assert.equal(runway.score, runway.max);
});
