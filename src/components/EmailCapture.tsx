"use client";

import { useState } from "react";
import { EVENTS, track } from "@/lib/analytics";

type State = "idle" | "loading" | "done" | "error";

export function EmailCapture({
  source = "site",
  tag,
  heading = "Get the free SaaS Metrics Cheat Sheet",
  description = "One page, every formula and benchmark on this site. Plus occasional, no-spam updates when we ship new tools.",
  compact = false,
}: {
  source?: string;
  tag?: string;
  heading?: string;
  description?: string;
  compact?: boolean;
}) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<State>("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setState("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source, tag }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setState("done");
        setMessage(data.message || "You're on the list — check your inbox.");
        track(EVENTS.emailSubmit, { source });
      } else {
        setState("error");
        setMessage(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      setState("error");
      setMessage("Network error. Please try again.");
    }
  }

  if (state === "done") {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-800">
        <p className="font-semibold">Thanks! 🎉</p>
        <p className="mt-1 text-sm">{message}</p>
      </div>
    );
  }

  return (
    <div
      className={
        compact
          ? ""
          : "rounded-2xl border border-brand-100 bg-brand-50 p-6 sm:p-8"
      }
    >
      {!compact && (
        <>
          <h3 className="text-lg font-semibold text-ink">{heading}</h3>
          <p className="mt-1 text-sm text-ink-soft">{description}</p>
        </>
      )}
      <form onSubmit={onSubmit} className="mt-4 flex flex-col gap-2 sm:flex-row">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@company.com"
          aria-label="Email address"
          className="w-full flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-ink shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
        />
        <button
          type="submit"
          disabled={state === "loading"}
          className="rounded-lg bg-brand-600 px-5 py-2.5 font-semibold text-white transition hover:bg-brand-700 disabled:opacity-60"
        >
          {state === "loading" ? "Sending…" : "Get it free"}
        </button>
      </form>
      {state === "error" && (
        <p className="mt-2 text-sm text-rose-600">{message}</p>
      )}
      <p className="mt-2 text-xs text-ink-muted">
        No spam. Unsubscribe anytime.
      </p>
    </div>
  );
}
