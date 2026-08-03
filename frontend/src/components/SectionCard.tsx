"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function SectionCard({
  href,
  title,
  description,
}: {
  href: string;
  title: string;
  description: string;
}) {
  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
      <Link
        href={href}
        className="block h-full rounded-lg border border-light-brown/40 bg-white/40 p-5 shadow-sm transition-shadow hover:shadow-md"
      >
        <p className="font-[family-name:var(--font-heading)] text-xl text-ink">
          {title}
        </p>
        <p className="mt-2 text-sm text-ink/70">{description}</p>
      </Link>
    </motion.div>
  );
}
