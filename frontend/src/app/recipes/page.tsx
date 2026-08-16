import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getRecipes, imageOptimizerUrl, type Recipe } from "@/lib/api";

export const metadata: Metadata = {
  title: "Recipes | FrosteAto",
};

function metaLine(recipe: Recipe): string | null {
  const parts = [
    recipe.servings ? `${recipe.servings} servings` : null,
    recipe.prepTime ? `Prep ${recipe.prepTime}` : null,
    recipe.cookTime ? `Cook ${recipe.cookTime}` : null,
    `${recipe.kcalPerServing} kcal`,
    recipe.proteinPerServing != null ? `${recipe.proteinPerServing}g protein` : null,
  ].filter((part): part is string => Boolean(part));

  return parts.length > 0 ? parts.join(" · ") : null;
}

export default async function RecipesPage() {
  let recipes: Recipe[] = [];
  let unavailable = false;

  try {
    recipes = await getRecipes();
  } catch {
    unavailable = true;
  }

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-8 px-4 py-10 sm:px-6">
      <div>
        <h1 className="font-[family-name:var(--font-heading)] text-4xl">
          Recipes
        </h1>
        <p className="mt-3 max-w-2xl text-lg leading-relaxed text-fg/80">
          Things I actually cook, written down before I forget how.
        </p>
      </div>

      {unavailable && (
        <p className="text-fg/60">
          Couldn&apos;t reach the recipe backend right now - check back soon.
        </p>
      )}

      {!unavailable && recipes.length === 0 && (
        <p className="text-fg/60">No recipes yet - check back soon.</p>
      )}

      {!unavailable && recipes.length > 0 && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {recipes.map((recipe) => {
            const imageSrc = imageOptimizerUrl(recipe.imageUrl);
            const meta = metaLine(recipe);

            return (
              <Link
                key={recipe.id}
                href={`/recipes/${recipe.slug}`}
                className="group block overflow-hidden rounded-md border border-fg/12 bg-card-bg"
              >
                <div className="relative aspect-[3/2] w-full overflow-hidden bg-fg/8">
                  {imageSrc && (
                    <Image
                      src={imageSrc}
                      alt={recipe.title}
                      fill
                      sizes="(max-width: 640px) 100vw, 50vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  )}
                </div>
                <div className="p-4">
                  <p className="font-[family-name:var(--font-heading)] text-lg text-fg">
                    {recipe.title}
                  </p>
                  {meta && <p className="mt-1 text-sm text-fg/60">{meta}</p>}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </main>
  );
}
