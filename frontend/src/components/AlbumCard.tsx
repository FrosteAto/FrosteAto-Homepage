import Image from "next/image";
import Link from "next/link";
import { apiImageUrl, type Album } from "@/lib/api";

export default function AlbumCard({ album }: { album: Album }) {
  const coverUrl = apiImageUrl(album.coverPhoto?.imageUrl ?? null);

  return (
    <Link
      href={`/photography/${album.slug}`}
      className="group block overflow-hidden rounded-md border border-fg/12 bg-card"
    >
      <div className="relative aspect-square w-full overflow-hidden bg-fg/8">
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
        <p className="font-[family-name:var(--font-heading)] text-lg text-fg">
          {album.name}
        </p>
        {album.description && (
          <p className="mt-1 line-clamp-2 text-sm text-fg/70">
            {album.description}
          </p>
        )}
      </div>
    </Link>
  );
}
