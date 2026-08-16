import type { Metadata } from "next";
import Link from "next/link";
import { getPosts, type Post } from "@/lib/api";

export const metadata: Metadata = {
  title: "Blog | FrosteAto",
  alternates: {
    types: { "application/rss+xml": "/blog/rss.xml" },
  },
};

function formatDate(iso: string | null) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function excerpt(body: string, length = 200) {
  const flat = body.replace(/\s+/g, " ").trim();
  return flat.length > length ? `${flat.slice(0, length).trim()}…` : flat;
}

export default async function BlogPage() {
  let posts: Post[] = [];
  let unavailable = false;

  try {
    posts = await getPosts();
  } catch {
    unavailable = true;
  }

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-4 py-10 sm:px-6">
      <div className="flex items-baseline justify-between">
        <h1 className="font-[family-name:var(--font-heading)] text-4xl">Blog</h1>
        <Link href="/blog/rss.xml" className="text-sm text-link">
          RSS
        </Link>
      </div>

      {unavailable && (
        <p className="text-fg/60">
          Couldn&apos;t reach the blog backend right now - check back soon.
        </p>
      )}

      {!unavailable && posts.length === 0 && (
        <p className="text-fg/60">Nothing posted yet - check back soon.</p>
      )}

      <div className="flex flex-col gap-8">
        {posts.map((post) => (
          <article key={post.id} className="border-b border-fg/12 pb-8">
            <Link href={`/blog/${post.slug}`}>
              <h2 className="font-[family-name:var(--font-heading)] text-2xl hover:text-accent">
                {post.title}
              </h2>
            </Link>
            <p className="mt-1 text-sm text-muted">{formatDate(post.publishedAt)}</p>
            <p className="mt-3 leading-relaxed text-fg/80">{excerpt(post.body)}</p>
            <Link
              href={`/blog/${post.slug}`}
              className="mt-2 inline-block text-link"
            >
              Read more
            </Link>
          </article>
        ))}
      </div>
    </main>
  );
}
