import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Music | Daniel O'Brien",
};

/**
 * No releases yet. Add entries here as albums go up on Bandcamp - each one
 * renders as a card below with a cover, title, and link. Leave coverImage
 * or bandcampUrl null for an upcoming release that doesn't have art or a
 * live link yet - it renders as an obvious placeholder instead of a dead
 * link or a broken image.
 */
type Release = {
  title: string;
  year: number | null;
  coverImage: string | null;
  bandcampUrl: string | null;
};

const releases: Release[] = [
  {
    title: "Untitled Album",
    year: null,
    coverImage: null,
    bandcampUrl: null,
  },
];

export default function MusicPage() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-4 py-10 sm:px-6">
      <div>
        <h1 className="font-[family-name:var(--font-heading)] text-4xl">
          Music
        </h1>
        <p className="mt-3 max-w-2xl text-lg leading-relaxed text-ink/80">
          Albums I&apos;ve released, or will release, linked out to
          Bandcamp. I also wrote and performed the score for{" "}
          <Link href="/software" className="text-link">
            Drop By Drop
          </Link>
          .
        </p>
      </div>

      {releases.length === 0 ? (
        <p className="text-ink/60">Nothing released yet - check back soon.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {releases.map((release) => {
            const isPlaceholder = !release.bandcampUrl;

            const card = (
              <>
                <div className="relative aspect-square w-full overflow-hidden bg-light-brown/20">
                  {release.coverImage ? (
                    <Image
                      src={release.coverImage}
                      alt={release.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-light-brown/30 to-dark-green/10 text-ink/40">
                      <svg
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="h-10 w-10"
                        aria-hidden="true"
                      >
                        <path d="M9 18V5l12-2v13M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm12-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" stroke="currentColor" strokeWidth="1.5" fill="none" />
                      </svg>
                      <span className="text-xs">Cover coming soon</span>
                    </div>
                  )}
                  {isPlaceholder && (
                    <span className="absolute right-2 top-2 rounded-full bg-ink/70 px-2 py-0.5 text-xs text-white">
                      Coming soon
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <p className="font-[family-name:var(--font-heading)] text-lg">
                    {release.title}
                  </p>
                  <p className="text-sm text-grey">{release.year ?? "TBA"}</p>
                </div>
              </>
            );

            return isPlaceholder ? (
              <div
                key={release.title}
                className="block overflow-hidden rounded-lg border border-dashed border-light-brown/50 bg-white/40"
              >
                {card}
              </div>
            ) : (
              <Link
                key={release.title}
                href={release.bandcampUrl!}
                className="group block overflow-hidden rounded-lg border border-light-brown/40 bg-white/40"
              >
                {card}
              </Link>
            );
          })}
        </div>
      )}
    </main>
  );
}
