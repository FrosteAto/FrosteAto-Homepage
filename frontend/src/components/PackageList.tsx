"use client";

import { useState } from "react";

export type PackageGroup = {
  category: string;
  items: string[];
};

export default function PackageList({ groups }: { groups: PackageGroup[] }) {
  const [open, setOpen] = useState(false);
  const total = groups.reduce((sum, g) => sum + g.items.length, 0);

  return (
    <div className="mt-6">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="text-sm font-bold text-dark-green hover:text-ink"
        aria-expanded={open}
      >
        {open ? "Hide" : "Show"} full package list ({total})
      </button>

      {open && (
        <div className="mt-3 flex flex-col gap-4 text-sm">
          {groups.map((group) => (
            <div key={group.category}>
              <p className="font-bold text-ink/70">{group.category}</p>
              <div className="mt-1 flex flex-wrap gap-1.5">
                {group.items.map((pkg) => (
                  <code
                    key={pkg}
                    className="rounded bg-light-brown/20 px-1.5 py-0.5 font-[family-name:var(--font-plex-mono)] text-xs"
                  >
                    {pkg}
                  </code>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
