"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import {
  Heart,
  BookOpen,
  CheckCircle,
  Clock,
  Star,
  Clapperboard,
  MonitorPlay,
  Book,
} from "lucide-react";

interface ListFavoritesProps {
  loading: boolean;
  favorites: any[];
  activeFilter: string;
  onRemove: (id: string) => void;
}

const ListFavorites = ({
  loading,
  favorites,
  activeFilter,
  onRemove,
}: ListFavoritesProps) => {

  // Helper Status Icon (Digabungkan agar support Anime & Manga terms)
  const getStatusIcon = (status: string) => {
    if (!status) return <Clock className="w-4 h-4 text-slate-500" />;
    const s = status.toLowerCase();
    
    if (s.includes("finished") || s.includes("completed")) {
      return <CheckCircle className="w-4 h-4 text-emerald-400" />;
    }
    if (s.includes("publishing") || s.includes("airing")) {
      return <Clock className="w-4 h-4 text-blue-400" />;
    }
    return <Clock className="w-4 h-4 text-slate-500" />;
  };

  // Helper Icon Type
  const getTypeIcon = (type: string) => {
      if (type === "Manga") return <Book className="w-3 h-3" />;
      if (type === "Anime") return <MonitorPlay className="w-3 h-3" />;
      return <Clapperboard className="w-3 h-3" />;
  }

  // --- LOADING STATE ---
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 relative z-10">
        {Array(10)
          .fill(0)
          .map((_, index) => (
            <Card
              key={index}
              className="rounded-xl border border-slate-800 bg-slate-900 shadow-sm overflow-hidden h-full"
            >
              <div className="animate-pulse bg-slate-800 aspect-2/3 w-full"></div>
              <div className="p-4 space-y-3">
                 <div className="animate-pulse bg-slate-800 h-5 rounded w-3/4"></div>
                 <div className="animate-pulse bg-slate-800 h-4 rounded w-1/2"></div>
              </div>
            </Card>
          ))}
      </div>
    );
  }

  // --- EMPTY STATE ---
  if (favorites.length === 0) {
    return (
      <div className="text-center py-20 bg-transparent rounded-xl border border-dashed border-slate-800 relative z-10">
        <Heart className="w-16 h-16 text-slate-700 mx-auto mb-4" />
        <p className="text-gray-400 text-lg">
          Tidak ada {activeFilter === "all" ? "item" : activeFilter} di koleksi.
        </p>
        <Link
          href={
            activeFilter === "manga"
              ? "/mangas"
              : activeFilter === "anime"
              ? "/animes"
              : activeFilter === "movie"
              ? "/movies"
              : "/mangas"
          }
          className="text-purple-400 hover:text-purple-300 text-sm mt-2 inline-block font-medium hover:underline"
        >
          Cari {activeFilter === "all" ? "Manga, Anime, atau Film" : activeFilter}{" "}
          Baru
        </Link>
      </div>
    );
  }

  // --- MAIN CONTENT ---
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 animate-in fade-in zoom-in duration-500 relative z-10">
      {favorites.map((item) => (
        <Card
          key={item.id}
          // Style Class disamakan dengan ListMangas (Shadow, Hover translate, Border logic)
          className="group relative flex flex-col bg-slate-900 rounded-xl border border-slate-800 shadow-md hover:shadow-2xl hover:shadow-black/50 hover:-translate-y-1 hover:border-slate-600 transition-all duration-300 overflow-hidden p-0"
        >
          {/* IMAGE SECTION */}
          <div className="relative w-full aspect-2/3 overflow-hidden bg-slate-800">
            <Link
              href={`/${
                item.type ? item.type.toLowerCase() + "s" : "mangas"
              }/detail/${item.mal_id}`}
            >
              <Image
                fill
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                src={item.image_url || "/placeholder.jpg"}
                alt={item.title}
                // Style Image disamakan (Scale on hover, Opacity)
                className="object-cover transition-transform duration-500 group-hover:scale-110 opacity-90 group-hover:opacity-90 cursor-pointer"
                loading="lazy"
              />
            </Link>

            {/* Badge Tipe (Karena favorite campur aduk, kita perlu badge ini) */}
            {item.type && (
              <div className="absolute top-2 left-2 px-2 py-1 bg-black/60 backdrop-blur-md rounded-md text-[10px] font-bold text-white uppercase tracking-wider border border-white/10 flex items-center gap-1">
                {getTypeIcon(item.type)}
                {item.type}
              </div>
            )}

            {/* Tombol Delete (Positioning & Style disamakan dengan Heart di ListMangas) */}
            <button
              onClick={() => onRemove(item.id)}
              title="Hapus dari favorit"
              className="absolute top-3 right-3 z-10 p-2 rounded-full transition-all duration-300 hover:scale-110 focus:outline-none bg-black/20 hover:bg-black/40 backdrop-blur-sm cursor-pointer"
            >
              <Heart className="w-5 h-5 fill-red-500 text-red-500" />
            </button>
          </div>

          {/* CONTENT SECTION */}
          <div className="flex flex-col grow p-4 space-y-3">
            {/* Title */}
            <Link
              href={`/${
                item.type ? item.type.toLowerCase() + "s" : "mangas"
              }/detail/${item.mal_id}`}
            >
              <h3
                // Style Font disamakan
                className="font-bold text-base md:text-lg line-clamp-2 leading-tight text-slate-100 group-hover:text-blue-400 transition-colors"
                title={item.title}
              >
                {item.title}
              </h3>
            </Link>

            {/* Meta Info */}
            <div className="flex flex-col gap-2 mt-auto pt-2 border-t border-slate-800/50">
              <div className="flex justify-between items-center text-sm text-slate-400 font-medium">
                {/* Chapter/Episode Info */}
                <div className="flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span className="text-xs md:text-sm">
                    {item.chapters
                      ? `${item.chapters} Ch.`
                      : item.episodes
                      ? `${item.episodes} Eps.`
                      : "?"}
                  </span>
                </div>

                {/* Status Info */}
                <div className="flex items-center gap-1.5">
                  {getStatusIcon(item.status)}
                  <span
                    className={`text-xs md:text-sm capitalize ${
                      item.status?.toLowerCase().includes("finished") ||
                      item.status?.toLowerCase().includes("completed")
                        ? "text-emerald-400"
                        : "text-blue-400"
                    }`}
                  >
                     {/* Normalisasi teks status */}
                    {(item.status === "Publishing" || item.status === "Airing")
                      ? "Ongoing"
                      : (item.status === "Finished" || item.status === "Completed")
                      ? "End"
                      : item.status || "?"}
                  </span>
                </div>
              </div>

              {/* Score Info (Style disamakan) */}
              {item.score > 0 && (
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300 bg-slate-800 w-fit px-2 py-1 rounded-md self-start border border-slate-700">
                  <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                  <span>{Number(item.score).toFixed(1)}</span>
                </div>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default ListFavorites;