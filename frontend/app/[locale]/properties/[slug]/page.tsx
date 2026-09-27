import Link from "next/link";
import { notFound } from "next/navigation";
import { BadgeCheck, Bath, BedDouble, Building2, Calendar, Car, Eye, Layers, MapPin, Ruler, Star } from "lucide-react";

import { LeadForm } from "@/components/lead-form";
import { PropertyCard } from "@/components/property-card";
import { SaveButton } from "@/components/save-button";
import { Reveal } from "@/components/ui";
import { api } from "@/lib/api";
import { img, num, priceLabel, shortPrice } from "@/lib/format";
import { getDict, pick, sep, type Locale } from "@/lib/i18n";
import type { Property } from "@/lib/types";

type Payload = { property: Property; similar: Property[] };

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const data = await api<Payload | null>(`/api/properties/${slug}`, {}, null);
  if (!data) return {};
  return { title: pick(data.property.title, locale as Locale) };
}

export default async function PropertyPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale: raw, slug } = await params;
  const locale = raw as Locale;
  const t = getDict(locale);
  const data = await api<Payload | null>(`/api/properties/${slug}`, {}, null);
  if (!data) notFound();
  const p = data.property;

  const facts = [
    { icon: Ruler, label: t.unit.meter, value: num(p.area, locale) },
    { icon: BedDouble, label: t.unit.bed, value: num(p.beds, locale) },
    { icon: Bath, label: t.unit.bath, value: num(p.baths, locale) },
    { icon: Car, label: t.unit.parking, value: num(p.parking, locale) },
    { icon: Layers, label: t.unit.floor, value: num(p.floor, locale) },
    { icon: Calendar, label: t.unit.year, value: num(p.yearBuilt, locale) },
  ];

  return (
    <article className="mx-auto max-w-6xl px-5 py-8">
      <Reveal>
        <nav className="mb-5 flex flex-wrap items-center gap-1.5 text-sm text-muted">
          <Link href={`/${locale}/properties`} className="hover:text-brand">{t.nav.properties}</Link>
          <span>/</span>
          <Link href={`/${locale}/properties?city=${p.city.en}`} className="hover:text-brand">{pick(p.city, locale)}</Link>
          <span>/</span>
          <span className="text-ink">{pick(p.district, locale)}</span>
        </nav>
      </Reveal>

      <div className="grid gap-3 sm:grid-cols-4 sm:grid-rows-2">
        <Reveal className="sm:col-span-3 sm:row-span-2">
          <div className="card relative h-full overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img(p.cover)} alt="" className="aspect-[16/10] size-full object-cover" />
            <span className="glass absolute start-4 top-4 rounded-full px-4 py-2 text-sm font-bold">
              {p.deal === "sale" ? t.deal.sale : t.deal.rent}
            </span>
          </div>
        </Reveal>
        {(p.gallery ?? []).slice(0, 2).map((g, i) => (
          <Reveal key={`${g}-${i}`} delay={0.08 * (i + 1)} className="hidden sm:block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img(g)} alt="" className="card aspect-square size-full object-cover" />
          </Reveal>
        ))}
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1.6fr_1fr]">
        <div>
          <Reveal>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="font-display text-3xl font-extrabold leading-snug sm:text-4xl">{pick(p.title, locale)}</h1>
                <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted">
                  <span className="flex items-center gap-1"><MapPin className="size-4" />{pick(p.district, locale)}{sep(locale)}{pick(p.city, locale)}</span>
                  <span className="flex items-center gap-1"><Eye className="size-4" />{num(p.views, locale)} {t.prop.views}</span>
                  <span className="flex items-center gap-1"><Star className="size-4 fill-amber-400 text-amber-400" />{num(p.rating, locale)}</span>
                </p>
              </div>
              <SaveButton slug={p.slug} label={t.prop.save} savedLabel={t.prop.saved} />
            </div>
          </Reveal>

          <Reveal delay={0.06}>
            <div className="card mt-6 flex flex-wrap items-baseline gap-x-6 gap-y-2 p-5">
              <span className="font-display text-2xl font-extrabold grad-text sm:text-3xl">{priceLabel(p, locale)}</span>
              {p.deal === "sale" && p.pricePerMeter > 0 && (
                <span className="text-sm text-muted">{t.unit.perMeter}: {shortPrice(p.pricePerMeter, locale)} {t.unit.toman}</span>
              )}
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <h2 className="mt-10 font-display text-xl font-bold">{t.prop.facts}</h2>
            <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {facts.map((f) => (
                <li key={f.label} className="card flex items-center gap-3 p-4">
                  <f.icon className="size-5 shrink-0 text-brand" />
                  <span>
                    <span className="block font-display text-lg font-extrabold leading-tight">{f.value}</span>
                    <span className="text-xs text-muted">{f.label}</span>
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.1}>
            <h2 className="mt-10 font-display text-xl font-bold">{t.prop.about}</h2>
            <p className="mt-3 text-base leading-9 text-muted">{pick(p.description, locale)}</p>
          </Reveal>

          <Reveal delay={0.12}>
            <h2 className="mt-10 font-display text-xl font-bold">{t.prop.features}</h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {(p.features ?? []).map((f) => (
                <li key={f} className="rounded-full border border-line bg-surface/70 px-4 py-2 text-sm font-semibold">
                  {(t.features as Record<string, string>)[f] ?? f}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <aside className="flex flex-col gap-5">
          {p.pro && (
            <Reveal>
              <div className="card p-5">
                <h2 className="mb-4 font-display text-lg font-bold">{t.prop.agent}</h2>
                <div className="flex items-center gap-3">
                  <span className="grid size-14 shrink-0 place-items-center rounded-2xl text-lg font-extrabold text-white"
                    style={{ backgroundImage: `linear-gradient(135deg, hsl(${p.pro.hue} 85% 58%), hsl(${(p.pro.hue + 60) % 360} 80% 48%))` }}>
                    {p.pro.initials}
                  </span>
                  <div className="min-w-0">
                    <p className="flex items-center gap-1 font-bold">
                      {pick(p.pro.name, locale)}
                      {p.pro.verified && <BadgeCheck className="size-4 text-teal" />}
                    </p>
                    <p className="truncate text-sm text-muted">
                      <Building2 className="me-1 inline size-3.5" />{pick(p.pro.agency, locale)}
                    </p>
                  </div>
                </div>
                <a href={`tel:${p.pro.phone.replace(/\s/g, "")}`}
                  dir="ltr"
                  className="mt-4 block rounded-2xl border border-line bg-bg2 py-3 text-center text-sm font-bold transition hover:ring-brand">
                  {p.pro.phone}
                </a>
              </div>
            </Reveal>
          )}
          <Reveal delay={0.06}>
            <LeadForm t={t} propertyId={p.id} proId={p.pro?.id} />
          </Reveal>
        </aside>
      </div>

      {data.similar.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 font-display text-2xl font-extrabold">{t.prop.similar}</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {data.similar.map((s, i) => (
              <Reveal key={s.id} delay={i * 0.06}><PropertyCard p={s} locale={locale} /></Reveal>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
