import { Aurora } from "@/components/aurora";
import { SwipeDeck } from "@/components/swipe-deck";
import { Reveal } from "@/components/ui";
import { api } from "@/lib/api";
import { getDict, type Locale } from "@/lib/i18n";
import type { Property } from "@/lib/types";

export default async function SwipePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = raw as Locale;
  const t = getDict(locale);
  const data = await api<{ items: Property[] }>("/api/properties/deck", { limit: 14 }, { items: [] });

  return (
    <div className="relative min-h-[80dvh]">
      <Aurora className="h-[50vh] opacity-70" />
      <div className="relative z-10 mx-auto max-w-6xl px-5 py-10">
        <Reveal>
          <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">{t.swipe.title}</h1>
          <p className="mt-3 max-w-xl leading-8 text-muted">{t.swipe.lead}</p>
        </Reveal>
        <div className="mt-10">
          <SwipeDeck locale={locale} initial={data.items} />
        </div>
      </div>
    </div>
  );
}
