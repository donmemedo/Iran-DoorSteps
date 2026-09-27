export const API_BASE =
  process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const PUBLIC_API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

type Query = Record<string, string | number | boolean | undefined | null>;

export function qs(params: Query = {}) {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== "") sp.set(k, String(v));
  }
  const s = sp.toString();
  return s ? `?${s}` : "";
}

/** Server-side fetch (RSC). Never throws: returns the fallback so the page still renders. */
export async function api<T>(path: string, params: Query = {}, fallback?: T): Promise<T> {
  try {
    const res = await fetch(`${API_BASE}${path}${qs(params)}`, { cache: "no-store" });
    if (!res.ok) throw new Error(`${res.status}`);
    return (await res.json()) as T;
  } catch (e) {
    if (fallback !== undefined) return fallback;
    throw e;
  }
}

/** Client-side fetch against the public base URL. */
export async function clientApi<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${PUBLIC_API_BASE}${path}`, {
    headers: { "content-type": "application/json" },
    ...init,
  });
  if (!res.ok) throw new Error(await res.text());
  return (await res.json()) as T;
}

/** Anonymous profile id, kept in localStorage, used for likes and journey progress. */
export function profileId() {
  if (typeof window === "undefined") return "guest";
  let id = localStorage.getItem("ds-profile");
  if (!id) {
    id = `p-${Math.random().toString(36).slice(2, 10)}`;
    localStorage.setItem("ds-profile", id);
  }
  return id;
}
