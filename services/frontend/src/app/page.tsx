"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import GallerySection from "./components/GallerySection";

interface Photo {
  id?: number;
  src: string;
  title: string;
  category?: string;
}

type TabType = "elevi" | "banchet" | "festivitate" | "favorite";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<TabType>("elevi");
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [photos, setPhotos] = useState<Photo[]>([]);

  // Mock data for now
  useEffect(() => {
    const baseElevi = [
      {
        src: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e",
        title: "Elev 1",
      },
      {
        src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
        title: "Elev 2",
      },
      {
        src: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d",
        title: "Elev 3",
      },
      {
        src: "https://images.unsplash.com/photo-1544005313-94ddf0286df2",
        title: "Elev 4",
      },
    ];

    const eleviPhotos = Array.from({ length: 12 }, (_, i) => ({
      ...baseElevi[i % baseElevi.length],
      category: "elevi",
    }));

    const baseBanchet = [
      {
        src: "https://images.unsplash.com/photo-1532634896-26909d0d4b6a",
        title: "Banchet 1",
      },
      {
        src: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1",
        title: "Banchet 2",
      },
      {
        src: "https://images.unsplash.com/photo-1521334884684-d80222895322",
        title: "Banchet 3",
      },
    ];

    const banchetPhotos = Array.from({ length: 9 }, (_, i) => ({
      ...baseBanchet[i % baseBanchet.length],
      category: "banchet",
    }));

    const baseFestivitate = [
      {
        src: "https://images.unsplash.com/photo-1551836022-4c4c79ecde51",
        title: "Festivitate 1",
      },
      {
        src: "https://images.unsplash.com/photo-1524503033411-c9566986fc8f",
        title: "Festivitate 2",
      },
      {
        src: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e",
        title: "Festivitate 3",
      },
    ];

    const festivitatePhotos = Array.from({ length: 9 }, (_, i) => ({
      ...baseFestivitate[i % baseFestivitate.length],
      category: "festivitate",
    }));

    setPhotos([...eleviPhotos, ...banchetPhotos, ...festivitatePhotos]);
  }, []);

  // Filter by category
  const eleviPhotos = photos.filter((p) => p.category === "elevi");
  const banchetPhotos = photos.filter((p) => p.category === "banchet");
  const festivitatePhotos = photos.filter((p) => p.category === "festivitate");
  const favoritePhotos = photos.filter((img) => favorites.has(img.src));

  const categories = [
    { id: "elevi", label: "Elevi" },
    { id: "banchet", label: "Banchet" },
    { id: "festivitate", label: "Festivitate" },
    { id: "favorite", label: "Favorite" },
  ];

  // Example placeholder to show typed favorites logic
  useEffect(() => {
    async function fetchFavorites() {
      try {
        // const res = await api.get("/favorites/");
        // const favs = new Set(res.data.map((f: FavoriteResponse) => f.photo));
        // setFavorites(favs);
      } catch (_) {
        console.warn("Favorites fetch skipped (mock mode)");
      }
    }
    fetchFavorites();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero section */}
      <div className="relative w-full h-[80vh] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d"
          alt="Class Cover"
          fill
          className="object-cover opacity-70"
          priority
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <h1 className="text-5xl font-bold mb-4 drop-shadow-lg">
            Clasa a XII-a C — Promoția 2025
          </h1>
          <p className="text-lg text-gray-300">
            Colegiul Național Exemplu — Album de amintiri
          </p>
        </div>
      </div>

      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-neutral-900/70 backdrop-blur-md border-b border-neutral-800 shadow-md">
        <div className="max-w-5xl mx-auto flex justify-center gap-8 py-4 px-4">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id as TabType)}
              className={`relative text-sm sm:text-base font-medium tracking-wide transition ${
                activeTab === cat.id
                  ? "text-white"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              {cat.label}
              {activeTab === cat.id && (
                <span className="absolute left-0 -bottom-1 w-full h-[2px] bg-gradient-to-r from-white to-gray-400 rounded-full animate-slideIn" />
              )}
            </button>
          ))}
        </div>
      </nav>

      {/* Content */}
      <div className="w-full mx-0 p-0">
        {activeTab === "elevi" && (
          <GallerySection
            images={eleviPhotos}
            hideTitle
            favorites={favorites}
            setFavorites={setFavorites}
          />
        )}
        {activeTab === "banchet" && (
          <GallerySection
            images={banchetPhotos}
            hideTitle
            favorites={favorites}
            setFavorites={setFavorites}
          />
        )}
        {activeTab === "festivitate" && (
          <GallerySection
            images={festivitatePhotos}
            hideTitle
            favorites={favorites}
            setFavorites={setFavorites}
          />
        )}
        {activeTab === "favorite" && (
          <GallerySection
            images={favoritePhotos}
            hideTitle
            favorites={favorites}
            setFavorites={setFavorites}
          />
        )}
      </div>
    </div>
  );
}