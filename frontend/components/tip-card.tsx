import Link from "next/link";
import { Clock } from "lucide-react";
import { img, num } from "@/lib/format";
import { getDict, pick, type Locale } from "@/lib/i18n";
import type { Tip } from "@/lib/types";
import { Magnetic } from "./ui";

export function TipCard({ tip, locale }: { tip: Tip; locale: Locale }) {
  const t = getDict(locale);
  return (
    <Magnetic className="h-full">
      <Link href={`/${locale}/tips/${tip.slug}`} className="card group flex h-full flex-col overflow-hidden">
        <div className="relative aspect-[16/9] overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={img(tip.cover)} alt="" loading="lazy"
            className="size-full object-cover transition-transform duration-700 group-hover:scale-105" />
          <span className="glass absolute start-3 top-3 rounded-full px-3 py-1 text-xs font-bold">
            {pick(tip.category, locale)}
          </span>
        </div>
        <div className="flex flex-1 flex-col gap-2 p-5">
          <h3 className="font-display text-lg font-bold leading-8 group-hover:text-brand">{pick(tip.title, locale)}</h3>
          <p className="line-clamp-2 text-sm leading-7 text-muted">{pick(tip.body, locale)}</p>
          <span className="mt-auto flex items-center gap-1.5 pt-3 text-xs text-muted">
            <Clock className="size-3.5" />{num(tip.readMin, locale)} {t.tips.read}
            {tip.pro && <span className="ms-2">· {t.tips.by} {pick(tip.pro.name, locale)}</span>}
          </span>
        </div>
      </Link>
    </Magnetic>
  );
}
