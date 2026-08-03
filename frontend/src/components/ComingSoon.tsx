export default function ComingSoon({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-start justify-center gap-4 px-4 py-20 sm:px-6">
      <h1 className="font-[family-name:var(--font-heading)] text-4xl">
        {title}
      </h1>
      <p className="max-w-xl text-lg leading-relaxed text-ink/80">
        {description}
      </p>
      <p className="text-sm font-bold uppercase tracking-wide text-grey">
        Coming soon
      </p>
    </main>
  );
}
