"use client";

import { motion } from "framer-motion";
import FetchCard, { type Accent } from "./FetchCard";
import PackageList, { type PackageGroup } from "./PackageList";
import TopicGrid, { type Topic } from "./TopicGrid";

export default function FlavourSection({
  id,
  name,
  host,
  accent,
  specs,
  intro,
  topics,
  packages,
}: {
  id: string;
  name: string;
  host: string;
  accent: Accent;
  specs: { label: string; value: string }[];
  intro: string;
  topics: Topic[];
  packages: PackageGroup[];
}) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5 }}
      className="mx-auto w-full max-w-6xl scroll-mt-24 px-4 py-12 sm:px-8 lg:px-12"
    >
      <p className="text-center font-[family-name:var(--font-jetbrains-mono)] text-5xl sm:text-6xl">
        {name}
      </p>

      <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,22rem)_1fr] lg:gap-12">
        <div className="lg:col-start-1">
          <FetchCard
            edition={name.replace(/ Edition$/, "")}
            host={host}
            accent={accent}
            specs={specs}
          />
          <PackageList groups={packages} accent={accent} />
        </div>

        <div className="lg:col-start-2">
          <p className="text-xl leading-relaxed text-fg/80">{intro}</p>
          <div className="mt-8">
            <TopicGrid accent={accent} topics={topics} />
          </div>
        </div>
      </div>
    </motion.section>
  );
}
