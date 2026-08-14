import type { Metadata } from "next";
import AlbumBrowser from "@/components/AlbumBrowser";
import { groupAlbumsByCamera } from "@/lib/photography";
import { getAlbums, getPhotos, type Album, type Photo } from "@/lib/api";

export const metadata: Metadata = {
  title: "Photography | FrosteAto",
};

export default async function PhotographyPage() {
  let albums: Album[] = [];
  let photos: Photo[] = [];
  let unavailable = false;

  try {
    [albums, photos] = await Promise.all([getAlbums(), getPhotos()]);
  } catch {
    unavailable = true;
  }

  const { sortedAlbums, cameraGroups, unknownAlbums } = groupAlbumsByCamera(
    albums,
    photos,
  );

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-4 py-10 sm:px-6">
      <h1 className="font-[family-name:var(--font-heading)] text-4xl">
        Photography
      </h1>

      {unavailable && (
        <p className="text-fg/60">
          Couldn&apos;t reach the photo backend right now - check back soon.
        </p>
      )}

      {!unavailable && albums.length === 0 && (
        <p className="text-fg/60">No albums yet - check back soon.</p>
      )}

      {!unavailable && albums.length > 0 && (
        <AlbumBrowser
          sortedAlbums={sortedAlbums}
          cameraGroups={cameraGroups}
          unknownAlbums={unknownAlbums}
        />
      )}
    </main>
  );
}
