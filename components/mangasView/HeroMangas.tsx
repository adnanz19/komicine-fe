"use client";

import { Search } from "lucide-react";
import React, { useRef } from "react";

interface HeroMangasProps {
  onSearch?: (keyword: string) => void;
}

const HeroMangas = ({ onSearch }: HeroMangasProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearchAction = (e?: React.FormEvent) => {
    if (e) e.preventDefault(); 
    const keyword = inputRef.current?.value;
    if (keyword !== undefined) {
      onSearch?.(keyword);
    }
  };

  const handleCategorySearch = (category: string) => {
    if (inputRef.current) {
      inputRef.current.value = category;
    }
    onSearch?.(category);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearchAction();
    }
  };
  return (
    <>
      <section className="py-24 px-6 md:px-10 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-purple-200 rounded-full mix-blend-multiply filter blur-[128px] opacity-50 -z-10"> test</div>

        <div className="w-full max-w-4xl mx-auto text-center flex flex-col items-center">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
            Temukan & Baca Manga Favoritmu Disini
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl">
            Platform baca manga terbaik dengan update tercepat. Temukan ribuan
            koleksi dari berbagai genre favoritmu sekarang.
          </p>

          <div className="w-full max-w-5xl relative mb-8">
            <input
              type="text"
              ref={inputRef}
              onKeyDown={handleKeyDown}
              placeholder="Cari judul manga (cth: Naruto, One Piece)..."
              className="w-full py-4 pl-12 pr-4 rounded-full border border-gray-300 shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
            />
            <button
              onClick={() => handleSearchAction()}
              className="absolute left-0 top-0 bottom-0 w-12 flex items-center justify-center"
            >
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 hover:text-purple-600 transition " />
            </button>
          </div>

          <div className="flex flex-wrap justify-center gap-3 text-sm text-gray-600">
            <span>Populer:</span>
            <button
              onClick={() => handleCategorySearch("Action")}
              className="hover:text-purple-600 underline decoration-dotted cursor-pointer transition-colors"
            >
              Action
            </button>
            <button
              onClick={() => handleCategorySearch("Romance")}
              className="hover:text-purple-600 underline decoration-dotted cursor-pointer transition-colors"
            >
              Romance
            </button>
            <button
              onClick={() => handleCategorySearch("Isekai")}
              className="hover:text-purple-600 underline decoration-dotted cursor-pointer transition-colors"
            >
              Isekai
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default HeroMangas;
