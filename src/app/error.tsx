"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surface for server logs / analytics without exposing details to users.
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <p className="text-sm font-semibold text-brand-700">Something went wrong</p>
      <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-ink">
        That didn&apos;t load as expected
      </h1>
      <p className="mt-3 text-ink-soft">
        Sorry about that. You can try again, or head back to the calculators.
      </p>
      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <button
          type="button"
          onClick={reset}
          className="rounded-lg bg-brand-600 px-6 py-3 font-semibold text-white transition hover:bg-brand-700"
        >
          Try again
        </button>
        <Link
          href="/calculators"
          className="rounded-lg border border-slate-300 bg-white px-6 py-3 font-semibold text-ink-soft transition hover:bg-slate-50"
        >
          All calculators
        </Link>
      </div>
    </div>
  );
}
