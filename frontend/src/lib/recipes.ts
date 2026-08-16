import type { Recipe, RecipeCategory } from "@/lib/api";

export type CategoryGroup = {
  category: RecipeCategory;
  recipes: Recipe[];
};

/**
 * Groups recipes by category, in the category list's own order (meal
 * order, e.g. Breakfast/Lunch/Dinner/Snacks/Dessert - see
 * RecipeCategory's `order: ['id' => 'ASC']` on the backend). Categories
 * with no recipes are left out entirely, same as recipes with no category
 * - both would just be empty/pointless sections in the grouped view.
 */
export function groupRecipesByCategory(
  recipes: Recipe[],
  categories: RecipeCategory[],
): { categoryGroups: CategoryGroup[]; uncategorized: Recipe[] } {
  const recipesByCategoryId = new Map<number, Recipe[]>();
  const uncategorized: Recipe[] = [];

  for (const recipe of recipes) {
    if (!recipe.category) {
      uncategorized.push(recipe);
      continue;
    }

    const list = recipesByCategoryId.get(recipe.category.id);
    if (list) {
      list.push(recipe);
    } else {
      recipesByCategoryId.set(recipe.category.id, [recipe]);
    }
  }

  const categoryGroups = categories
    .map((category) => ({
      category,
      recipes: recipesByCategoryId.get(category.id) ?? [],
    }))
    .filter((group) => group.recipes.length > 0);

  return { categoryGroups, uncategorized };
}
