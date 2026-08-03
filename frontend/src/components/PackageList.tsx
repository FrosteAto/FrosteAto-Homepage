"use client";

import { useState } from "react";

export default function PackageList({
  official,
  aur,
  flatpak,
}: {
  official: string[];
  aur?: string[];
  flatpak?: string[];
}) {
  const [open, setOpen] = useState(false);
  const total = official.length + (aur?.length ?? 0) + (flatpak?.length ?? 0);

  return (
    <div className="mt-4">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="text-sm font-bold text-dark-green hover:text-ink"
        aria-expanded={open}
      >
        {open ? "Hide" : "Show"} full package list ({total})
      </button>

      {open && (
        <div className="mt-3 flex flex-col gap-3 text-sm">
          <PackageGroup label="Official repos" items={official} />
          {aur && aur.length > 0 && <PackageGroup label="AUR" items={aur} />}
          {flatpak && flatpak.length > 0 && (
            <PackageGroup label="Flatpak" items={flatpak} />
          )}
        </div>
      )}
    </div>
  );
}

function PackageGroup({ label, items }: { label: string; items: string[] }) {
  return (
    <div>
      <p className="font-bold text-ink/70">{label}</p>
      <div className="mt-1 flex flex-wrap gap-1.5">
        {items.map((pkg) => (
          <code
            key={pkg}
            className="rounded bg-light-brown/20 px-1.5 py-0.5 font-[family-name:var(--font-plex-mono)] text-xs"
          >
            {pkg}
          </code>
        ))}
      </div>
    </div>
  );
}
