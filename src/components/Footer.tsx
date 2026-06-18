import Link from "next/link";
import { FOOTER_NAV, SITE_NAME, SITE_TAGLINE } from "@/lib/site";
import { Logo } from "./Logo";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-24 border-t border-slate-200 bg-slate-50">
      <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-5">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 font-semibold text-ink">
              <Logo />
              <span className="text-lg">{SITE_NAME}</span>
            </Link>
            <p className="mt-3 max-w-xs text-sm text-ink-muted">{SITE_TAGLINE}.</p>
          </div>
          {FOOTER_NAV.map((col) => (
            <div key={col.heading}>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
                {col.heading}
              </h3>
              <ul className="mt-3 space-y-2">
                {col.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm text-ink-soft transition hover:text-brand-700"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-col gap-3 border-t border-slate-200 pt-6 text-xs text-ink-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {SITE_NAME}. Built for founders and operators.
          </p>
          <p className="max-w-xl sm:text-right">
            Educational tools only — not financial, investment, accounting or
            legal advice. See our{" "}
            <Link href="/legal/disclaimer" className="underline hover:text-ink-soft">
              disclaimer
            </Link>
            .
          </p>
        </div>
      </div>
    </footer>
  );
}
