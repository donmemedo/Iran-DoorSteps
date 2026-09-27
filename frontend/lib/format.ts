import type { Locale } from "./i18n";

const nf = (l: Locale) => new Intl.NumberFormat(l === "fa" ? "fa-IR" : "en-US", { maximumFractionDigits: 1 });

export const num = (n: number, l: Locale) => nf(l).format(n);

/** 6_500_000_000 -> "۶٫۵ میلیارد" / "6.5B" */
export function shortPrice(v: number, l: Locale) {
  if (!v) return l === "fa" ? "توافقی" : "On request";
  if (v >= 1_000_000_000) return `${num(Math.round((v / 1_000_000_000) * 10) / 10, l)} ${l === "fa" ? "میلیارد" : "B"}`;
  if (v >= 1_000_000) return `${num(Math.round(v / 1_000_000), l)} ${l === "fa" ? "میلیون" : "M"}`;
  return num(v, l);
}

export function priceLabel(p: { deal: string; price: number; deposit: number; rent: number }, l: Locale) {
  const toman = l === "fa" ? "تومان" : "toman";
  if (p.deal === "sale") return `${shortPrice(p.price, l)} ${toman}`;
  const dep = l === "fa" ? "ودیعه" : "Deposit";
  const rent = l === "fa" ? "اجاره" : "rent";
  return `${dep} ${shortPrice(p.deposit, l)} + ${shortPrice(p.rent, l)} ${rent}`;
}

export const img = (key: string) => `/img/${key || "a1"}.svg`;
