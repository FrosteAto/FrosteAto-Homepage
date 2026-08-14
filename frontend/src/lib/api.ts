const API_URL = process.env.API_URL ?? "http://localhost:8000";
// Same origin as API_URL in every environment today, but must be a separate
// NEXT_PUBLIC_ variable: apiImageUrl() below produces <img src> values that
// the browser fetches directly, and non-NEXT_PUBLIC_ vars are stripped from
// the client bundle at build time.
const NEXT_PUBLIC_API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

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

export type Photo = {
  id: number;
  title: string | null;
  album: { id: number; name: string } | null;
  tags: Tag[];
  camera: Camera | null;
  takenAt: string | null;
  imageUrl: string | null;
  createdAt: string;
  featured: boolean;
};

export type Album = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  coverPhoto: Photo | null;
  takenAt: string | null;
  createdAt: string;
};

export type Post = {
  id: number;
  title: string;
  slug: string;
  body: string;
  publishedAt: string | null;
};

async function apiFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
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

export function photoSortDate(photo: Photo): number {
  const time = new Date(photo.takenAt ?? photo.createdAt ?? 0).getTime();
  return Number.isNaN(time) ? 0 : time;
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

export function apiImageUrl(path: string | null): string | null {
  return path ? `${NEXT_PUBLIC_API_URL}${path}` : null;
}
