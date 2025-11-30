"use client";

import React from "react";
import {
  LayoutGrid,
  Book,
  MonitorPlay,
  Clapperboard,
  Search,
} from "lucide-react";

interface HeroFavoritesProps {
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
  favoritesCount: number;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const HeroFavorites = ({
  activeFilter,
  setActiveFilter,
  favoritesCount,
  searchQuery,
  setSearchQuery,
}: HeroFavoritesProps) => {
  const filterCategories = [
    { id: "all", name: "Semua", icon: <LayoutGrid className="w-3 h-3" /> },
    { id: "manga", name: "Manga", icon: <Book className="w-3 h-3" /> },
    { id: "anime", name: "Anime", icon: <MonitorPlay className="w-3 h-3" /> },
    { id: "movie", name: "Movie", icon: <Clapperboard className="w-3 h-3" /> },
  ];

  return (
    <section className="relative pt-20 pb-20 px-6 md:px-10 overflow-hidden">
      <div className="w-full max-w-4xl mx-auto text-center flex flex-col items-center relative z-10">
        
        {/* Badge Kecil */}
        <div className="mb-6 inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-xs font-medium backdrop-blur-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
          </span>
          My Personal Collection
        </div>

        {/* Heading Utama (Ukuran font disamakan dengan HeroMangas) */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 text-foreground leading-tight">
          Koleksi <br />
          <span className="text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-blue-400">
            Favoritmu
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-base md:text-lg text-muted-foreground mb-10 max-w-2xl leading-relaxed">
          Menyimpan total <span className="text-foreground font-bold">{favoritesCount}</span> item yang siap untuk kamu tonton atau baca kembali kapan saja tanpa perlu mencarinya lagi.
        </p>

        {/* Search Bar Container (Style disamakan persis) */}
        <div className="w-full max-w-2xl relative mb-8 group">
          <div className="absolute -inset-1 bg-linear-to-r from-purple-600 to-blue-600 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>

          <div className="relative flex items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari judul di koleksi favorit..."
              className="w-full py-4 pl-12 pr-14 rounded-full bg-card/90 border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 shadow-xl backdrop-blur-xl transition-all"
            />

            <Search className="absolute left-4 text-muted-foreground w-5 h-5 peer-focus:text-purple-400 transition-colors" />

            {/* Tombol Search di kanan (Visual saja, karena filter sudah realtime) */}
            <button
              className="absolute right-2 top-2 bottom-2 bg-card hover:bg-purple-600 text-foreground p-2 rounded-full transition-all duration-300 border border-border hover:border-purple-500 cursor-pointer"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter Categories */}
        <div className="flex flex-wrap justify-center items-center gap-3 text-sm">
          <span className="text-muted-foreground mr-2">Filter:</span>
          {filterCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveFilter(cat.id)}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full border transition-all duration-300 text-xs md:text-sm backdrop-blur-sm cursor-pointer ${
                activeFilter === cat.id
                  ? "bg-purple-600 border-purple-500 text-white"
                  : "border-border bg-card/50 text-muted-foreground hover:text-foreground hover:bg-purple-600 hover:border-purple-500"
              }`}
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

export default HeroFavorites;