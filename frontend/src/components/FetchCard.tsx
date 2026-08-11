"use client";

import { motion } from "framer-motion";

export type Accent = "purple" | "blue" | "yellow";

export const accentText: Record<Accent, string> = {
  purple: "text-dark-purple",
  blue: "text-dark-blue",
  yellow: "text-dark-yellow",
};

const accentBorder: Record<Accent, string> = {
  purple: "border-t-dark-purple",
  blue: "border-t-dark-blue",
  yellow: "border-t-dark-yellow",
};

// A miniature version of the FrosteArch mark - a mountain with an arch cut
// into it - standing in for the ASCII-art logo real fetch tools print.
const Glyph = ({ className }: { className: string }) => (
  <svg viewBox="0 0 100 100" aria-hidden className={className}>
    <path
      fill="currentColor"
      d="M50 8 L92 92 L60 92 Q60 55 50 55 Q40 55 40 92 L8 92 Z"
    />
  </svg>
);

export default function FetchCard({
  edition,
  host,
  accent,
  specs,
}: {
  edition: string;
  host: string;
  accent: Accent;
  specs: { label: string; value: string }[];
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.4 }}
      className={`rounded-t-md border border-fg/12 border-t-2 bg-card px-5 pb-5 pt-4 font-[family-name:var(--font-plex-mono)] text-sm ${accentBorder[accent]}`}
    >
      <p className="mb-3 text-xs text-fg/40">
        dan@{host} ~ $ fastfetch
      </p>

      <div className="flex gap-4">
        <Glyph className={`mt-1 h-14 w-14 shrink-0 ${accentText[accent]}`} />

        <dl className="flex-1 space-y-1.5">
          {[{ label: "OS", value: `FrosteArch ${edition}` }, ...specs].map(
            (spec, i) => (
            <motion.div
              key={spec.label}
              initial={{ opacity: 0, x: -6 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
              className="flex gap-2"
            >
              <dt className="w-20 shrink-0 text-fg/50">{spec.label}</dt>
              <dd className="text-fg/90">{spec.value}</dd>
            </motion.div>
          ))}
        </dl>
      </div>
    </motion.div>
  );
}
