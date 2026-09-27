import { Aurora } from "@/components/aurora";
import { TipCard } from "@/components/tip-card";
import { Reveal } from "@/components/ui";
import { api } from "@/lib/api";
import { getDict, type Locale } from "@/lib/i18n";
import type { Tip } from "@/lib/types";

export default async function TipsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = raw as Locale;
  const t = getDict(locale);
  const data = await api<{ items: Tip[] }>("/api/tips", {}, { items: [] });

  return (
    <div className="relative">
      <Aurora className="h-[40vh] opacity-60" />
      <div className="relative z-10 mx-auto max-w-6xl px-5 py-10">
        <Reveal>
          <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">{t.tips.title}</h1>
          <p className="mt-3 max-w-2xl leading-8 text-muted">{t.tips.lead}</p>
        </Reveal>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {data.items.map((tip, i) => (
            <Reveal key={tip.id} delay={(i % 3) * 0.05}><TipCard tip={tip} locale={locale} /></Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
