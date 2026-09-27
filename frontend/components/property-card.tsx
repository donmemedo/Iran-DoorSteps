import Link from "next/link";
import { Bath, BedDouble, MapPin, Ruler, Star } from "lucide-react";

import { img, num, priceLabel } from "@/lib/format";
import { getDict, pick, sep, type Locale } from "@/lib/i18n";
import type { Property } from "@/lib/types";
import { Magnetic } from "./ui";

export function PropertyCard({ p, locale, priority = false }: { p: Property; locale: Locale; priority?: boolean }) {
  const t = getDict(locale);
  const kind = (t.kinds as Record<string, string>)[p.kind] ?? p.kind;

  return (
    <Magnetic className="h-full">
      <Link href={`/${locale}/properties/${p.slug}`} className="card group flex h-full flex-col overflow-hidden">
        <div className="relative aspect-[4/3] overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={img(p.cover)} alt="" loading={priority ? "eager" : "lazy"}
            className="size-full object-cover transition-transform duration-700 group-hover:scale-105" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/55 to-transparent" />
          <div className="absolute inset-x-3 top-3 flex items-center justify-between gap-2">
            <span className="glass rounded-full px-3 py-1 text-xs font-bold text-ink">
              {p.deal === "sale" ? t.deal.sale : t.deal.rent}
            </span>
            {p.featured && (
              <span className="grad-brand rounded-full px-3 py-1 text-xs font-bold text-white shadow-soft">★</span>
            )}
          </div>
          <div className="absolute bottom-3 start-3 flex items-center gap-1 text-xs font-semibold text-white/95">
            <MapPin className="size-3.5" />
            {pick(p.district, locale)}{sep(locale)}{pick(p.city, locale)}
          </div>
          <div className="absolute bottom-3 end-3 flex items-center gap-1 rounded-full bg-black/45 px-2 py-0.5 text-xs font-bold text-white backdrop-blur">
            <Star className="size-3.5 fill-amber-300 text-amber-300" />
            {num(p.rating, locale)}
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-3 p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-display text-base font-bold leading-7 group-hover:text-brand">{pick(p.title, locale)}</h3>
          </div>
          <p className="text-sm font-extrabold grad-text">{priceLabel(p, locale)}</p>
          <ul className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-line pt-3 text-xs text-muted">
            <li className="flex items-center gap-1"><Ruler className="size-3.5" />{num(p.area, locale)} {t.unit.meter}</li>
            <li className="flex items-center gap-1"><BedDouble className="size-3.5" />{num(p.beds, locale)} {t.unit.bed}</li>
            <li className="flex items-center gap-1"><Bath className="size-3.5" />{num(p.baths, locale)} {t.unit.bath}</li>
            <li className="ms-auto rounded-full bg-brandsoft px-2 py-0.5 font-semibold text-brand">{kind}</li>
          </ul>
        </div>
      </Link>
    </Magnetic>
  );
}
