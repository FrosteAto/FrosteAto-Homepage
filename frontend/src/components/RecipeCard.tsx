import Image from "next/image";
import Link from "next/link";
import { imageOptimizerUrl, type Recipe } from "@/lib/api";

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

export default function RecipeCard({ recipe }: { recipe: Recipe }) {
  const imageSrc = imageOptimizerUrl(recipe.imageUrl);
  const meta = metaLine(recipe);

  return (
    <Link
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
}
