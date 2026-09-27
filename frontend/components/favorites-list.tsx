"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { PropertyCard } from "./property-card";
import { clientApi, profileId } from "@/lib/api";
import { getDict, type Locale } from "@/lib/i18n";
import type { Property } from "@/lib/types";

export function FavoritesList({ locale }: { locale: Locale }) {
  const t = getDict(locale);
  const [items, setItems] = useState<Property[] | null>(null);

  useEffect(() => {
    clientApi<{ items: Property[] }>(`/api/properties/favorites?profile=${profileId()}`)
      .then((d) => setItems(d.items))
      .catch(() => setItems([]));
  }, []);

  if (items === null) {
    return (
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2].map((i) => <div key={i} className="card h-80 animate-pulse opacity-60" />)}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="card mt-10 grid place-items-center gap-3 p-16 text-center">
        <span className="text-4xl">💜</span>
        <p className="font-display text-lg font-bold">{t.fav.empty}</p>
        <Link href={`/${locale}/swipe`} className="grad-brand rounded-full px-5 py-2.5 text-sm font-bold text-white">
          {t.nav.swipe}
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((p) => <PropertyCard key={p.id} p={p} locale={locale} />)}
    </div>
  );
}
