import RecipeCard from "@/components/RecipeCard";
import type { Recipe } from "@/lib/api";
import type { CategoryGroup } from "@/lib/recipes";

// A custom disclosure triangle replacing the browser's default <details>
// marker (styling of which varies awkwardly across browsers) - rotates via
// Tailwind's group-open variant, no JS needed.
function DisclosureIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      className="h-3 w-3 shrink-0 text-accent transition-transform duration-200 group-open:rotate-90"
    >
      <path d="M8 5l8 7-8 7V5z" />
    </svg>
  );
}

function CategorySection({
  id,
  name,
  recipes,
}: {
  id: string;
  name: string;
  recipes: Recipe[];
}) {
  return (
    <details id={id} open className="group">
      <summary className="flex cursor-pointer list-none items-center gap-3 border-b border-fg/12 pb-3 [&::-webkit-details-marker]:hidden">
        <DisclosureIcon />
        <h2 className="font-[family-name:var(--font-heading)] text-2xl">
          {name}
        </h2>
        <span className="text-sm text-muted">{recipes.length}</span>
      </summary>
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
        {recipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </details>
  );
}

export default function RecipeBrowser({
  categoryGroups,
  uncategorized,
}: {
  categoryGroups: CategoryGroup[];
  uncategorized: Recipe[];
}) {
  const hasUncategorized = uncategorized.length > 0;
  const sectionCount = categoryGroups.length + (hasUncategorized ? 1 : 0);

  return (
    <div className="flex flex-col gap-8">
      {sectionCount > 1 && (
        <nav
          aria-label="Jump to category"
          className="flex flex-wrap gap-y-2 border-b border-fg/12 pb-4"
        >
          {categoryGroups.map(({ category, recipes }, i) => (
            <a
              key={category.slug}
              href={`#${category.slug}`}
              className={`text-xs uppercase tracking-[0.18em] text-muted transition-colors hover:text-accent ${
                i === 0 ? "pr-6" : "border-l border-fg/15 pl-6 pr-6"
              }`}
            >
              {category.name}
              <span className="ml-1.5 text-fg/40">{recipes.length}</span>
            </a>
          ))}
          {hasUncategorized && (
            <a
              href="#uncategorized"
              className={`text-xs uppercase tracking-[0.18em] text-muted transition-colors hover:text-accent ${
                categoryGroups.length > 0 ? "border-l border-fg/15 pl-6" : ""
              }`}
            >
              Uncategorized
              <span className="ml-1.5 text-fg/40">{uncategorized.length}</span>
            </a>
          )}
        </nav>
      )}

      <div className="flex flex-col gap-10">
        {categoryGroups.map(({ category, recipes }) => (
          <CategorySection
            key={category.slug}
            id={category.slug}
            name={category.name}
            recipes={recipes}
          />
        ))}

        {hasUncategorized && (
          <CategorySection
            id="uncategorized"
            name="Uncategorized"
            recipes={uncategorized}
          />
        )}
      </div>
    </div>
  );
}
