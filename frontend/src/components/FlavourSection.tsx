"use client";

import { motion } from "framer-motion";
import PackageList, { type PackageGroup } from "./PackageList";

export default function FlavourSection({
  id,
  name,
  paragraphs,
  packages,
}: {
  id: string;
  name: string;
  paragraphs: string[];
  packages: PackageGroup[];
}) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5 }}
      className="mx-auto w-full max-w-3xl scroll-mt-24 px-4 py-12 sm:px-6"
    >
      <p className="font-[family-name:var(--font-heading)] text-3xl">{name}</p>
      <div className="mt-4 flex flex-col gap-4 text-lg leading-relaxed text-ink/80">
        {paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>

      <PackageList groups={packages} />
    </motion.section>
  );
}
