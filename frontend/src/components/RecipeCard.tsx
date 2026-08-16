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
          <ul className="list-disc space-y-0.5 pr-3 pl-4">
            {recipe.servings && <li>{recipe.servings} servings</li>}
            {recipe.prepTime && <li>Prep {recipe.prepTime}</li>}
            {recipe.cookTime && <li>Cook {recipe.cookTime}</li>}
          </ul>
          <ul className="list-disc space-y-0.5 pl-7">
            <li>{recipe.kcalPerServing} kcal</li>
            {recipe.proteinPerServing != null && (
              <li>{recipe.proteinPerServing}g protein</li>
            )}
          </ul>
        </div>
      </div>
    </Link>
  );
}
