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
            FrosteAto
          </p>
          <p className="mt-2 text-lg text-muted">
            Software Developer, Computer Scientist, &amp; General Creator
          </p>
          <div className="mt-3 flex gap-4 text-xl text-tan-text">
            <Link href="https://github.com/FrosteAto" className="hover:text-fg">
              <i className="fa-brands fa-github" aria-hidden />
            </Link>
            <Link
              href="https://www.linkedin.com/in/djob/"
              className="hover:text-fg"
            >
              <i className="fa-brands fa-linkedin" aria-hidden />
            </Link>
            <Link
              href="mailto:FrosteAto.exparrot@protonmail.com"
              className="hover:text-fg"
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

      <div className="flex max-w-3xl flex-col gap-4 text-lg leading-relaxed">
        <p>
          Hi, I&apos;m FrosteAto! Welcome to my personal website. I am a software
          developer by trade, and you will find the personal projects im most proud of here.
          This includes FrosteArch, a Linux distro I maintain myself, as well as this website
          and anything else I come up with.
        </p>
        <p>
          Outside of the software world, I also enjoy photography, music, cooking, and even
          the odd bit of drawing. Now, not all of this is currently available on this site,
          but as I become more confident with it I will pop it up for display.

          Photography is immediately available, and I am currently working on music to put up here soon.
          Recipes will also shortly be available for display as well.
        </p>
        <p>
          I also have a (admittedly pretty empty) blog where I will post my random thoughts and opinions
          from time to time. Read those if you want. Or don't, I suppose.
        </p>
        <p>
          So, use the nav bar up top to explore the different sections of my life, and feel 
          free to reach out to me if you have any questions.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {sections.map((s) => (
          <SectionCard key={s.href} {...s} />
        ))}
      </div>
    </main>
  );
}
