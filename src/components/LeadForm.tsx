"use client";

import { useState } from "react";
import { EVENTS, track } from "@/lib/analytics";

type State = "idle" | "loading" | "done" | "error";

const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-ink shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200";

export function LeadForm() {
  const [state, setState] = useState<State>("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload = Object.fromEntries(fd.entries());
    setState("loading");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setState("done");
        setMessage(data.message || "Thanks — we'll be in touch shortly.");
        track(EVENTS.leadSubmit, { kind: "metrics_review" });
        form.reset();
      } else {
        setState("error");
        setMessage(data.error || "Something went wrong. Please email us instead.");
      }
    } catch {
      setState("error");
      setMessage("Network error. Please email us instead.");
    }
  }

  if (state === "done") {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-emerald-800">
        <p className="font-semibold">Request received ✅</p>
        <p className="mt-1 text-sm">{message}</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-ink-soft" htmlFor="lf-name">
            Name
          </label>
          <input id="lf-name" name="name" required className={`mt-1.5 ${inputClass}`} />
        </div>
        <div>
          <label className="block text-sm font-medium text-ink-soft" htmlFor="lf-email">
            Work email
          </label>
          <input id="lf-email" name="email" type="email" required className={`mt-1.5 ${inputClass}`} />
        </div>
        <div>
          <label className="block text-sm font-medium text-ink-soft" htmlFor="lf-company">
            Company
          </label>
          <input id="lf-company" name="company" className={`mt-1.5 ${inputClass}`} />
        </div>
        <div>
          <label className="block text-sm font-medium text-ink-soft" htmlFor="lf-arr">
            Approx. ARR
          </label>
          <input id="lf-arr" name="arr" placeholder="e.g. $2M" className={`mt-1.5 ${inputClass}`} />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-ink-soft" htmlFor="lf-message">
          What would you like a second opinion on?
        </label>
        <textarea
          id="lf-message"
          name="message"
          rows={4}
          className={`mt-1.5 ${inputClass}`}
          placeholder="e.g. Our CAC payback crept past 18 months and we're planning a raise…"
        />
      </div>
      {/* Honeypot for bots */}
      <input
        type="text"
        name="company_website"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />
      <button
        type="submit"
        disabled={state === "loading"}
        className="rounded-lg bg-brand-600 px-6 py-3 font-semibold text-white transition hover:bg-brand-700 disabled:opacity-60"
      >
        {state === "loading" ? "Sending…" : "Request a metrics review"}
      </button>
      {state === "error" && <p className="text-sm text-rose-600">{message}</p>}
    </form>
  );
}
