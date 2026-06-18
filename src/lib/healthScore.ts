import {
  calcLtv,
  calcPaybackMonths,
  calcRuleOf40,
  calcRunwayMonths,
  type InputDef,
  type Status,
} from "./metrics";
import { formatMonths, formatPercent, formatRatio } from "./format";

export const HS_INPUTS: InputDef[] = [
  { id: "arpa", label: "ARPA (monthly)", unit: "currency", default: 120, min: 0 },
  { id: "grossMargin", label: "Gross margin", unit: "percent", default: 78, min: 0 },
  { id: "churn", label: "Monthly customer churn", unit: "percent", default: 3, min: 0, step: 0.1 },
  { id: "cac", label: "CAC", unit: "currency", default: 1200, min: 0 },
  { id: "growth", label: "Revenue growth (YoY)", unit: "percent", default: 45 },
  { id: "margin", label: "Profit margin (EBITDA/FCF)", unit: "percent", default: -10 },
  { id: "cash", label: "Cash on hand", unit: "currency", default: 2000000, min: 0 },
  { id: "netBurn", label: "Net monthly burn", unit: "currency", default: 110000, min: 0 },
];

export type HealthArea = {
  key: string;
  name: string;
  display: string;
  score: number;
  max: number;
  status: Status;
  recommendation: string;
};

export type HealthScoreResult = {
  total: number;
  grade: string;
  gradeStatus: Status;
  areas: HealthArea[];
};

const clamp = (n: number, lo: number, hi: number) =>
  Math.max(lo, Math.min(hi, n));

export function statusFromRatio(r: number): Status {
  if (r >= 0.85) return "great";
  if (r >= 0.65) return "good";
  if (r >= 0.4) return "warn";
  return "bad";
}

export function computeHealthScore(
  v: Record<string, number>,
): HealthScoreResult {
  const ltv = calcLtv(v.arpa, v.grossMargin, v.churn);
  const ratio = v.cac > 0 ? ltv / v.cac : Infinity;
  const payback = calcPaybackMonths(v.cac, v.arpa, v.grossMargin);
  const annualChurn = (1 - Math.pow(1 - v.churn / 100, 12)) * 100;
  const ro40 = calcRuleOf40(v.growth, v.margin);
  const runway = calcRunwayMonths(v.cash, v.netBurn);

  const sLtvCac = clamp(isFinite(ratio) ? (ratio / 3) * 25 : 25, 0, 25);
  const sPayback = clamp(
    isFinite(payback) ? (20 * (21 - payback)) / 15 : 20,
    0,
    20,
  );
  const sRetention = clamp((20 * (40 - annualChurn)) / 30, 0, 20);
  const sRule = clamp((20 * ro40) / 40, 0, 20);
  const sRunway = clamp(isFinite(runway) ? (15 * (runway - 3)) / 15 : 15, 0, 15);

  const areas: HealthArea[] = [
    {
      key: "ltvCac",
      name: "LTV:CAC ratio",
      display: formatRatio(ratio),
      score: sLtvCac,
      max: 25,
      status: statusFromRatio(sLtvCac / 25),
      recommendation:
        "Lift LTV (retention, pricing, expansion) or lower CAC to push the ratio toward 3:1+.",
    },
    {
      key: "payback",
      name: "CAC payback",
      display: formatMonths(payback),
      score: sPayback,
      max: 20,
      status: statusFromRatio(sPayback / 20),
      recommendation:
        "Shorten payback with annual prepaid plans, higher ARPA, or cheaper acquisition.",
    },
    {
      key: "retention",
      name: "Annual churn",
      display: formatPercent(annualChurn),
      score: sRetention,
      max: 20,
      status: statusFromRatio(sRetention / 20),
      recommendation:
        "Reduce churn: fix onboarding, recover failed payments, and add expansion revenue.",
    },
    {
      key: "rule40",
      name: "Rule of 40",
      display: formatPercent(ro40, 0),
      score: sRule,
      max: 20,
      status: statusFromRatio(sRule / 20),
      recommendation:
        "Rebalance growth vs. profitability so growth % + margin % clears 40.",
    },
    {
      key: "runway",
      name: "Cash runway",
      display: isFinite(runway) ? formatMonths(runway) : "∞",
      score: sRunway,
      max: 15,
      status: statusFromRatio(sRunway / 15),
      recommendation:
        "Extend runway via revenue, cost control, or financing before it dips under 12 months.",
    },
  ];

  const total = Math.round(areas.reduce((sum, a) => sum + a.score, 0));
  let grade = "F";
  let gradeStatus: Status = "bad";
  if (total >= 85) {
    grade = "A";
    gradeStatus = "great";
  } else if (total >= 70) {
    grade = "B";
    gradeStatus = "good";
  } else if (total >= 55) {
    grade = "C";
    gradeStatus = "warn";
  } else if (total >= 40) {
    grade = "D";
    gradeStatus = "warn";
  }

  return { total, grade, gradeStatus, areas };
}

export function topPriorities(
  areas: HealthArea[],
  n = 2,
): HealthArea[] {
  return [...areas]
    .sort((a, b) => a.score / a.max - b.score / b.max)
    .slice(0, n);
}
