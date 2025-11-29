"use client";

import {
  Search,
  Heart,
  Shield,
  ShieldOff,
  Film,
  Star,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useRef } from "react";
import { HeroMoviesProps } from "@/types/movie";
import { useSafeMode } from "@/hooks/useSafeMode";

const HeroMovies = ({ onSearch }: HeroMoviesProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Gunakan custom hook untuk safe mode dengan TanStack Query
  const { safeMode, toggleSafeMode } = useSafeMode();

  const handleSearchAction = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const keyword = inputRef.current?.value?.trim();

    if (keyword) {
      // Ketika search text, hapus genre parameter dan gunakan query text
      const params = new URLSearchParams();
      params.set("q", keyword);
      router.push(`/movies?${params.toString()}`);
    } else {
      // Jika kosong, kembali ke halaman default tanpa parameter
      router.push("/movies");
    }

    // Tetap panggil onSearch untuk update komponen
    onSearch?.(keyword || "");
  };

  const handleCategorySearch = (categoryName: string, genreId: number) => {
    // Clear input field ketika search by genre
    if (inputRef.current) {
      inputRef.current.value = "";
    }

    // Ketika search by genre, hapus text query dan gunakan genre parameter
    const params = new URLSearchParams();
    params.set("genre", genreId.toString());
    router.push(`/movies?${params.toString()}`);

    onSearch?.(""); // Clear text search
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearchAction();
    }
  };



  // Check if there are any active filters

  return (
    <section className="relative pt-20 pb-20 px-6 md:px-10 overflow-hidden">
      {/* Glow Ungu di tengah */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[100px] -z-10 animate-pulse"></div>

      <div className="w-full max-w-4xl mx-auto text-center flex flex-col items-center relative z-10">
        {/* Label Kecil */}
        <div className="mb-6 inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-xs font-medium backdrop-blur-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
          </span>
          Platform Movie Streaming #1 Indonesia
        </div>

        {/* Heading Utama */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 text-foreground leading-tight">
          Temukan & Tonton <br />
          <span className="text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-blue-400">
            Movie Favoritmu
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-base md:text-lg text-muted-foreground mb-10 max-w-2xl leading-relaxed">
          Platform streaming movie terlengkap dengan koleksi terbaru. Nikmati
          ribuan film dari berbagai genre dan negara dengan kualitas HD.
        </p>

        {/* Search Bar Container */}
        <div className="w-full max-w-2xl relative mb-8 group">
          <div className="absolute -inset-1 bg-linear-to-r from-purple-600 to-blue-600 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>

          <div className="relative flex items-center">
            <input
              type="text"
              ref={inputRef}
              onKeyDown={handleKeyDown}
              placeholder="Cari judul movie (cth: Spider-Man, Avatar)..."
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


        {/* Safe Mode Toggle */}
        <div className="mb-8 flex items-center justify-center gap-3">
          <button
            onClick={toggleSafeMode}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-300 ${
              safeMode
                ? "bg-green-600/20 border-green-500/30 text-green-400 hover:bg-green-600/30"
                : "bg-red-600/20 border-red-500/30 text-red-400 hover:bg-red-600/30"
            }`}
          >
            {safeMode ? (
              <Shield className="w-4 h-4" />
            ) : (
              <ShieldOff className="w-4 h-4" />
            )}
            <span className="text-sm font-medium">
              {safeMode ? "Safe Mode: ON" : "Safe Mode: OFF"}
            </span>
          </button>
          <span className="text-xs text-muted-foreground">
            {safeMode
              ? "Menyembunyikan konten dewasa"
              : "Menampilkan semua konten"}
          </span>
        </div>

        {/* Movie Stats */}
        <h2 className="text-slate-400 ">
          Movie Yang Ditampilkan Pastinya Memiliki :{" "}
        </h2>
        <div className="mt-3 flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Film className="w-4 h-4" />
            <span>Ribuan Film</span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4" />
            <span>Rating Tinggi</span>
          </div>
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4" />
            <span>Favorit User</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroMovies;
