import {
  formatCurrency,
  formatMonths,
  formatNumber,
  formatPercent,
  formatRatio,
  type Unit,
} from "./format";

export type Status = "great" | "good" | "warn" | "bad" | "neutral";

export type InputDef = {
  id: string;
  label: string;
  unit: "currency" | "percent" | "number" | "months" | "count";
  default: number;
  help?: string;
  min?: number;
  step?: number;
};

export type ResultExtra = { label: string; display: string };

export type MetricResult = {
  label: string;
  display: string;
  unit: Unit;
  status: Status;
  verdict: string;
  extra?: ResultExtra[];
};

export type Source = { label: string; url: string };

export type MetricCategory =
  | "Unit economics"
  | "Growth"
  | "Retention"
  | "Efficiency"
  | "Cash";

export type Metric = {
  slug: string;
  name: string;
  h1: string;
  title: string;
  metaDescription: string;
  category: MetricCategory;
  shortDescription: string;
  intro: string[];
  formula: string;
  inputs: InputDef[];
  compute: (v: Record<string, number>) => MetricResult;
  benchmarks: { label: string; range: string }[];
  benchmarkNote: string;
  faqs: { q: string; a: string }[];
  related: string[];
  sources: Source[];
};

// ---------------------------------------------------------------------------
// Shared sources (real, well-known references)
// ---------------------------------------------------------------------------
const S = {
  forEntrepreneurs: {
    label: "For Entrepreneurs — SaaS Metrics 2.0 (David Skok)",
    url: "https://www.forentrepreneurs.com/saas-metrics-2/",
  },
  wspLtvCac: {
    label: "Wall Street Prep — LTV/CAC Ratio",
    url: "https://www.wallstreetprep.com/knowledge/ltv-cac-ratio/",
  },
  wspRule40: {
    label: "Wall Street Prep — The Rule of 40",
    url: "https://www.wallstreetprep.com/knowledge/rule-of-40/",
  },
  cfiRule40: {
    label: "Corporate Finance Institute — Rule of 40",
    url: "https://corporatefinanceinstitute.com/resources/valuation/rule-of-40",
  },
  hubifi: {
    label: "HubiFi — B2B SaaS Benchmarks",
    url: "https://www.hubifi.com/blog/b2b-saas-benchmarks",
  },
} satisfies Record<string, Source>;

// ---------------------------------------------------------------------------
// Small helpers
// ---------------------------------------------------------------------------
const safeDiv = (a: number, b: number): number => (b === 0 ? NaN : a / b);

function pct(value: number): number {
  return value / 100;
}

// ---------------------------------------------------------------------------
// Reusable calculations (also used by the Health Score report)
// ---------------------------------------------------------------------------
export function calcLtv(
  arpaMonthly: number,
  grossMarginPct: number,
  monthlyChurnPct: number,
): number {
  const churn = pct(monthlyChurnPct);
  if (churn <= 0) return Infinity;
  return safeDiv(arpaMonthly * pct(grossMarginPct), churn);
}

export function calcPaybackMonths(
  cac: number,
  arpaMonthly: number,
  grossMarginPct: number,
): number {
  const monthlyGrossProfit = arpaMonthly * pct(grossMarginPct);
  return safeDiv(cac, monthlyGrossProfit);
}

export function calcRuleOf40(
  growthPct: number,
  marginPct: number,
): number {
  return growthPct + marginPct;
}

export function calcRunwayMonths(cash: number, netMonthlyBurn: number): number {
  if (netMonthlyBurn <= 0) return Infinity;
  return safeDiv(cash, netMonthlyBurn);
}

// ---------------------------------------------------------------------------
// Metric registry
// ---------------------------------------------------------------------------
export const METRICS: Metric[] = [
  // -------------------------------------------------------------------------
  {
    slug: "ltv-cac",
    name: "LTV:CAC Ratio",
    h1: "LTV:CAC Ratio Calculator",
    title: "LTV:CAC Ratio Calculator (Free) — SaaS Unit Economics | SaaSGauge",
    metaDescription:
      "Calculate your LTV:CAC ratio for free. Enter ARPA, gross margin, churn and CAC to see lifetime value, the ratio, and how it compares to the 3:1 benchmark.",
    category: "Unit economics",
    shortDescription:
      "Lifetime value vs. acquisition cost — the single best read on whether growth is profitable.",
    intro: [
      "The LTV:CAC ratio compares the lifetime gross profit of a customer (LTV) to what it costs to acquire them (CAC). It is the clearest single signal of whether your growth engine creates value or destroys it.",
      "A commonly cited target is 3:1 or higher, meaning each customer returns roughly three times their acquisition cost in gross profit. Treat it as a starting point for a conversation, not a pass/fail grade — payback period and retention matter just as much.",
    ],
    formula:
      "LTV = (ARPA × Gross margin %) ÷ Monthly churn %   •   Ratio = LTV ÷ CAC",
    inputs: [
      {
        id: "arpa",
        label: "Average revenue per account (monthly)",
        unit: "currency",
        default: 100,
        min: 0,
        help: "Average monthly recurring revenue per paying account.",
      },
      {
        id: "grossMargin",
        label: "Gross margin",
        unit: "percent",
        default: 80,
        min: 0,
        help: "Recurring gross margin after hosting, support and payment fees.",
      },
      {
        id: "churn",
        label: "Monthly customer churn",
        unit: "percent",
        default: 3,
        min: 0,
        step: 0.1,
        help: "Share of customers lost each month.",
      },
      {
        id: "cac",
        label: "Customer acquisition cost (CAC)",
        unit: "currency",
        default: 800,
        min: 0,
        help: "Fully loaded sales + marketing cost to win one customer.",
      },
    ],
    compute: (v) => {
      const ltv = calcLtv(v.arpa, v.grossMargin, v.churn);
      const ratio = safeDiv(ltv, v.cac);
      let status: Status = "neutral";
      let verdict =
        "Enter your numbers to see how your unit economics compare.";
      if (isFinite(ratio)) {
        if (ratio >= 3 && ratio <= 5) {
          status = "great";
          verdict =
            "Healthy. A 3:1–5:1 ratio is the textbook sweet spot for efficient, sustainable growth.";
        } else if (ratio > 5) {
          status = "good";
          verdict =
            "Strong, but a ratio above 5:1 can mean you are under-investing in growth. You may be able to spend more to acquire customers faster.";
        } else if (ratio >= 1.5) {
          status = "warn";
          verdict =
            "Below the 3:1 benchmark. Improve retention, raise prices, or lower CAC to widen the margin.";
        } else {
          status = "bad";
          verdict =
            "Unsustainable — you are spending close to (or more than) a customer's lifetime value to acquire them.";
        }
      }
      return {
        label: "LTV:CAC Ratio",
        display: formatRatio(ratio),
        unit: "ratio",
        status,
        verdict,
        extra: [
          { label: "Customer lifetime value (LTV)", display: formatCurrency(ltv) },
          {
            label: "Avg. customer lifetime",
            display:
              v.churn > 0 ? formatMonths(100 / v.churn) : "Indefinite",
          },
        ],
      };
    },
    benchmarks: [
      { label: "Unsustainable", range: "< 1.5 : 1" },
      { label: "Needs work", range: "1.5 – 3 : 1" },
      { label: "Healthy", range: "3 – 5 : 1" },
      { label: "Possibly under-investing", range: "> 5 : 1" },
    ],
    benchmarkNote:
      "The 3:1 rule of thumb is widely cited but context-dependent. A 2.5:1 ratio with a 9-month payback and 120% NRR can be a better business than 4:1 with a 30-month payback.",
    faqs: [
      {
        q: "What is a good LTV:CAC ratio?",
        a: "3:1 or higher is the most widely cited benchmark for a healthy SaaS business. Below 3:1 usually signals weak retention or pricing or expensive acquisition; far above 5:1 can mean you are leaving growth on the table by under-investing.",
      },
      {
        q: "Should LTV use revenue or gross profit?",
        a: "Use gross profit. Multiplying ARPA by gross margin gives a margin-adjusted LTV, which is the version investors expect and the version this calculator uses.",
      },
      {
        q: "Why does churn have such a big impact?",
        a: "LTV is inversely proportional to churn — average customer lifetime is roughly 1 ÷ churn rate. Cutting monthly churn from 4% to 2% doubles the expected lifetime and therefore doubles LTV.",
      },
    ],
    related: ["cac", "ltv", "cac-payback", "churn-rate"],
    sources: [S.wspLtvCac, S.forEntrepreneurs],
  },

  // -------------------------------------------------------------------------
  {
    slug: "cac",
    name: "Customer Acquisition Cost (CAC)",
    h1: "CAC Calculator",
    title: "CAC Calculator (Free) — Customer Acquisition Cost | SaaSGauge",
    metaDescription:
      "Free CAC calculator. Divide your sales and marketing spend by new customers won to get fully-loaded customer acquisition cost, plus blended vs. paid context.",
    category: "Unit economics",
    shortDescription:
      "What it really costs to win one customer, fully loaded.",
    intro: [
      "Customer Acquisition Cost (CAC) is the total sales and marketing investment divided by the number of new customers acquired in the same period. 'Fully loaded' means salaries, tools, ad spend, agencies and commissions — not just media cost.",
      "CAC on its own has no universal benchmark; it only means something next to LTV and payback period. Use this number as the input to your LTV:CAC and CAC payback calculations.",
    ],
    formula: "CAC = Total sales & marketing spend ÷ New customers acquired",
    inputs: [
      {
        id: "spend",
        label: "Sales & marketing spend (period)",
        unit: "currency",
        default: 40000,
        min: 0,
        help: "All S&M cost in the period: salaries, ads, tools, commissions.",
      },
      {
        id: "customers",
        label: "New customers acquired (period)",
        unit: "count",
        default: 50,
        min: 0,
      },
    ],
    compute: (v) => {
      const cac = safeDiv(v.spend, v.customers);
      return {
        label: "Customer Acquisition Cost",
        display: formatCurrency(cac),
        unit: "currency",
        status: "neutral",
        verdict:
          "CAC is only meaningful against LTV and payback. Feed this into the LTV:CAC and CAC payback calculators to judge it.",
      };
    },
    benchmarks: [
      { label: "Self-serve / PLG", range: "Often < $400" },
      { label: "SMB sales-assisted", range: "~$1k – $5k" },
      { label: "Mid-market / enterprise", range: "$10k – $50k+" },
    ],
    benchmarkNote:
      "CAC varies enormously by motion and segment, so there is no single 'good' number. What matters is CAC relative to the value and payback of the customers it buys.",
    faqs: [
      {
        q: "What costs go into CAC?",
        a: "Everything spent to acquire customers in the period: marketing salaries and overhead, ad spend, content and SEO costs, sales salaries and commissions, SDR tooling, and any agencies. Exclude customer success and support, which are retention costs.",
      },
      {
        q: "What is the difference between blended and paid CAC?",
        a: "Blended CAC divides all S&M spend by all new customers (including organic). Paid CAC divides only paid acquisition spend by customers won through paid channels. Track both — a low blended CAC can hide an expensive paid channel.",
      },
    ],
    related: ["ltv-cac", "cac-payback", "magic-number"],
    sources: [S.forEntrepreneurs, S.hubifi],
  },

  // -------------------------------------------------------------------------
  {
    slug: "ltv",
    name: "Customer Lifetime Value (LTV)",
    h1: "LTV Calculator",
    title: "LTV Calculator (Free) — SaaS Customer Lifetime Value | SaaSGauge",
    metaDescription:
      "Free customer lifetime value (LTV) calculator for SaaS. Enter ARPA, gross margin and churn to get a margin-adjusted LTV and your average customer lifetime.",
    category: "Unit economics",
    shortDescription:
      "The margin-adjusted gross profit you earn from a customer over their lifetime.",
    intro: [
      "Lifetime Value (LTV, sometimes CLV) estimates the total gross profit a customer generates before they churn. The standard SaaS formula multiplies monthly revenue per account by gross margin, then divides by churn.",
      "Because lifetime is the inverse of churn, retention is the biggest lever on LTV — usually bigger than price.",
    ],
    formula: "LTV = (ARPA × Gross margin %) ÷ Monthly churn %",
    inputs: [
      { id: "arpa", label: "ARPA (monthly)", unit: "currency", default: 100, min: 0 },
      { id: "grossMargin", label: "Gross margin", unit: "percent", default: 80, min: 0 },
      {
        id: "churn",
        label: "Monthly customer churn",
        unit: "percent",
        default: 3,
        min: 0,
        step: 0.1,
      },
    ],
    compute: (v) => {
      const ltv = calcLtv(v.arpa, v.grossMargin, v.churn);
      return {
        label: "Customer Lifetime Value",
        display: formatCurrency(ltv),
        unit: "currency",
        status: "neutral",
        verdict:
          "Compare LTV to CAC: a healthy SaaS business aims for LTV at least 3× its acquisition cost.",
        extra: [
          {
            label: "Avg. customer lifetime",
            display: v.churn > 0 ? formatMonths(100 / v.churn) : "Indefinite",
          },
          {
            label: "Monthly gross profit / account",
            display: formatCurrency(v.arpa * pct(v.grossMargin)),
          },
        ],
      };
    },
    benchmarks: [
      { label: "Lifetime at 5% monthly churn", range: "~20 months" },
      { label: "Lifetime at 3% monthly churn", range: "~33 months" },
      { label: "Lifetime at 1% monthly churn", range: "~100 months" },
    ],
    benchmarkNote:
      "There is no universal 'good' LTV — it depends entirely on your CAC. Always evaluate LTV as a ratio to acquisition cost.",
    faqs: [
      {
        q: "Why divide by churn?",
        a: "If 3% of customers leave each month, the average customer stays about 1 ÷ 0.03 ≈ 33 months. Multiplying monthly gross profit by that lifetime gives total lifetime value.",
      },
      {
        q: "Should I use customer churn or revenue churn?",
        a: "For per-customer LTV, use customer (logo) churn. If you have meaningful expansion revenue, a more advanced approach uses net revenue churn, which can make LTV much higher.",
      },
    ],
    related: ["ltv-cac", "churn-rate", "cac-payback"],
    sources: [S.forEntrepreneurs, S.wspLtvCac],
  },

  // -------------------------------------------------------------------------
  {
    slug: "cac-payback",
    name: "CAC Payback Period",
    h1: "CAC Payback Period Calculator",
    title: "CAC Payback Period Calculator (Free) | SaaSGauge",
    metaDescription:
      "Free CAC payback period calculator. See how many months of gross profit it takes to recover acquisition cost, and how you compare to the 12-month benchmark.",
    category: "Unit economics",
    shortDescription:
      "How many months until a new customer pays back what it cost to acquire them.",
    intro: [
      "CAC payback period is the number of months of gross profit it takes to recoup the cost of acquiring a customer. It is a cash-flow metric: the shorter the payback, the less capital you tie up funding growth.",
      "Top-quartile SaaS companies recover CAC in under 12 months. Benchmark data shows the median is closer to 18 months, so anything under a year is genuinely strong.",
    ],
    formula:
      "CAC payback (months) = CAC ÷ (ARPA × Gross margin %)",
    inputs: [
      { id: "cac", label: "CAC", unit: "currency", default: 800, min: 0 },
      { id: "arpa", label: "ARPA (monthly)", unit: "currency", default: 100, min: 0 },
      { id: "grossMargin", label: "Gross margin", unit: "percent", default: 80, min: 0 },
    ],
    compute: (v) => {
      const months = calcPaybackMonths(v.cac, v.arpa, v.grossMargin);
      let status: Status = "neutral";
      let verdict = "Enter your numbers to see your payback period.";
      if (isFinite(months)) {
        if (months < 6) {
          status = "great";
          verdict =
            "Excellent. A sub-6-month payback is best-in-class and means growth is largely self-funding.";
        } else if (months <= 12) {
          status = "good";
          verdict =
            "Healthy. Recovering CAC within 12 months is the widely cited target for efficient SaaS.";
        } else if (months <= 18) {
          status = "warn";
          verdict =
            "Around the market median (~18 months). Workable if retention is strong, but watch your cash.";
        } else {
          status = "bad";
          verdict =
            "Long payback ties up a lot of cash per customer. Improve pricing, margin, or acquisition efficiency.";
        }
      }
      return {
        label: "CAC Payback Period",
        display: formatMonths(months),
        unit: "months",
        status,
        verdict,
      };
    },
    benchmarks: [
      { label: "Best-in-class", range: "< 6 months" },
      { label: "Healthy", range: "6 – 12 months" },
      { label: "Market median", range: "~18 months" },
      { label: "Cash-intensive", range: "> 18 months" },
    ],
    benchmarkNote:
      "Acceptable payback rises with deal size and retention. Enterprise SaaS with very low churn can tolerate longer paybacks than self-serve SMB tools.",
    faqs: [
      {
        q: "Should payback use gross margin?",
        a: "Yes. Dividing CAC by gross-profit-per-month (ARPA × gross margin) is the rigorous version, because you can only repay acquisition cost with the margin you keep, not top-line revenue.",
      },
      {
        q: "What is a good CAC payback for SaaS?",
        a: "Under 12 months is the common target and under 6 months is best-in-class. Benchmark datasets put the median around 18 months, so don't panic if you're there — but treat shrinking it as a priority.",
      },
    ],
    related: ["ltv-cac", "cac", "runway"],
    sources: [S.hubifi, S.forEntrepreneurs],
  },

  // -------------------------------------------------------------------------
  {
    slug: "mrr",
    name: "MRR Calculator",
    h1: "MRR Calculator",
    title: "MRR Calculator (Free) — Monthly Recurring Revenue | SaaSGauge",
    metaDescription:
      "Free MRR calculator with movement breakdown. Add new, expansion, contraction and churned MRR to your starting MRR to get ending MRR, net new MRR and ARR.",
    category: "Growth",
    shortDescription:
      "Track ending MRR and net new MRR from the five components of MRR movement.",
    intro: [
      "Monthly Recurring Revenue (MRR) is the normalised, predictable subscription revenue you earn each month. The most useful way to look at it is through the five 'MRR movements': new, expansion, contraction, churned, and the resulting ending MRR.",
      "Net new MRR — new + expansion − contraction − churned — tells you whether the business grew or shrank this month, independent of one-off effects.",
    ],
    formula:
      "Ending MRR = Starting + New + Expansion − Contraction − Churned   •   ARR = MRR × 12",
    inputs: [
      { id: "starting", label: "Starting MRR", unit: "currency", default: 50000, min: 0 },
      { id: "newMrr", label: "New MRR", unit: "currency", default: 8000, min: 0 },
      { id: "expansion", label: "Expansion MRR", unit: "currency", default: 3000, min: 0 },
      { id: "contraction", label: "Contraction MRR", unit: "currency", default: 1000, min: 0 },
      { id: "churned", label: "Churned MRR", unit: "currency", default: 2500, min: 0 },
    ],
    compute: (v) => {
      const netNew = v.newMrr + v.expansion - v.contraction - v.churned;
      const ending = v.starting + netNew;
      const growth = safeDiv(netNew, v.starting) * 100;
      let status: Status = "neutral";
      let verdict = "";
      if (netNew > 0) {
        status = "good";
        verdict = `You added ${formatCurrency(netNew)} of net new MRR (${formatPercent(
          growth,
        )} growth this month).`;
      } else if (netNew === 0) {
        status = "warn";
        verdict = "Flat month — new and expansion exactly offset losses.";
      } else {
        status = "bad";
        verdict = `MRR contracted by ${formatCurrency(
          Math.abs(netNew),
        )} — losses outweighed new and expansion revenue.`;
      }
      return {
        label: "Ending MRR",
        display: formatCurrency(ending),
        unit: "currency",
        status,
        verdict,
        extra: [
          { label: "Net new MRR", display: formatCurrency(netNew) },
          { label: "ARR (ending MRR × 12)", display: formatCurrency(ending * 12) },
          { label: "MRR growth this month", display: formatPercent(growth) },
        ],
      };
    },
    benchmarks: [
      { label: "Early-stage strong growth", range: "10 – 20%+ MoM" },
      { label: "Scaling SaaS", range: "5 – 10% MoM" },
      { label: "Mature SaaS", range: "1 – 4% MoM" },
    ],
    benchmarkNote:
      "Sustainable monthly growth rates fall as ARR grows. The 'T2D3' path (triple, triple, double, double, double) is a famous aspirational benchmark for venture-scale SaaS.",
    faqs: [
      {
        q: "What counts as expansion vs. new MRR?",
        a: "New MRR comes from brand-new customers. Expansion MRR is additional recurring revenue from existing customers (upgrades, seats, add-ons). Keeping them separate reveals how much growth comes from your base.",
      },
      {
        q: "Should one-time fees be included in MRR?",
        a: "No. Exclude setup fees, one-off services and usage spikes that won't recur. MRR should reflect only the revenue you can reasonably expect every month.",
      },
    ],
    related: ["arr", "nrr", "quick-ratio", "arpu"],
    sources: [S.forEntrepreneurs, S.hubifi],
  },

  // -------------------------------------------------------------------------
  {
    slug: "arr",
    name: "ARR Calculator",
    h1: "ARR Calculator",
    title: "ARR Calculator (Free) — Annual Recurring Revenue | SaaSGauge",
    metaDescription:
      "Free ARR calculator. Convert MRR to annual recurring revenue, project growth at a chosen monthly rate, and see ARR per customer.",
    category: "Growth",
    shortDescription:
      "Annualise MRR and project where ARR lands at your current growth rate.",
    intro: [
      "Annual Recurring Revenue (ARR) is MRR multiplied by 12 — the run-rate value of your subscription contracts over a year. It is the headline number investors track for term-subscription SaaS.",
      "This calculator also projects ARR twelve months out at a constant monthly growth rate, so you can sanity-check plans against a run rate.",
    ],
    formula: "ARR = MRR × 12   •   Projected ARR = ARR × (1 + monthly growth)¹²",
    inputs: [
      { id: "mrr", label: "Current MRR", unit: "currency", default: 60000, min: 0 },
      {
        id: "growth",
        label: "Expected monthly growth",
        unit: "percent",
        default: 6,
        min: 0,
        step: 0.5,
      },
      { id: "customers", label: "Total customers", unit: "count", default: 600, min: 0 },
    ],
    compute: (v) => {
      const arr = v.mrr * 12;
      const projectedMrr = v.mrr * Math.pow(1 + pct(v.growth), 12);
      const projectedArr = projectedMrr * 12;
      const arrPerCustomer = safeDiv(arr, v.customers);
      return {
        label: "Annual Recurring Revenue",
        display: formatCurrency(arr),
        unit: "currency",
        status: "neutral",
        verdict: `At ${formatPercent(
          v.growth,
        )} monthly growth, ARR would reach about ${formatCurrency(
          projectedArr,
        )} in 12 months.`,
        extra: [
          { label: "Projected ARR (12 mo)", display: formatCurrency(projectedArr) },
          { label: "ARR per customer", display: formatCurrency(arrPerCustomer) },
        ],
      };
    },
    benchmarks: [
      { label: "$1M ARR", range: "First major milestone" },
      { label: "$10M ARR", range: "Repeatable go-to-market" },
      { label: "$100M ARR", range: "Category leader scale" },
    ],
    benchmarkNote:
      "ARR milestones ($1M, $10M, $100M) are common fundraising and maturity markers. The growth rate needed to reach the next one falls as the base grows.",
    faqs: [
      {
        q: "Is ARR just MRR × 12?",
        a: "For pure monthly subscriptions, yes. If you also sell annual contracts, ARR is the annualised value of all active recurring contracts; it should exclude one-time and non-recurring services revenue.",
      },
      {
        q: "Does the projection assume constant growth?",
        a: "Yes — it compounds your current monthly growth rate for 12 months. Real growth rates usually decay as you scale, so treat the projection as an optimistic run-rate ceiling.",
      },
    ],
    related: ["mrr", "rule-of-40", "arpu"],
    sources: [S.hubifi, S.forEntrepreneurs],
  },

  // -------------------------------------------------------------------------
  {
    slug: "churn-rate",
    name: "Churn Rate",
    h1: "Churn Rate Calculator",
    title: "Churn Rate Calculator (Free) — Customer & Revenue Churn | SaaSGauge",
    metaDescription:
      "Free churn rate calculator. Compute monthly customer (logo) churn and revenue churn, plus the annualised equivalent, with SaaS benchmark context.",
    category: "Retention",
    shortDescription:
      "Monthly and annualised customer and revenue churn, side by side.",
    intro: [
      "Churn measures the customers or revenue you lose in a period. Customer (logo) churn counts accounts lost; revenue churn counts the MRR lost. They can diverge sharply — losing a few big accounts can mean low logo churn but high revenue churn.",
      "Small monthly numbers compound: 5% monthly logo churn is roughly 46% annualised, so the difference between 2% and 5% is enormous over a year.",
    ],
    formula:
      "Customer churn = Customers lost ÷ Customers at start   •   Annualised ≈ 1 − (1 − monthly)¹²",
    inputs: [
      { id: "customersStart", label: "Customers at start", unit: "count", default: 1000, min: 0 },
      { id: "customersLost", label: "Customers lost", unit: "count", default: 30, min: 0 },
      { id: "mrrStart", label: "MRR at start", unit: "currency", default: 100000, min: 0 },
      { id: "mrrLost", label: "MRR lost (churn + contraction)", unit: "currency", default: 4000, min: 0 },
    ],
    compute: (v) => {
      const logo = safeDiv(v.customersLost, v.customersStart) * 100;
      const revenue = safeDiv(v.mrrLost, v.mrrStart) * 100;
      const annualLogo = (1 - Math.pow(1 - pct(logo), 12)) * 100;
      let status: Status = "neutral";
      let verdict = "";
      if (isFinite(logo)) {
        if (logo < 1) {
          status = "great";
          verdict = "Excellent retention — under 1% monthly logo churn is best-in-class.";
        } else if (logo <= 3) {
          status = "good";
          verdict = "Healthy monthly churn for most SaaS segments.";
        } else if (logo <= 5) {
          status = "warn";
          verdict = "Elevated. Common for early SMB SaaS, but a priority to reduce.";
        } else {
          status = "bad";
          verdict = "High churn will cap growth — over 5% monthly compounds to ~46%+ a year.";
        }
      }
      return {
        label: "Monthly Customer (Logo) Churn",
        display: formatPercent(logo),
        unit: "percent",
        status,
        verdict,
        extra: [
          { label: "Monthly revenue churn", display: formatPercent(revenue) },
          { label: "Annualised logo churn", display: formatPercent(annualLogo) },
        ],
      };
    },
    benchmarks: [
      { label: "Best-in-class (monthly logo)", range: "< 1%" },
      { label: "Healthy SMB SaaS", range: "1 – 3%" },
      { label: "Needs attention", range: "3 – 5%" },
      { label: "High", range: "> 5%" },
    ],
    benchmarkNote:
      "Enterprise SaaS often runs annual logo churn in the single digits; self-serve SMB tools naturally run higher. Compare yourself to your segment, not the whole market.",
    faqs: [
      {
        q: "What's the difference between customer churn and revenue churn?",
        a: "Customer (logo) churn counts accounts lost. Revenue churn counts MRR lost. A product with strong expansion can have positive logo churn but negative net revenue churn, because upsells outweigh losses.",
      },
      {
        q: "Why annualise churn?",
        a: "Monthly churn compounds. Annualising with 1 − (1 − monthly)¹² shows the real yearly impact: 3% monthly is ~30% a year, not 36%, because the base shrinks each month.",
      },
    ],
    related: ["nrr", "grr", "ltv", "ltv-cac"],
    sources: [S.hubifi, S.forEntrepreneurs],
  },

  // -------------------------------------------------------------------------
  {
    slug: "nrr",
    name: "Net Revenue Retention (NRR)",
    h1: "Net Revenue Retention (NRR) Calculator",
    title: "NRR Calculator (Free) — Net Revenue Retention / NDR | SaaSGauge",
    metaDescription:
      "Free NRR (net revenue retention / NDR) calculator. Measure how much revenue you keep and grow from existing customers, excluding new logos, with benchmarks.",
    category: "Retention",
    shortDescription:
      "How much your existing customer base grows or shrinks on its own, before any new logos.",
    intro: [
      "Net Revenue Retention (NRR, also called Net Dollar Retention) measures how the revenue from a cohort of existing customers changes over a period — including expansion, contraction and churn, but excluding any brand-new customers.",
      "Above 100% means your existing base grows by itself, the hallmark of best-in-class SaaS. Public SaaS leaders frequently report 110–120%+.",
    ],
    formula:
      "NRR = (Starting MRR + Expansion − Contraction − Churn) ÷ Starting MRR × 100",
    inputs: [
      { id: "starting", label: "Starting MRR (existing customers)", unit: "currency", default: 100000, min: 0 },
      { id: "expansion", label: "Expansion MRR", unit: "currency", default: 12000, min: 0 },
      { id: "contraction", label: "Contraction MRR", unit: "currency", default: 3000, min: 0 },
      { id: "churned", label: "Churned MRR", unit: "currency", default: 5000, min: 0 },
    ],
    compute: (v) => {
      const nrr =
        safeDiv(
          v.starting + v.expansion - v.contraction - v.churned,
          v.starting,
        ) * 100;
      let status: Status = "neutral";
      let verdict = "";
      if (isFinite(nrr)) {
        if (nrr >= 110) {
          status = "great";
          verdict = "Best-in-class. Your existing base grows on its own — expansion beats churn handily.";
        } else if (nrr >= 100) {
          status = "good";
          verdict = "Net negative churn: expansion offsets all losses. Solid foundation for efficient growth.";
        } else if (nrr >= 90) {
          status = "warn";
          verdict = "Below 100% — your base shrinks slightly each period, so new sales must run just to stand still.";
        } else {
          status = "bad";
          verdict = "Leaky bucket. Significant net contraction will undermine growth no matter how much you sell.";
        }
      }
      return {
        label: "Net Revenue Retention",
        display: formatPercent(nrr),
        unit: "percent",
        status,
        verdict,
      };
    },
    benchmarks: [
      { label: "Median SaaS", range: "~100 – 102%" },
      { label: "Good", range: "100 – 110%" },
      { label: "Best-in-class", range: "110 – 120%+" },
      { label: "Leaky", range: "< 90%" },
    ],
    benchmarkNote:
      "Median NRR across SaaS sits around 100–102%; public SaaS leaders often report ~114% and best-in-class exceeds 120%. NRR tends to be higher for enterprise and lower for SMB.",
    faqs: [
      {
        q: "What's the difference between NRR and GRR?",
        a: "NRR (net) includes expansion revenue, so it can exceed 100%. GRR (gross) excludes expansion and only measures revenue kept, so it is capped at 100%. Reporting both shows whether retention is healthy or just masked by upsells.",
      },
      {
        q: "Why exclude new customers?",
        a: "NRR is about the durability of revenue you already have. Including new logos would conflate retention with acquisition and hide a leaky base.",
      },
    ],
    related: ["grr", "churn-rate", "quick-ratio", "mrr"],
    sources: [S.hubifi, S.forEntrepreneurs],
  },

  // -------------------------------------------------------------------------
  {
    slug: "grr",
    name: "Gross Revenue Retention (GRR)",
    h1: "Gross Revenue Retention (GRR) Calculator",
    title: "GRR Calculator (Free) — Gross Revenue Retention | SaaSGauge",
    metaDescription:
      "Free GRR (gross revenue retention) calculator. Measure the share of recurring revenue you keep before expansion, capped at 100%, with SaaS benchmarks.",
    category: "Retention",
    shortDescription:
      "The share of recurring revenue you keep, before any expansion — capped at 100%.",
    intro: [
      "Gross Revenue Retention (GRR) measures how much recurring revenue from existing customers you retain, excluding expansion. Because it can't be rescued by upsells, GRR is the honest measure of churn-and-contraction.",
      "GRR is always 100% or lower. Strong SaaS businesses hold GRR in the high 80s to 90s percent.",
    ],
    formula:
      "GRR = (Starting MRR − Contraction − Churn) ÷ Starting MRR × 100",
    inputs: [
      { id: "starting", label: "Starting MRR (existing customers)", unit: "currency", default: 100000, min: 0 },
      { id: "contraction", label: "Contraction MRR", unit: "currency", default: 3000, min: 0 },
      { id: "churned", label: "Churned MRR", unit: "currency", default: 5000, min: 0 },
    ],
    compute: (v) => {
      const grr =
        safeDiv(v.starting - v.contraction - v.churned, v.starting) * 100;
      let status: Status = "neutral";
      let verdict = "";
      if (isFinite(grr)) {
        if (grr >= 90) {
          status = "great";
          verdict = "Excellent — you keep 90%+ of existing revenue before any upsell.";
        } else if (grr >= 80) {
          status = "good";
          verdict = "Healthy gross retention for most SaaS segments.";
        } else if (grr >= 70) {
          status = "warn";
          verdict = "Soft. Expansion may be masking underlying churn — investigate why revenue leaks.";
        } else {
          status = "bad";
          verdict = "High gross churn. Retention work should come before pouring more into acquisition.";
        }
      }
      return {
        label: "Gross Revenue Retention",
        display: formatPercent(grr),
        unit: "percent",
        status,
        verdict,
      };
    },
    benchmarks: [
      { label: "Best-in-class", range: "> 90%" },
      { label: "Healthy", range: "80 – 90%" },
      { label: "Needs work", range: "70 – 80%" },
      { label: "Leaky", range: "< 70%" },
    ],
    benchmarkNote:
      "Enterprise SaaS routinely posts GRR above 90%; SMB and self-serve tools run lower. GRR below NRR by a wide margin means upsells are hiding a churn problem.",
    faqs: [
      {
        q: "Can GRR be above 100%?",
        a: "No. GRR excludes expansion revenue, so the most you can retain is everything you started with — 100%. Only NRR can exceed 100%.",
      },
      {
        q: "Which matters more, GRR or NRR?",
        a: "Both. NRR shows overall base growth; GRR shows the quality underneath it. Investors increasingly ask for GRR because a high NRR built on a weak GRR is fragile.",
      },
    ],
    related: ["nrr", "churn-rate", "mrr"],
    sources: [S.hubifi, S.forEntrepreneurs],
  },

  // -------------------------------------------------------------------------
  {
    slug: "rule-of-40",
    name: "Rule of 40",
    h1: "Rule of 40 Calculator",
    title: "Rule of 40 Calculator (Free) — SaaS Growth vs. Profit | SaaSGauge",
    metaDescription:
      "Free Rule of 40 calculator. Add your revenue growth rate and profit margin to see if you clear the 40% threshold that balances SaaS growth and profitability.",
    category: "Efficiency",
    shortDescription:
      "Growth rate + profit margin. Clear 40% and you're balancing growth and profitability.",
    intro: [
      "The Rule of 40 says a healthy SaaS company's revenue growth rate plus its profit margin should add up to at least 40%. It's a quick way to judge whether you're balancing the trade-off between growing fast and being profitable.",
      "Use a consistent profit measure — EBITDA margin or free-cash-flow margin are common. A fast grower can have a negative margin and still pass; a slow grower must be highly profitable to clear the bar.",
    ],
    formula: "Rule of 40 score = Revenue growth % + Profit margin %",
    inputs: [
      {
        id: "growth",
        label: "Revenue growth rate (YoY)",
        unit: "percent",
        default: 30,
        help: "Year-over-year recurring revenue growth.",
      },
      {
        id: "margin",
        label: "Profit margin (EBITDA or FCF)",
        unit: "percent",
        default: 15,
        help: "Can be negative for high-growth, unprofitable companies.",
      },
    ],
    compute: (v) => {
      const score = calcRuleOf40(v.growth, v.margin);
      let status: Status;
      let verdict: string;
      if (score >= 60) {
        status = "great";
        verdict = "Exceptional. A score of 60+ puts you among elite SaaS performers.";
      } else if (score >= 40) {
        status = "good";
        verdict = "You clear the Rule of 40 — growth and profitability are well balanced.";
      } else if (score >= 25) {
        status = "warn";
        verdict = "Below 40. Either accelerate growth or improve margin to close the gap.";
      } else {
        status = "bad";
        verdict = "Well below the threshold — the growth/profit balance needs real work.";
      }
      return {
        label: "Rule of 40 Score",
        display: formatPercent(score, 0),
        unit: "percent",
        status,
        verdict,
        extra: [
          { label: "From growth", display: formatPercent(v.growth, 0) },
          { label: "From margin", display: formatPercent(v.margin, 0) },
        ],
      };
    },
    benchmarks: [
      { label: "Elite", range: "≥ 60%" },
      { label: "Passing", range: "≥ 40%" },
      { label: "Below benchmark", range: "25 – 40%" },
      { label: "At risk", range: "< 25%" },
    ],
    benchmarkNote:
      "The Rule of 40 is most meaningful at scale (roughly $5M+ ARR). Very early companies are expected to prioritise growth and may post negative margins.",
    faqs: [
      {
        q: "Which profit margin should I use?",
        a: "EBITDA margin and free-cash-flow margin are the two most common. Pick one and use it consistently. Whatever you choose, use the same growth basis (usually YoY recurring revenue growth).",
      },
      {
        q: "Does the Rule of 40 apply to early-stage startups?",
        a: "Less so. Below ~$5M ARR, companies are typically expected to grow fast and run at a loss, so the rule is more of a north star than a pass/fail test until you're at scale.",
      },
    ],
    related: ["arr", "burn-rate", "magic-number"],
    sources: [S.wspRule40, S.cfiRule40],
  },

  // -------------------------------------------------------------------------
  {
    slug: "burn-rate",
    name: "Burn Rate",
    h1: "Burn Rate Calculator",
    title: "Burn Rate Calculator (Free) — Gross & Net Monthly Burn | SaaSGauge",
    metaDescription:
      "Free burn rate calculator. Enter monthly cash out and cash in to get gross and net burn, then see implied runway from your cash balance.",
    category: "Cash",
    shortDescription:
      "Gross and net monthly cash burn, plus the runway it implies.",
    intro: [
      "Burn rate is how much cash you consume each month. Gross burn is total monthly cash outflow; net burn subtracts cash coming in. Net burn is the number that determines how long your runway lasts.",
      "If cash inflows exceed outflows, net burn is negative — you're cash-flow positive and not burning at all.",
    ],
    formula:
      "Gross burn = Monthly cash out   •   Net burn = Cash out − Cash in",
    inputs: [
      { id: "cashOut", label: "Monthly cash out (all expenses)", unit: "currency", default: 120000, min: 0 },
      { id: "cashIn", label: "Monthly cash in (collections)", unit: "currency", default: 80000, min: 0 },
      { id: "cash", label: "Cash in bank", unit: "currency", default: 900000, min: 0 },
    ],
    compute: (v) => {
      const grossBurn = v.cashOut;
      const netBurn = v.cashOut - v.cashIn;
      const runway = calcRunwayMonths(v.cash, netBurn);
      let status: Status;
      let verdict: string;
      if (netBurn <= 0) {
        status = "great";
        verdict = "Cash-flow positive — you're not burning. Inflows cover your costs.";
      } else if (isFinite(runway) && runway >= 18) {
        status = "good";
        verdict = `Burning ${formatCurrency(netBurn)}/mo with comfortable runway (~${formatMonths(runway)}).`;
      } else if (isFinite(runway) && runway >= 9) {
        status = "warn";
        verdict = `Burning ${formatCurrency(netBurn)}/mo — start planning your next raise or path to break-even.`;
      } else {
        status = "bad";
        verdict = `Burning ${formatCurrency(netBurn)}/mo leaves limited runway. Extend it urgently.`;
      }
      return {
        label: "Net Monthly Burn",
        display: formatCurrency(netBurn),
        unit: "currency",
        status,
        verdict,
        extra: [
          { label: "Gross burn", display: formatCurrency(grossBurn) },
          { label: "Implied runway", display: isFinite(runway) ? formatMonths(runway) : "∞ (profitable)" },
        ],
      };
    },
    benchmarks: [
      { label: "Comfortable runway", range: "≥ 18 months" },
      { label: "Plan ahead", range: "9 – 18 months" },
      { label: "Danger zone", range: "< 9 months" },
    ],
    benchmarkNote:
      "The 'right' burn depends on stage and growth. Investors increasingly favour capital efficiency — pairing burn with the net new ARR it buys (the burn multiple).",
    faqs: [
      {
        q: "Gross vs. net burn — which should I track?",
        a: "Track both. Gross burn shows your cost base if revenue disappeared; net burn shows the actual monthly drain on cash and drives runway. Net burn is the one that determines how long you survive.",
      },
      {
        q: "What is the burn multiple?",
        a: "Burn multiple = net burn ÷ net new ARR. It shows how much you burn to add a dollar of recurring revenue; under 1.0 is efficient, over 2.0 is a flag. Use the Magic Number calculator for a related efficiency view.",
      },
    ],
    related: ["runway", "rule-of-40", "magic-number"],
    sources: [S.forEntrepreneurs, S.hubifi],
  },

  // -------------------------------------------------------------------------
  {
    slug: "runway",
    name: "Cash Runway",
    h1: "Cash Runway Calculator",
    title: "Runway Calculator (Free) — Cash Runway in Months | SaaSGauge",
    metaDescription:
      "Free cash runway calculator. Divide cash on hand by net monthly burn to see how many months you have and your projected zero-cash date.",
    category: "Cash",
    shortDescription:
      "How many months of cash you have left at your current net burn.",
    intro: [
      "Runway is the number of months your business can operate before it runs out of cash, assuming burn stays constant. It's the most important survival metric for any venture-funded startup.",
      "A common rule of thumb is to keep 18+ months of runway after a raise and to start the next raise with 6–9 months left.",
    ],
    formula: "Runway (months) = Cash on hand ÷ Net monthly burn",
    inputs: [
      { id: "cash", label: "Cash on hand", unit: "currency", default: 1500000, min: 0 },
      { id: "netBurn", label: "Net monthly burn", unit: "currency", default: 90000, min: 0 },
    ],
    compute: (v) => {
      const runway = calcRunwayMonths(v.cash, v.netBurn);
      let status: Status;
      let verdict: string;
      if (!isFinite(runway)) {
        status = "great";
        verdict = "No net burn — runway is effectively unlimited at the current rate.";
      } else if (runway >= 18) {
        status = "great";
        verdict = "Comfortable. 18+ months gives room to hit milestones before raising again.";
      } else if (runway >= 12) {
        status = "good";
        verdict = "Solid, but begin planning the next raise or path to profitability now.";
      } else if (runway >= 6) {
        status = "warn";
        verdict = "Getting tight — most founders start fundraising with 6–9 months left.";
      } else {
        status = "bad";
        verdict = "Critical. Prioritise extending runway via revenue, cost cuts, or financing immediately.";
      }
      const zeroDate = new Date();
      zeroDate.setMonth(zeroDate.getMonth() + (isFinite(runway) ? Math.floor(runway) : 0));
      return {
        label: "Cash Runway",
        display: isFinite(runway) ? formatMonths(runway) : "∞ (profitable)",
        unit: "months",
        status,
        verdict,
        extra: isFinite(runway)
          ? [
              {
                label: "Projected zero-cash month",
                display: zeroDate.toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                }),
              },
            ]
          : undefined,
      };
    },
    benchmarks: [
      { label: "Comfortable", range: "≥ 18 months" },
      { label: "Healthy", range: "12 – 18 months" },
      { label: "Start fundraising", range: "6 – 12 months" },
      { label: "Critical", range: "< 6 months" },
    ],
    benchmarkNote:
      "Fundraising takes 3–6 months, so 'time to raise' is built into these thresholds. Tougher markets push the comfortable target toward 24 months.",
    faqs: [
      {
        q: "Should runway use gross or net burn?",
        a: "Net burn. Runway reflects the real monthly drain on cash after collections, so divide cash on hand by net monthly burn, not gross burn.",
      },
      {
        q: "When should I start raising?",
        a: "Most founders start the next round with 6–9 months of runway remaining, because raising typically takes 3–6 months and you want margin for error.",
      },
    ],
    related: ["burn-rate", "rule-of-40"],
    sources: [S.forEntrepreneurs, S.hubifi],
  },

  // -------------------------------------------------------------------------
  {
    slug: "magic-number",
    name: "SaaS Magic Number",
    h1: "SaaS Magic Number Calculator",
    title: "SaaS Magic Number Calculator (Free) — S&M Efficiency | SaaSGauge",
    metaDescription:
      "Free SaaS Magic Number calculator. Measure sales & marketing efficiency: how much new ARR each dollar of prior-quarter S&M spend generated.",
    category: "Efficiency",
    shortDescription:
      "New ARR generated per dollar of sales & marketing spend — a clean efficiency read.",
    intro: [
      "The SaaS Magic Number measures sales and marketing efficiency: how much new annualised recurring revenue you generated for each dollar of S&M spend in the prior period. It's a favourite of investors gauging whether to fund more growth.",
      "Above 1.0 means each dollar of S&M brought in more than a dollar of new ARR — a strong signal to invest more. Below 0.5 suggests the go-to-market engine needs work before scaling spend.",
    ],
    formula:
      "Magic Number = (Current quarter revenue − Prior quarter revenue) × 4 ÷ Prior quarter S&M spend",
    inputs: [
      { id: "currentRev", label: "Current quarter revenue", unit: "currency", default: 1300000, min: 0 },
      { id: "priorRev", label: "Prior quarter revenue", unit: "currency", default: 1150000, min: 0 },
      { id: "priorSm", label: "Prior quarter S&M spend", unit: "currency", default: 500000, min: 0 },
    ],
    compute: (v) => {
      const magic = safeDiv((v.currentRev - v.priorRev) * 4, v.priorSm);
      let status: Status = "neutral";
      let verdict = "";
      if (isFinite(magic)) {
        if (magic >= 1) {
          status = "great";
          verdict = "Highly efficient — each S&M dollar returns more than a dollar of new ARR. Consider scaling spend.";
        } else if (magic >= 0.75) {
          status = "good";
          verdict = "Efficient. A magic number of 0.75–1.0 generally supports continued investment in growth.";
        } else if (magic >= 0.5) {
          status = "warn";
          verdict = "Borderline. Tune conversion, pricing or targeting before adding more spend.";
        } else {
          status = "bad";
          verdict = "Inefficient go-to-market. Fix the funnel before scaling acquisition spend.";
        }
      }
      return {
        label: "SaaS Magic Number",
        display: formatNumber(magic, 2),
        unit: "number",
        status,
        verdict,
      };
    },
    benchmarks: [
      { label: "Scale spend", range: "≥ 1.0" },
      { label: "Efficient", range: "0.75 – 1.0" },
      { label: "Optimise first", range: "0.5 – 0.75" },
      { label: "Inefficient", range: "< 0.5" },
    ],
    benchmarkNote:
      "The magic number lags reality by a quarter (this period's revenue from last period's spend). Read it as a trend, not a single-quarter verdict.",
    faqs: [
      {
        q: "Why multiply revenue change by 4?",
        a: "To annualise a single quarter's revenue increase. Multiplying the quarter-over-quarter revenue gain by four converts it to an approximate new-ARR figure to compare against spend.",
      },
      {
        q: "Why use prior-quarter spend?",
        a: "Sales and marketing spend takes time to convert to revenue. Comparing this quarter's revenue gain to last quarter's spend respects that lag.",
      },
    ],
    related: ["cac", "rule-of-40", "burn-rate"],
    sources: [S.forEntrepreneurs, S.hubifi],
  },

  // -------------------------------------------------------------------------
  {
    slug: "quick-ratio",
    name: "SaaS Quick Ratio",
    h1: "SaaS Quick Ratio Calculator",
    title: "SaaS Quick Ratio Calculator (Free) — Growth Efficiency | SaaSGauge",
    metaDescription:
      "Free SaaS Quick Ratio calculator. Compare new + expansion MRR to churned + contraction MRR to see how efficiently you grow against revenue losses.",
    category: "Efficiency",
    shortDescription:
      "Revenue gained vs. revenue lost — how much growth survives the leaky bucket.",
    intro: [
      "The SaaS Quick Ratio compares the MRR you add (new + expansion) to the MRR you lose (churned + contraction). It captures, in one number, how efficiently your growth survives your losses.",
      "A quick ratio of 4 means you add four dollars for every dollar you lose — generally considered healthy. Below 1 means you're shrinking.",
    ],
    formula:
      "Quick Ratio = (New MRR + Expansion MRR) ÷ (Churned MRR + Contraction MRR)",
    inputs: [
      { id: "newMrr", label: "New MRR", unit: "currency", default: 9000, min: 0 },
      { id: "expansion", label: "Expansion MRR", unit: "currency", default: 4000, min: 0 },
      { id: "churned", label: "Churned MRR", unit: "currency", default: 2500, min: 0 },
      { id: "contraction", label: "Contraction MRR", unit: "currency", default: 800, min: 0 },
    ],
    compute: (v) => {
      const gained = v.newMrr + v.expansion;
      const lost = v.churned + v.contraction;
      const ratio = safeDiv(gained, lost);
      let status: Status = "neutral";
      let verdict = "";
      if (isFinite(ratio)) {
        if (ratio >= 4) {
          status = "great";
          verdict = "Efficient growth — you add roughly 4× the MRR you lose. This is the common best-in-class bar.";
        } else if (ratio >= 2) {
          status = "good";
          verdict = "Healthy. Growth comfortably outpaces losses.";
        } else if (ratio >= 1) {
          status = "warn";
          verdict = "Growing, but losses are eating much of your gains. Retention is the lever.";
        } else {
          status = "bad";
          verdict = "You're shrinking — losing more MRR than you add. Fix churn before scaling acquisition.";
        }
      }
      return {
        label: "SaaS Quick Ratio",
        display: formatNumber(ratio, 2),
        unit: "number",
        status,
        verdict,
        extra: [
          { label: "MRR gained", display: formatCurrency(gained) },
          { label: "MRR lost", display: formatCurrency(lost) },
        ],
      };
    },
    benchmarks: [
      { label: "Best-in-class", range: "≥ 4" },
      { label: "Healthy", range: "2 – 4" },
      { label: "Inefficient", range: "1 – 2" },
      { label: "Shrinking", range: "< 1" },
    ],
    benchmarkNote:
      "The quick ratio rewards efficient growth. A high ratio achieved with tiny absolute numbers still needs scale — read it alongside net new MRR.",
    faqs: [
      {
        q: "How is the quick ratio different from NRR?",
        a: "NRR looks only at existing customers and excludes new logos. The quick ratio includes new MRR, so it measures the efficiency of total growth (acquisition + expansion) against total losses.",
      },
      {
        q: "What's a good SaaS quick ratio?",
        a: "4 or higher is the widely cited benchmark for efficient growth. Between 1 and 4 you're still growing but leaking; below 1 you're contracting.",
      },
    ],
    related: ["nrr", "mrr", "magic-number"],
    sources: [S.forEntrepreneurs, S.hubifi],
  },

  // -------------------------------------------------------------------------
  {
    slug: "arpu",
    name: "ARPU / ARPA",
    h1: "ARPU Calculator",
    title: "ARPU Calculator (Free) — Average Revenue Per User/Account | SaaSGauge",
    metaDescription:
      "Free ARPU / ARPA calculator. Divide MRR by customers to get average revenue per user or account, monthly and annualised, with growth context.",
    category: "Growth",
    shortDescription:
      "Average monthly revenue per user or account — a pulse on pricing and mix.",
    intro: [
      "ARPU (Average Revenue Per User) or ARPA (Average Revenue Per Account) is total recurring revenue divided by the number of customers. Rising ARPU usually means better pricing, upsell, or a shift toward larger customers.",
      "ARPU is a key input to LTV and a quick way to see whether you're moving up-market over time.",
    ],
    formula: "ARPU = Total MRR ÷ Total customers   •   Annual ARPU = ARPU × 12",
    inputs: [
      { id: "mrr", label: "Total MRR", unit: "currency", default: 60000, min: 0 },
      { id: "customers", label: "Total customers", unit: "count", default: 600, min: 0 },
    ],
    compute: (v) => {
      const arpu = safeDiv(v.mrr, v.customers);
      return {
        label: "ARPU (monthly)",
        display: formatCurrency(arpu),
        unit: "currency",
        status: "neutral",
        verdict:
          "Track ARPU over time — a rising trend signals successful pricing, packaging or up-market motion.",
        extra: [{ label: "Annual ARPU", display: formatCurrency(arpu * 12) }],
      };
    },
    benchmarks: [
      { label: "Self-serve / prosumer", range: "$5 – $50 / mo" },
      { label: "SMB", range: "$50 – $500 / mo" },
      { label: "Mid-market / enterprise", range: "$500 – $5k+ / mo" },
    ],
    benchmarkNote:
      "There's no 'good' ARPU in isolation — it reflects your segment and pricing model. What matters is the trend and how ARPU relates to CAC and support cost.",
    faqs: [
      {
        q: "What's the difference between ARPU and ARPA?",
        a: "ARPU is per user (individual seat/login); ARPA is per account (which may contain many users). B2B SaaS usually tracks ARPA; consumer and prosumer products track ARPU.",
      },
      {
        q: "How do I raise ARPU?",
        a: "Through pricing increases, packaging changes that nudge upgrades, usage-based add-ons, and selling to larger customers. Watch that higher ARPU doesn't come with disproportionately higher churn or CAC.",
      },
    ],
    related: ["mrr", "ltv", "ltv-cac"],
    sources: [S.forEntrepreneurs, S.hubifi],
  },

  // -------------------------------------------------------------------------
  {
    slug: "gross-margin",
    name: "SaaS Gross Margin",
    h1: "SaaS Gross Margin Calculator",
    title: "SaaS Gross Margin Calculator (Free) — Target 70–85% | SaaSGauge",
    metaDescription:
      "Free SaaS gross margin calculator. Subtract cost of revenue (hosting, support, payment fees) from revenue to get gross margin, with the 70–85% SaaS benchmark.",
    category: "Efficiency",
    shortDescription:
      "Revenue left after cost of revenue — the margin that funds everything else.",
    intro: [
      "Gross margin is the percentage of revenue left after the direct cost of delivering your service — hosting and infrastructure, customer support, third-party software baked into the product, and payment processing fees.",
      "Healthy SaaS gross margins run roughly 70–85%. High margins are what let software businesses fund sales, R&D and still throw off cash at scale.",
    ],
    formula: "Gross margin = (Revenue − Cost of revenue) ÷ Revenue × 100",
    inputs: [
      { id: "revenue", label: "Recurring revenue (period)", unit: "currency", default: 100000, min: 0 },
      {
        id: "cogs",
        label: "Cost of revenue (hosting, support, fees)",
        unit: "currency",
        default: 22000,
        min: 0,
        help: "Direct delivery costs only — not sales, marketing, or R&D.",
      },
    ],
    compute: (v) => {
      const margin = safeDiv(v.revenue - v.cogs, v.revenue) * 100;
      let status: Status = "neutral";
      let verdict = "";
      if (isFinite(margin)) {
        if (margin >= 80) {
          status = "great";
          verdict = "Excellent software margins — plenty of room to fund growth and profitability.";
        } else if (margin >= 70) {
          status = "good";
          verdict = "Healthy SaaS gross margin, right in the expected range.";
        } else if (margin >= 50) {
          status = "warn";
          verdict = "Below typical SaaS margins — check hosting efficiency, support load, and whether services revenue is dragging it down.";
        } else {
          status = "bad";
          verdict = "Low for SaaS. This may signal a services-heavy model or expensive infrastructure relative to price.";
        }
      }
      return {
        label: "Gross Margin",
        display: formatPercent(margin),
        unit: "percent",
        status,
        verdict,
        extra: [{ label: "Gross profit", display: formatCurrency(v.revenue - v.cogs) }],
      };
    },
    benchmarks: [
      { label: "Best-in-class", range: "≥ 80%" },
      { label: "Healthy SaaS", range: "70 – 80%" },
      { label: "Sub-scale / services-heavy", range: "50 – 70%" },
      { label: "Concern", range: "< 50%" },
    ],
    benchmarkNote:
      "Include only cost of revenue (delivery), not operating expenses like sales, marketing and R&D. Usage-heavy or AI-inference products may sit lower until they optimise infrastructure.",
    faqs: [
      {
        q: "What goes into SaaS cost of revenue?",
        a: "Hosting and infrastructure, third-party APIs and software embedded in the product, customer support and customer success tied to delivery, payment processing fees, and any data costs. Exclude sales, marketing, G&A and R&D.",
      },
      {
        q: "Why do investors care about gross margin?",
        a: "High gross margin is what separates software from services. It determines how much of each new dollar can fund growth and eventually flow to profit, and it directly affects valuation multiples.",
      },
    ],
    related: ["ltv-cac", "rule-of-40", "arpu"],
    sources: [S.hubifi, S.forEntrepreneurs],
  },

  // -------------------------------------------------------------------------
  {
    slug: "burn-multiple",
    name: "Burn Multiple",
    h1: "Burn Multiple Calculator",
    title: "Burn Multiple Calculator (Free) — Capital Efficiency | SaaSGauge",
    metaDescription:
      "Free burn multiple calculator. Divide net burn by net new ARR to see how much cash you burn for each dollar of new recurring revenue, with benchmark context.",
    category: "Cash",
    shortDescription:
      "Cash burned per dollar of net new ARR — the cleanest capital-efficiency read.",
    intro: [
      "The burn multiple, popularised by David Sacks, divides net cash burn by net new ARR over the same period. It answers one question investors love: how much are you burning to add a dollar of recurring revenue?",
      "Lower is better. Under 1.0 is exceptional capital efficiency; above 2.0 means growth is getting expensive and deserves scrutiny.",
    ],
    formula: "Burn Multiple = Net burn ÷ Net new ARR (same period)",
    inputs: [
      { id: "netBurn", label: "Net cash burn (period)", unit: "currency", default: 1500000, min: 0 },
      { id: "netNewArr", label: "Net new ARR added (period)", unit: "currency", default: 1200000, min: 0 },
    ],
    compute: (v) => {
      const mult = safeDiv(v.netBurn, v.netNewArr);
      let status: Status = "neutral";
      let verdict = "";
      if (v.netNewArr <= 0) {
        status = "bad";
        verdict = "Burning cash with no net new ARR — capital efficiency can't be assessed favourably.";
      } else if (isFinite(mult)) {
        if (mult < 1) {
          status = "great";
          verdict = "Exceptional. Under 1.0 means you add more than a dollar of ARR for every dollar burned.";
        } else if (mult <= 1.5) {
          status = "good";
          verdict = "Great efficiency. Comfortably in the range investors reward.";
        } else if (mult <= 2) {
          status = "warn";
          verdict = "Acceptable, but watch it — growth is starting to get expensive.";
        } else {
          status = "bad";
          verdict = "Inefficient. Above 2.0 means a lot of cash for each new ARR dollar; tighten before scaling.";
        }
      }
      return {
        label: "Burn Multiple",
        display: formatNumber(mult, 2),
        unit: "number",
        status,
        verdict,
      };
    },
    benchmarks: [
      { label: "Amazing", range: "< 1.0" },
      { label: "Great", range: "1.0 – 1.5" },
      { label: "Watch", range: "1.5 – 2.0" },
      { label: "Inefficient", range: "> 2.0" },
    ],
    benchmarkNote:
      "The burn multiple captures efficiency in a single number across the whole business, unlike the magic number which isolates sales & marketing. Read it over several quarters.",
    faqs: [
      {
        q: "How is burn multiple different from the magic number?",
        a: "The magic number measures sales & marketing efficiency only (new ARR per S&M dollar). The burn multiple measures whole-company efficiency (net new ARR per dollar of total net burn), so it also reflects R&D and G&A spend.",
      },
      {
        q: "What is a good burn multiple?",
        a: "Below 1.0 is exceptional, 1.0–1.5 is great, 1.5–2.0 is acceptable, and above 2.0 is a flag. Earlier-stage companies often run higher and improve as they scale.",
      },
    ],
    related: ["burn-rate", "runway", "magic-number", "rule-of-40"],
    sources: [S.forEntrepreneurs, S.hubifi],
  },

  // -------------------------------------------------------------------------
  {
    slug: "arr-per-employee",
    name: "ARR per Employee",
    h1: "ARR per Employee Calculator",
    title: "ARR per Employee Calculator (Free) — SaaS Productivity | SaaSGauge",
    metaDescription:
      "Free ARR per employee calculator. Divide ARR by full-time headcount to benchmark SaaS productivity and capital efficiency against industry ranges.",
    category: "Efficiency",
    shortDescription:
      "Annual recurring revenue per full-time employee — a quick productivity gauge.",
    intro: [
      "ARR per employee divides annual recurring revenue by full-time headcount. It's a fast proxy for organisational productivity and how efficiently you've staffed for your revenue.",
      "Typical SaaS runs around $150k–$200k per employee, with best-in-class companies exceeding $300k as they scale.",
    ],
    formula: "ARR per employee = ARR ÷ Full-time employees",
    inputs: [
      { id: "arr", label: "ARR", unit: "currency", default: 6000000, min: 0 },
      { id: "employees", label: "Full-time employees (FTE)", unit: "count", default: 35, min: 0 },
    ],
    compute: (v) => {
      const per = safeDiv(v.arr, v.employees);
      let status: Status = "neutral";
      let verdict = "";
      if (isFinite(per)) {
        if (per >= 250000) {
          status = "great";
          verdict = "Highly productive — at or above best-in-class for most stages.";
        } else if (per >= 150000) {
          status = "good";
          verdict = "Healthy productivity, in the typical range for scaling SaaS.";
        } else if (per >= 100000) {
          status = "warn";
          verdict = "On the low side — common pre-scale, but watch hiring pace vs. revenue.";
        } else {
          status = "bad";
          verdict = "Low. Either revenue needs to catch up to headcount or the team is over-built.";
        }
      }
      return {
        label: "ARR per Employee",
        display: formatCurrency(per),
        unit: "currency",
        status,
        verdict,
      };
    },
    benchmarks: [
      { label: "Best-in-class", range: "≥ $250k" },
      { label: "Healthy", range: "$150k – $250k" },
      { label: "Pre-scale", range: "$100k – $150k" },
      { label: "Low", range: "< $100k" },
    ],
    benchmarkNote:
      "Productivity rises with scale, so early companies naturally sit lower. Compare against peers at your ARR band rather than the whole market.",
    faqs: [
      {
        q: "Should I count contractors?",
        a: "Use full-time equivalents (FTEs). Convert significant contractor hours to FTE so the ratio reflects your true cost base, not just payroll headcount.",
      },
      {
        q: "Why does ARR per employee matter?",
        a: "It's a simple efficiency and burn signal. Investors use it alongside the Rule of 40 and burn multiple to judge whether headcount growth is translating into revenue.",
      },
    ],
    related: ["rule-of-40", "burn-multiple", "arr"],
    sources: [S.hubifi, S.forEntrepreneurs],
  },

  // -------------------------------------------------------------------------
  {
    slug: "trial-conversion",
    name: "Trial Conversion Rate",
    h1: "Trial-to-Paid Conversion Rate Calculator",
    title: "Trial Conversion Rate Calculator (Free) — Trial to Paid | SaaSGauge",
    metaDescription:
      "Free trial-to-paid conversion rate calculator. Divide paid conversions by trials started to benchmark your funnel against opt-in, opt-out and freemium norms.",
    category: "Growth",
    shortDescription:
      "What share of trials become paying customers — your funnel's bottom line.",
    intro: [
      "Trial conversion rate is the percentage of free trials (or freemium signups) that become paying customers. It's the bottom line of your activation and onboarding funnel.",
      "Benchmarks vary a lot by model: opt-in free trials (no card) often convert ~25%, opt-out trials (card required) much higher, and freemium typically just 2–5%.",
    ],
    formula: "Trial conversion = Paid conversions ÷ Trials started × 100",
    inputs: [
      { id: "trials", label: "Trials / signups started", unit: "count", default: 1000, min: 0 },
      { id: "converted", label: "Converted to paid", unit: "count", default: 180, min: 0 },
    ],
    compute: (v) => {
      const rate = safeDiv(v.converted, v.trials) * 100;
      let status: Status = "neutral";
      let verdict = "";
      if (isFinite(rate)) {
        if (rate >= 25) {
          status = "great";
          verdict = "Strong for an opt-in trial. (Opt-out / card-required trials can go much higher.)";
        } else if (rate >= 15) {
          status = "good";
          verdict = "Healthy opt-in trial conversion.";
        } else if (rate >= 5) {
          status = "warn";
          verdict = "Middling for a free trial, though typical for freemium. Tighten activation and time-to-value.";
        } else {
          status = "bad";
          verdict = "Low — unless you're freemium, this points to onboarding or fit problems.";
        }
      }
      return {
        label: "Trial → Paid Conversion",
        display: formatPercent(rate),
        unit: "percent",
        status,
        verdict,
      };
    },
    benchmarks: [
      { label: "Opt-out free trial (card)", range: "~50 – 60%" },
      { label: "Opt-in free trial (no card)", range: "~15 – 25%" },
      { label: "Reverse trial", range: "~15 – 25%" },
      { label: "Freemium", range: "~2 – 5%" },
    ],
    benchmarkNote:
      "Always compare to your own model. A 5% freemium conversion can be excellent, while a 5% opt-out trial would be alarming.",
    faqs: [
      {
        q: "What counts as a trial start?",
        a: "Use the top of the funnel you're optimising — typically activated trials (people who actually started using the product), not just email signups, so the rate reflects real intent.",
      },
      {
        q: "How do I improve trial conversion?",
        a: "Shorten time-to-first-value, guide users to an aha moment quickly, trigger upgrade prompts at the right time, and consider opt-out trials or reverse trials if they fit your motion.",
      },
    ],
    related: ["cac", "ltv-cac", "arpu"],
    sources: [S.forEntrepreneurs, S.hubifi],
  },

  // -------------------------------------------------------------------------
  {
    slug: "dau-mau",
    name: "DAU/MAU Stickiness",
    h1: "DAU/MAU Ratio (Stickiness) Calculator",
    title: "DAU/MAU Calculator (Free) — Stickiness Ratio | SaaSGauge",
    metaDescription:
      "Free DAU/MAU stickiness calculator. Divide daily active users by monthly active users to measure engagement, with common product benchmarks.",
    category: "Retention",
    shortDescription:
      "Daily over monthly active users — how habitual and sticky your product is.",
    intro: [
      "The DAU/MAU ratio (stickiness) divides daily active users by monthly active users. It estimates how many days in a month the average active user shows up, and is a core engagement signal for product-led businesses.",
      "Around 20% is generally good; 50%+ indicates a daily-habit product. Expectations vary by category — a daily tool should be far stickier than a monthly one.",
    ],
    formula: "Stickiness = DAU ÷ MAU × 100",
    inputs: [
      { id: "dau", label: "Daily active users (DAU)", unit: "count", default: 4000, min: 0 },
      { id: "mau", label: "Monthly active users (MAU)", unit: "count", default: 16000, min: 0 },
    ],
    compute: (v) => {
      const ratio = safeDiv(v.dau, v.mau) * 100;
      let status: Status = "neutral";
      let verdict = "";
      if (isFinite(ratio)) {
        if (ratio >= 50) {
          status = "great";
          verdict = "Daily-habit product — exceptional stickiness.";
        } else if (ratio >= 20) {
          status = "good";
          verdict = "Good engagement for most product categories.";
        } else if (ratio >= 10) {
          status = "warn";
          verdict = "Lower engagement — fine for inherently infrequent tools, a flag for daily ones.";
        } else {
          status = "bad";
          verdict = "Low stickiness. Users return rarely; investigate value frequency and habit loops.";
        }
      }
      return {
        label: "DAU/MAU Stickiness",
        display: formatPercent(ratio),
        unit: "percent",
        status,
        verdict,
        extra: [
          {
            label: "Avg. active days / month",
            display: isFinite(ratio) ? `${(ratio / 100 * 30).toFixed(1)} days` : "—",
          },
        ],
      };
    },
    benchmarks: [
      { label: "Daily-habit product", range: "≥ 50%" },
      { label: "Good", range: "20 – 50%" },
      { label: "Infrequent-use", range: "10 – 20%" },
      { label: "Low", range: "< 10%" },
    ],
    benchmarkNote:
      "Stickiness expectations depend on use case. Judge against products with the same natural usage frequency, not a universal target.",
    faqs: [
      {
        q: "What does a 25% DAU/MAU mean?",
        a: "Roughly, the average monthly active user engages about 7–8 days a month (25% × 30). It's a proxy for how habitual your product is.",
      },
      {
        q: "Is higher always better?",
        a: "Generally yes for engagement, but the right level depends on the job your product does. A tax tool used a few times a year will and should have low stickiness.",
      },
    ],
    related: ["churn-rate", "nrr", "arpu"],
    sources: [S.forEntrepreneurs, S.hubifi],
  },

  // -------------------------------------------------------------------------
  {
    slug: "acv",
    name: "Average Contract Value (ACV)",
    h1: "ACV Calculator",
    title: "ACV Calculator (Free) — Average Contract Value | SaaSGauge",
    metaDescription:
      "Free ACV (average contract value) calculator. Annualise total contract value over its term to compare deals on an apples-to-apples yearly basis.",
    category: "Growth",
    shortDescription:
      "Annualised value of a contract — compare multi-year deals on a yearly basis.",
    intro: [
      "Average Contract Value (ACV) is the annualised recurring value of a customer contract — total contract value spread across its term, excluding one-time fees. It lets you compare a one-year and a three-year deal on the same yearly basis.",
      "ACV is most useful in sales-led SaaS for sizing deals, setting quotas, and segmenting customers.",
    ],
    formula: "ACV = (Total contract value − one-time fees) ÷ Contract term (years)",
    inputs: [
      { id: "tcv", label: "Total contract value (recurring)", unit: "currency", default: 90000, min: 0 },
      { id: "years", label: "Contract term (years)", unit: "number", default: 3, min: 0, step: 0.5 },
    ],
    compute: (v) => {
      const acv = safeDiv(v.tcv, v.years);
      return {
        label: "Average Contract Value",
        display: formatCurrency(acv),
        unit: "currency",
        status: "neutral",
        verdict:
          "Use ACV to compare deals of different lengths and to size quotas. Exclude one-time setup and services fees so it reflects recurring value only.",
        extra: [
          { label: "Monthly equivalent", display: formatCurrency(acv / 12) },
        ],
      };
    },
    benchmarks: [
      { label: "Self-serve / SMB", range: "< $5k ACV" },
      { label: "Mid-market", range: "$15k – $100k ACV" },
      { label: "Enterprise", range: "$100k+ ACV" },
    ],
    benchmarkNote:
      "ACV bands roughly map to go-to-market motion. Rising ACV over time usually signals a successful move up-market.",
    faqs: [
      {
        q: "What's the difference between ACV and TCV?",
        a: "TCV (total contract value) is the entire value of the contract over its full term, including one-time fees. ACV annualises only the recurring portion, so a 3-year, $90k recurring contract has a $30k ACV.",
      },
      {
        q: "Should ACV include one-time fees?",
        a: "No. Exclude setup, onboarding and professional-services fees so ACV reflects the recurring, repeatable value of the deal.",
      },
    ],
    related: ["arpu", "arr", "ltv"],
    sources: [S.forEntrepreneurs, S.hubifi],
  },

  // -------------------------------------------------------------------------
  {
    slug: "arr-multiple",
    name: "ARR Multiple (Illustrative)",
    h1: "ARR Multiple Calculator (Illustrative)",
    title: "ARR Multiple Calculator (Free, Illustrative) — SaaS | SaaSGauge",
    metaDescription:
      "Free ARR multiple calculator. Multiply ARR by a revenue multiple you choose to get an illustrative enterprise value. For education only — not a valuation or advice.",
    category: "Efficiency",
    shortDescription:
      "ARR × a multiple you choose = an illustrative figure. Education only, not a valuation.",
    intro: [
      "This tool multiplies your ARR by a revenue multiple you choose to produce an illustrative figure. Multiples are driven heavily by growth rate, retention and the Rule of 40, and by market conditions — there is no single 'correct' number.",
      "Important: this is an arithmetic illustration for learning, not a valuation, appraisal, or investment advice. A real valuation requires a qualified professional and far more than one ratio.",
    ],
    formula: "Illustrative value = ARR × Revenue multiple (you choose)",
    inputs: [
      { id: "arr", label: "ARR", unit: "currency", default: 5000000, min: 0 },
      { id: "multiple", label: "Revenue multiple (×)", unit: "number", default: 6, min: 0, step: 0.5 },
    ],
    compute: (v) => {
      const value = v.arr * v.multiple;
      return {
        label: "Illustrative figure (ARR × multiple)",
        display: formatCurrency(value),
        unit: "currency",
        status: "neutral",
        verdict:
          "Illustrative only — not a valuation or investment advice. Multiples vary widely with growth, retention, profitability and market conditions.",
      };
    },
    benchmarks: [
      { label: "Higher multiples associated with", range: "high growth + NRR > 110%" },
      { label: "Lower multiples associated with", range: "slow growth, weak retention" },
      { label: "Reality", range: "set by the market, not a formula" },
    ],
    benchmarkNote:
      "Public and private SaaS multiples move with interest rates and sentiment and differ by segment. Treat any single multiple as a rough sketch, never a target or promise.",
    faqs: [
      {
        q: "Is this a real valuation?",
        a: "No. It is simple arithmetic (ARR × a multiple you enter) for educational purposes. Actual valuations consider growth, retention, margins, market, comparables and more, and should be done by a qualified professional.",
      },
      {
        q: "What drives the multiple?",
        a: "Growth rate and durable retention are the biggest drivers, alongside gross margin, Rule of 40, market size and prevailing market conditions. The same ARR can command very different multiples.",
      },
    ],
    related: ["arr", "rule-of-40", "nrr"],
    sources: [S.forEntrepreneurs, S.hubifi],
  },
];

// ---------------------------------------------------------------------------
// Lookups & helpers
// ---------------------------------------------------------------------------
export const METRIC_SLUGS = METRICS.map((m) => m.slug);

export function getMetric(slug: string): Metric | undefined {
  return METRICS.find((m) => m.slug === slug);
}

export function getRelated(metric: Metric): Metric[] {
  return metric.related
    .map((slug) => getMetric(slug))
    .filter((m): m is Metric => Boolean(m));
}

export const CATEGORIES: MetricCategory[] = [
  "Unit economics",
  "Growth",
  "Retention",
  "Efficiency",
  "Cash",
];

export function metricsByCategory(): Record<MetricCategory, Metric[]> {
  const out = {} as Record<MetricCategory, Metric[]>;
  for (const cat of CATEGORIES) {
    out[cat] = METRICS.filter((m) => m.category === cat);
  }
  return out;
}

export function defaultValues(metric: Metric): Record<string, number> {
  return Object.fromEntries(metric.inputs.map((i) => [i.id, i.default]));
}
