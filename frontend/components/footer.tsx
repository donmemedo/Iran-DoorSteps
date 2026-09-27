import Link from "next/link";
import { Logo } from "./logo";
import type { Dict, Locale } from "@/lib/i18n";

export function Footer({ locale, t }: { locale: Locale; t: Dict }) {
  const cols = [
    { title: t.footer.product, links: [
      { href: `/${locale}/properties`, label: t.nav.properties },
      { href: `/${locale}/swipe`, label: t.nav.swipe },
      { href: `/${locale}/journey`, label: t.nav.journey },
    ]},
    { title: t.nav.pros, links: [
      { href: `/${locale}/pros`, label: t.pros.title },
      { href: `/${locale}/tips`, label: t.tips.title },
      { href: `/${locale}/favorites`, label: t.nav.favorites },
    ]},
    { title: t.footer.legal, links: [
      { href: `/${locale}`, label: t.footer.privacy },
      { href: `/${locale}`, label: t.footer.terms },
      { href: `/${locale}`, label: t.footer.support },
    ]},
  ];

  return (
    <footer className="relative mt-24 border-t border-line bg-bg2/60">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2.5 font-display text-xl font-extrabold">
            <Logo />
            {t.brand}
          </div>
          <p className="mt-4 max-w-xs text-sm leading-7 text-muted">{t.tagline}</p>
        </div>
        {cols.map((c) => (
          <div key={c.title}>
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted">{c.title}</h3>
            <ul className="mt-4 space-y-2.5">
              {c.links.map((l, i) => (
                <li key={`${l.href}-${i}`}>
                  <Link href={l.href} className="text-sm text-ink/80 transition hover:text-brand">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-line px-5 py-5 text-center text-xs text-muted">
        © {new Date().getFullYear()} {t.brand} — {t.footer.rights}
      </div>
    </footer>
  );
}
