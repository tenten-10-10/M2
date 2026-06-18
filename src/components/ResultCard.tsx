import type { MetricResult } from "@/lib/metrics";
import { STATUS_STYLES } from "./statusStyles";

export function ResultCard({ result }: { result: MetricResult }) {
  const s = STATUS_STYLES[result.status];
  return (
    <div className={`rounded-2xl bg-white p-6 shadow-card ring-1 ${s.ring}`}>
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-ink-muted">{result.label}</p>
        {result.status !== "neutral" && (
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${s.badge}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
            {s.label}
          </span>
        )}
      </div>
      <p className={`mt-2 text-4xl font-bold tracking-tight ${s.text}`}>
        {result.display}
      </p>
      <p className="mt-3 text-sm leading-relaxed text-ink-soft">{result.verdict}</p>

      {result.extra && result.extra.length > 0 && (
        <dl className="mt-5 grid grid-cols-1 gap-3 border-t border-slate-100 pt-4 sm:grid-cols-2">
          {result.extra.map((e) => (
            <div key={e.label} className="flex items-baseline justify-between gap-2">
              <dt className="text-sm text-ink-muted">{e.label}</dt>
              <dd className="text-sm font-semibold text-ink">{e.display}</dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}
