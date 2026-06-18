export type Unit =
  | "currency"
  | "percent"
  | "ratio"
  | "number"
  | "months"
  | "count";

export function formatCurrency(value: number): string {
  if (!isFinite(value)) return "—";
  const abs = Math.abs(value);
  const opts: Intl.NumberFormatOptions = {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: abs >= 100 ? 0 : 2,
  };
  return new Intl.NumberFormat("en-US", opts).format(value);
}

export function formatPercent(value: number, digits = 1): string {
  if (!isFinite(value)) return "—";
  return `${value.toFixed(digits)}%`;
}

export function formatRatio(value: number): string {
  if (!isFinite(value)) return "—";
  return `${value.toFixed(2)} : 1`;
}

export function formatNumber(value: number, digits = 0): string {
  if (!isFinite(value)) return "—";
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: digits,
  }).format(value);
}

export function formatMonths(value: number): string {
  if (!isFinite(value)) return "—";
  const rounded = Math.round(value * 10) / 10;
  return `${rounded} ${rounded === 1 ? "month" : "months"}`;
}

export function formatValue(value: number, unit: Unit): string {
  switch (unit) {
    case "currency":
      return formatCurrency(value);
    case "percent":
      return formatPercent(value);
    case "ratio":
      return formatRatio(value);
    case "months":
      return formatMonths(value);
    case "count":
    case "number":
    default:
      return formatNumber(value, value % 1 === 0 ? 0 : 2);
  }
}
