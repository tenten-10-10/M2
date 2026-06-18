export type GlossaryTerm = {
  term: string;
  abbr?: string;
  definition: string;
  calculatorSlug?: string;
};

export const GLOSSARY: GlossaryTerm[] = [
  {
    term: "Annual Recurring Revenue",
    abbr: "ARR",
    definition:
      "The annualised value of your recurring subscription revenue — usually MRR × 12. The headline scale metric for subscription SaaS.",
    calculatorSlug: "arr",
  },
  {
    term: "Monthly Recurring Revenue",
    abbr: "MRR",
    definition:
      "The normalised, predictable subscription revenue earned each month, excluding one-time fees. Best understood through its movements: new, expansion, contraction and churned.",
    calculatorSlug: "mrr",
  },
  {
    term: "Customer Acquisition Cost",
    abbr: "CAC",
    definition:
      "Fully-loaded sales and marketing spend divided by the number of new customers acquired in the same period.",
    calculatorSlug: "cac",
  },
  {
    term: "Customer Lifetime Value",
    abbr: "LTV / CLV",
    definition:
      "The total gross profit a customer generates before churning — typically (ARPA × gross margin) ÷ churn rate.",
    calculatorSlug: "ltv",
  },
  {
    term: "LTV:CAC Ratio",
    definition:
      "Lifetime value divided by acquisition cost. A widely cited target is 3:1 or higher, balancing profitable growth against under-investment.",
    calculatorSlug: "ltv-cac",
  },
  {
    term: "CAC Payback Period",
    definition:
      "The number of months of gross profit needed to recover the cost of acquiring a customer. Under 12 months is the common target.",
    calculatorSlug: "cac-payback",
  },
  {
    term: "Net Revenue Retention",
    abbr: "NRR / NDR",
    definition:
      "How revenue from existing customers changes over a period including expansion but excluding new logos. Above 100% means the base grows on its own.",
    calculatorSlug: "nrr",
  },
  {
    term: "Gross Revenue Retention",
    abbr: "GRR",
    definition:
      "Recurring revenue retained from existing customers excluding expansion. Capped at 100%; the honest measure of churn and contraction.",
    calculatorSlug: "grr",
  },
  {
    term: "Churn Rate",
    definition:
      "The share of customers (logo churn) or revenue (revenue churn) lost in a period. Compounds quickly, so small monthly numbers matter a lot annually.",
    calculatorSlug: "churn-rate",
  },
  {
    term: "Rule of 40",
    definition:
      "A health check that says revenue growth rate plus profit margin should be at least 40%. Most meaningful at scale.",
    calculatorSlug: "rule-of-40",
  },
  {
    term: "Burn Rate",
    definition:
      "Monthly cash consumed. Gross burn is total cash out; net burn subtracts cash in and drives runway.",
    calculatorSlug: "burn-rate",
  },
  {
    term: "Cash Runway",
    definition:
      "How many months you can operate before running out of cash, at the current net burn rate.",
    calculatorSlug: "runway",
  },
  {
    term: "SaaS Magic Number",
    definition:
      "Sales and marketing efficiency: annualised new revenue divided by prior-period S&M spend. Above 1.0 signals room to scale spend.",
    calculatorSlug: "magic-number",
  },
  {
    term: "SaaS Quick Ratio",
    definition:
      "(New + expansion MRR) ÷ (churned + contraction MRR). Measures how efficiently growth survives losses; 4+ is best-in-class.",
    calculatorSlug: "quick-ratio",
  },
  {
    term: "ARPU / ARPA",
    definition:
      "Average revenue per user / per account — total MRR divided by customers. A pulse on pricing and customer mix.",
    calculatorSlug: "arpu",
  },
  {
    term: "Gross Margin",
    definition:
      "Revenue left after cost of revenue (hosting, support, fees). Healthy SaaS runs 70–85%.",
    calculatorSlug: "gross-margin",
  },
  {
    term: "Burn Multiple",
    definition:
      "Net burn divided by net new ARR — how much cash you burn to add a dollar of recurring revenue. Under 1.0 is efficient.",
  },
  {
    term: "T2D3",
    definition:
      "An aspirational venture-scale growth path: triple, triple, double, double, double ARR over five years.",
  },
  {
    term: "ARR per Employee",
    definition:
      "Annual recurring revenue divided by full-time headcount — a quick productivity and capital-efficiency proxy. Typical SaaS runs $150k–$200k+.",
    calculatorSlug: "arr-per-employee",
  },
  {
    term: "Trial Conversion Rate",
    definition:
      "Share of free trials or signups that become paying customers. Varies widely: opt-out trials convert far higher than freemium.",
    calculatorSlug: "trial-conversion",
  },
  {
    term: "DAU/MAU (Stickiness)",
    definition:
      "Daily active users divided by monthly active users — a core engagement signal. ~20% is good; 50%+ is a daily-habit product.",
    calculatorSlug: "dau-mau",
  },
  {
    term: "Average Contract Value",
    abbr: "ACV",
    definition:
      "The annualised recurring value of a contract, excluding one-time fees. Lets you compare deals of different lengths on a yearly basis.",
    calculatorSlug: "acv",
  },
  {
    term: "ARR Multiple",
    definition:
      "A revenue multiple applied to ARR to sketch an illustrative value. Driven by growth and retention; never a substitute for a real valuation.",
    calculatorSlug: "arr-multiple",
  },
];
