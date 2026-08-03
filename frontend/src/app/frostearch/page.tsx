import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import FlavourSection from "@/components/FlavourSection";

export const metadata: Metadata = {
  title: "FrosteArch | Daniel O'Brien",
};

const flavours = [
  {
    name: "Desktop Edition",
    image: "/images/frostearch/desktop.png",
    description:
      "A full daily-driver environment with programming, productivity, gaming, and creative tools already installed.",
  },
  {
    name: "Server Edition",
    image: "/images/frostearch/server.png",
    description:
      "A lean profile tuned for long-running services, including Plex defaults and enough local tooling to debug directly on the machine.",
  },
  {
    name: "Node Edition",
    image: "/images/frostearch/node.png",
    description:
      "A minimal profile whose only job is to boot, log in, and show a dashboard in Firefox.",
  },
];

export default function FrosteArchPage() {
  return (
    <main className="flex flex-1 flex-col">
      <div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-6 px-4 py-16 text-center sm:px-6">
        <Image
          src="/images/frostearch/logo.png"
          alt="FrosteArch"
          width={520}
          height={134}
          priority
          className="h-auto w-full max-w-md"
        />
        <p className="max-w-2xl text-lg leading-relaxed text-ink/80">
          A custom Arch Linux distro built around a practical, opinionated
          setup for desktop, server, and appliance use. Three editions, one
          install flow.
        </p>
        <Link
          href="https://github.com/FrosteAto/FrosteArch"
          className="text-link"
        >
          View the source and installation guide on GitHub
        </Link>
      </div>

      <div className="flex flex-col">
        {flavours.map((flavour, i) => (
          <FlavourSection key={flavour.name} index={i} {...flavour} />
        ))}
      </div>

      <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-3 px-4 py-16 text-center sm:px-6">
        <p className="font-[family-name:var(--font-heading)] text-2xl">
          Also does music production
        </p>
        <p className="max-w-xl text-ink/70">
          FrosteArch ships a setup script that handles Wine prefixes for FL
          Studio and the Hatsune Miku Piapro Studio voicebank suite -
          historically one of the more painful things to get working on
          Linux.
        </p>
      </div>
    </main>
  );
}
