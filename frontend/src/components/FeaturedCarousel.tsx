"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { apiImageUrl, type Photo } from "@/lib/api";

export default function FeaturedCarousel({ photos }: { photos: Photo[] }) {
  const [index, setIndex] = useState(0);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const showPrev = useCallback(
    () => setIndex((i) => (i - 1 + photos.length) % photos.length),
    [photos.length],
  );
  const showNext = useCallback(
    () => setIndex((i) => (i + 1) % photos.length),
    [photos.length],
  );

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

  const photo = photos[index];
  const url = apiImageUrl(photo.imageUrl);
  const openPhoto = openIndex !== null ? photos[openIndex] : null;
  const hasMultiple = photos.length > 1;

  return (
    <div className="flex flex-col gap-3">
      <h2 className="font-[family-name:var(--font-heading)] text-lg text-fg/70">
        Featured
      </h2>

      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-md bg-fg/8 sm:aspect-[21/9]">
        <button
          type="button"
          onClick={() => setOpenIndex(index)}
          className="absolute inset-0"
          aria-label={`View ${photo.title ?? "featured photo"} full size`}
        >
          {url && (
            <Image
              src={url}
              alt={photo.title ?? "Featured photo"}
              fill
              sizes="(max-width: 1024px) 100vw, 1024px"
              priority
              className="object-cover"
            />
          )}
        </button>

        {hasMultiple && (
          <>
            <button
              type="button"
              onClick={showPrev}
              aria-label="Previous featured photo"
              className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/40 px-3 py-2 text-2xl text-white hover:bg-black/60"
            >
              &#8249;
            </button>
            <button
              type="button"
              onClick={showNext}
              aria-label="Next featured photo"
              className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/40 px-3 py-2 text-2xl text-white hover:bg-black/60"
            >
              &#8250;
            </button>
            <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-2">
              {photos.map((p, i) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Go to featured photo ${i + 1}`}
                  className={`h-2 w-2 rounded-full transition-colors ${
                    i === index ? "bg-white" : "bg-white/40"
                  }`}
                />
              ))}
            </div>
          </>
        )}
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
