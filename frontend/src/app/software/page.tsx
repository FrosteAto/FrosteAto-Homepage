import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import FrosteArchGlyph from "@/components/FrosteArchGlyph";

export const metadata: Metadata = {
  title: "Software Development | FrosteAto",
};

type CompetencyIcon =
  | { kind: "fa"; icon: string; color: string }
  | { kind: "img"; src: string };

type CompetencyItem = { label: string; icon: CompetencyIcon };

const competencies: { label: string; items: CompetencyItem[] }[] = [
  {
    label: "Game Dev",
    items: [
      { label: "Unity", icon: { kind: "fa", icon: "fa-brands fa-unity", color: "#1f1f1f" } },
      { label: "Ren'py", icon: { kind: "img", src: "/images/rp.png" } },
      { label: "C#", icon: { kind: "img", src: "/images/cs.png" } },
      { label: "Godot", icon: { kind: "img", src: "/images/godot.svg" } },
    ],
  },
  {
    label: "Front-End",
    items: [
      { label: "HTML", icon: { kind: "fa", icon: "fa-solid fa-code", color: "#24b953" } },
      { label: "CSS", icon: { kind: "fa", icon: "fa-brands fa-css3", color: "#243ab9" } },
      { label: "SASS", icon: { kind: "fa", icon: "fa-brands fa-sass", color: "#b92480" } },
      { label: "Javascript", icon: { kind: "fa", icon: "fa-brands fa-js", color: "#cf631a" } },
      { label: "React", icon: { kind: "fa", icon: "fa-brands fa-react", color: "#24d4d4" } },
      { label: "Tailwind", icon: { kind: "img", src: "/images/tailwind.svg" } },
    ],
  },
  {
    label: "Back-End",
    items: [
      { label: "PHP", icon: { kind: "fa", icon: "fa-brands fa-php", color: "#9c9fbd" } },
      { label: "Symfony", icon: { kind: "img", src: "/images/symfony.svg" } },
      { label: "Doctrine", icon: { kind: "img", src: "/images/doctrine.svg" } },
      { label: "SQL", icon: { kind: "fa", icon: "fa-solid fa-server", color: "#6e93d8" } },
      { label: "Python", icon: { kind: "fa", icon: "fa-brands fa-python", color: "#918700" } },
    ],
  },
  {
    label: "Other",
    items: [
      { label: "Figma", icon: { kind: "fa", icon: "fa-brands fa-figma", color: "#7c1cb4" } },
      { label: "Photoshop", icon: { kind: "img", src: "/images/cc.png" } },
      { label: "Clip Studio Paint", icon: { kind: "img", src: "/images/csp.png" } },
      { label: "GIMP", icon: { kind: "img", src: "/images/gimp.svg" } },
      { label: "Krita", icon: { kind: "img", src: "/images/krita.svg" } },
      { label: "darktable", icon: { kind: "img", src: "/images/darktable.svg" } },
    ],
  },
];

type Project = {
  title: string;
  image: string;
  description: string;
  team?: { name: string; role: string; href: string }[];
  links?: { label: string; href: string }[];
};

const projects: Project[] = [
  {
    title: "Drop By Drop",
    image: "/images/dbd.gif",
    description:
      "Drop By Drop is an assignment-turned-passion-project by me and 4 friends. It's a roguelite dungeon crawler where the user fights a variety of enemies with different attacks and behaviours in randomly generated dungeons. I was responsible for enemy behaviour, numerous smaller details, and the music & sound.",
    team: [
      { name: "Morgan Rose Godden", role: "Lead Programmer", href: "https://godden.dev" },
      { name: "FrosteAto", role: "Programmer & Lead Composer", href: "https://0brien.dev" },
      { name: "Natalie Stoker", role: "Lead Artist", href: "mailto:nataliecstoker@gmail.com" },
      { name: "Dylan Oates", role: "Business & Administration", href: "mailto:ddoates@outlook.com" },
      { name: "Nat Gough", role: "Writer & Designer", href: "mailto:goughnathan01@gmail.com" },
    ],
  },
];

export default function SoftwarePage() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-12 px-4 py-10 sm:px-6">
      <div>
        <h1 className="font-[family-name:var(--font-heading)] text-4xl">
          Software Development
        </h1>
        <p className="mt-3 max-w-3xl text-lg leading-relaxed">
          Want to contact me?{" "}
          <Link href="mailto:FrosteAto.exparrot@protonmail.com" className="text-link">
            Click here.
          </Link>
        </p>
      </div>

      <section>
        <h2 className="text-2xl font-black text-muted">Competencies</h2>
        <div className="mt-4 space-y-2">
          {competencies.map((c) => (
            <p key={c.label} className="text-lg leading-loose">
              <span className="font-bold">{c.label}: </span>
              {c.items.map((item, i) => (
                <span key={item.label}>
                  {i > 0 && ", "}
                  {item.icon.kind === "fa" ? (
                    <i
                      className={`${item.icon.icon} align-middle`}
                      style={{ color: item.icon.color }}
                      aria-hidden
                    />
                  ) : (
                    <Image
                      src={item.icon.src}
                      alt=""
                      width={22}
                      height={22}
                      className="inline-block h-[22px] w-[22px] align-middle object-contain"
                    />
                  )}{" "}
                  {item.label}
                </span>
              ))}
            </p>
          ))}
        </div>
      </section>

      <hr className="border-2 border-dashed border-fg/20" />

      <section className="flex flex-col gap-10">
        <h2 className="text-2xl font-black text-muted">Projects</h2>

        <div className="flex items-start gap-6">
          <div>
            <p className="text-2xl font-black text-muted">FrosteArch</p>
            <p className="mt-2 max-w-2xl text-lg leading-relaxed">
              My own Arch Linux distribution - a set of install scripts and
              package selections that turn a bare Arch install into three
              ready-to-go editions (Desktop, Server, and Node), built around
              getting a fully configured machine running with as little
              manual setup as possible.
            </p>
            <p className="mt-2">
              <Link href="/frostearch" className="text-link">
                See it in detail
              </Link>
              , and{" "}
              <Link href="https://github.com/FrosteAto/FrosteArch" className="text-link">
                view the source on GitHub
              </Link>
              .
            </p>
          </div>
          <div className="hidden h-[150px] w-[150px] shrink-0 items-center justify-center rounded-full bg-frostearch-purple/10 sm:flex">
            <FrosteArchGlyph className="h-20 w-20 text-frostearch-purple" />
          </div>
        </div>

        {projects.map((p) => (
          <div key={p.title} className="flex items-start gap-6">
            <div>
              <p className="text-2xl font-black text-muted">{p.title}</p>
              <p className="mt-2 max-w-2xl text-lg leading-relaxed">
                {p.description}
              </p>
              {p.team && (
                <>
                  <p className="mt-2 font-bold">Full Team:</p>
                  <ul>
                    {p.team.map((t) => (
                      <li key={t.name}>
                        <Link href={t.href} className="text-link">
                          {t.name}
                        </Link>{" "}
                        - {t.role}
                      </li>
                    ))}
                  </ul>
                </>
              )}
              {p.links && (
                <p className="mt-2">
                  {p.links.map((l, i) => (
                    <span key={l.href}>
                      {i > 0 && ", and "}
                      <Link href={l.href} className="text-link">
                        {l.label}
                      </Link>
                    </span>
                  ))}
                  .
                </p>
              )}
            </div>
            <Image
              src={p.image}
              alt={p.title}
              width={150}
              height={150}
              className="hidden shrink-0 rounded-full sm:block"
            />
          </div>
        ))}

        <div>
          <p className="text-2xl font-black text-muted">Other Projects</p>
          <p className="mt-2 max-w-2xl text-lg leading-relaxed">
            Hackathon entries, one-off scripts, and other smaller things live
            on my{" "}
            <Link href="https://github.com/FrosteAto" className="text-link">
              GitHub
            </Link>
            .
          </p>
        </div>
      </section>
    </main>
  );
}
