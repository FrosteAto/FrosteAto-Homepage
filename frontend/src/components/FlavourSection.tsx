"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import PackageList from "./PackageList";

type Feature = {
  title: string;
  description: string;
};

type Packages = {
  official: string[];
  aur?: string[];
  flatpak?: string[];
};

export default function FlavourSection({
  name,
  image,
  description,
  features,
  packages,
  index,
}: {
  name: string;
  image: string;
  description: string;
  features: Feature[];
  packages: Packages;
  index: number;
}) {
  const reversed = index % 2 === 1;

  return (
    <section
      className={`mx-auto flex w-full max-w-5xl flex-col items-start gap-8 px-4 py-12 sm:px-6 md:flex-row ${
        reversed ? "md:flex-row-reverse" : ""
      }`}
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5 }}
        className="relative aspect-video w-full flex-1 shrink-0 overflow-hidden rounded-lg shadow-md md:sticky md:top-24"
      >
        <Image
          src={image}
          alt={name}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex-1"
      >
        <p className="font-[family-name:var(--font-heading)] text-3xl">{name}</p>
        <p className="mt-3 text-lg leading-relaxed text-ink/80">{description}</p>

        <dl className="mt-6 flex flex-col gap-4">
          {features.map((feature) => (
            <div key={feature.title}>
              <dt className="font-bold text-ink">{feature.title}</dt>
              <dd className="mt-0.5 text-ink/70">{feature.description}</dd>
            </div>
          ))}
        </dl>

        <PackageList {...packages} />
      </motion.div>
    </section>
  );
}
