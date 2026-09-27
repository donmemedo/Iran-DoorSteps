"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { motion } from "motion/react";

import { clientApi } from "@/lib/api";
import type { Dict } from "@/lib/i18n";

export function LeadForm({ t, propertyId, proId }: { t: Dict; propertyId?: number; proId?: number }) {
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    setState("sending");
    try {
      await clientApi("/api/leads", {
        method: "POST",
        body: JSON.stringify({
          name: data.get("name"),
          phone: data.get("phone"),
          email: data.get("email") || "",
          message: data.get("message") || "",
          property_id: propertyId ?? null,
          pro_id: proId ?? null,
        }),
      });
      setState("done");
    } catch {
      setState("error");
    }
  };

  if (state === "done") {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
        className="card grid place-items-center gap-2 p-8 text-center">
        <span className="grad-brand grid size-12 place-items-center rounded-full text-2xl text-white">✓</span>
        <p className="font-display text-lg font-bold">{t.lead.success}</p>
      </motion.div>
    );
  }

  const field = "w-full rounded-2xl border border-line bg-bg2 px-4 py-3 text-sm outline-none transition focus:ring-brand";

  return (
    <form onSubmit={onSubmit} className="card flex flex-col gap-3 p-5">
      <h3 className="font-display text-lg font-bold">{t.lead.title}</h3>
      <div className="grid gap-3 sm:grid-cols-2">
        <input name="name" required minLength={2} placeholder={t.lead.name} className={field} />
        <input name="phone" required minLength={6} inputMode="tel" placeholder={t.lead.phone} className={field} />
      </div>
      <input name="email" type="email" placeholder={t.lead.email} className={field} />
      <textarea name="message" rows={3} placeholder={t.lead.message} className={field} />
      {state === "error" && <p className="text-sm text-rose">{t.lead.error}</p>}
      <button type="submit" disabled={state === "sending"}
        className="grad-brand shine flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-bold text-white disabled:opacity-60">
        <Send className="size-4" />
        {t.cta.send}
      </button>
    </form>
  );
}
