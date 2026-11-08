import Image from "next/image";
import Link from "next/link";
import SocialIcon from "@/components/SocialIcon";

const sections = [
  { href: "/software", description: "Employment history and personal projects." },
  { href: "/khione", description: "My custom Linux ISO." },
  { href: "/photography", description: "A collection of the pictures I take." },
  { href: "/music", description: "Albums I've released, linked to Bandcamp." },
  { href: "/recipes", description: "Recipes I actually cook." },
  { href: "/blog", description: "Whatever's on my mind lately." },
];

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-page flex-1 flex-col gap-10 px-4 py-10 sm:px-6">
      <div className="flex items-center gap-6">
        <Image
          src="/images/cat.png"
          alt="A cat"
          width={120}
          height={120}
          className="rounded-full"
        />
        <div>
          <p className="font-[family-name:var(--font-heading)] text-4xl sm:text-5xl">
            FrosteAto
          </p>
          <p className="mt-2 text-lg text-muted">
            Software Developer, Computer Scientist, &amp; General Creator
          </p>
          <div className="mt-3 flex gap-4 text-accent">
            <Link href="https://github.com/FrosteAto" className="hover:text-fg" aria-label="GitHub">
              <SocialIcon name="github" />
            </Link>
            <Link
              href="https://www.linkedin.com/in/djob/"
              className="hover:text-fg"
              aria-label="LinkedIn"
            >
              <SocialIcon name="linkedin" />
            </Link>
            <Link
              href="mailto:FrosteAto.exparrot@protonmail.com"
              className="hover:text-fg"
              aria-label="Email"
            >
              <SocialIcon name="email" />
            </Link>
          </div>
        </div>
      </div>

      <div className="rounded-md border border-fg/12 bg-card-bg p-5 sm:p-6">
        <p className="font-[family-name:var(--font-plex-mono)] text-xs text-fg/40">
          $ cat about.md
        </p>
        <div className="mt-3 flex flex-col gap-3 text-lg leading-relaxed">
          <p>
            <span className="text-accent-soft">#</span> Hi, I&apos;m FrosteAto! Welcome to my personal website. I am a software
            developer by trade, and you will find the personal projects im most proud of here.
            This includes Khione, a Linux distro I maintain myself, as well as this website
            and anything else I come up with.
          </p>
          <p>
            <span className="text-accent-soft">#</span> Outside of the software world, I also enjoy photography, music, cooking, and even
            the odd bit of drawing. Now, not all of this is currently available on this site,
            but as I become more confident with it I will pop it up for display.
            Photography and recipes are already up, and I am currently working on getting music
            up here too.
          </p>
          <p>
            <span className="text-accent-soft">#</span> I also have a (admittedly pretty empty) blog where I will post my random thoughts and opinions
            from time to time. Read those if you want. Or don&apos;t, I suppose.
          </p>
          <p>
            <span className="text-accent-soft">#</span> So, use the nav bar up top to explore the different sections of my life, and feel
            free to reach out to me if you have any questions.
          </p>
        </div>
      </div>

      <div>
        <p className="font-[family-name:var(--font-plex-mono)] text-sm text-fg/70">
          ~/frosteato/
        </p>
        <div className="mt-2 flex flex-col">
          {sections.map((s, i) => (
            <Link
              key={s.href}
              href={s.href}
              className="group flex flex-wrap items-center gap-x-3 gap-y-1 rounded px-2 py-1.5 transition-colors hover:bg-fg/5"
            >
              <span className="font-[family-name:var(--font-plex-mono)] text-sm text-fg/40">
                {i === sections.length - 1 ? "└──" : "├──"}
              </span>
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
              <span className="font-[family-name:var(--font-jetbrains-mono)] text-base sm:min-w-[180px]">
                {s.href.slice(1)}/
              </span>
              <span className="flex-1 text-sm text-fg/60">{s.description}</span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
