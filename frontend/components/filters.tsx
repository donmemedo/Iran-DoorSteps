"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import { shortPrice } from "@/lib/format";
import type { Dict, Locale } from "@/lib/i18n";
import type { Facets } from "@/lib/types";

export function Filters({ locale, t, facets }: { locale: Locale; t: Dict; facets: Facets }) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const [open, setOpen] = useState(false);

  const set = (key: string, value?: string | null) => {
    const next = new URLSearchParams(sp.toString());
    if (!value) next.delete(key);
    else next.set(key, value);
    next.delete("page");
    router.push(`${pathname}?${next.toString()}`, { scroll: false });
  };

  const toggleFeature = (f: string) => {
    const current = (sp.get("features") ?? "").split(",").filter(Boolean);
    const next = current.includes(f) ? current.filter((x) => x !== f) : [...current, f];
    set("features", next.join(","));
  };

  const active = (key: string, value: string) => sp.get(key) === value;
  const chip = (on: boolean) =>
    `rounded-full px-3.5 py-2 text-sm font-semibold transition ${
      on ? "grad-brand text-white shadow-soft" : "border border-line bg-surface/70 hover:ring-brand"
    }`;

  const priceSteps = [1, 3, 5, 8, 12, 20].map((n) => n * 1_000_000_000);
  const activeCount = ["city", "deal", "kind", "beds", "min_price", "max_price", "features"].filter((k) => sp.get(k)).length;

  const body = (
    <div className="flex flex-col gap-6">
      <Group label={t.search.deal}>
        <button className={chip(!sp.get("deal"))} onClick={() => set("deal")}>{t.deal.any}</button>
        <button className={chip(active("deal", "sale"))} onClick={() => set("deal", "sale")}>{t.deal.sale}</button>
        <button className={chip(active("deal", "rent"))} onClick={() => set("deal", "rent")}>{t.deal.rent}</button>
      </Group>

      <Group label={t.search.city}>
        <button className={chip(!sp.get("city"))} onClick={() => set("city")}>{t.cta.all}</button>
        {facets.cities.map((c) => (
          <button key={c.en} className={chip(active("city", c.en))} onClick={() => set("city", c.en)}>
            {locale === "fa" ? c.fa : c.en}
          </button>
        ))}
      </Group>

      <Group label={t.search.kind}>
        <button className={chip(!sp.get("kind"))} onClick={() => set("kind")}>{t.cta.all}</button>
        {facets.kinds.map((k) => (
          <button key={k} className={chip(active("kind", k))} onClick={() => set("kind", k)}>
            {(t.kinds as Record<string, string>)[k] ?? k}
          </button>
        ))}
      </Group>

      <Group label={t.search.beds}>
        <button className={chip(!sp.get("beds"))} onClick={() => set("beds")}>{t.cta.all}</button>
        {[1, 2, 3, 4].map((b) => (
          <button key={b} className={chip(active("beds", String(b)))} onClick={() => set("beds", String(b))}>
            {b}+
          </button>
        ))}
      </Group>

      <Group label={t.search.price}>
        {priceSteps.map((v) => (
          <button key={v} className={chip(active("max_price", String(v)))} onClick={() => set("max_price", String(v))}>
            ≤ {shortPrice(v, locale)}
          </button>
        ))}
      </Group>

      <Group label={t.search.features}>
        {facets.features.map((f) => {
          const on = (sp.get("features") ?? "").split(",").includes(f);
          return (
            <button key={f} className={chip(on)} onClick={() => toggleFeature(f)}>
              {(t.features as Record<string, string>)[f] ?? f}
            </button>
          );
        })}
      </Group>

      {activeCount > 0 && (
        <button onClick={() => router.push(pathname)} className="flex items-center gap-1.5 self-start text-sm font-bold text-rose">
          <X className="size-4" />{t.cta.reset}
        </button>
      )}
    </div>
  );

  return (
    <>
      {/* desktop rail */}
      <aside className="card sticky top-24 hidden h-fit max-h-[calc(100dvh-8rem)] overflow-y-auto p-5 lg:block">
        <h2 className="mb-5 flex items-center gap-2 font-display text-lg font-bold">
          <SlidersHorizontal className="size-4" />{t.search.filters}
        </h2>
        {body}
      </aside>

      {/* mobile sheet */}
      <button onClick={() => setOpen(true)}
        className="glass fixed bottom-5 start-1/2 z-40 flex -translate-x-1/2 items-center gap-2 rounded-full px-5 py-3 text-sm font-bold shadow-float lg:hidden rtl:translate-x-1/2">
        <SlidersHorizontal className="size-4" />
        {t.search.filters}
        {activeCount > 0 && <span className="grad-brand grid size-5 place-items-center rounded-full text-xs text-white">{activeCount}</span>}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 lg:hidden" onClick={() => setOpen(false)}>
            <motion.div
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 34 }}
              onClick={(e) => e.stopPropagation()}
              className="absolute inset-x-0 bottom-0 max-h-[85dvh] overflow-y-auto rounded-t-[2rem] bg-bg p-6 pb-24"
            >
              <div className="mb-5 flex items-center justify-between">
                <h2 className="font-display text-xl font-bold">{t.search.filters}</h2>
                <button onClick={() => setOpen(false)} className="grid size-9 place-items-center rounded-full border border-line">
                  <X className="size-4" />
                </button>
              </div>
              {body}
              <button onClick={() => setOpen(false)}
                className="grad-brand mt-8 w-full rounded-2xl py-3.5 font-bold text-white">{t.cta.apply}</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-2.5 text-xs font-bold uppercase tracking-wider text-muted">{label}</h3>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}
