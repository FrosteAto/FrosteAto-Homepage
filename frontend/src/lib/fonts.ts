import localFont from "next/font/local";

export const helveticaNeue = localFont({
  src: "../fonts/HelveticaNeueBold.ttf",
  variable: "--font-heading",
  display: "swap",
});

export const commitMono = localFont({
  src: "../fonts/CommitMono.otf",
  variable: "--font-body",
  display: "swap",
});

export const satisfy = localFont({
  src: "../fonts/Satisfy.ttf",
  variable: "--font-accent",
  display: "swap",
});

export const ibmPlexMono = localFont({
  src: "../fonts/IBMPlexMono.ttf",
  variable: "--font-plex-mono",
  display: "swap",
});
