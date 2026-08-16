const API_URL = process.env.API_URL ?? "http://localhost:8000";
// Same origin as API_URL in every environment today, but must be a separate
// NEXT_PUBLIC_ variable: apiImageUrl() below produces <img src> values that
// the browser fetches directly, and non-NEXT_PUBLIC_ vars are stripped from
// the client bundle at build time.
const NEXT_PUBLIC_API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
// Backend's Docker-internal hostname, reachable only from other containers
// on the same compose network - never the browser. Used for apiFetch()'s
// JSON calls below so they go straight to the backend container instead of
// looping out through the public domain and back through Caddy. Falls back
// to API_URL where there's no such distinction (local dev has no internal
// vs. public split). Safe as a plain server-only var, unlike the pair below
// - apiFetch() is only ever called from Server Components (the page.tsx
// files), never from something that also re-runs client-side.
const INTERNAL_API_URL = process.env.INTERNAL_API_URL ?? API_URL;
// Same backend hostname as INTERNAL_API_URL, but for imageOptimizerUrl()
// below, which -unlike apiFetch()- gets called from Client Components
// (PhotoGrid, AlbumCard, FeaturedGrid all hydrate client-side). A plain
// server-only var would resolve differently there: stripped from the client
// bundle, falling back to a value that doesn't reach the backend from
// inside the frontend container - the same server/client mismatch that
// broke the lightbox before this got fixed. Being NEXT_PUBLIC_ makes it an
// identical build-time constant in both places, so there's nothing to
// mismatch. The value is meaningless outside the Docker network, so baking
// it into the public bundle isn't a real exposure - it's not a secret, just
// an address nothing outside docker-compose can do anything with.
const NEXT_PUBLIC_INTERNAL_API_URL =
  process.env.NEXT_PUBLIC_INTERNAL_API_URL ?? NEXT_PUBLIC_API_URL;

type HydraCollection<T> = {
  member: T[];
  totalItems: number;
};

export type Tag = {
  id: number;
  name: string;
  slug: string;
};

export type Camera = {
  id: number;
  name: string;
  slug: string;
};

export type Lens = {
  id: number;
  name: string;
  slug: string;
};

export type Photo = {
  id: number;
  title: string | null;
  album: { id: number; name: string } | null;
  tags: Tag[];
  camera: Camera | null;
  takenAt: string | null;
  imageUrl: string | null;
  thumbnailUrl: string | null;
  createdAt: string;
  featured: boolean;
  aperture: string | null;
  shutterSpeed: string | null;
  iso: number | null;
  focalLength: string | null;
};

export type Album = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  coverPhoto: Photo | null;
  takenAt: string | null;
  lens: Lens | null;
  createdAt: string;
};

export type Post = {
  id: number;
  title: string;
  slug: string;
  body: string;
  publishedAt: string | null;
};

export type MusicAlbum = {
  id: number;
  title: string;
  description: string | null;
  coverImageUrl: string | null;
  bandcampUrl: string | null;
  createdAt: string;
};

export type Recipe = {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  ingredients: string;
  steps: string;
  authorNotes: string | null;
  servings: string | null;
  prepTime: string | null;
  cookTime: string | null;
  imageUrl: string | null;
  publishedAt: string | null;
  createdAt: string;
};

async function apiFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${INTERNAL_API_URL}${path}`, {
    headers: { Accept: "application/ld+json" },
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error(`API request to ${path} failed: ${res.status}`);
  }

  return res.json() as Promise<T>;
}

export async function getAlbums(): Promise<Album[]> {
  const data = await apiFetch<HydraCollection<Album>>("/api/albums");
  return data.member;
}

export async function getAlbumBySlug(slug: string): Promise<Album | null> {
  const data = await apiFetch<HydraCollection<Album>>(
    `/api/albums?slug=${encodeURIComponent(slug)}`,
  );
  return data.member[0] ?? null;
}

export async function getMusicAlbums(): Promise<MusicAlbum[]> {
  const data = await apiFetch<HydraCollection<MusicAlbum>>(
    "/api/music_albums",
  );
  return data.member;
}

export function photoSortDate(photo: Photo): number {
  const time = new Date(photo.takenAt ?? photo.createdAt ?? 0).getTime();
  return Number.isNaN(time) ? 0 : time;
}

export function formatAlbumDate(dateString: string): string | null {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return null;

  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export async function getPhotos(filter?: {
  albumSlug?: string;
  tagSlug?: string;
}): Promise<Photo[]> {
  const params = new URLSearchParams();
  if (filter?.albumSlug) params.set("album.slug", filter.albumSlug);
  if (filter?.tagSlug) params.set("tags.slug", filter.tagSlug);

  const query = params.toString();
  const data = await apiFetch<HydraCollection<Photo>>(
    `/api/photos${query ? `?${query}` : ""}`,
  );
  return data.member.sort((a, b) => photoSortDate(b) - photoSortDate(a));
}

export async function getTags(): Promise<Tag[]> {
  const data = await apiFetch<HydraCollection<Tag>>("/api/tags");
  return data.member;
}

export async function getPosts(): Promise<Post[]> {
  const data = await apiFetch<HydraCollection<Post>>("/api/posts");
  return data.member;
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const data = await apiFetch<HydraCollection<Post>>(
    `/api/posts?slug=${encodeURIComponent(slug)}`,
  );
  return data.member[0] ?? null;
}

export async function getRecipes(): Promise<Recipe[]> {
  const data = await apiFetch<HydraCollection<Recipe>>("/api/recipes");
  return data.member;
}

export async function getRecipeBySlug(slug: string): Promise<Recipe | null> {
  const data = await apiFetch<HydraCollection<Recipe>>(
    `/api/recipes?slug=${encodeURIComponent(slug)}`,
  );
  return data.member[0] ?? null;
}

export function apiImageUrl(path: string | null): string | null {
  return path ? `${NEXT_PUBLIC_API_URL}${path}` : null;
}

// For next/image's `src` prop specifically: that value is embedded in the
// /_next/image?url=... query string and fetched server-side by Next itself
// to generate the resized image - the browser never connects to it directly,
// so it can point at the internal backend URL instead of the public one.
export function imageOptimizerUrl(path: string | null): string | null {
  return path ? `${NEXT_PUBLIC_INTERNAL_API_URL}${path}` : null;
}

export type PhotoThumbnail = {
  src: string | null;
  // True when src is already a pre-sized thumbnail (generated at upload
  // time or by the backfill) - callers should render it with next/image's
  // `unoptimized` so Next doesn't also try to resize an already-right-sized
  // image. False means src still needs Next's on-demand resize, same as
  // before thumbnails existed - true for anything not yet backfilled.
  preGenerated: boolean;
};

export function photoThumbnail(photo: Photo): PhotoThumbnail {
  if (photo.thumbnailUrl) {
    return { src: apiImageUrl(photo.thumbnailUrl), preGenerated: true };
  }

  return { src: imageOptimizerUrl(photo.imageUrl), preGenerated: false };
}

// Camera + shooting settings for the lightbox, e.g.
// "Canon EOS R6 · f/2.8 · 1/500s · ISO 400 · 50mm". Any piece missing from
// EXIF (or the photo predates EXIF detection) is just left out - never a
// stray "· ·" or a line of "unknown" placeholders.
export function photoSettingsLine(photo: Photo): string | null {
  const parts = [
    photo.camera?.name,
    photo.aperture,
    photo.shutterSpeed,
    photo.iso ? `ISO ${photo.iso}` : null,
    photo.focalLength,
  ].filter((part): part is string => Boolean(part));

  return parts.length > 0 ? parts.join(" · ") : null;
}

// The camera used on the most photos in an album, for the album page's
// "shot on X" line. Ties resolve to whichever camera name is encountered
// first. Returns null if no photo in the album has a camera set.
export function primaryCameraName(photos: Photo[]): string | null {
  const counts = new Map<string, number>();
  for (const photo of photos) {
    if (!photo.camera) continue;
    counts.set(photo.camera.name, (counts.get(photo.camera.name) ?? 0) + 1);
  }

  let best: string | null = null;
  let bestCount = 0;
  for (const [name, count] of counts) {
    if (count > bestCount) {
      best = name;
      bestCount = count;
    }
  }

  return best;
}
