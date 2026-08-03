import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Software Development | Daniel O'Brien",
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
      { label: "C++", icon: { kind: "img", src: "/images/c++.png" } },
      { label: "Win32", icon: { kind: "img", src: "/images/windows.png" } },
      { label: "DirectX", icon: { kind: "img", src: "/images/dx.png" } },
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
    ],
  },
  {
    label: "Back-End",
    items: [
      { label: "Python", icon: { kind: "fa", icon: "fa-brands fa-python", color: "#918700" } },
      { label: "MS Access", icon: { kind: "fa", icon: "fa-solid fa-database", color: "#a12e1f" } },
      { label: "SQL", icon: { kind: "fa", icon: "fa-solid fa-server", color: "#6e93d8" } },
      { label: "PHP", icon: { kind: "fa", icon: "fa-brands fa-php", color: "#9c9fbd" } },
      { label: "Java", icon: { kind: "fa", icon: "fa-brands fa-java", color: "#cf1a1a" } },
      { label: "C", icon: { kind: "img", src: "/images/c.png" } },
    ],
  },
  {
    label: "Other",
    items: [
      { label: "Figma", icon: { kind: "fa", icon: "fa-brands fa-figma", color: "#7c1cb4" } },
      { label: "Photoshop", icon: { kind: "img", src: "/images/cc.png" } },
      { label: "Clip Studio Paint", icon: { kind: "img", src: "/images/csp.png" } },
    ],
  },
];

const projects = [
  {
    title: "Drop By Drop",
    image: "/images/dbd.gif",
    description:
      "Drop By Drop is an assignment-turned-passion-project by me and 4 friends. It's a roguelite dungeon crawler where the user fights a variety of enemies with different attacks and behaviours in randomly generated dungeons. I was responsible for enemy behaviour, numerous smaller details, and the music & sound.",
    team: [
      { name: "Morgan Rose Godden", role: "Lead Programmer", href: "https://godden.dev" },
      { name: "Daniel O'Brien", role: "Programmer & Lead Composer", href: "https://0brien.dev" },
      { name: "Natalie Stoker", role: "Lead Artist", href: "mailto:nataliecstoker@gmail.com" },
      { name: "Dylan Oates", role: "Business & Administration", href: "mailto:ddoates@outlook.com" },
      { name: "Nat Gough", role: "Writer & Designer", href: "mailto:goughnathan01@gmail.com" },
    ],
  },
  {
    title: "DUST",
    image: "/images/dustsite.png",
    description:
      "I was employed in an internship position during the summer of 2023 to begin producing a web application for the DUST initiative. It required the ability to load and display 3d models to the viewer, as well as 360 degree images. It must also allow people to traverse the models with limited freedom. I used three.JS to accomplish this.",
    links: [
      { label: "Find out more about DUST", href: "https://www.derby.ac.uk/derbys-urban-sustainable-transition/" },
      { label: "my project", href: "https://github.com/FrosteAto/Derby-DUST-Website-Work" },
    ],
  },
];

const otherProjects = [
  {
    label: "Rolls-Royce Hackathon Website",
    href: "https://hackathon.bfrd.uk/index.php",
    description: "in which I produced a short visual novel to educate the voters on the merits of different power sources.",
  },
  {
    label: "E-Ink/Pihole Integration",
    href: "https://github.com/FrosteAto/Pihole-EInk-2.66inch",
    description: "where I wrote a script that interacted with the PiHole API to display data about the DNS level adblocker's local statistics on an E-Ink display connected to a Raspberry Pi.",
  },
  {
    label: "Space Monitor",
    href: "https://github.com/FrosteAto/SpaceTraders-Custom-Client",
    description: "a (very) WIP web frontend used to play the API-based space trading game 'spacetraders.io'.",
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
          <Link href="mailto:Dan.exparrot@protonmail.com" className="text-link">
            Click here.
          </Link>
        </p>
      </div>

      <section>
        <h2 className="text-2xl font-black text-grey">Competencies</h2>
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

      <hr className="border-2 border-dashed border-light-brown" />

      <section className="flex flex-col gap-10">
        <h2 className="text-2xl font-black text-grey">Projects</h2>

        {projects.map((p) => (
          <div key={p.title} className="flex items-start gap-6">
            <div>
              <p className="text-2xl font-black text-grey">{p.title}</p>
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
          <p className="text-2xl font-black text-grey">Other Projects</p>
          <ul className="mt-2 max-w-2xl space-y-2 text-lg leading-relaxed">
            {otherProjects.map((op) => (
              <li key={op.href}>
                <Link href={op.href} className="text-link">
                  {op.label}
                </Link>
                , {op.description}
              </li>
            ))}
            <li>
              Discover all these and more on my{" "}
              <Link href="https://github.com/FrosteAto" className="text-link">
                Github
              </Link>{" "}
              page.
            </li>
          </ul>
        </div>
      </section>
    </main>
  );
}
