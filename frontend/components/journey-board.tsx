"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { Check, Clock } from "lucide-react";

import { clientApi, profileId } from "@/lib/api";
import { num } from "@/lib/format";
import { getDict, pick, type Locale } from "@/lib/i18n";
import type { Journey } from "@/lib/types";

const ACCENTS: Record<string, string> = {
  violet: "from-violet-500 to-fuchsia-500",
  emerald: "from-emerald-500 to-teal-500",
  sky: "from-sky-500 to-indigo-500",
  amber: "from-amber-500 to-orange-500",
  rose: "from-rose-500 to-pink-500",
  cyan: "from-cyan-500 to-blue-500",
};

export function JourneyBoard({ locale, data }: { locale: Locale; data: Journey }) {
  const t = getDict(locale);
  const [done, setDone] = useState<Set<number>>(new Set());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("ds-journey");
    const fromServer = data.phases.flatMap((p) => p.steps.filter((s) => s.done).map((s) => s.id));
    const ids = saved ? (JSON.parse(saved) as number[]) : fromServer;
    setDone(new Set(ids));
    setReady(true);
  }, [data]);

  const total = useMemo(() => data.phases.reduce((n, p) => n + p.steps.length, 0), [data]);
  const percent = total ? Math.round((done.size / total) * 100) : 0;

  const toggle = (id: number) => {
    const next = new Set(done);
    const on = !next.has(id);
    on ? next.add(id) : next.delete(id);
    setDone(next);
    localStorage.setItem("ds-journey", JSON.stringify([...next]));
    clientApi("/api/journey/progress", {
      method: "POST",
      body: JSON.stringify({ profile: profileId(), step_id: id, done: on }),
    }).catch(() => {});
  };

  return (
    <>
      <div className="card sticky top-24 z-30 flex flex-wrap items-center gap-4 p-5">
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between text-sm">
            <span className="font-bold">{t.journey.progress}</span>
            <span className="text-muted">
              {num(ready ? done.size : 0, locale)} {t.journey.of} {num(total, locale)} {t.journey.done}
            </span>
          </div>
          <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-line">
            <motion.div className="grad-brand h-full rounded-full"
              initial={{ width: 0 }} animate={{ width: `${ready ? percent : 0}%` }}
              transition={{ type: "spring", stiffness: 120, damping: 20 }} />
          </div>
        </div>
        <span className="grad-text font-display text-3xl font-extrabold">{num(ready ? percent : 0, locale)}%</span>
      </div>

      <div className="mt-8 space-y-6">
        {data.phases.map((phase, i) => {
          const phaseDone = phase.steps.filter((s) => done.has(s.id)).length;
          const complete = phaseDone === phase.steps.length && phase.steps.length > 0;
          return (
            <motion.section
              key={phase.key} id={phase.key}
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.05 }}
              className="card scroll-mt-40 overflow-hidden"
            >
              <div className="flex flex-wrap items-center gap-4 border-b border-line p-5">
                <span className={`grid size-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br ${ACCENTS[phase.accent] ?? ACCENTS.violet} font-display text-lg font-extrabold text-white shadow-soft`}>
                  {complete ? <Check className="size-6" /> : num(i + 1, locale)}
                </span>
                <div className="min-w-0 flex-1">
                  <h2 className="font-display text-xl font-extrabold">{pick(phase.title, locale)}</h2>
                  <p className="mt-1 text-sm leading-7 text-muted">{pick(phase.summary, locale)}</p>
                </div>
                <span className="flex items-center gap-1.5 rounded-full bg-brandsoft px-3 py-1.5 text-xs font-bold text-brand">
                  <Clock className="size-3.5" />{pick(phase.duration, locale)}
                </span>
              </div>

              <ul className="divide-y divide-line">
                {phase.steps.map((step) => {
                  const on = done.has(step.id);
                  return (
                    <li key={step.id}>
                      <button onClick={() => toggle(step.id)}
                        className="flex w-full items-start gap-3 p-4 text-start transition hover:bg-brandsoft/50">
                        <span className={`mt-0.5 grid size-6 shrink-0 place-items-center rounded-full border-2 transition ${
                          on ? "grad-brand border-transparent text-white" : "border-line"
                        }`}>
                          {on && <Check className="size-3.5" />}
                        </span>
                        <span className="min-w-0">
                          <span className={`block font-semibold transition ${on ? "text-muted line-through" : ""}`}>
                            {pick(step.title, locale)}
                          </span>
                          <span className="mt-0.5 block text-sm text-muted">{pick(step.hint, locale)}</span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </motion.section>
          );
        })}
      </div>
    </>
  );
}
