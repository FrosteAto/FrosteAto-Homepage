"use client";

import { useState } from "react";
import AlbumCard from "@/components/AlbumCard";
import type { Album } from "@/lib/api";
import type { CameraGroup } from "@/lib/photography";

export default function AlbumBrowser({
  sortedAlbums,
  cameraGroups,
  unknownAlbums,
}: {
  sortedAlbums: Album[];
  cameraGroups: CameraGroup[];
  unknownAlbums: Album[];
}) {
  const [grouped, setGrouped] = useState(false);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-end">
        <label className="flex items-center gap-2 text-sm text-fg/70">
          <input
            type="checkbox"
            checked={grouped}
            onChange={(e) => setGrouped(e.target.checked)}
          />
          Group by camera
        </label>
      </div>

      {!grouped && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {sortedAlbums.map((album) => (
            <AlbumCard key={album.id} album={album} />
          ))}
        </div>
      )}

      {grouped && (
        <div className="flex flex-col gap-3">
          {cameraGroups.map(({ camera, albums }) => (
            <details
              key={camera.slug}
              className="rounded-md border border-fg/12 bg-card p-4"
            >
              <summary className="cursor-pointer font-[family-name:var(--font-heading)] text-lg">
                {camera.name} ({albums.length})
              </summary>
              <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
                {albums.map((album) => (
                  <AlbumCard key={album.id} album={album} />
                ))}
              </div>
            </details>
          ))}

          {unknownAlbums.length > 0 && (
            <details className="rounded-md border border-fg/12 bg-card p-4">
              <summary className="cursor-pointer font-[family-name:var(--font-heading)] text-lg">
                Unknown camera ({unknownAlbums.length})
              </summary>
              <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
                {unknownAlbums.map((album) => (
                  <AlbumCard key={album.id} album={album} />
                ))}
              </div>
            </details>
          )}
        </div>
      )}
    </div>
  );
}
