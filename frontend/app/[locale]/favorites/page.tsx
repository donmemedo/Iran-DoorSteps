import { Aurora } from "@/components/aurora";
import { FavoritesList } from "@/components/favorites-list";
import { Reveal } from "@/components/ui";
import { getDict, type Locale } from "@/lib/i18n";

export default async function FavoritesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = raw as Locale;
  const t = getDict(locale);

  return (
    <div className="relative min-h-[70dvh]">
      <Aurora className="h-[40vh] opacity-60" />
      <div className="relative z-10 mx-auto max-w-6xl px-5 py-10">
        <Reveal>
          <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">{t.fav.title}</h1>
        </Reveal>
        <FavoritesList locale={locale} />
      </div>
    </div>
  );
}
