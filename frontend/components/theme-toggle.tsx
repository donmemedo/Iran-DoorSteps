"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "motion/react";

export function ThemeToggle({ label }: { label: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  const dark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      aria-label={label}
      onClick={() => setTheme(dark ? "light" : "dark")}
      className="relative grid size-10 place-items-center rounded-full border border-line bg-surface/70 text-ink transition hover:ring-brand"
    >
      {ready && (
        <motion.span
          key={dark ? "d" : "l"}
          initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
          animate={{ rotate: 0, opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 18 }}
          className="grid place-items-center"
        >
          {dark ? <Moon className="size-[18px]" /> : <Sun className="size-[18px]" />}
        </motion.span>
      )}
    </button>
  );
}
