import type { Metadata } from "next";
import Image from "next/image";
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
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-10 sm:px-6">
      {imageSrc && (
        <Image
          src={imageSrc}
          alt={recipe.title}
          width={800}
          height={533}
          className="h-auto w-full rounded-md object-cover"
        />
      )}

      <h1 className="font-[family-name:var(--font-heading)] text-4xl">
        {recipe.title}
      </h1>

      {(recipe.servings || recipe.prepTime || recipe.cookTime) && (
        <dl className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-muted">
          {recipe.servings && (
            <div className="flex gap-1">
              <dt className="font-bold">Servings</dt>
              <dd>{recipe.servings}</dd>
            </div>
          )}
          {recipe.prepTime && (
            <div className="flex gap-1">
              <dt className="font-bold">Prep</dt>
              <dd>{recipe.prepTime}</dd>
            </div>
          )}
          {recipe.cookTime && (
            <div className="flex gap-1">
              <dt className="font-bold">Cook</dt>
              <dd>{recipe.cookTime}</dd>
            </div>
          )}
        </dl>
      )}

      <section>
        <h2 className="font-[family-name:var(--font-heading)] text-2xl">
          Ingredients
        </h2>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          {ingredientLines.map((line, i) => (
            <li key={i}>{line}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="font-[family-name:var(--font-heading)] text-2xl">
          Method
        </h2>
        <ol className="mt-2 list-decimal space-y-2 pl-5">
          {stepLines.map((line, i) => (
            <li key={i}>{line}</li>
          ))}
        </ol>
      </section>

      {notesParagraphs.length > 0 && (
        <section>
          <h2 className="font-[family-name:var(--font-heading)] text-2xl">
            Author&apos;s notes
          </h2>
          <div className="mt-2 flex flex-col gap-3 text-fg/80">
            {notesParagraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
