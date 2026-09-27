"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search } from "lucide-react";

import type { Dict, Locale } from "@/lib/i18n";

export function SearchBar({ locale, t, suggestions }: { locale: Locale; t: Dict; suggestions: string[] }) {
  const router = useRouter();
  const [q, setQ] = useState("");

  const go = (value: string) => {
    const v = value.trim();
    router.push(`/${locale}/properties${v ? `?q=${encodeURIComponent(v)}` : ""}`);
  };

  return (
    <div className="w-full max-w-2xl">
      <form
        onSubmit={(e) => { e.preventDefault(); go(q); }}
        className="glass flex items-center gap-2 rounded-full p-2 shadow-float"
      >
        <Search className="ms-3 size-5 shrink-0 text-muted" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={t.hero.searchPlaceholder}
          aria-label={t.search.title}
          className="min-w-0 flex-1 bg-transparent py-2.5 text-base outline-none placeholder:text-muted"
        />
        <button type="submit" className="grad-brand shine shrink-0 rounded-full px-5 py-2.5 text-sm font-bold text-white sm:px-7">
          {t.search.title}
        </button>
      </form>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="text-xs text-muted">{t.hero.quick}:</span>
        {suggestions.map((s) => (
          <button key={s} type="button" onClick={() => go(s)}
            className="rounded-full border border-line bg-surface/60 px-3 py-1.5 text-xs font-semibold transition hover:ring-brand">
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
