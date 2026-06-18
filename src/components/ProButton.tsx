"use client";

import { EVENTS, track } from "@/lib/analytics";

export function ProButton({
  href,
  label = "Get the Pro Pack",
}: {
  href: string;
  label?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => track(EVENTS.proClick)}
      className="inline-block w-full rounded-lg bg-brand-600 px-6 py-3 text-center font-semibold text-white transition hover:bg-brand-700"
    >
      {label}
    </a>
  );
}
