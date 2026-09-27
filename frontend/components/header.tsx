"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Heart, Languages, Menu, X } from "lucide-react";

import { Logo } from "./logo";
import { ThemeToggle } from "./theme-toggle";
import type { Dict, Locale } from "@/lib/i18n";

export function Header({ locale, t }: { locale: Locale; t: Dict }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  const other: Locale = locale === "fa" ? "en" : "fa";
  const rest = pathname.split("/").slice(2).join("/");
  const switchHref = `/${other}${rest ? `/${rest}` : ""}`;

  const links = [
    { href: `/${locale}/properties`, label: t.nav.properties },
    { href: `/${locale}/swipe`, label: t.nav.swipe },
    { href: `/${locale}/journey`, label: t.nav.journey },
    { href: `/${locale}/pros`, label: t.nav.pros },
    { href: `/${locale}/tips`, label: t.nav.tips },
  ];

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4">
      <nav
        className={`mx-auto flex max-w-6xl items-center gap-2 rounded-full px-3 py-2 transition-all duration-300 sm:gap-3 sm:px-4 ${
          solid ? "glass shadow-float" : "border border-transparent"
        }`}
      >
        <Link href={`/${locale}`} className="flex items-center gap-2.5 ps-1 font-display text-lg font-extrabold tracking-tight">
          <Logo />
          <span className="hidden sm:inline">{t.brand}</span>
        </Link>

        <ul className="mx-auto hidden items-center gap-1 lg:flex">
          {links.map((l) => {
            const active = pathname.startsWith(l.href);
            return (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={`relative rounded-full px-3.5 py-2 text-sm font-medium transition ${
                    active ? "text-ink" : "text-muted hover:text-ink"
                  }`}
                >
                  {active && (
                    <motion.span layoutId="nav-pill" className="absolute inset-0 rounded-full bg-brandsoft"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }} />
                  )}
                  <span className="relative">{l.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="ms-auto flex items-center gap-1.5 lg:ms-0">
          <Link href={`/${locale}/favorites`} aria-label={t.nav.favorites}
            className="grid size-10 place-items-center rounded-full border border-line bg-surface/70 transition hover:ring-brand">
            <Heart className="size-[18px]" />
          </Link>
          <Link href={switchHref} aria-label="Change language"
            className="flex h-10 items-center gap-1.5 rounded-full border border-line bg-surface/70 px-3 text-sm font-semibold transition hover:ring-brand">
            <Languages className="size-[17px]" />
            {other.toUpperCase()}
          </Link>
          <ThemeToggle label={t.theme.dark} />
          <Link href={`/${locale}/journey`}
            className="grad-brand shine hidden h-10 items-center rounded-full px-5 text-sm font-bold text-white shadow-soft sm:flex">
            {t.cta.start}
          </Link>
          <button type="button" onClick={() => setOpen((v) => !v)} aria-label="Menu"
            className="grid size-10 place-items-center rounded-full border border-line bg-surface/70 lg:hidden">
            {open ? <X className="size-[18px]" /> : <Menu className="size-[18px]" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.22 }}
            className="glass mx-auto mt-2 max-w-6xl overflow-hidden rounded-3xl p-2 shadow-float lg:hidden"
          >
            {links.map((l) => (
              <Link key={l.href} href={l.href}
                className="block rounded-2xl px-4 py-3 text-base font-semibold hover:bg-brandsoft">
                {l.label}
              </Link>
            ))}
            <Link href={`/${locale}/journey`}
              className="grad-brand mt-1 block rounded-2xl px-4 py-3 text-center text-base font-bold text-white">
              {t.cta.start}
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
