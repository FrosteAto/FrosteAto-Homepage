import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getMusicAlbums, imageOptimizerUrl, type MusicAlbum } from "@/lib/api";

export const metadata: Metadata = {
  title: "Music | FrosteAto",
};

export default async function MusicPage() {
  let albums: MusicAlbum[] = [];
  let unavailable = false;

  try {
    albums = await getMusicAlbums();
  } catch {
    unavailable = true;
  }

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-4 py-10 sm:px-6">
      <div>
        <h1 className="font-[family-name:var(--font-heading)] text-4xl">
          Music
        </h1>
        <p className="mt-3 max-w-2xl text-lg leading-relaxed text-fg/80">
          Albums I&apos;ve released, or will release, linked out to
          Bandcamp. I also wrote and performed the score for{" "}
          <Link href="/software" className="text-link">
            Drop By Drop
          </Link>
          .
        </p>
      </div>

      {unavailable && (
        <p className="text-fg/60">
          Couldn&apos;t reach the music backend right now - check back soon.
        </p>
      )}

      {!unavailable && albums.length === 0 && (
        <p className="text-fg/60">Nothing released yet - check back soon.</p>
      )}

      {!unavailable && albums.length > 0 && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {albums.map((album) => {
            const isPlaceholder = !album.bandcampUrl;
            const coverSrc = imageOptimizerUrl(album.coverImageUrl);

            const card = (
              <>
                <div className="relative aspect-square w-full overflow-hidden bg-fg/8">
                  {coverSrc ? (
                    <Image
                      src={coverSrc}
                      alt={album.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-fg/40">
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
                    <span className="absolute right-2 top-2 rounded-full bg-ink/70 px-2 py-0.5 text-xs text-cream">
                      Coming soon
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <p className="font-[family-name:var(--font-heading)] text-lg text-fg">
                    {album.title}
                  </p>
                  {album.description && (
                    <p className="mt-1 line-clamp-3 text-sm text-fg/70">
                      {album.description}
                    </p>
                  )}
                </div>
              </>
            );

            return isPlaceholder ? (
              <div
                key={album.id}
                className="block overflow-hidden rounded-md border border-dashed border-fg/20 bg-card"
              >
                {card}
              </div>
            ) : (
              <a
                key={album.id}
                href={album.bandcampUrl!}
                target="_blank"
                rel="noopener noreferrer"
                className="group block overflow-hidden rounded-md border border-fg/12 bg-card"
              >
                {card}
              </a>
            );
          })}
        </div>
      )}
    </main>
  );
}
