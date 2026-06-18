"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { defaultValues, getMetric } from "@/lib/metrics";
import { EVENTS, track } from "@/lib/analytics";
import { NumberField } from "./NumberField";
import { ResultCard } from "./ResultCard";

export function Calculator({ slug }: { slug: string }) {
  const metric = getMetric(slug);

  const [values, setValues] = useState<Record<string, number>>(
    metric ? defaultValues(metric) : {},
  );
  const [copied, setCopied] = useState(false);
  const tracked = useRef(false);

  // After mount (client only), apply any numeric values from the URL so links
  // are shareable. Done in an effect to avoid SSR/hydration mismatches and to
  // keep the calculator fully server-rendered for crawlers.
  useEffect(() => {
    if (!metric) return;
    const params = new URLSearchParams(window.location.search);
    const overrides: Record<string, number> = {};
    for (const def of metric.inputs) {
      const raw = params.get(def.id);
      if (raw !== null && raw !== "") {
        const n = parseFloat(raw);
        if (!Number.isNaN(n)) overrides[def.id] = n;
      }
    }
    if (Object.keys(overrides).length > 0) {
      setValues((prev) => ({ ...prev, ...overrides }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const result = useMemo(
    () => (metric ? metric.compute(values) : null),
    [metric, values],
  );

  if (!metric || !result) return null;

  const update = (id: string, v: number) => {
    if (!tracked.current) {
      tracked.current = true;
      track(EVENTS.calcUsed, { calculator: slug });
    }
    setValues((prev) => ({ ...prev, [id]: v }));
  };

  const copyLink = async () => {
    const params = new URLSearchParams();
    for (const def of metric.inputs) params.set(def.id, String(values[def.id]));
    const url = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
    track(EVENTS.shareClick, { calculator: slug });
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="text-base font-semibold text-ink">Your numbers</h2>
        <div className="mt-4 space-y-4">
          {metric.inputs.map((def) => (
            <NumberField
              key={def.id}
              def={def}
              value={values[def.id]}
              onChange={(v) => update(def.id, v)}
            />
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between gap-3">
          <p className="text-xs text-ink-muted">
            Runs in your browser. Nothing is sent anywhere.
          </p>
          <button
            type="button"
            onClick={copyLink}
            className="shrink-0 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-ink-soft transition hover:bg-slate-50"
          >
            {copied ? "Link copied!" : "Copy shareable link"}
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <ResultCard result={result} />

        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-ink">Benchmarks</h3>
          <ul className="mt-3 divide-y divide-slate-100">
            {metric.benchmarks.map((b) => (
              <li
                key={b.label}
                className="flex items-center justify-between py-2 text-sm"
              >
                <span className="text-ink-soft">{b.label}</span>
                <span className="font-medium text-ink">{b.range}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs leading-relaxed text-ink-muted">
            {metric.benchmarkNote}
          </p>
        </div>
      </div>
    </div>
  );
}
