"use client";

import { Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "motion/react";

import { clientApi, profileId } from "@/lib/api";

export function SaveButton({ slug, label, savedLabel }: { slug: string; label: string; savedLabel: string }) {
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setSaved(localStorage.getItem(`ds-fav-${slug}`) === "1");
  }, [slug]);

  const toggle = async () => {
    const next = !saved;
    setSaved(next);
    setBusy(true);
    localStorage.setItem(`ds-fav-${slug}`, next ? "1" : "0");
    try {
      await clientApi(`/api/properties/${slug}/swipe`, {
        method: "POST",
        body: JSON.stringify({ profile: profileId(), liked: next }),
      });
    } catch {
      /* offline-friendly: the local flag still holds */
    }
    setBusy(false);
  };

  return (
    <motion.button whileTap={{ scale: 0.92 }} type="button" onClick={toggle} disabled={busy}
      className={`flex h-11 items-center gap-2 rounded-full border px-4 text-sm font-bold transition ${
        saved ? "border-rose/40 bg-rose/10 text-rose" : "border-line bg-surface/70 hover:ring-brand"
      }`}>
      <Heart className={`size-4 ${saved ? "fill-current" : ""}`} />
      {saved ? savedLabel : label}
    </motion.button>
  );
}
