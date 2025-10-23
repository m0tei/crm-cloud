"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { Download, X, ChevronLeft, ChevronRight, Heart } from "lucide-react";

interface GallerySectionProps {
  title?: string;
  images?: { src: string; title: string }[];
  hideTitle?: boolean;
  favorites: Set<string>;
  setFavorites: React.Dispatch<React.SetStateAction<Set<string>>>;
}

export default function GallerySection({
  title,
  images = [],
  hideTitle,
  favorites,
  setFavorites,
}: GallerySectionProps) {
  const [open, setOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // ESC + arrows
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "ArrowRight" && open) nextImage();
      if (e.key === "ArrowLeft" && open) prevImage();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  const handleDownload = async (url: string, title: string) => {
    const response = await fetch(url, { mode: "cors" });
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = `${title || "photo"}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(blobUrl);
  };

  const toggleFavorite = (url: string) => {
    setFavorites((prev) => {
      const newFavs = new Set(prev);
      if (newFavs.has(url)) newFavs.delete(url);
      else newFavs.add(url);
      return newFavs;
    });
  };

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setOpen(true);
  };

  const closeLightbox = () => setOpen(false);
  const prevImage = () => setCurrentIndex((p) => (p === 0 ? images.length - 1 : p - 1));
  const nextImage = () => setCurrentIndex((p) => (p === images.length - 1 ? 0 : p + 1));

  return (
    <section className="my-0">
      {!hideTitle && <h2 className="text-3xl font-semibold mb-6 text-white">{title}</h2>}

      <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-0 [column-fill:_balance]">
        {images.map((img, idx) => {
          const isFav = favorites.has(img.src);
          return (
            <div
              key={idx}
              className="relative cursor-pointer break-inside-avoid mb-0 group"
              onClick={() => openLightbox(idx)}
            >
              <Image
                src={img.src}
                alt={img.title}
                width={800}
                height={800}
                className="w-full h-auto object-cover select-none transition-transform duration-300 group-hover:scale-[1.02]"
              />
              <div
                className={`absolute bottom-2 left-2 flex gap-2 items-center transition-opacity duration-300 ${
                  isFav ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                }`}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(img.src);
                  }}
                  className={`p-2 rounded-full transition ${
                    isFav ? "bg-red-500/80 text-white" : "bg-black/60 text-white/80 hover:bg-black/80"
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isFav ? "fill-white" : ""}`} />
                </button>

                {!isFav && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownload(img.src, img.title);
                    }}
                    className="p-2 rounded-full bg-black/60 text-white/80 hover:bg-black/80 transition"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {open && images.length > 0 && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
          <div className="absolute top-5 left-5 flex gap-3">
            <button
              onClick={() => toggleFavorite(images[currentIndex].src)}
              className={`p-3 rounded-full transition ${
                favorites.has(images[currentIndex].src)
                  ? "bg-red-500/80 text-white"
                  : "bg-white/10 text-white/80 hover:bg-white/20"
              }`}
            >
              <Heart
                className={`w-6 h-6 ${
                  favorites.has(images[currentIndex].src) ? "fill-white" : ""
                }`}
              />
            </button>

            <button
              onClick={() => handleDownload(images[currentIndex].src, images[currentIndex].title)}
              className="p-3 rounded-full bg-white/10 text-white/80 hover:bg-white/20 transition"
            >
              <Download className="w-6 h-6" />
            </button>
          </div>

          <button
            onClick={closeLightbox}
            className="absolute top-5 right-5 text-white/80 hover:text-white transition"
          >
            <X className="w-8 h-8" />
          </button>

          <button
            onClick={prevImage}
            className="absolute left-5 text-white/70 hover:text-white transition"
          >
            <ChevronLeft className="w-10 h-10" />
          </button>

          <Image
            src={images[currentIndex].src}
            alt={images[currentIndex].title}
            width={1400}
            height={1000}
            className="max-h-[90vh] w-auto object-contain transition-transform duration-300"
          />

          <button
            onClick={nextImage}
            className="absolute right-5 text-white/70 hover:text-white transition"
          >
            <ChevronRight className="w-10 h-10" />
          </button>
        </div>
      )}
    </section>
  );
}