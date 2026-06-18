# SaaS Metrics Model — formula reference

Use this with `saas-metrics-model.csv`. Import the CSV into Google Sheets
(File → Import) or Excel, then replace the example "COMPUTED" rows with the live
formulas below so they update as you change inputs. Assumes month columns start
at **B** (Jan) on the row of the metric.

## MRR movements → outputs
Let `Start`, `New`, `Exp`, `Contr`, `Churn` be the input rows for a month column.

| Output | Formula (spreadsheet) |
|---|---|
| Net new MRR | `=New + Exp - Contr - Churn` |
| Ending MRR | `=Start + (New + Exp - Contr - Churn)` |
| ARR | `=EndingMRR * 12` |
| MRR growth % | `=(New + Exp - Contr - Churn) / Start` |
| Quick ratio | `=(New + Exp) / (Contr + Churn)` |
| NRR % | `=(Start + Exp - Contr - Churn) / Start` |
| GRR % | `=(Start - Contr - Churn) / Start` |

> Carry next month's `Start` = this month's `Ending MRR` (e.g. `C3 = B_ending`).

## Unit economics
| Output | Formula |
|---|---|
| LTV | `=(ARPA * GrossMargin%) / MonthlyChurn%` |
| LTV:CAC | `=LTV / CAC` |
| CAC payback (months) | `=CAC / (ARPA * GrossMargin%)` |
| Avg customer lifetime (months) | `=1 / MonthlyChurn%` |

## Efficiency
| Output | Formula |
|---|---|
| Rule of 40 | `=RevenueGrowth% + ProfitMargin%` |
| SaaS magic number | `=((CurrentQtrRev - PriorQtrRev) * 4) / PriorQtrS&M` |
| Burn multiple | `=NetBurn / NetNewARR` |
| ARR per employee | `=ARR / FTEs` |

## Cash
| Output | Formula |
|---|---|
| Net burn | `=MonthlyCashOut - MonthlyCashIn` |
| Runway (months) | `=CashOnHand / NetBurn` (∞ if NetBurn ≤ 0) |
| Annualised churn | `=1 - (1 - MonthlyChurn%)^12` |

## Tips
- Keep **inputs** and **computed** clearly separated (shade input cells).
- Use gross profit, not revenue, for LTV and CAC payback.
- Track **net new MRR** as the single best read of monthly momentum.
- Re-check benchmarks in `benchmark-database.csv` and judge against your segment.

_Educational tooling, not financial advice. Validate with a qualified professional._
