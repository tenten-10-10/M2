"use client";

import { EVENTS, track } from "@/lib/analytics";

export function PrintButton({
  label = "Print / save as PDF",
}: {
  label?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => {
        track(EVENTS.reportPrint, { page: "cheat-sheet" });
        window.print();
      }}
      className="no-print inline-flex items-center gap-2 rounded-lg bg-ink px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-ink-soft"
    >
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2M6 14h12v8H6z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {label}
    </button>
  );
}
