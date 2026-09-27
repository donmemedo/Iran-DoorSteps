import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Clock } from "lucide-react";

import { Reveal } from "@/components/ui";
import { api } from "@/lib/api";
import { img, num } from "@/lib/format";
import { getDict, isRtl, pick, type Locale } from "@/lib/i18n";
import type { Tip } from "@/lib/types";

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const data = await api<{ tip: Tip } | null>(`/api/tips/${slug}`, {}, null);
  return data ? { title: pick(data.tip.title, locale as Locale) } : {};
}

export default async function TipPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale: raw, slug } = await params;
  const locale = raw as Locale;
  const t = getDict(locale);
  const data = await api<{ tip: Tip } | null>(`/api/tips/${slug}`, {}, null);
  if (!data) notFound();
  const tip = data.tip;
  const Arrow = isRtl(locale) ? ArrowRight : ArrowLeft;

  return (
    <article className="mx-auto max-w-3xl px-5 py-10">
      <Link href={`/${locale}/tips`} className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-muted hover:text-brand">
        <Arrow className="size-4" />{t.tips.title}
      </Link>
      <Reveal>
        <span className="rounded-full bg-brandsoft px-3 py-1 text-xs font-bold text-brand">{pick(tip.category, locale)}</span>
        <h1 className="mt-4 font-display text-4xl font-extrabold leading-tight">{pick(tip.title, locale)}</h1>
        <p className="mt-4 flex items-center gap-3 text-sm text-muted">
          <Clock className="size-4" />{num(tip.readMin, locale)} {t.tips.read}
          {tip.pro && <span>· {t.tips.by} {pick(tip.pro.name, locale)}</span>}
        </p>
      </Reveal>
      <Reveal delay={0.06}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={img(tip.cover)} alt="" className="card mt-8 aspect-[16/7] w-full object-cover" />
      </Reveal>
      <Reveal delay={0.1}>
        <p className="mt-8 text-lg leading-10 text-ink/90">{pick(tip.body, locale)}</p>
      </Reveal>
    </article>
  );
}
