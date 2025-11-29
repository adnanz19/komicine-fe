"use client";

import React, { useMemo, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import axios from "axios";
import { Card } from "../../ui/card";
import {
  Heart,
  BookOpen,
  CheckCircle,
  Clock,
  Star,
  Users,
  Shield,
  ShieldOff,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { AnimeApiResponse, ListAnimesProps } from "@/types/anime";
import AnimePagination from "./AnimePagination";

// --- IMPORT FIREBASE ---
import { auth, db } from "@/lib/firebase";
import { doc, setDoc, deleteDoc, onSnapshot, collection } from "firebase/firestore";
import { onAuthStateChanged, User } from "firebase/auth";

const fetchAnimes = async (
  query: string,
  genreId?: string,
  page: number = 1
): Promise<AnimeApiResponse> => {
  const apiUrl = process.env.NEXT_PUBLIC_JIKAN_API_URL;

  let endpoint = `${apiUrl}/anime?limit=15&page=${page}`;

  if (genreId) {
    endpoint += `&genres=${genreId}&order_by=popularity`;
  } else if (query) {
    endpoint += `&q=${query}`;
  } else {
    endpoint += `&order_by=popularity`;
  }

  const response = await axios.get(endpoint);
  return response.data;
};

const ListAnimes = ({ searchQuery, safeMode = true }: ListAnimesProps) => {
  // --- STATE FIREBASE ---
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [user, setUser] = useState<User | null>(null); // Cek user login

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const genreId = searchParams.get("genre");
  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  const searchKey = useMemo(() => {
    return `${searchQuery}-${genreId || "none"}`;
  }, [searchQuery, genreId]);

  const effectiveCurrentPage = useMemo(() => {
    const isNewSearch = searchKey !== `${searchQuery}-${genreId || "none"}`;
    if (isNewSearch && currentPage > 1) {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("page");
      const newUrl = params.toString()
        ? `${pathname}?${params.toString()}`
        : pathname;
      router.replace(newUrl);
      return 1;
    }
    return currentPage;
  }, [
    searchKey,
    currentPage,
    searchQuery,
    genreId,
    searchParams,
    pathname,
    router,
  ]);

  const {
    data: apiResponse,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["animes", searchKey, safeMode, effectiveCurrentPage],
    queryFn: () =>
      fetchAnimes(searchQuery, genreId || undefined, effectiveCurrentPage),
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
    enabled: true,
  });

  const allAnimes = useMemo(() => {
    return apiResponse?.data || [];
  }, [apiResponse?.data]);
  const pagination = apiResponse?.pagination;

  // Filter anime berdasarkan safe mode
  const animes = useMemo(() => {
    if (!allAnimes) return [];

    if (!safeMode) {
      console.log("Safe mode OFF, showing all animes");
      return allAnimes;
    }

    const filtered = allAnimes.filter((anime) => {
      if (anime.genres && Array.isArray(anime.genres)) {
        const hasAdultContent = anime.genres.some(
          (genre) =>
            genre.name &&
            (genre.name.toLowerCase().includes("hentai") ||
              genre.name.toLowerCase().includes("erotica") ||
              genre.name.toLowerCase().includes("ecchi"))
        );
        return !hasAdultContent;
      }
      return true;
    });

    console.log(
      `Filtered result: ${filtered.length} animes (removed ${
        allAnimes.length - filtered.length
      })`
    );
    return filtered;
  }, [allAnimes, safeMode]);

  // --- LOGIKA FIREBASE 1: Cek User Login ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // --- LOGIKA FIREBASE 2: Sync Favorites Realtime ---
  useEffect(() => {
    if (!user) {
      setFavorites(new Set());
      return;
    }

    const favRef = collection(db, "users", user.uid, "favorites");
    const unsubscribe = onSnapshot(favRef, (snapshot) => {
      const favIds = new Set(snapshot.docs.map((doc) => parseInt(doc.id)));
      setFavorites(favIds);
    });

    return () => unsubscribe();
  }, [user]);

  // --- LOGIKA FIREBASE 3: Toggle Function ---
  const toggleFavorite = async (anime: any) => {
    // Terima Full Object
    if (!user) {
      router.push("/login");
      return;
    }

    const animeIdString = anime.mal_id.toString();
    const docRef = doc(db, "users", user.uid, "favorites", animeIdString);

    try {
      if (favorites.has(anime.mal_id)) {
        // Hapus
        await deleteDoc(docRef);
      } else {
        // Simpan
        await setDoc(docRef, {
          mal_id: anime.mal_id,
          title: anime.title,
          image_url: anime.images.jpg.image_url,
          score: anime.score || 0,
          status: anime.status,

          // --- KHUSUS ANIME ---
          type: "Anime", // Penting untuk filter!
          episodes: anime.episodes, // Simpan episode, bukan chapter

          added_at: new Date().toISOString(),
        });
      }
    } catch (err) {
      console.error("Gagal update favorite anime:", err);
    }
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

  const getSearchTitle = () => {
    if (genreId) {
      const genreMap: { [key: string]: string } = {
        "1": "Action",
        "2": "Adventure",
        "10": "Fantasy",
        "22": "Romance",
      };
      return `Genre: ${genreMap[genreId] || `ID ${genreId}`}`;
    }
    if (searchQuery) {
      return `Hasil Pencarian untuk "${searchQuery}"`;
    }
    return "Daftar Anime Populer";
  };

  const handlePageChange = (page: number) => {
    console.log("handlePageChange called with page:", page);
    console.log("Current URL params:", searchParams.toString());

    const params = new URLSearchParams(searchParams.toString());
    if (page === 1) {
      params.delete("page");
    } else {
      params.set("page", page.toString());
    }
    const newUrl = params.toString()
      ? `${pathname}?${params.toString()}`
      : pathname;

    console.log("Navigating to:", newUrl);
    router.push(newUrl);

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isLoading) {
    return (
      <div className="p-6 md:p-10 my-10 max-w-7xl mx-auto relative z-10">
        <h2 className="text-3xl font-bold mb-8 text-center text-white">
          Memuat anime...
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {Array(20)
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
        <p className="text-red-500 text-lg mb-4">
          Error loading anime data. Please try again later.
        </p>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 my-10 max-w-7xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-extrabold text-white tracking-tight mb-4">
          {getSearchTitle()}
        </h2>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm">
          {safeMode ? (
            <p className="text-green-400 flex items-center gap-1">
              <Shield className="w-4 h-4" />
              Safe Mode Aktif - Konten dewasa disembunyikan
            </p>
          ) : (
            <p className="text-yellow-400 flex items-center gap-1">
              <ShieldOff className="w-4 h-4" />
              Safe Mode Nonaktif - Menampilkan semua konten
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {animes?.map((anime) => (
          <Card
            key={anime.mal_id}
            className="group relative flex flex-col bg-slate-900 rounded-xl border border-slate-800 shadow-md hover:shadow-2xl hover:shadow-black/50 hover:-translate-y-1 hover:border-slate-600 transition-all duration-300 overflow-hidden p-0"
          >
            <div className="relative w-full aspect-2/3 overflow-hidden bg-slate-800">
              <Link href={`/animes/detail/${anime.mal_id}`}>
                <Image
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                  src={anime.images.jpg.image_url}
                  alt={anime.title}
                  className="object-cover transition-transform duration-500 group-hover:scale-110 opacity-90 group-hover:opacity-90 cursor-pointer"
                  loading="lazy"
                />
              </Link>

              <div className="absolute top-0 inset-x-0 h-24 bg-linear-to-b from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-2">
                <div className="flex items-center gap-1 text-white text-xs">
                  <Users className="w-4 h-4" />
                  <span>{anime.members?.toLocaleString()}</span>
                </div>
              </div>

              <button
                // UPDATE: Passing full object
                onClick={() => toggleFavorite(anime)}
                className="absolute top-3 right-3 z-10 p-2 rounded-full transition-all duration-300 hover:scale-110 focus:outline-none bg-black/20 hover:bg-black/40 backdrop-blur-sm"
              >
                <Heart
                  className={`w-5 h-5 transition-colors cursor-pointer ${
                    favorites.has(anime.mal_id)
                      ? "fill-red-500 text-red-500"
                      : "text-slate-300 hover:text-red-400"
                  }`}
                />
              </button>
            </div>

            <div className="flex flex-col grow p-4 space-y-3">
              <Link href={`/animes/detail/${anime.mal_id}`}>
                <h3
                  className="font-bold text-base md:text-lg line-clamp-2 leading-tight text-slate-100 group-hover:text-blue-400 transition-colors"
                  title={anime.title}
                >
                  {anime.title}
                </h3>
              </Link>

              <div className="flex flex-col gap-2 mt-auto pt-2 border-t border-slate-800/50">
                <div className="flex justify-between items-center text-sm text-slate-400 font-medium">
                  <div className="flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span className="text-xs md:text-sm">
                      {anime.episodes ? `${anime.episodes} Ep.` : "?"}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {getStatusIcon(anime.status)}
                    <span
                      className={`text-xs md:text-sm capitalize ${
                        anime.status.toLowerCase() === "finished"
                          ? "text-emerald-400"
                          : anime.status.toLowerCase() === "publishing"
                          ? "text-blue-400"
                          : "text-slate-500"
                      }`}
                    >
                      {anime.status === "Publishing"
                        ? "Ongoing"
                        : anime.status}
                    </span>
                  </div>
                </div>

                {anime.score && (
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300 bg-slate-800 w-fit px-2 py-1 rounded-md self-start border border-slate-700">
                    <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                    <span>{anime.score.toFixed(1)}</span>
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {pagination && (
        <AnimePagination
          pagination={pagination}
          currentPage={effectiveCurrentPage}
          onPageChange={handlePageChange}
        />
      )}

      {animes?.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg mb-4">
            Tidak ada anime yang ditemukan
          </p>
          {safeMode && allAnimes && allAnimes.length > 0 && (
            <p className="text-sm text-green-400">
              Coba matikan Safe Mode untuk melihat lebih banyak konten
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default ListAnimes;