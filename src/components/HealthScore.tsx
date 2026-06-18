"use client";

import { useMemo, useRef, useState } from "react";
import { EVENTS, track } from "@/lib/analytics";
import {
  HS_INPUTS,
  computeHealthScore,
  topPriorities,
} from "@/lib/healthScore";
import { STATUS_STYLES } from "./statusStyles";
import { EmailCapture } from "./EmailCapture";
import { NumberField } from "./NumberField";

export function HealthScore() {
  const [values, setValues] = useState<Record<string, number>>(
    Object.fromEntries(HS_INPUTS.map((i) => [i.id, i.default])),
  );
  const tracked = useRef(false);
  const { total, grade, gradeStatus, areas } = useMemo(
    () => computeHealthScore(values),
    [values],
  );

  const update = (id: string, val: number) => {
    if (!tracked.current) {
      tracked.current = true;
      track(EVENTS.healthScoreRun);
    }
    setValues((prev) => ({ ...prev, [id]: val }));
  };

  const priorities = topPriorities(areas, 2);

  const ringStyle = STATUS_STYLES[gradeStatus];
  const circumference = 2 * Math.PI * 52;
  const offset = circumference * (1 - total / 100);

  return (
    <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
      {/* Inputs (hidden when printing) */}
      <div className="no-print rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="text-base font-semibold text-ink">Your metrics</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1">
          {HS_INPUTS.map((def) => (
            <NumberField
              key={def.id}
              def={def}
              value={values[def.id]}
              onChange={(v) => update(def.id, v)}
            />
          ))}
        </div>
        <p className="mt-4 text-xs text-ink-muted">
          Everything is calculated locally in your browser. We never see your
          numbers.
        </p>
      </div>

      {/* Report */}
      <div id="health-report" className="space-y-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center">
            <div className="relative h-32 w-32 shrink-0">
              <svg className="h-32 w-32 -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="52" fill="none" stroke="#e2e8f0" strokeWidth="12" />
                <circle
                  cx="60"
                  cy="60"
                  r="52"
                  fill="none"
                  strokeWidth="12"
                  strokeLinecap="round"
                  className={ringStyle.text}
                  stroke="currentColor"
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-ink">{total}</span>
                <span className="text-xs text-ink-muted">/ 100</span>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-ink-muted">
                Your SaaS Health Score
              </p>
              <p className={`text-4xl font-bold ${ringStyle.text}`}>
                Grade {grade}
              </p>
              <p className="mt-1 max-w-md text-sm text-ink-soft">
                A weighted read across unit economics, retention, efficiency and
                cash. Adjust your inputs to see the score update live.
              </p>
            </div>
          </div>
        </div>

        {/* Sub-scores */}
        <div className="grid gap-3 sm:grid-cols-2">
          {areas.map((a) => {
            const s = STATUS_STYLES[a.status];
            return (
              <div key={a.key} className={`rounded-xl bg-white p-4 ring-1 ${s.ring}`}>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-ink-soft">{a.name}</p>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${s.badge}`}>
                    {s.label}
                  </span>
                </div>
                <p className={`mt-1 text-2xl font-bold ${s.text}`}>{a.display}</p>
                <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-full rounded-full ${s.dot}`}
                    style={{ width: `${(a.score / a.max) * 100}%` }}
                  />
                </div>
                <p className="mt-1 text-right text-xs text-ink-muted">
                  {Math.round(a.score)} / {a.max} pts
                </p>
              </div>
            );
          })}
        </div>

        {/* Priorities */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h3 className="text-base font-semibold text-ink">
            Top priorities to raise your score
          </h3>
          <ol className="mt-3 space-y-3">
            {priorities.map((p, i) => (
              <li key={p.key} className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700">
                  {i + 1}
                </span>
                <div>
                  <p className="text-sm font-semibold text-ink">{p.name}</p>
                  <p className="text-sm text-ink-soft">{p.recommendation}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="no-print flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              track(EVENTS.reportPrint);
              window.print();
            }}
            className="inline-flex items-center gap-2 rounded-lg bg-ink px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-ink-soft"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2M6 14h12v8H6z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Save / print report (PDF)
          </button>
        </div>

        <div className="no-print">
          <EmailCapture
            source="health-score"
            tag="health-score"
            heading="Want this as a board-ready PDF + the full benchmark model?"
            description="Get the free SaaS Metrics Cheat Sheet now, and be first to know when the Pro report pack drops."
          />
        </div>
      </div>
    </div>
  );
}
