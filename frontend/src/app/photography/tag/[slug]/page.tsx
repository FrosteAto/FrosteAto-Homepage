import type { Metadata } from "next";
import Link from "next/link";
import PhotoGrid from "@/components/PhotoGrid";
import { getPhotos } from "@/lib/api";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  return { title: `#${slug} | Photography` };
}

export default async function PhotoTagPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const photos = await getPhotos({ tagSlug: slug });

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-4 py-10 sm:px-6">
      <div>
        <Link href="/photography" className="text-sm text-link">
          &larr; All albums
        </Link>
        <h1 className="mt-2 font-[family-name:var(--font-heading)] text-4xl">
          #{slug}
        </h1>
      </div>

      {photos.length === 0 ? (
        <p className="text-fg/60">No photos tagged #{slug} yet.</p>
      ) : (
        <PhotoGrid photos={photos} />
      )}
    </main>
  );
}
