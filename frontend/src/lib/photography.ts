import { photoSortDate, type Album, type Camera, type Photo } from "@/lib/api";

export type CameraGroup = {
  camera: Camera;
  albums: Album[];
};

export type GroupedAlbums = {
  sortedAlbums: Album[];
  cameraGroups: CameraGroup[];
  unknownAlbums: Album[];
};

/**
 * Groups albums by the camera(s) used in their photos, for the
 * "Group by camera" toggle on the photography landing page.
 *
 * Expects `photos` already sorted newest-taken-first (this is
 * `getPhotos()`'s default order) - that ordering is what lets this
 * function treat the first photo found for an album as its most recent,
 * without re-sorting.
 *
 * An album with photos from more than one camera appears once in each
 * relevant camera's group. An album with no camera-tagged photos (or no
 * photos at all) appears only in `unknownAlbums`. Camera groups come out
 * ordered by their own most-recently-shot album, since that's the order
 * their first photo is encountered while walking `sortedAlbums`.
 */
export function groupAlbumsByCamera(
  albums: Album[],
  photos: Photo[],
): GroupedAlbums {
  const photosByAlbum = new Map<number, Photo[]>();
  for (const photo of photos) {
    if (!photo.album) continue;
    const list = photosByAlbum.get(photo.album.id);
    if (list) {
      list.push(photo);
    } else {
      photosByAlbum.set(photo.album.id, [photo]);
    }
  }

  function albumSortDate(albumId: number): number {
    const albumPhotos = photosByAlbum.get(albumId);
    return albumPhotos && albumPhotos.length > 0
      ? photoSortDate(albumPhotos[0])
      : -Infinity;
  }

  const sortedAlbums = [...albums].sort(
    (a, b) => albumSortDate(b.id) - albumSortDate(a.id),
  );

  const groupsBySlug = new Map<string, CameraGroup>();
  const unknownAlbums: Album[] = [];

  for (const album of sortedAlbums) {
    const albumPhotos = photosByAlbum.get(album.id) ?? [];
    const camerasInAlbum = new Map<string, Camera>();
    for (const photo of albumPhotos) {
      if (photo.camera) camerasInAlbum.set(photo.camera.slug, photo.camera);
    }

    if (camerasInAlbum.size === 0) {
      unknownAlbums.push(album);
      continue;
    }

    for (const camera of camerasInAlbum.values()) {
      const group = groupsBySlug.get(camera.slug);
      if (group) {
        group.albums.push(album);
      } else {
        groupsBySlug.set(camera.slug, { camera, albums: [album] });
      }
    }
  }

  return {
    sortedAlbums,
    cameraGroups: [...groupsBySlug.values()],
    unknownAlbums,
  };
}
