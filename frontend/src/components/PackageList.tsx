"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { accentText, type Accent } from "./FetchCard";

export type PackageGroup = {
  category: string;
  items: string[];
};

export default function PackageList({
  groups,
  accent,
}: {
  groups: PackageGroup[];
  accent: Accent;
}) {
  const [open, setOpen] = useState(false);
  const total = groups.reduce((sum, g) => sum + g.items.length, 0);

  return (
    <div className="overflow-hidden rounded-b-md border border-t-0 border-fg/12 bg-card-bg font-[family-name:var(--font-plex-mono)]">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center gap-2 px-5 py-3 text-left text-sm hover:bg-fg/5"
      >
        <span className={accentText[accent]}>$</span>
        <span className="text-fg/80">
          {open ? "hide" : "cat"} packages.txt
          <span className="text-fg/40"> # {total} packages</span>
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-3 border-t border-fg/10 px-5 py-4 text-[13px] leading-relaxed">
              {groups.map((group) => (
                <div key={group.category}>
                  <p className={accentText[accent]}># {group.category}</p>
                  <p className="text-fg/70">{group.items.join(" ")}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
