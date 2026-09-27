import { Aurora } from "@/components/aurora";
import { JourneyBoard } from "@/components/journey-board";
import { Reveal } from "@/components/ui";
import { api } from "@/lib/api";
import { getDict, type Locale } from "@/lib/i18n";
import type { Journey } from "@/lib/types";

export default async function JourneyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = raw as Locale;
  const t = getDict(locale);
  const data = await api<Journey>("/api/journey", {}, { phases: [], completed: 0, total: 0, percent: 0 });

  return (
    <div className="relative">
      <Aurora className="h-[45vh] opacity-60" />
      <div className="relative z-10 mx-auto max-w-4xl px-5 py-10">
        <Reveal>
          <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">{t.journey.title}</h1>
          <p className="mt-3 max-w-2xl leading-8 text-muted">{t.journey.lead}</p>
        </Reveal>
        <div className="mt-8">
          <JourneyBoard locale={locale} data={data} />
        </div>
      </div>
    </div>
  );
}
