import Link from "next/link";

import { Aurora } from "@/components/aurora";
import { LeadForm } from "@/components/lead-form";
import { ProCard } from "@/components/pro-card";
import { Reveal } from "@/components/ui";
import { api } from "@/lib/api";
import { getDict, type Locale } from "@/lib/i18n";
import type { Pro } from "@/lib/types";

export default async function ProsPage({
  params, searchParams,
}: { params: Promise<{ locale: string }>; searchParams: Promise<{ role?: string }> }) {
  const { locale: raw } = await params;
  const locale = raw as Locale;
  const t = getDict(locale);
  const { role } = await searchParams;
  const data = await api<{ items: Pro[]; roles: string[] }>("/api/pros", { role }, { items: [], roles: [] });

  return (
    <div className="relative">
      <Aurora className="h-[40vh] opacity-60" />
      <div className="relative z-10 mx-auto max-w-6xl px-5 py-10">
        <Reveal>
          <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">{t.pros.title}</h1>
          <p className="mt-3 max-w-2xl leading-8 text-muted">{t.pros.lead}</p>
        </Reveal>

        <Reveal delay={0.06}>
          <div className="mt-8 flex flex-wrap gap-2">
            <Link href={`/${locale}/pros`}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${!role ? "grad-brand text-white shadow-soft" : "border border-line bg-surface/70 hover:ring-brand"}`}>
              {t.cta.all}
            </Link>
            {data.roles.map((r) => (
              <Link key={r} href={`/${locale}/pros?role=${r}`}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${role === r ? "grad-brand text-white shadow-soft" : "border border-line bg-surface/70 hover:ring-brand"}`}>
                {(t.pros.roles as Record<string, string>)[r] ?? r}
              </Link>
            ))}
          </div>
        </Reveal>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {data.items.map((pro, i) => (
            <Reveal key={pro.id} delay={(i % 3) * 0.05}><ProCard pro={pro} locale={locale} /></Reveal>
          ))}
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <h2 className="font-display text-3xl font-extrabold">{t.lead.title}</h2>
            <p className="mt-3 leading-8 text-muted">{t.pros.lead}</p>
          </Reveal>
          <Reveal delay={0.06}><LeadForm t={t} /></Reveal>
        </div>
      </div>
    </div>
  );
}
