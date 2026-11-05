import Image from "next/image";
import Link from "next/link";
import WindowTitlebar from "@/components/WindowTitlebar";
import { accentText } from "@/lib/khioneAccent";
import type { Accent } from "@/lib/khioneAccent";

type Edition = {
  id: string;
  name: string;
  image: string;
  blurDataURL: string;
  accent: Accent;
  role: string;
};

export default function BootWindow({
  tagline,
  githubHref,
  editions,
}: {
  tagline: string;
  githubHref: string;
  editions: Edition[];
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-fg/12 bg-card-bg shadow-[0_24px_60px_-32px_rgba(0,0,0,0.35)]">
      <WindowTitlebar prompt="frosteato@khione: ~" />

      <div className="p-6 sm:p-10">
        <div className="flex flex-wrap items-center gap-8 sm:flex-nowrap sm:gap-12">
          <Image
            src="/images/khione/khione-mark.png"
            alt=""
            width={1440}
            height={1981}
            priority
            className="h-auto w-28 shrink-0 sm:w-32"
          />
          <div className="min-w-[240px] flex-1">
            <Image
              src="/images/khione/khione-wordmark.png"
              alt="Khione"
              width={3019}
              height={777}
              priority
              className="-mt-1 mb-3 h-auto w-52 sm:w-60"
            />
            <p className="max-w-xl text-fg/80">{tagline}</p>
            <Link href={githubHref} className="text-link mt-3 inline-block">
              View the source and installation guide on GitHub
            </Link>
          </div>
        </div>

        <hr className="my-8 border-t border-dashed border-fg/15" />

        <p className="mb-3 font-[family-name:var(--font-plex-mono)] text-xs text-fg/40">
          $ ./boot-menu --list
        </p>
        <div className="flex flex-col divide-y divide-fg/10">
          {editions.map((edition) => (
            <a
              key={edition.id}
              href={`#${edition.id}`}
              aria-label={`Jump to ${edition.name} edition`}
              className="group flex items-center gap-3 py-3 transition-colors duration-200 hover:bg-fg/5 sm:gap-4"
            >
              <span
                className={`w-3 shrink-0 font-[family-name:var(--font-jetbrains-mono)] text-lg opacity-0 transition-opacity duration-200 group-hover:opacity-100 ${accentText[edition.accent]}`}
                aria-hidden
              >
                &gt;
              </span>
              <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full sm:h-9 sm:w-9">
                <Image
                  src={edition.image}
                  alt=""
                  fill
                  sizes="80px"
                  priority
                  placeholder="blur"
                  blurDataURL={edition.blurDataURL}
                  style={{ objectFit: "cover" }}
                />
              </div>
              <span className="flex-1 font-[family-name:var(--font-jetbrains-mono)] text-lg sm:text-xl">
                Khione {edition.name}
              </span>
              <span className="hidden font-[family-name:var(--font-plex-mono)] text-xs text-fg/50 sm:block">
                {edition.role}
              </span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
