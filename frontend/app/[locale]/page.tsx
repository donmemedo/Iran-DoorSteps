import Link from "next/link";
import { ArrowLeft, ArrowRight, Compass, ShieldCheck, Sparkles, TrendingUp } from "lucide-react";

import { Aurora } from "@/components/aurora";
import { LeadForm } from "@/components/lead-form";
import { ProCard } from "@/components/pro-card";
import { PropertyCard } from "@/components/property-card";
import { SearchBar } from "@/components/search-bar";
import { TipCard } from "@/components/tip-card";
import { Reveal } from "@/components/ui";
import { api } from "@/lib/api";
import { img, num, shortPrice } from "@/lib/format";
import { getDict, isRtl, pick, type Locale } from "@/lib/i18n";
import type { Facets, Journey, Property, Stats, Tip } from "@/lib/types";
import type { Pro } from "@/lib/types";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = raw as Locale;
  const t = getDict(locale);
  const rtl = isRtl(locale);
  const Arrow = rtl ? ArrowLeft : ArrowRight;

  const [featured, stats, facets, journey, pros, tips] = await Promise.all([
    api<{ items: Property[] }>("/api/properties", { featured: true, size: 6, sort: "rating" }, { items: [] }),
    api<Stats>("/api/stats", {}, { properties: 0, pros: 0, cities: 0, avgPricePerMeter: 0, deals: 0, satisfaction: 97 }),
    api<Facets>("/api/properties/facets", {}, { cities: [], kinds: [], features: [], priceMin: 0, priceMax: 0, total: 0 }),
    api<Journey>("/api/journey", {}, { phases: [], completed: 0, total: 0, percent: 0 }),
    api<{ items: Pro[] }>("/api/pros", {}, { items: [] }),
    api<{ items: Tip[] }>("/api/tips", {}, { items: [] }),
  ]);

  const cities = facets.cities.slice(0, 6).map((c) => (locale === "fa" ? c.fa : c.en));
  const statCards = [
    { v: num(stats.properties, locale), l: t.stats.properties, icon: Compass },
    { v: num(stats.pros, locale), l: t.stats.pros, icon: ShieldCheck },
    { v: num(stats.deals, locale), l: t.stats.deals, icon: TrendingUp },
    { v: `${shortPrice(stats.avgPricePerMeter, locale)}`, l: t.stats.avgMeter, icon: Sparkles },
  ];

  return (
    <>
      {/* ——— hero ——— */}
      <section className="relative overflow-hidden px-5 pb-16 pt-10 sm:pt-16">
        <Aurora />
        <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <Reveal>
              <span className="glass inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold sm:text-sm">
                <Sparkles className="size-4 text-brand" />
                {t.hero.badge}
              </span>
            </Reveal>
            <Reveal delay={0.06}>
              <h1 className="mt-6 font-display text-[clamp(2.6rem,7vw,4.7rem)] font-extrabold leading-[1.08] tracking-tight">
                {t.hero.title1}
                <br />
                <span className="grad-text">{t.hero.title2}</span>
              </h1>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mt-6 max-w-xl text-base leading-9 text-muted sm:text-lg">{t.hero.lead}</p>
            </Reveal>
            <Reveal delay={0.18} className="mt-8">
              <SearchBar locale={locale} t={t} suggestions={cities.slice(0, 4)} />
            </Reveal>
          </div>

          <Reveal delay={0.2} y={40}>
            <div className="relative mx-auto aspect-[4/5] w-full max-w-sm sm:max-w-md">
              {featured.items[0] && (
                <div className="card absolute end-0 top-0 w-[78%] rotate-2 overflow-hidden shadow-float transition-transform duration-500 hover:rotate-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img(featured.items[0].cover)} alt="" className="aspect-[4/5] w-full object-cover" />
                  <div className="absolute inset-x-0 top-0 bg-gradient-to-b from-black/85 via-black/35 to-transparent p-4 pb-14 text-white">
                    <p className="truncate text-sm font-bold">{pick(featured.items[0].title, locale)}</p>
                    <p className="mt-1 text-sm font-extrabold">
                      {shortPrice(featured.items[0].deal === "sale" ? featured.items[0].price : featured.items[0].deposit, locale)} {t.unit.toman}
                    </p>
                  </div>
                </div>
              )}

              {featured.items[1] && (
                <div className="card absolute bottom-0 start-0 z-10 w-[54%] -rotate-3 overflow-hidden shadow-float transition-transform duration-500 hover:rotate-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img(featured.items[1].cover)} alt="" className="aspect-[4/3] w-full object-cover" />
                  <div className="p-3">
                    <p className="truncate text-xs font-bold">{pick(featured.items[1].title, locale)}</p>
                    <p className="mt-1 text-xs font-extrabold grad-text">
                      {shortPrice(featured.items[1].deal === "sale" ? featured.items[1].price : featured.items[1].deposit, locale)} {t.unit.toman}
                    </p>
                  </div>
                </div>
              )}

              <div className="glass absolute start-[2%] top-[14%] z-20 flex items-center gap-2.5 rounded-2xl px-4 py-3 shadow-float">
                <span className="grid size-9 place-items-center rounded-xl bg-brandsoft text-brand">
                  <ShieldCheck className="size-5" />
                </span>
                <span>
                  <span className="block font-display text-base font-extrabold leading-tight">{num(stats.pros, locale)}</span>
                  <span className="text-[11px] text-muted">{t.stats.pros}</span>
                </span>
              </div>
            </div>
          </Reveal>
        </div>

        {/* stat strip */}
        <div className="relative z-10 mx-auto mt-14 grid max-w-6xl grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {statCards.map((s, i) => (
            <Reveal key={s.l} delay={i * 0.05}>
              <div className="card flex items-center gap-3 p-4">
                <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-brandsoft text-brand">
                  <s.icon className="size-5" />
                </span>
                <span>
                  <span className="block font-display text-xl font-extrabold leading-tight">{s.v}</span>
                  <span className="text-xs text-muted">{s.l}</span>
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ——— trust marquee ——— */}
      <section className="fade-edge overflow-hidden border-y border-line bg-bg2/50 py-4">
        <div className="marquee flex w-max gap-10 whitespace-nowrap text-sm font-semibold text-muted">
          {[0, 1].map((k) => (
            <span key={k} className="flex gap-10">
              <span>{t.home.trust}</span>
              {cities.map((c) => <span key={`${k}-${c}`}>● {c}</span>)}
            </span>
          ))}
        </div>
      </section>

      {/* ——— featured ——— */}
      <Section
        title={t.home.featured} lead={t.home.featuredLead}
        href={`/${locale}/properties`} cta={t.cta.seeAll} Arrow={Arrow}
      >
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.items.map((p, i) => (
            <Reveal key={p.id} delay={(i % 3) * 0.07}>
              <PropertyCard p={p} locale={locale} priority={i < 3} />
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ——— how it works ——— */}
      <section className="relative mx-auto max-w-6xl px-5 py-16">
        <Reveal>
          <h2 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">{t.home.how}</h2>
        </Reveal>
        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {t.home.steps.map((s, i) => (
            <Reveal key={s.t} delay={i * 0.08}>
              <div className="card group relative h-full overflow-hidden p-6">
                <span className="grad-text font-display text-5xl font-extrabold opacity-40">{num(i + 1, locale)}</span>
                <h3 className="mt-3 font-display text-xl font-bold">{s.t}</h3>
                <p className="mt-2 text-sm leading-8 text-muted">{s.d}</p>
                <span className="grad-brand absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100" />
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ——— journey ——— */}
      <Section title={t.journey.title} lead={t.home.journeyLead} href={`/${locale}/journey`} cta={t.cta.more} Arrow={Arrow}>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {journey.phases.map((ph, i) => (
            <Reveal key={ph.key} delay={(i % 3) * 0.06}>
              <Link href={`/${locale}/journey#${ph.key}`} className="card group flex h-full flex-col gap-2 p-5 transition hover:shadow-float">
                <span className="grad-brand grid size-10 place-items-center rounded-xl font-display text-sm font-extrabold text-white">
                  {num(i + 1, locale)}
                </span>
                <h3 className="mt-2 font-display text-lg font-bold group-hover:text-brand">{pick(ph.title, locale)}</h3>
                <p className="text-sm leading-7 text-muted">{pick(ph.summary, locale)}</p>
                <span className="mt-auto pt-3 text-xs font-semibold text-brand">
                  {t.journey.duration}: {pick(ph.duration, locale)}
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ——— pros ——— */}
      <Section title={t.pros.title} lead={t.home.prosLead} href={`/${locale}/pros`} cta={t.cta.seeAll} Arrow={Arrow}>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {pros.items.slice(0, 4).map((pro, i) => (
            <Reveal key={pro.id} delay={(i % 4) * 0.06}><ProCard pro={pro} locale={locale} /></Reveal>
          ))}
        </div>
      </Section>

      {/* ——— tips ——— */}
      <Section title={t.tips.title} lead={t.tips.lead} href={`/${locale}/tips`} cta={t.cta.seeAll} Arrow={Arrow}>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {tips.items.slice(0, 3).map((tip, i) => (
            <Reveal key={tip.id} delay={(i % 3) * 0.07}><TipCard tip={tip} locale={locale} /></Reveal>
          ))}
        </div>
      </Section>

      {/* ——— closing cta ——— */}
      <section className="relative mx-auto mt-10 max-w-6xl px-5">
        <div className="card relative grid gap-8 overflow-hidden p-6 sm:p-10 lg:grid-cols-2">
          <Aurora className="opacity-70" />
          <div className="relative z-10">
            <h2 className="font-display text-3xl font-extrabold leading-tight sm:text-4xl">{t.lead.title}</h2>
            <p className="mt-4 max-w-md text-base leading-9 text-muted">{t.pros.lead}</p>
            <Link href={`/${locale}/swipe`}
              className="glass mt-6 inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-bold">
              {t.swipe.title}
              <Arrow className="size-4" />
            </Link>
          </div>
          <div className="relative z-10">
            <LeadForm t={t} />
          </div>
        </div>
      </section>
    </>
  );
}

function Section({
  title, lead, href, cta, Arrow, children,
}: {
  title: string; lead: string; href: string; cta: string;
  Arrow: React.ComponentType<{ className?: string }>; children: React.ReactNode;
}) {
  return (
    <section className="mx-auto max-w-6xl px-5 py-16">
      <Reveal>
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">{title}</h2>
            <p className="mt-2 max-w-xl text-sm leading-8 text-muted sm:text-base">{lead}</p>
          </div>
          <Link href={href} className="group flex items-center gap-2 rounded-full border border-line bg-surface/60 px-4 py-2 text-sm font-bold transition hover:ring-brand">
            {cta}
            <Arrow className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </Reveal>
      {children}
    </section>
  );
}
