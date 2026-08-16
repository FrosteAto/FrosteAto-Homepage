"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const socials = [
  { href: "https://github.com/FrosteAto", icon: "fa-brands fa-github" },
  { href: "https://www.linkedin.com/in/djob/", icon: "fa-brands fa-linkedin" },
  { href: "mailto:FrosteAto.exparrot@protonmail.com", icon: "fa-solid fa-envelope" },
];

type Quote = { text: string; attribution: string };

const homeQuote: Quote = {
  text: '"That is what it is to be human: To make yourself more than you are."',
  attribution: "-Jean Luc Picard, 2002",
};

// Longer/more-specific prefixes aren't needed here since every current
// top-level route is disjoint (no route is a prefix of another). If that
// ever changes, order the more specific prefix first - find() takes the
// first match.
const quotesByPrefix: { prefix: string; quote: Quote }[] = [
  {
    prefix: "/software",
    quote: {
      text: '"It is possible to commit no mistakes and still lose. That is not a weakness. That is life."',
      attribution: "-Jean-Luc Picard",
    },
  },
  {
    prefix: "/frostearch",
    quote: {
      text: "\"Things are only impossible until they're not!\"",
      attribution: "-Jean-Luc Picard",
    },
  },
  {
    prefix: "/photography",
    quote: {
      text: '"Seize the time, Meribor. Live now. Make now always the most precious time. Now will never come again."',
      attribution: "-Jean-Luc Picard",
    },
  },
  {
    prefix: "/music",
    quote: {
      text: "\"I know Hamlet. And what he might say with irony, I say with conviction. 'What a piece of work is a man! How noble in reason! how infinite in faculty! in form, in moving, how express and admirable! in action how like an angel! in apprehension how like a god!'\"",
      attribution: "-Jean-Luc Picard",
    },
  },
  {
    prefix: "/blog",
    quote: {
      text: '"No being is so important that he can usurp the rights of another"',
      attribution: "-Jean-Luc Picard",
    },
  },
  {
    prefix: "/recipes",
    quote: {
      text: '"Tea. Earl Grey. Hot."',
      attribution: "-Jean-Luc Picard",
    },
  },
];

function quoteForPath(pathname: string): Quote {
  if (pathname === "/") return homeQuote;

  const match = quotesByPrefix.find(({ prefix }) => pathname.startsWith(prefix));
  return match ? match.quote : homeQuote;
}

export default function Footer() {
  const pathname = usePathname();
  const quote = quoteForPath(pathname);

  return (
    <footer className="mt-auto flex flex-col items-center justify-end gap-4 bg-header-footer-bg px-4 pb-10 pt-16 text-center text-header-footer-fg">
      <p className="max-w-2xl font-[family-name:var(--font-accent)] text-3xl sm:text-4xl">
        {quote.text}
      </p>
      <p className="text-sm text-header-footer-fg/70">{quote.attribution}</p>

      <div className="flex gap-4 text-xl">
        {socials.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="text-header-footer-accent transition-colors hover:text-header-footer-fg"
          >
            <i className={s.icon} aria-hidden />
          </Link>
        ))}
      </div>

      <p className="text-sm text-header-footer-fg/70">Made lovingly by hand</p>
      <p className="text-sm text-header-footer-fg/70">
        &copy; FrosteAto {new Date().getFullYear()}
      </p>
    </footer>
  );
}
