import Link from "next/link";
import { Suspense } from "react";

import { Aurora } from "@/components/aurora";
import { Filters } from "@/components/filters";
import { PropertyCard } from "@/components/property-card";
import { SortSelect } from "@/components/sort-select";
import { Reveal } from "@/components/ui";
import { api } from "@/lib/api";
import { num } from "@/lib/format";
import { getDict, type Locale } from "@/lib/i18n";
import type { Facets, Property } from "@/lib/types";

type Search = Record<string, string | string[] | undefined>;
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

export default async function PropertiesPage({
  params, searchParams,
}: { params: Promise<{ locale: string }>; searchParams: Promise<Search> }) {
  const { locale: raw } = await params;
  const locale = raw as Locale;
  const t = getDict(locale);
  const sp = await searchParams;
  const page = Number(one(sp.page) ?? 1) || 1;

  const query = {
    q: one(sp.q), city: one(sp.city), deal: one(sp.deal), kind: one(sp.kind),
    beds: one(sp.beds), min_price: one(sp.min_price), max_price: one(sp.max_price),
    features: one(sp.features), sort: one(sp.sort) ?? "newest", page, size: 12,
  };

  const [data, facets] = await Promise.all([
    api<{ items: Property[]; total: number; pages: number }>("/api/properties", query, { items: [], total: 0, pages: 1 }),
    api<Facets>("/api/properties/facets", {}, { cities: [], kinds: [], features: [], priceMin: 0, priceMax: 0, total: 0 }),
  ]);

  const qsFor = (p: number) => {
    const u = new URLSearchParams();
    Object.entries({ ...query, size: undefined }).forEach(([k, v]) => v && k !== "page" && u.set(k, String(v)));
    u.set("page", String(p));
    return `?${u.toString()}`;
  };

  return (
    <div className="relative">
      <Aurora className="h-[40vh] opacity-60" />
      <div className="relative z-10 mx-auto max-w-7xl px-5 py-10">
        <Reveal>
          <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
            {one(sp.q) ? `“${one(sp.q)}”` : t.nav.properties}
          </h1>
          <p className="mt-3 text-muted">
            <span className="font-bold text-ink">{num(data.total, locale)}</span> {t.search.results}
          </p>
        </Reveal>

        <div className="mt-8 grid gap-6 lg:grid-cols-[280px_1fr]">
          <Suspense fallback={<div />}>
            <Filters locale={locale} t={t} facets={facets} />
          </Suspense>

          <div>
            <div className="mb-5 flex items-center justify-end">
              <Suspense fallback={<div />}><SortSelect t={t} /></Suspense>
            </div>

            {data.items.length === 0 ? (
              <div className="card grid place-items-center gap-3 p-16 text-center">
                <span className="text-4xl">🏚️</span>
                <p className="font-display text-lg font-bold">{t.search.noResults}</p>
                <Link href={`/${locale}/properties`} className="text-sm font-bold text-brand">{t.cta.reset}</Link>
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {data.items.map((p, i) => (
                  <Reveal key={p.id} delay={(i % 3) * 0.05}>
                    <PropertyCard p={p} locale={locale} priority={i < 3} />
                  </Reveal>
                ))}
              </div>
            )}

            {data.pages > 1 && (
              <nav className="mt-10 flex flex-wrap items-center justify-center gap-2">
                {Array.from({ length: data.pages }, (_, i) => i + 1).map((p) => (
                  <Link key={p} href={qsFor(p)} scroll
                    className={`grid size-10 place-items-center rounded-full text-sm font-bold transition ${
                      p === page ? "grad-brand text-white shadow-soft" : "border border-line bg-surface/70 hover:ring-brand"
                    }`}>
                    {num(p, locale)}
                  </Link>
                ))}
              </nav>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
