import Link from "next/link";

const socials = [
  { href: "https://github.com/FrosteAto", icon: "fa-brands fa-github" },
  { href: "https://www.linkedin.com/in/djob/", icon: "fa-brands fa-linkedin" },
  { href: "mailto:FrosteAto.exparrot@protonmail.com", icon: "fa-solid fa-envelope" },
];

export default function Footer() {
  return (
    <footer className="mt-auto flex flex-col items-center justify-end gap-4 bg-chrome px-4 pb-10 pt-16 text-center text-chrome-fg">
      <p className="font-[family-name:var(--font-accent)] text-3xl sm:text-4xl">
        &quot;That is what it is to be human:
      </p>
      <p className="-mt-4 font-[family-name:var(--font-accent)] text-3xl sm:text-4xl">
        To make yourself more than you are.&quot;
      </p>
      <p className="text-sm text-chrome-fg/70">-Jean Luc Picard, 2002</p>

      <div className="flex gap-4 text-xl">
        {socials.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="text-chrome-accent transition-colors hover:text-chrome-fg"
          >
            <i className={s.icon} aria-hidden />
          </Link>
        ))}
      </div>

      <p className="text-sm text-chrome-fg/70">Made lovingly by hand</p>
      <p className="text-sm text-chrome-fg/70">
        &copy; FrosteAto O&apos;Brien {new Date().getFullYear()}
      </p>
    </footer>
  );
}
