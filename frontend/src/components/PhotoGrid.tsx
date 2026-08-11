"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { apiImageUrl, type Photo } from "@/lib/api";

export default function PhotoGrid({ photos }: { photos: Photo[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const close = useCallback(() => setOpenIndex(null), []);
  const showPrev = useCallback(
    () => setOpenIndex((i) => (i === null ? null : (i - 1 + photos.length) % photos.length)),
    [photos.length],
  );
  const showNext = useCallback(
    () => setOpenIndex((i) => (i === null ? null : (i + 1) % photos.length)),
    [photos.length],
  );

  useEffect(() => {
    if (openIndex === null) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") showPrev();
      if (e.key === "ArrowRight") showNext();
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [openIndex, close, showPrev, showNext]);

  const openPhoto = openIndex !== null ? photos[openIndex] : null;

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {photos.map((photo, i) => {
          const url = apiImageUrl(photo.imageUrl);
          return (
            <button
              key={photo.id}
              type="button"
              onClick={() => setOpenIndex(i)}
              className="group relative aspect-square overflow-hidden rounded-md bg-fg/8"
            >
              {url && (
                <Image
                  src={url}
                  alt={photo.title ?? "Photo"}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
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
            onClick={close}
          >
            <button
              type="button"
              onClick={close}
              aria-label="Close"
              className="absolute right-4 top-4 text-3xl text-white/80 hover:text-white"
            >
              &times;
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                showPrev();
              }}
              aria-label="Previous photo"
              className="absolute left-4 top-1/2 -translate-y-1/2 text-4xl text-white/80 hover:text-white"
            >
              &#8249;
            </button>

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
              {(openPhoto.title || openPhoto.tags.length > 0) && (
                <div className="mt-3 flex flex-col items-center gap-2 text-center text-white">
                  {openPhoto.title && <p className="text-lg">{openPhoto.title}</p>}
                  {openPhoto.tags.length > 0 && (
                    <div className="flex flex-wrap justify-center gap-2">
                      {openPhoto.tags.map((tag) => (
                        <Link
                          key={tag.id}
                          href={`/photography/tag/${tag.slug}`}
                          className="rounded-full bg-white/10 px-3 py-1 text-xs hover:bg-white/20"
                          onClick={(e) => e.stopPropagation()}
                        >
                          #{tag.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </motion.div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                showNext();
              }}
              aria-label="Next photo"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-4xl text-white/80 hover:text-white"
            >
              &#8250;
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
