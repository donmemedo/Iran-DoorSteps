import { BadgeCheck, Phone, Star } from "lucide-react";
import { num } from "@/lib/format";
import { getDict, pick, type Locale } from "@/lib/i18n";
import type { Pro } from "@/lib/types";

export function ProCard({ pro, locale }: { pro: Pro; locale: Locale }) {
  const t = getDict(locale);
  const role = (t.pros.roles as Record<string, string>)[pro.role] ?? pro.role;
  return (
    <article className="card flex h-full flex-col gap-4 p-5 transition hover:shadow-float">
      <div className="flex items-center gap-3">
        <span className="grid size-14 shrink-0 place-items-center rounded-2xl text-lg font-extrabold text-white shadow-soft"
          style={{ backgroundImage: `linear-gradient(135deg, hsl(${pro.hue} 85% 58%), hsl(${(pro.hue + 60) % 360} 80% 48%))` }}>
          {pro.initials}
        </span>
        <div className="min-w-0">
          <h3 className="flex items-center gap-1 font-display text-base font-bold">
            {pick(pro.name, locale)}
            {pro.verified && <BadgeCheck className="size-4 text-teal" />}
          </h3>
          <p className="truncate text-sm text-muted">{role} · {pick(pro.agency, locale)}</p>
        </div>
      </div>
      <p className="line-clamp-2 text-sm leading-7 text-muted">{pick(pro.bio, locale)}</p>
      <div className="flex flex-wrap gap-1.5">
        {pro.specialties.map((s) => (
          <span key={s} className="rounded-full bg-brandsoft px-2.5 py-1 text-xs font-semibold text-brand">{s}</span>
        ))}
      </div>
      <div className="mt-auto flex items-center justify-between border-t border-line pt-3 text-xs text-muted">
        <span className="flex items-center gap-1 font-bold text-ink">
          <Star className="size-3.5 fill-amber-400 text-amber-400" />{num(pro.rating, locale)}
          <span className="font-normal text-muted">({num(pro.reviews, locale)} {t.pros.reviews})</span>
        </span>
        <span>{num(pro.deals, locale)} {t.pros.deals}</span>
        <a href={`tel:${pro.phone.replace(/\s/g, "")}`} className="flex items-center gap-1 font-semibold text-brand">
          <Phone className="size-3.5" />{t.pros.call}
        </a>
      </div>
    </article>
  );
}
