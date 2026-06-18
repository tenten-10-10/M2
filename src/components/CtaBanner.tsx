import Link from "next/link";

export function CtaBanner({
  title,
  text,
  href,
  cta,
}: {
  title: string;
  text: string;
  href: string;
  cta: string;
}) {
  return (
    <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-brand-700 to-brand-900 p-8 text-white sm:p-10">
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="max-w-xl">
          <h2 className="text-xl font-bold sm:text-2xl">{title}</h2>
          <p className="mt-2 text-sm text-brand-100">{text}</p>
        </div>
        <Link
          href={href}
          className="shrink-0 rounded-lg bg-white px-5 py-3 font-semibold text-brand-800 transition hover:bg-brand-50"
        >
          {cta}
        </Link>
      </div>
    </div>
  );
}
