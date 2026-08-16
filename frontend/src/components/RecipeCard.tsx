import Image from "next/image";
import Link from "next/link";
import { imageOptimizerUrl, type Recipe } from "@/lib/api";

export default function RecipeCard({ recipe }: { recipe: Recipe }) {
  const imageSrc = imageOptimizerUrl(recipe.imageUrl);

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

        {/* Two fixed columns, not a wrapped bullet-joined line - so kcal and
            protein always land in the same spot card to card, regardless of
            how long the servings/prep/cook text is on the left. */}
        <div className="mt-2 grid grid-cols-2 divide-x divide-fg/10 text-sm text-fg/60">
          <div className="flex flex-col gap-0.5 pr-3">
            {recipe.servings && <span>{recipe.servings} servings</span>}
            {recipe.prepTime && <span>Prep {recipe.prepTime}</span>}
            {recipe.cookTime && <span>Cook {recipe.cookTime}</span>}
          </div>
          <div className="flex flex-col gap-0.5 pl-3">
            <span>{recipe.kcalPerServing} kcal</span>
            {recipe.proteinPerServing != null && (
              <span>{recipe.proteinPerServing}g protein</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
