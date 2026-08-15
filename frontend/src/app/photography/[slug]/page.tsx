import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import FeaturedGrid from "@/components/FeaturedGrid";
import PhotoGrid from "@/components/PhotoGrid";
import {
  formatAlbumDate,
  getAlbumBySlug,
  getPhotos,
  primaryCameraName,
} from "@/lib/api";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const album = await getAlbumBySlug(slug);

  return { title: album ? `${album.name} | Photography` : "Album not found" };
}

export default async function AlbumPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const album = await getAlbumBySlug(slug);

  if (!album) {
    notFound();
  }

  const photos = await getPhotos({ albumSlug: slug });
  const featuredPhotos = photos.filter((photo) => photo.featured);
  const date = album.takenAt ? formatAlbumDate(album.takenAt) : null;
  const photoCount =
    photos.length > 0
      ? `${photos.length} photo${photos.length === 1 ? "" : "s"}`
      : null;
  const primaryCamera = primaryCameraName(photos);
  const lensName = album.lens?.name ?? null;
  let gear: string | null = null;
  if (primaryCamera && lensName) {
    gear = `Shot on ${primaryCamera} with ${lensName}`;
  } else if (primaryCamera) {
    gear = `Shot on ${primaryCamera}`;
  } else if (lensName) {
    gear = `Shot with ${lensName}`;
  }
  const meta = [date, photoCount, gear].filter(Boolean).join(" · ");

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-4 py-10 sm:px-6">
      <div>
        <Link href="/photography" className="text-sm text-link">
          &larr; All albums
        </Link>
        <h1 className="mt-2 font-[family-name:var(--font-heading)] text-4xl">
          {album.name}
        </h1>
        {meta && <p className="mt-1 text-sm text-fg/60">{meta}</p>}
        {album.description && (
          <p className="mt-2 max-w-2xl text-fg/70">{album.description}</p>
        )}
      </div>

      {featuredPhotos.length > 0 && (
        <>
          <FeaturedGrid photos={featuredPhotos} />
          <h2 className="font-[family-name:var(--font-heading)] text-2xl">
            All Photos
          </h2>
        </>
      )}

      {photos.length === 0 ? (
        <p className="text-fg/60">No photos in this album yet.</p>
      ) : (
        <PhotoGrid photos={photos} />
      )}
    </main>
  );
}
