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
        className="block h-full rounded-md border border-fg/12 bg-card p-5 transition-colors hover:border-tan"
      >
        <p className="font-[family-name:var(--font-heading)] text-xl text-fg">
          {title}
        </p>
        <p className="mt-2 text-sm text-fg/70">{description}</p>
      </Link>
    </motion.div>
  );
}
