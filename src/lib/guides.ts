export type Block =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "callout"; text: string };

export type Guide = {
  slug: string;
  title: string;
  metaTitle: string;
  description: string;
  updated: string; // ISO date
  readingMinutes: number;
  takeaways: string[];
  body: Block[];
  relatedCalculators: string[];
};

export const GUIDES: Guide[] = [
  {
    slug: "saas-metrics-that-matter",
    title: "The SaaS metrics that actually matter at each stage",
    metaTitle:
      "SaaS Metrics That Matter by Stage (Pre-seed to Scale) | SaaSGauge",
    description:
      "A no-fluff guide to which SaaS metrics matter at each stage — from pre-seed activation to scale-stage Rule of 40 — and which ones to ignore for now.",
    updated: "2026-06-01",
    readingMinutes: 7,
    takeaways: [
      "Track fewer metrics, but the right ones for your stage.",
      "Pre-product/market-fit: retention and activation beat growth-rate vanity.",
      "Post-fit: unit economics (LTV:CAC, payback) decide if you can scale spend.",
      "At scale: efficiency metrics (Rule of 40, magic number, NRR) drive valuation.",
    ],
    body: [
      {
        type: "p",
        text: "Most SaaS dashboards track too many metrics, which means nobody acts on any of them. The cure isn't a bigger dashboard — it's matching a small set of metrics to your stage. Here's a practical map.",
      },
      { type: "h2", text: "Pre-product/market-fit: retention and activation" },
      {
        type: "p",
        text: "Before you have product/market fit, growth rate is noise — you can manufacture signups with effort and discounts. What you can't fake is whether people keep using and paying. Focus on activation (the share of new users who reach first value) and retention (do cohorts flatten out instead of decaying to zero?).",
      },
      {
        type: "ul",
        items: [
          "Cohort retention curves — do they flatten, or trend to zero?",
          "Activation rate — % of new signups who hit a meaningful first-value milestone.",
          "Logo and revenue churn — your earliest read on durability.",
        ],
      },
      {
        type: "callout",
        text: "If retention curves decay to zero, no amount of acquisition will save you. Fix retention before spending on growth.",
      },
      { type: "h2", text: "Post-fit: unit economics" },
      {
        type: "p",
        text: "Once cohorts retain, the question becomes: can you profitably buy more customers? This is where unit economics decide everything. The two numbers that matter most are the LTV:CAC ratio and CAC payback period.",
      },
      {
        type: "ul",
        items: [
          "LTV:CAC ≥ 3:1 suggests you can pour fuel on the fire.",
          "CAC payback < 12 months keeps growth from starving you of cash.",
          "Gross margin ≥ 70% confirms you actually keep enough of each dollar.",
        ],
      },
      { type: "h2", text: "At scale: efficiency and durability" },
      {
        type: "p",
        text: "Past roughly $5–10M ARR, investors and acquirers grade you on efficiency and durability. Growth alone isn't enough; growth that compounds with healthy economics is what earns a premium.",
      },
      {
        type: "ul",
        items: [
          "Rule of 40 — growth rate + profit margin ≥ 40%.",
          "Net revenue retention — 110%+ means the base grows itself.",
          "SaaS magic number — is each S&M dollar still efficient as you scale?",
        ],
      },
      {
        type: "p",
        text: "The throughline: each stage has two or three metrics that genuinely change your decisions. Track those obsessively and let the rest be diagnostics you check occasionally.",
      },
    ],
    relatedCalculators: ["ltv-cac", "cac-payback", "nrr", "rule-of-40"],
  },
  {
    slug: "improve-ltv-cac",
    title: "How to improve your LTV:CAC ratio (without just cutting ad spend)",
    metaTitle: "How to Improve LTV:CAC Ratio — 7 Levers | SaaSGauge",
    description:
      "Seven concrete levers to improve your LTV:CAC ratio — retention, pricing, expansion, channel mix and more — with the math behind each.",
    updated: "2026-06-01",
    readingMinutes: 6,
    takeaways: [
      "LTV and CAC are both movable — don't only attack CAC.",
      "Retention is usually the highest-leverage input to LTV.",
      "Raising prices and adding expansion revenue lift LTV fast.",
      "Channel mix and conversion rate move CAC more than bidding tactics.",
    ],
    body: [
      {
        type: "p",
        text: "LTV:CAC is a ratio, so you can improve it from both sides. Founders reflexively cut acquisition spend, but the biggest gains usually come from the LTV numerator — and they compound.",
      },
      { type: "h2", text: "Lever 1 — Cut churn (the biggest LTV multiplier)" },
      {
        type: "p",
        text: "Because average lifetime is roughly 1 ÷ churn, halving monthly churn roughly doubles LTV. Improving onboarding, closing the gap to first value, and proactively saving at-risk accounts move this more than any pricing trick.",
      },
      { type: "h2", text: "Lever 2 — Raise prices (or stop under-charging)" },
      {
        type: "p",
        text: "A price increase flows almost entirely to gross profit, lifting LTV one-for-one. Grandfather existing customers if needed, but most SaaS companies are under-priced relative to the value they deliver.",
      },
      { type: "h2", text: "Lever 3 — Add expansion revenue" },
      {
        type: "p",
        text: "Seats, usage tiers and add-ons let revenue per account grow over time. Strong expansion can push net revenue retention above 100%, which dramatically increases the true LTV of a cohort.",
      },
      { type: "h2", text: "Lever 4 — Improve gross margin" },
      {
        type: "p",
        text: "LTV uses gross profit, not revenue. Trimming infrastructure waste, automating support, and renegotiating third-party costs all raise the margin that flows into LTV.",
      },
      { type: "h2", text: "Lever 5 — Shift channel mix toward efficient channels" },
      {
        type: "p",
        text: "Organic, referral and content-driven channels typically carry far lower CAC than paid. Re-weighting acquisition toward them lowers blended CAC without cutting growth.",
      },
      { type: "h2", text: "Lever 6 — Raise conversion rates" },
      {
        type: "p",
        text: "Every percentage point of funnel conversion lowers CAC for the same spend. Landing-page clarity, faster time-to-value in trials, and tighter qualification all help.",
      },
      { type: "h2", text: "Lever 7 — Target better-fit customers" },
      {
        type: "p",
        text: "Customers who fit your ICP churn less and expand more — so they have higher LTV and often lower CAC. Sharpening targeting improves both sides of the ratio at once.",
      },
      {
        type: "callout",
        text: "Run your current numbers through the LTV:CAC calculator, then change one input at a time to see which lever moves your ratio the most.",
      },
    ],
    relatedCalculators: ["ltv-cac", "ltv", "cac", "churn-rate"],
  },
  {
    slug: "shorten-cac-payback",
    title: "How to shorten your CAC payback period",
    metaTitle: "How to Shorten CAC Payback Period — Practical Tactics | SaaSGauge",
    description:
      "Why a long CAC payback strangles cash, and the concrete levers — pricing, annual plans, margin, funnel efficiency — that bring it under 12 months.",
    updated: "2026-06-01",
    readingMinutes: 5,
    takeaways: [
      "Payback is a cash metric — long payback ties up capital per customer.",
      "Annual prepaid plans collapse payback immediately.",
      "Higher ARPA and gross margin both shorten payback directly.",
      "Cheaper, higher-converting acquisition lowers the CAC numerator.",
    ],
    body: [
      {
        type: "p",
        text: "CAC payback is how many months of gross profit it takes to earn back acquisition cost. It's a cash-flow metric: the longer it is, the more capital you tie up funding each new customer, and the more you must raise to grow.",
      },
      { type: "h2", text: "1. Sell annual, prepaid plans" },
      {
        type: "p",
        text: "Collecting a year of revenue upfront is the single fastest way to shorten payback in cash terms — you recover CAC on day one instead of over many months. Incentivise annual billing with a discount that's cheaper than the cost of capital you'd otherwise raise.",
      },
      { type: "h2", text: "2. Raise ARPA" },
      {
        type: "p",
        text: "Payback = CAC ÷ (ARPA × gross margin). Higher revenue per account shrinks the denominator's drag directly. Pricing changes, packaging that drives upgrades, and moving up-market all help.",
      },
      { type: "h2", text: "3. Improve gross margin" },
      {
        type: "p",
        text: "Because payback uses gross profit, every point of margin shortens it. Optimise infrastructure spend and reduce support cost per account.",
      },
      { type: "h2", text: "4. Lower CAC" },
      {
        type: "p",
        text: "Improve funnel conversion, lean on lower-cost organic and referral channels, and tighten targeting so you spend less to win each customer.",
      },
      {
        type: "callout",
        text: "Aim for under 12 months; under 6 is best-in-class. Use the CAC payback calculator to test how annual billing or a price increase changes your number.",
      },
    ],
    relatedCalculators: ["cac-payback", "cac", "gross-margin", "runway"],
  },
  {
    slug: "reduce-saas-churn",
    title: "How to reduce SaaS churn (and lift retention)",
    metaTitle: "How to Reduce SaaS Churn — Retention Playbook | SaaSGauge",
    description:
      "A practical playbook to reduce SaaS churn: fix onboarding, monitor health scores, win back at-risk accounts, and turn retention into net revenue growth.",
    updated: "2026-06-01",
    readingMinutes: 6,
    takeaways: [
      "Churn compounds — small monthly improvements pay off enormously.",
      "Most churn is decided in onboarding, before value is felt.",
      "Track gross and net retention separately to avoid hiding leaks.",
      "Expansion can turn retention from a defence into a growth engine.",
    ],
    body: [
      {
        type: "p",
        text: "Churn is the silent killer of SaaS growth because it compounds. Cutting monthly churn from 4% to 2% can double a customer's expected lifetime and, with it, lifetime value. Here's where to focus.",
      },
      { type: "h2", text: "Fix onboarding first" },
      {
        type: "p",
        text: "Most churn is decided in the first weeks, before a customer ever feels the product's value. Define a clear 'first value' milestone, then ruthlessly shorten the path to it: guided setup, sensible defaults, templates and check-ins all reduce early churn.",
      },
      { type: "h2", text: "Watch the right retention numbers" },
      {
        type: "p",
        text: "Track gross revenue retention and net revenue retention separately. A healthy NRR built on a weak GRR means upsells are masking a churn problem — investigate the gap rather than celebrating the headline.",
      },
      { type: "h2", text: "Build customer health signals" },
      {
        type: "ul",
        items: [
          "Usage trends — declining logins or feature use predict churn.",
          "Support sentiment and ticket volume.",
          "Billing failures — involuntary churn is often 20–40% of total churn and is recoverable with dunning.",
        ],
      },
      { type: "h2", text: "Recover involuntary churn" },
      {
        type: "p",
        text: "A surprising share of churn is failed payments, not unhappy customers. Smart dunning — retries, card-update prompts, grace periods — recovers revenue you've already earned at near-zero cost.",
      },
      { type: "h2", text: "Turn retention into growth" },
      {
        type: "p",
        text: "The best retention motion doesn't just prevent losses — it expands accounts. Usage-based tiers, seat growth and add-ons can push net revenue retention above 100%, so your existing base grows even before you add a single new logo.",
      },
      {
        type: "callout",
        text: "Measure where you stand with the churn rate, GRR and NRR calculators, then re-check monthly as you ship retention improvements.",
      },
    ],
    relatedCalculators: ["churn-rate", "grr", "nrr", "ltv"],
  },
  {
    slug: "nrr-vs-grr",
    title: "NRR vs GRR: what each retention metric actually tells you",
    metaTitle: "NRR vs GRR — The Difference (and Why Both Matter) | SaaSGauge",
    description:
      "NRR vs GRR explained: net revenue retention includes expansion and can exceed 100%; gross revenue retention can't. Why investors increasingly ask for both.",
    updated: "2026-06-01",
    readingMinutes: 5,
    takeaways: [
      "NRR includes expansion and can exceed 100%; GRR can't go above 100%.",
      "GRR is the honest floor: the revenue you keep before any upsell.",
      "A high NRR on a weak GRR is fragile — upsells masking churn.",
      "Report both; investors increasingly ask for GRR specifically.",
    ],
    body: [
      {
        type: "p",
        text: "Net and gross revenue retention sound similar but answer different questions. Confusing them is one of the most common metrics mistakes in board decks.",
      },
      { type: "h2", text: "The definitions" },
      {
        type: "ul",
        items: [
          "NRR = (Starting MRR + expansion − contraction − churn) ÷ starting MRR. Includes expansion, so it can exceed 100%.",
          "GRR = (Starting MRR − contraction − churn) ÷ starting MRR. Excludes expansion, so it is capped at 100%.",
          "Both look only at existing customers, excluding new logos.",
        ],
      },
      { type: "h2", text: "Why GRR is the honest floor" },
      {
        type: "p",
        text: "Because GRR can't be rescued by upsells, it's the truest measure of churn-and-contraction. If your NRR is 115% but your GRR is 75%, expansion is papering over a serious leak. The day expansion slows, that leak surfaces.",
      },
      { type: "h2", text: "What good looks like" },
      {
        type: "ul",
        items: [
          "GRR: 90%+ is best-in-class (common in enterprise); 80–90% is healthy.",
          "NRR: above 100% is good; 110–120%+ is best-in-class.",
          "Watch the gap: a wide NRR–GRR gap means growth depends on upsell, not durability.",
        ],
      },
      {
        type: "callout",
        text: "Report both. Run your numbers through the NRR and GRR calculators and track the gap between them over time.",
      },
    ],
    relatedCalculators: ["nrr", "grr", "churn-rate", "mrr"],
  },
  {
    slug: "healthy-burn-and-runway",
    title: "How much burn and runway is healthy?",
    metaTitle: "Healthy Burn Rate & Runway — How Much Is Right? | SaaSGauge",
    description:
      "How much burn and runway is healthy for a startup: the 18-month rule, when to start raising, and why the burn multiple matters more than absolute burn.",
    updated: "2026-06-01",
    readingMinutes: 5,
    takeaways: [
      "Aim for 18+ months of runway after a raise; start raising with 6–9 left.",
      "Net burn (not gross) drives runway — it's cash out minus cash in.",
      "Efficiency matters more than absolute burn: watch the burn multiple.",
      "In tougher markets, push the comfortable runway target toward 24 months.",
    ],
    body: [
      {
        type: "p",
        text: "There's no single 'right' burn — it depends on stage, growth and market. But there are well-worn guardrails worth knowing.",
      },
      { type: "h2", text: "Runway: the survival number" },
      {
        type: "p",
        text: "Runway is cash on hand divided by net monthly burn. The common rule of thumb is to hold 18+ months after a raise and to start the next raise with 6–9 months left, because raising typically takes 3–6 months. In tougher funding markets, stretch the comfortable target toward 24 months.",
      },
      { type: "h2", text: "Gross vs. net burn" },
      {
        type: "p",
        text: "Gross burn is total monthly cash out; net burn subtracts cash coming in. Runway is driven by net burn. If you're collecting meaningful revenue, your net burn — and therefore your runway — can be far better than gross burn implies.",
      },
      { type: "h2", text: "Efficiency beats absolute burn" },
      {
        type: "p",
        text: "Investors increasingly care less about how much you burn and more about what that burn buys. The burn multiple (net burn ÷ net new ARR) captures this: under 1.0 is exceptional, under 1.5 is great, over 2.0 is a flag. Two companies can burn the same amount; the one adding more ARR per dollar wins.",
      },
      {
        type: "callout",
        text: "Check your runway, net burn and burn multiple together — they tell a fuller story than any one alone.",
      },
    ],
    relatedCalculators: ["runway", "burn-rate", "burn-multiple", "rule-of-40"],
  },
];

export const getGuide = (slug: string): Guide | undefined =>
  GUIDES.find((g) => g.slug === slug);
