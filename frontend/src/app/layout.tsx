import type { Metadata } from "next";
import Script from "next/script";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import {
  helveticaNeue,
  commitMono,
  satisfy,
  ibmPlexMono,
  jetbrainsMono,
} from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "FrosteAto",
  description:
    "FrosteAto - Software Developer, Computer Scientist, & General Creator.",
};

// TEMPORARY: defaults to light regardless of system preference - dark mode
// still needs work. Explicit toggles (localStorage) are still respected.
// Revert by restoring the matchMedia('(prefers-color-scheme: dark)') fallback.
const THEME_INIT_SCRIPT = `(function () {
  try {
    var stored = localStorage.getItem('theme');
    var isDark = stored === 'dark';
    if (isDark) document.documentElement.classList.add('dark');
  } catch (e) {}
})();`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en-GB"
      className={`${helveticaNeue.variable} ${commitMono.variable} ${satisfy.variable} ${ibmPlexMono.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="flex min-h-screen flex-col antialiased">
        <Script
          src="https://kit.fontawesome.com/787a4a31b3.js"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        <Nav />
        <PageTransition>{children}</PageTransition>
        <Footer year={new Date().getFullYear()} />
      </body>
    </html>
  );
}
