"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { apiImageUrl, imageOptimizerUrl, type Photo } from "@/lib/api";

export default function FeaturedGrid({ photos }: { photos: Photo[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const closeLightbox = useCallback(() => setOpenIndex(null), []);
  const lightboxPrev = useCallback(
    () =>
      setOpenIndex((i) =>
        i === null ? null : (i - 1 + photos.length) % photos.length,
      ),
    [photos.length],
  );
  const lightboxNext = useCallback(
    () => setOpenIndex((i) => (i === null ? null : (i + 1) % photos.length)),
    [photos.length],
  );

  useEffect(() => {
    if (openIndex === null) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") lightboxPrev();
      if (e.key === "ArrowRight") lightboxNext();
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [openIndex, closeLightbox, lightboxPrev, lightboxNext]);

  if (photos.length === 0) return null;

  const openPhoto = openIndex !== null ? photos[openIndex] : null;
  const hasMultiple = photos.length > 1;

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-fg/12 bg-card/50 p-4 sm:p-6">
      <h2 className="font-[family-name:var(--font-heading)] text-2xl">
        Featured
      </h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {photos.map((photo, i) => {
          const url = imageOptimizerUrl(photo.imageUrl);
          return (
            <button
              key={photo.id}
              type="button"
              onClick={() => setOpenIndex(i)}
              className="group relative aspect-square overflow-hidden rounded-md bg-fg/8"
              aria-label={`View ${photo.title ?? "featured photo"} full size`}
            >
              {url && (
                <Image
                  src={url}
                  alt={photo.title ?? "Featured photo"}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              )}
            </button>
          );
        })}
      </div>

      <AnimatePresence>
        {openPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 p-4"
            onClick={closeLightbox}
          >
            <button
              type="button"
              onClick={closeLightbox}
              aria-label="Close"
              className="absolute right-4 top-4 text-3xl text-white/80 hover:text-white"
            >
              &times;
            </button>

            {hasMultiple && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  lightboxPrev();
                }}
                aria-label="Previous photo"
                className="absolute left-4 top-1/2 -translate-y-1/2 text-4xl text-white/80 hover:text-white"
              >
                &#8249;
              </button>
            )}

            <motion.div
              key={openPhoto.id}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              className="relative flex max-h-[85vh] w-full max-w-4xl flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              {apiImageUrl(openPhoto.imageUrl) && (
                <img
                  src={apiImageUrl(openPhoto.imageUrl)!}
                  alt={openPhoto.title ?? "Photo"}
                  className="max-h-[75vh] w-auto rounded object-contain"
                />
              )}
              {openPhoto.title && (
                <p className="mt-3 text-center text-lg text-white">
                  {openPhoto.title}
                </p>
              )}
            </motion.div>

            {hasMultiple && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  lightboxNext();
                }}
                aria-label="Next photo"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-4xl text-white/80 hover:text-white"
              >
                &#8250;
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
