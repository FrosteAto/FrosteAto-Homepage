"use client";

import { motion } from "framer-motion";
import { accentText, type Accent } from "./FetchCard";

export type Topic = {
  title: string;
  body: string;
};

export default function TopicGrid({
  accent,
  topics,
}: {
  accent: Accent;
  topics: Topic[];
}) {
  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
      {topics.map((topic, i) => (
        <motion.div
          key={topic.title}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.35, delay: i * 0.05 }}
        >
          <p
            className={`font-[family-name:var(--font-jetbrains-mono)] text-xl ${accentText[accent]}`}
          >
            {topic.title}
          </p>
          <p className="mt-1.5 text-base leading-relaxed text-fg/70">
            {topic.body}
          </p>
        </motion.div>
      ))}
    </div>
  );
}
