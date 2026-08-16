import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getRecipeBySlug, imageOptimizerUrl } from "@/lib/api";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const recipe = await getRecipeBySlug(slug);

  return { title: recipe ? `${recipe.title} | FrosteAto` : "Recipe not found" };
}

export default async function RecipePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const recipe = await getRecipeBySlug(slug);

  if (!recipe) {
    notFound();
  }

  const imageSrc = imageOptimizerUrl(recipe.imageUrl);
  const ingredientLines = recipe.ingredients
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  const stepLines = recipe.steps
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  const notesParagraphs = recipe.authorNotes
    ? recipe.authorNotes.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean)
    : [];

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-8 px-4 py-10 sm:gap-10 sm:px-6">
      <div>
        <Link href="/recipes" className="text-sm text-link">
          &larr; All recipes
        </Link>
        <h1 className="mt-3 font-[family-name:var(--font-heading)] text-4xl leading-[1.05] tracking-tight sm:text-5xl">
          {recipe.title}
        </h1>

        {(recipe.servings || recipe.prepTime || recipe.cookTime) && (
          <dl className="mt-6 flex flex-wrap gap-x-10 gap-y-4 border-y border-accent-soft/60 py-4">
            {recipe.servings && (
              <div>
                <dt className="text-xs uppercase tracking-[0.18em] text-muted">
                  Serves
                </dt>
                <dd className="mt-1 font-[family-name:var(--font-heading)] text-lg">
                  {recipe.servings}
                </dd>
              </div>
            )}
            {recipe.prepTime && (
              <div>
                <dt className="text-xs uppercase tracking-[0.18em] text-muted">
                  Prep time
                </dt>
                <dd className="mt-1 font-[family-name:var(--font-heading)] text-lg">
                  {recipe.prepTime}
                </dd>
              </div>
            )}
            {recipe.cookTime && (
              <div>
                <dt className="text-xs uppercase tracking-[0.18em] text-muted">
                  Cook time
                </dt>
                <dd className="mt-1 font-[family-name:var(--font-heading)] text-lg">
                  {recipe.cookTime}
                </dd>
              </div>
            )}
          </dl>
        )}
      </div>

      {imageSrc && (
        <div className="relative aspect-[3/2] w-full overflow-hidden rounded-md border border-fg/12 bg-fg/8">
          <Image
            src={imageSrc}
            alt={recipe.title}
            fill
            priority
            sizes="(max-width: 896px) 100vw, 896px"
            className="object-cover"
          />
        </div>
      )}

      <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
        <section className="lg:col-span-5 lg:sticky lg:top-8 lg:max-h-[calc(100vh-4rem)] lg:self-start lg:overflow-y-auto">
          <div className="rounded-md border border-fg/12 bg-card-bg p-5 sm:p-6">
            <h2 className="font-[family-name:var(--font-heading)] text-2xl">
              Ingredients
            </h2>
            <ul className="mt-3 divide-y divide-fg/10 border-t border-fg/10">
              {ingredientLines.map((line, i) => (
                <li key={i} className="py-2.5 leading-relaxed">
                  {line}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="lg:col-span-7">
          <h2 className="font-[family-name:var(--font-heading)] text-2xl">
            Method
          </h2>
          <ol className="mt-4 flex list-none flex-col gap-6">
            {stepLines.map((line, i) => (
              <li
                key={i}
                className="grid grid-cols-[2.25rem_1fr] gap-x-4 sm:grid-cols-[3rem_1fr]"
              >
                <span className="font-[family-name:var(--font-heading)] text-3xl leading-none text-accent sm:text-4xl">
                  {i + 1}
                </span>
                <p className="leading-relaxed">{line}</p>
              </li>
            ))}
          </ol>
        </section>
      </div>

      {notesParagraphs.length > 0 && (
        <section className="rounded-md rounded-l-none border-l-2 border-accent-soft bg-card-bg p-5 sm:p-6">
          <h2 className="font-[family-name:var(--font-accent)] text-3xl text-accent">
            Author&apos;s notes
          </h2>
          <div className="mt-3 flex flex-col gap-3 leading-relaxed text-fg/80">
            {notesParagraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
