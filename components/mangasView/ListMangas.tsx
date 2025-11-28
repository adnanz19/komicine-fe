"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Card } from "../ui/card";
import { Heart, BookOpen, CheckCircle, Clock, Star } from "lucide-react";
import Image from "next/image";

interface MangaData {
  mal_id: number;
  title: string;
  images: {
    jpg: {
      image_url: string;
    };
  };
  chapters: number | null;
  status: string;
  score: number;
}

interface ListMangasProps {
    searchQuery: string;
}

const fetchMangas = async (query: string): Promise<MangaData[]> => {
  const apiUrl = process.env.NEXT_PUBLIC_JIKAN_API_URL;

  let endpoint = `${apiUrl}/manga?limit=15`;

  if (query) {
      endpoint += `&q=${query}`; 
  } else {
      endpoint += `&order_by=popularity`;
  }

  const response = await axios.get(endpoint);
  return response.data.data;
};

const ListMangas = ({ searchQuery }: ListMangasProps) => {
  const [favorites, setFavorites] = useState<Set<number>>(new Set());

  const {
    data: mangas,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["mangas",searchQuery],
    queryFn: () => fetchMangas(searchQuery),
  });

  const toggleFavorite = (mangaId: number) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(mangaId)) {
        newFavorites.delete(mangaId);
      } else {
        newFavorites.add(mangaId);
      }
      return newFavorites;
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "finished":
        return <CheckCircle className="w-4 h-4 text-emerald-400" />;
      case "publishing":
        return <Clock className="w-4 h-4 text-blue-400" />;
      default:
        return <Clock className="w-4 h-4 text-slate-500" />;
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 md:p-10 my-10 max-w-7xl mx-auto relative z-10">
        <h2 className="text-3xl font-bold mb-8 text-center text-white">
          Memuat Manga...
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {Array(10)
            .fill(0)
            .map((_, index) => (
              <Card
                key={index}
                className="rounded-xl overflow-hidden border border-slate-800 bg-slate-900 shadow-sm"
              >
                <div className="animate-pulse bg-slate-800 aspect-2/3 w-full"></div>
                <div className="p-4 space-y-3">
                  <div className="animate-pulse bg-slate-800 h-5 rounded w-3/4"></div>
                  <div className="animate-pulse bg-slate-800 h-4 rounded w-1/2"></div>
                </div>
              </Card>
            ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 md:p-10 my-10 max-w-7xl mx-auto text-center">
        <p className="text-red-500 text-lg">
          Error loading manga data. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 my-10 max-w-7xl mx-auto">
      <h2 className="text-3xl font-extrabold mb-10 text-center text-white tracking-tight">
        {searchQuery ? `Hasil Pencarian untuk "${searchQuery}"` : "Daftar Manga Populer"}
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {mangas?.map((manga) => (
          <Card
            key={manga.mal_id}
            className="group relative flex flex-col bg-slate-900 rounded-xl border border-slate-800 shadow-md hover:shadow-2xl hover:shadow-black/50 hover:-translate-y-1 hover:border-slate-600 transition-all duration-300 overflow-hidden p-0"
          >
            <div className="relative w-full aspect-2/3 overflow-hidden bg-slate-800">
              <Image
                fill
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                src={manga.images.jpg.image_url}
                alt={manga.title}
                className="object-cover transition-transform duration-500 group-hover:scale-110 opacity-90 group-hover:opacity-90"
                loading="lazy" 
              />

              <div className="absolute top-0 inset-x-0 h-24 bg-linear-to-b from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              <button
                onClick={() => toggleFavorite(manga.mal_id)}
                className="absolute top-3 right-3 z-10 p-2 rounded-full transition-all duration-300 hover:scale-110 focus:outline-none bg-black/20 hover:bg-black/40 backdrop-blur-sm"
              >
                <Heart
                  className={`w-5 h-5 transition-colors ${
                    favorites.has(manga.mal_id)
                      ? "fill-red-500 text-red-500"
                      : "text-slate-300 hover:text-red-400"
                  }`}
                />
              </button>
            </div>

            <div className="flex flex-col grow p-4 space-y-3">
              <h3
                className="font-bold text-base md:text-lg line-clamp-2 leading-tight text-slate-100 group-hover:text-blue-400 transition-colors"
                title={manga.title}
              >
                {manga.title}
              </h3>

              <div className="flex flex-col gap-2 mt-auto pt-2 border-t border-slate-800/50">
                <div className="flex justify-between items-center text-sm text-slate-400 font-medium">
                  <div className="flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span className="text-xs md:text-sm">
                      {manga.chapters ? `${manga.chapters} Ch.` : "?"}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {getStatusIcon(manga.status)}
                    <span
                      className={`text-xs md:text-sm capitalize ${
                        manga.status.toLowerCase() === "finished"
                          ? "text-emerald-400"
                          : manga.status.toLowerCase() === "publishing"
                          ? "text-blue-400"
                          : "text-slate-500"
                      }`}
                    >
                      {manga.status === "Publishing" ? "Ongoing" : manga.status}
                    </span>
                  </div>
                </div>

                {manga.score && (
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300 bg-slate-800 w-fit px-2 py-1 rounded-md self-start border border-slate-700">
                    <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                    <span>{manga.score.toFixed(1)}</span>
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ListMangas;
