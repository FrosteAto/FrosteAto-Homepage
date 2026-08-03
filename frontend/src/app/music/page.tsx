import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Music | Daniel O'Brien",
};

/**
 * No releases yet. Add entries here as albums go up on Bandcamp - each one
 * renders as a card below with a cover, title, and link.
 */
type Release = {
  title: string;
  year: number;
  coverImage: string;
  bandcampUrl: string;
};

const releases: Release[] = [];

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
          {releases.map((release) => (
            <Link
              key={release.title}
              href={release.bandcampUrl}
              className="group block overflow-hidden rounded-lg border border-light-brown/40 bg-white/40"
            >
              <div className="relative aspect-square w-full overflow-hidden bg-light-brown/20">
                <Image
                  src={release.coverImage}
                  alt={release.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-4">
                <p className="font-[family-name:var(--font-heading)] text-lg">
                  {release.title}
                </p>
                <p className="text-sm text-grey">{release.year}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
