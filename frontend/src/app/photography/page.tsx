import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { apiImageUrl, getAlbums, type Album } from "@/lib/api";

export const metadata: Metadata = {
  title: "Photography | Daniel O'Brien",
};

export default async function PhotographyPage() {
  let albums: Album[] = [];
  let unavailable = false;

  try {
    albums = await getAlbums();
  } catch {
    unavailable = true;
  }

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-4 py-10 sm:px-6">
      <h1 className="font-[family-name:var(--font-heading)] text-4xl">
        Photography
      </h1>

      {unavailable && (
        <p className="text-ink/60">
          Couldn&apos;t reach the photo backend right now - check back soon.
        </p>
      )}

      {!unavailable && albums.length === 0 && (
        <p className="text-ink/60">No albums yet - check back soon.</p>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
        {albums.map((album) => {
          const coverUrl = apiImageUrl(album.coverPhoto?.imageUrl ?? null);
          return (
            <Link
              key={album.id}
              href={`/photography/${album.slug}`}
              className="group block overflow-hidden rounded-lg border border-light-brown/40 bg-white/40"
            >
              <div className="relative aspect-square w-full overflow-hidden bg-light-brown/20">
                {coverUrl && (
                  <Image
                    src={coverUrl}
                    alt={album.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                )}
              </div>
              <div className="p-4">
                <p className="font-[family-name:var(--font-heading)] text-lg">
                  {album.name}
                </p>
                {album.description && (
                  <p className="mt-1 line-clamp-2 text-sm text-ink/70">
                    {album.description}
                  </p>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
