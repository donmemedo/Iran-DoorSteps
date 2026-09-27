"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { Dict } from "@/lib/i18n";

export function SortSelect({ t }: { t: Dict }) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  return (
    <label className="flex items-center gap-2 text-sm text-muted">
      {t.search.sort}
      <select
        value={sp.get("sort") ?? "newest"}
        onChange={(e) => {
          const next = new URLSearchParams(sp.toString());
          next.set("sort", e.target.value);
          next.delete("page");
          router.push(`${pathname}?${next.toString()}`, { scroll: false });
        }}
        className="rounded-full border border-line bg-surface px-3 py-2 text-sm font-semibold text-ink outline-none focus:ring-brand"
      >
        {Object.entries(t.sort).map(([k, v]) => (
          <option key={k} value={k}>{v}</option>
        ))}
      </select>
    </label>
  );
}
