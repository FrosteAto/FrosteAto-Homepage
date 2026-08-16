"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ThemeToggle from "./ThemeToggle";

const links = [
  { href: "/", label: "Home" },
  { href: "/software", label: "Software Development" },
  { href: "/frostearch", label: "FrosteArch" },
  { href: "/photography", label: "Photography" },
  { href: "/music", label: "Music" },
  { href: "/blog", label: "Blog" },
];

export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="relative z-20 w-full bg-header-footer-bg">
      <div className="relative mx-auto flex max-w-5xl items-center justify-center px-4 py-4 sm:px-6">
        <div className="absolute right-4 top-1/2 -translate-y-1/2 sm:right-6">
          <ThemeToggle />
        </div>

        <button
          type="button"
          className="text-header-footer-fg sm:hidden"
          aria-label="Toggle navigation"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="block h-0.5 w-6 bg-header-footer-fg mb-1.5" />
          <span className="block h-0.5 w-6 bg-header-footer-fg mb-1.5" />
          <span className="block h-0.5 w-6 bg-header-footer-fg" />
        </button>

        <ul className="hidden items-center gap-1 sm:flex">
          {links.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <li key={link.href} className="relative">
                <Link
                  href={link.href}
                  className="relative block px-3 py-2 text-sm font-bold text-header-footer-fg/70 transition-colors hover:text-header-footer-fg"
                >
                  {link.label}
                  {active && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute inset-x-2 -bottom-0.5 h-0.5 bg-header-footer-fg"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden sm:hidden"
          >
            {links.map((link) => (
              <li key={link.href} className="border-t border-header-footer-fg/10">
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block px-4 py-3 text-sm font-bold text-header-footer-fg"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </header>
  );
}
