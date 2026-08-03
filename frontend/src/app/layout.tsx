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
} from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Daniel O'Brien",
  description:
    "Daniel O'Brien - Software Developer, Computer Scientist, & General Creator.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en-GB"
      className={`${helveticaNeue.variable} ${commitMono.variable} ${satisfy.variable} ${ibmPlexMono.variable}`}
    >
      <body className="flex min-h-screen flex-col antialiased">
        <Script
          src="https://kit.fontawesome.com/787a4a31b3.js"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        <Nav />
        <PageTransition>{children}</PageTransition>
        <Footer />
      </body>
    </html>
  );
}
