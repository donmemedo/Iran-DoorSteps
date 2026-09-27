"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useTransform } from "motion/react";
import { Bath, BedDouble, Heart, MapPin, RotateCcw, Ruler, X } from "lucide-react";

import { clientApi, profileId } from "@/lib/api";
import { img, num, priceLabel } from "@/lib/format";
import { getDict, pick, sep, type Locale } from "@/lib/i18n";
import type { Property } from "@/lib/types";

export function SwipeDeck({ locale, initial }: { locale: Locale; initial: Property[] }) {
  const t = getDict(locale);
  const [deck, setDeck] = useState(initial);
  const [liked, setLiked] = useState<Property[]>([]);
  const [history, setHistory] = useState<Property[]>([]);

  const top = deck[0];

  const decide = useCallback(
    (like: boolean) => {
      const card = deck[0];
      if (!card) return;
      setDeck((d) => d.slice(1));
      setHistory((h) => [card, ...h]);
      if (like) setLiked((l) => [card, ...l]);
      clientApi(`/api/properties/${card.slug}/swipe`, {
        method: "POST",
        body: JSON.stringify({ profile: profileId(), liked: like }),
      }).catch(() => {});
    },
    [deck],
  );

  const undo = () => {
    const [last, ...rest] = history;
    if (!last) return;
    setHistory(rest);
    setDeck((d) => [last, ...d]);
    setLiked((l) => l.filter((x) => x.id !== last.id));
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") decide(locale === "fa" ? false : true);
      if (e.key === "ArrowLeft") decide(locale === "fa" ? true : false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [decide, locale]);

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,420px)_1fr] lg:items-start">
      <div>
        <div className="relative mx-auto aspect-[3/4] w-full max-w-[420px]">
          <AnimatePresence>
            {deck.slice(0, 3).reverse().map((p, idx, arr) => {
              const depth = arr.length - 1 - idx;
              return depth === 0 ? (
                <TopCard key={p.id} p={p} locale={locale} onDecide={decide} />
              ) : (
                <motion.div
                  key={p.id}
                  initial={false}
                  animate={{ scale: 1 - depth * 0.06, y: depth * 18, rotate: depth % 2 ? 3 : -3, opacity: 1 }}
                  className="card absolute inset-0 overflow-hidden"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img(p.cover)} alt="" className="size-full object-cover" />
                </motion.div>
              );
            })}
          </AnimatePresence>

          {!top && (
            <div className="card grid h-full place-items-center gap-3 p-8 text-center">
              <span className="text-4xl">🎉</span>
              <p className="font-display text-lg font-bold">{t.swipe.empty}</p>
              <Link href={`/${locale}/favorites`} className="grad-brand rounded-full px-5 py-2.5 text-sm font-bold text-white">
                {t.nav.favorites}
              </Link>
            </div>
          )}
        </div>

        <div className="mt-8 flex items-center justify-center gap-4">
          <button onClick={() => decide(false)} aria-label={t.swipe.skip}
            className="grid size-14 place-items-center rounded-full border border-line bg-surface shadow-soft transition hover:scale-110 hover:text-rose">
            <X className="size-6" />
          </button>
          <button onClick={undo} aria-label={t.swipe.undo}
            className="grid size-11 place-items-center rounded-full border border-line bg-surface/70 text-muted transition hover:scale-110">
            <RotateCcw className="size-4" />
          </button>
          <button onClick={() => decide(true)} aria-label={t.swipe.like}
            className="grad-brand grid size-16 place-items-center rounded-full text-white shadow-float transition hover:scale-110">
            <Heart className="size-7 fill-current" />
          </button>
        </div>
      </div>

      <div>
        <h2 className="font-display text-xl font-bold">
          {t.swipe.matches} <span className="grad-text">({num(liked.length, locale)})</span>
        </h2>
        {liked.length === 0 ? (
          <div className="mt-3 space-y-3 text-sm leading-8 text-muted">
            <p>{t.swipe.lead}</p>
            <ul className="space-y-2">
              {[t.swipe.like, t.swipe.skip, t.swipe.undo].map((hint, i) => (
                <li key={hint} className="flex items-center gap-2.5">
                  <span className="grid size-7 shrink-0 place-items-center rounded-full bg-brandsoft text-xs font-bold text-brand">
                    {num(i + 1, locale)}
                  </span>
                  {hint}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            <AnimatePresence>
              {liked.map((p) => (
                <motion.li key={p.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                  <Link href={`/${locale}/properties/${p.slug}`} className="card flex items-center gap-3 overflow-hidden p-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img(p.cover)} alt="" className="size-16 shrink-0 rounded-xl object-cover" />
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-bold">{pick(p.title, locale)}</span>
                      <span className="block truncate text-xs grad-text font-bold">{priceLabel(p, locale)}</span>
                    </span>
                  </Link>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        )}
      </div>
    </div>
  );
}

function TopCard({ p, locale, onDecide }: { p: Property; locale: Locale; onDecide: (like: boolean) => void }) {
  const t = getDict(locale);
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-220, 220], [-14, 14]);
  const likeOpacity = useTransform(x, [40, 150], [0, 1]);
  const nopeOpacity = useTransform(x, [-150, -40], [1, 0]);

  return (
    <motion.div
      style={{ x, rotate }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.7}
      onDragEnd={(_, info) => {
        if (info.offset.x > 120) onDecide(true);
        else if (info.offset.x < -120) onDecide(false);
      }}
      exit={{ x: x.get() > 0 ? 500 : -500, opacity: 0, transition: { duration: 0.25 } }}
      className="card absolute inset-0 cursor-grab overflow-hidden active:cursor-grabbing"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={img(p.cover)} alt="" draggable={false} className="size-full object-cover" />
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-5 pt-16 text-white">
        <h3 className="font-display text-xl font-extrabold">{pick(p.title, locale)}</h3>
        <p className="mt-1 flex items-center gap-1 text-sm text-white/85">
          <MapPin className="size-4" />{pick(p.district, locale)}{sep(locale)}{pick(p.city, locale)}
        </p>
        <p className="mt-2 text-lg font-extrabold">{priceLabel(p, locale)}</p>
        <ul className="mt-3 flex flex-wrap gap-x-4 text-xs text-white/85">
          <li className="flex items-center gap-1"><Ruler className="size-3.5" />{num(p.area, locale)} {t.unit.meter}</li>
          <li className="flex items-center gap-1"><BedDouble className="size-3.5" />{num(p.beds, locale)}</li>
          <li className="flex items-center gap-1"><Bath className="size-3.5" />{num(p.baths, locale)}</li>
        </ul>
      </div>

      <motion.span style={{ opacity: likeOpacity }}
        className="absolute start-6 top-6 rotate-[-12deg] rounded-xl border-4 border-teal px-4 py-1 text-2xl font-extrabold text-teal">
        {t.swipe.like}
      </motion.span>
      <motion.span style={{ opacity: nopeOpacity }}
        className="absolute end-6 top-6 rotate-[12deg] rounded-xl border-4 border-rose px-4 py-1 text-2xl font-extrabold text-rose">
        {t.swipe.skip}
      </motion.span>
    </motion.div>
  );
}
