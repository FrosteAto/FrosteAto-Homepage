import Image from "next/image";
import { accentBg, accentText } from "@/lib/khioneAccent";
import type { Accent } from "@/lib/khioneAccent";
import type { PackageGroup } from "@/components/PackageList";
import type { Topic } from "@/components/TopicGrid";

export type EditionData = {
  id: string;
  name: string;
  image: string;
  accent: Accent;
  role: string;
  de: string;
  terminal: string;
  size: string;
  intro: string;
  topics: Topic[];
  packages: PackageGroup[];
};

function CategoryCard({
  group,
  accent,
  defaultOpen,
}: {
  group: PackageGroup;
  accent: Accent;
  defaultOpen: boolean;
}) {
  return (
    <details
      open={defaultOpen}
      className="group rounded-lg border border-fg/10 bg-card-bg px-3.5 py-3"
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-2 text-sm font-bold [&::-webkit-details-marker]:hidden">
        <span className="flex-1">{group.category}</span>
        <span className={`text-xs ${accentText[accent]}`}>{group.items.length}</span>
        <span className="text-fg/40 group-open:hidden">+</span>
        <span className="hidden text-fg/40 group-open:inline">–</span>
      </summary>
      <p className="mt-2 text-xs leading-relaxed text-fg/60">{group.items.join(", ")}</p>
    </details>
  );
}

export default function EditionInfographic({ edition }: { edition: EditionData }) {
  const packageTotal = edition.packages.reduce((sum, g) => sum + g.items.length, 0);

  return (
    <section id={edition.id} className="scroll-mt-24">
      <div className="flex flex-wrap items-center gap-5 border-b border-fg/10 pb-6">
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full sm:h-24 sm:w-24">
          <Image src={edition.image} alt="" fill sizes="200px" className="object-cover object-left" />
        </div>
        <div>
          <p className="font-[family-name:var(--font-jetbrains-mono)] text-2xl sm:text-3xl">
            Khione {edition.name}
          </p>
          <p className="mt-1 text-fg/70">{edition.role}</p>
          <p className="mt-1 text-sm text-fg/50">{edition.de} · {edition.terminal}</p>
        </div>
      </div>

      <div className={`mt-8 grid grid-cols-3 gap-px overflow-hidden rounded-xl ${accentBg[edition.accent]}`}>
        <div className="bg-card-bg px-3 py-5 text-center sm:py-6">
          <p className={`font-[family-name:var(--font-jetbrains-mono)] text-2xl sm:text-3xl ${accentText[edition.accent]}`}>
            {edition.size}
          </p>
          <span className="text-[11px] uppercase tracking-wide text-fg/50">Install size</span>
        </div>
        <div className="bg-card-bg px-3 py-5 text-center sm:py-6">
          <p className={`font-[family-name:var(--font-jetbrains-mono)] text-2xl sm:text-3xl ${accentText[edition.accent]}`}>
            {packageTotal}
          </p>
          <span className="text-[11px] uppercase tracking-wide text-fg/50">Packages</span>
        </div>
        <div className="bg-card-bg px-3 py-5 text-center sm:py-6">
          <p className={`font-[family-name:var(--font-jetbrains-mono)] text-2xl sm:text-3xl ${accentText[edition.accent]}`}>
            {edition.packages.length}
          </p>
          <span className="text-[11px] uppercase tracking-wide text-fg/50">Categories</span>
        </div>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          {edition.topics.map((topic, i) => (
            <div key={topic.title} className="mb-5 flex gap-4">
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-[family-name:var(--font-jetbrains-mono)] text-sm font-bold text-bg ${accentBg[edition.accent]}`}
              >
                {i + 1}
              </span>
              <div>
                <p className="font-bold">{topic.title}</p>
                <p className="mt-0.5 text-sm leading-relaxed text-fg/70">{topic.body}</p>
              </div>
            </div>
          ))}
          <p className={`mt-2 border-l-4 border-current pl-4 ${accentText[edition.accent]}`}>
            <span className="italic text-fg/80">&ldquo;{edition.intro}&rdquo;</span>
          </p>
        </div>

        <div className="h-fit">
          {/* Single sequential list below sm, so category order reads top-to-bottom as written. */}
          <div className="flex flex-col gap-3 sm:hidden">
            {edition.packages.map((group, i) => (
              <CategoryCard key={group.category} group={group} accent={edition.accent} defaultOpen={i < 2} />
            ))}
          </div>

          {/* Two genuinely independent columns from sm up - opening a card in one never
              reflows the other, since they aren't sharing grid rows. */}
          <div className="hidden gap-3 sm:flex">
            {[0, 1].map((col) => (
              <div key={col} className="flex flex-1 flex-col gap-3">
                {edition.packages
                  .map((group, i) => ({ group, i }))
                  .filter(({ i }) => i % 2 === col)
                  .map(({ group, i }) => (
                    <CategoryCard key={group.category} group={group} accent={edition.accent} defaultOpen={i < 2} />
                  ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
