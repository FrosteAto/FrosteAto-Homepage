import Image from "next/image";
import Link from "next/link";
import SectionCard from "@/components/SectionCard";

const sections = [
  {
    href: "/software",
    title: "Software Development",
    description: "Employment history and personal projects.",
  },
  {
    href: "/frostearch",
    title: "FrosteArch",
    description: "My custom Linux ISO.",
  },
  {
    href: "/photography",
    title: "Photography",
    description: "A collection of the pictures I take.",
  },
  {
    href: "/music",
    title: "Music",
    description: "Albums I've released, linked to Bandcamp.",
  },
  {
    href: "/blog",
    title: "Blog",
    description: "Whatever's on my mind lately.",
  },
];

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-10 px-4 py-10 sm:px-6">
      <div className="flex items-center gap-6">
        <div>
          <p className="font-[family-name:var(--font-heading)] text-4xl sm:text-5xl">
            FrosteAto O&apos;Brien
          </p>
          <p className="mt-2 text-lg text-grey">
            Software Developer, Computer Scientist, &amp; General Creator
          </p>
          <div className="mt-3 flex gap-4 text-xl text-grey">
            <Link href="https://github.com/FrosteAto" className="hover:text-ink">
              <i className="fa-brands fa-github" aria-hidden />
            </Link>
            <Link
              href="https://www.linkedin.com/in/djob/"
              className="hover:text-ink"
            >
              <i className="fa-brands fa-linkedin" aria-hidden />
            </Link>
            <Link
              href="mailto:FrosteAto.exparrot@protonmail.com"
              className="hover:text-ink"
            >
              <i className="fa-solid fa-envelope" aria-hidden />
            </Link>
          </div>
        </div>
        <Image
          src="/images/cat.png"
          alt="A cat"
          width={120}
          height={120}
          className="rounded-full"
        />
      </div>

      <p className="max-w-3xl text-lg leading-relaxed">
        Hi, I&apos;m FrosteAto! Welcome to my personal website. I am a
        passionate developer looking for experience in any role in the
        computing industry, and this site is home to everything else I
        make too - code, photos, music, and the odd blog post.
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {sections.map((s) => (
          <SectionCard key={s.href} {...s} />
        ))}
      </div>
    </main>
  );
}
