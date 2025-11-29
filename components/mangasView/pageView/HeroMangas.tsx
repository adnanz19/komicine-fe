"use client";

import { Search, Sparkles, TrendingUp, Heart, Zap } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useRef } from "react";

interface HeroMangasProps {
  onSearch?: (keyword: string) => void;
}

const HeroMangas = ({ onSearch }: HeroMangasProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSearchAction = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const keyword = inputRef.current?.value;
    if (keyword) {
      // Update URL dengan search parameter
      const params = new URLSearchParams(searchParams);
      params.set("q", keyword);
      router.push(`/mangas?${params.toString()}`);
    } else {
      // Jika kosong, hapus search parameter
      const params = new URLSearchParams(searchParams);
      params.delete("q");
      const newUrl = params.toString()
        ? `/mangas?${params.toString()}`
        : "/mangas";
      router.push(newUrl);
    }

    // Tetap panggil onSearch untuk update komponen
    onSearch?.(keyword || "");
  };

  const handleCategorySearch = (category: string) => {
    if (inputRef.current) {
      inputRef.current.value = category;
    }

    // Update URL dengan kategori
    const params = new URLSearchParams(searchParams);
    params.set("q", category);
    router.push(`/mangas?${params.toString()}`);

    onSearch?.(category);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearchAction();
    }
  };

  const popularCategories = [
    { name: "Action", icon: <Zap className="w-3 h-3" /> },
    { name: "Romance", icon: <Heart className="w-3 h-3" /> },
    { name: "Isekai", icon: <Sparkles className="w-3 h-3" /> },
    { name: "Fantasy", icon: <TrendingUp className="w-3 h-3" /> },
  ];

  return (
    <section className="relative pt-32 pb-20 px-6 md:px-10 overflow-hidden bg-background">
      
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[100px] -z-10 animate-pulse"></div>

      <div className="absolute bottom-0 left-0 right-0 h-24 bg-linear-to-t from-background to-transparent -z-10"></div>

      <div className="w-full max-w-4xl mx-auto text-center flex flex-col items-center relative z-10">
        <div className="mb-6 inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-xs font-medium backdrop-blur-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
          </span>
          Website Baca Manga #1 Indonesia
        </div>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 text-foreground leading-tight">
          Temukan & Baca <br />
          <span className="text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-blue-400">
            Manga Favoritmu
          </span>
        </h1>

        <p className="text-base md:text-lg text-muted-foreground mb-10 max-w-2xl leading-relaxed">
          Platform baca manga terlengkap dengan update tercepat. Nikmati ribuan
          koleksi dari berbagai genre secara gratis dan tanpa iklan yang
          mengganggu.
        </p>

        <div className="w-full max-w-2xl relative mb-8 group">
          {/* Efek Glow di belakang input saat hover */}
          <div className="absolute -inset-1 bg-linear-to-r from-purple-600 to-blue-600 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>

          <div className="relative flex items-center">
            <input
              type="text"
              ref={inputRef}
              onKeyDown={handleKeyDown}
              placeholder="Cari judul manga (cth: Naruto, One Piece)..."
              className="w-full py-4 pl-12 pr-14 rounded-full bg-card/90 border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 shadow-xl backdrop-blur-xl transition-all"
              defaultValue={searchParams.get("q") || ""}
            />

            <Search className="absolute left-4 text-muted-foreground w-5 h-5 peer-focus:text-purple-400 transition-colors" />

            <button
              onClick={() => handleSearchAction()}
              className="absolute right-2 top-2 bottom-2 bg-card hover:bg-purple-600 text-foreground p-2 rounded-full transition-all duration-300 border border-border hover:border-purple-500"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-3 text-sm">
          <span className="text-muted-foreground mr-2">Populer:</span>
          {popularCategories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => handleCategorySearch(cat.name)}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-border bg-card/50 text-muted-foreground hover:text-foreground hover:bg-purple-600 hover:border-purple-500 transition-all duration-300 text-xs md:text-sm backdrop-blur-sm"
            >
              {cat.icon}
              {cat.name}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroMangas;
