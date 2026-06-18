"use client";

import { useId } from "react";
import type { InputDef } from "@/lib/metrics";

const PREFIX: Record<string, string> = { currency: "$" };
const SUFFIX: Record<string, string> = {
  percent: "%",
  months: "mo",
};

export function NumberField({
  def,
  value,
  onChange,
}: {
  def: InputDef;
  value: number;
  onChange: (v: number) => void;
}) {
  const id = useId();
  const prefix = PREFIX[def.unit];
  const suffix = SUFFIX[def.unit];

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-ink-soft">
        {def.label}
      </label>
      <div className="relative mt-1.5">
        {prefix && (
          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-ink-muted">
            {prefix}
          </span>
        )}
        <input
          id={id}
          type="number"
          inputMode="decimal"
          value={Number.isFinite(value) ? value : ""}
          min={def.min}
          step={def.step ?? "any"}
          onChange={(e) => {
            const next = e.target.value === "" ? 0 : parseFloat(e.target.value);
            onChange(Number.isNaN(next) ? 0 : next);
          }}
          className={`w-full rounded-lg border border-slate-300 bg-white py-2.5 text-ink shadow-sm transition focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200 ${
            prefix ? "pl-7" : "pl-3"
          } ${suffix ? "pr-12" : "pr-3"}`}
        />
        {suffix && (
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-ink-muted">
            {suffix}
          </span>
        )}
      </div>
      {def.help && <p className="mt-1 text-xs text-ink-muted">{def.help}</p>}
    </div>
  );
}
