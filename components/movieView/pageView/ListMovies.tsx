"use client";

import React, { useCallback, useMemo, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Loader2,
  Grid3X3,
  Star,
  Calendar,
  EyeOff,
  BookOpen,
  Heart,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import MoviePagination from "./MoviePagination";
import { MovieData, MovieApiResponse, ListMoviesProps } from "@/types/movie";
import { useSafeMode } from "@/hooks/useSafeMode";
import Link from "next/link";
import Image from "next/image";

// Firebase imports
import { auth, db } from "@/lib/firebase";
import {
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  collection,
} from "firebase/firestore";
import { onAuthStateChanged, User } from "firebase/auth";

// TMDB API Configuration
const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY || "";
const TMDB_BASE_URL = process.env.NEXT_PUBLIC_TMDB_API_URL || "";
const TMDB_IMAGE_BASE_URL = process.env.NEXT_PUBLIC_TMDB_IMAGE_BASE_URL || "";

const fetchMovies = async (
  searchQuery: string = "",
  genreId: string = "",
  page: number = 1
): Promise<MovieApiResponse> => {
  try {
    let url: string;

    if (searchQuery) {
      // Search by text
      url = `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(
        searchQuery
      )}&page=${page}&include_adult=false`;
    } else if (genreId) {
      // Search by genre
      url = `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&with_genres=${genreId}&page=${page}&include_adult=false&sort_by=popularity.desc`;
    } else {
      // Popular movies
      url = `${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&page=${page}&include_adult=false`;
    }

    console.log(
      " Fetching movies from TMDB:",
      url.replace(TMDB_API_KEY, "***")
    );

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // Transform the response to match our interface
    const transformedData: MovieApiResponse = {
      results: data.results || [],
      total_pages: data.total_pages || 1,
      total_results: data.total_results || 0,
      page: data.page || 1,
    };

    return transformedData;
  } catch (error) {
    console.error("❌ Error fetching movies:", error);
    throw error;
  }
};

const ListMovies: React.FC<ListMoviesProps> = ({
  searchKeyword = "",
  onPageChange,
}) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Gunakan custom hook untuk safe mode
  const { safeMode } = useSafeMode();

  // Firebase state for favorites
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [user, setUser] = useState<User | null>(null);

  // Generate search key untuk TanStack Query
  const searchKey = useMemo(() => {
    const query = searchParams.get("q") || searchKeyword || "";
    const genre = searchParams.get("genre") || "";
    const page = searchParams.get("page") || "1";

    return `${query.trim()}-${genre}-${page}-${safeMode}`;
  }, [searchParams, searchKeyword, safeMode]);

  // Parse URL params
  const currentQuery = searchParams.get("q") || searchKeyword || "";
  const currentGenre = searchParams.get("genre") || "";
  const pageFromUrl = parseInt(searchParams.get("page") || "1");
  const effectivePage = Math.max(1, pageFromUrl);

  console.log(" ListMovies Debug:", {
    searchKeyword,
    searchParams: Object.fromEntries(searchParams.entries()),
    searchKey,
    currentQuery,
    currentGenre,
    effectivePage,
    safeMode,
  });

  // TanStack Query untuk fetch movies
  const {
    data: movieResponse,
    isLoading,
    isError,
    error,
    isFetching,
  } = useQuery({
    queryKey: ["movies", searchKey],
    queryFn: () => fetchMovies(currentQuery, currentGenre, effectivePage),
    staleTime: 1000 * 60 * 5, // 5 menit
    gcTime: 1000 * 60 * 10, // 10 menit
  });

  // Filter movies berdasarkan safe mode (filter adult content)
  const filteredMovies = useMemo(() => {
    if (!movieResponse?.results) return [];

    let filtered = [...movieResponse.results];

    // Safe mode filter (remove adult content)
    if (safeMode) {
      filtered = filtered.filter((movie) => !movie.adult);
    }

    return filtered;
  }, [movieResponse, safeMode]);

  // Firebase effects
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      // Clear favorites when user changes (login/logout)
      if (!currentUser) {
        setFavorites(new Set());
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) {
      return;
    }

    const favRef = collection(db, "users", user.uid, "favorites");
    const unsubscribe = onSnapshot(favRef, (snapshot) => {
      const favIds = new Set(snapshot.docs.map((doc) => parseInt(doc.id)));
      setFavorites(favIds);
    });

    return () => unsubscribe();
  }, [user]);

  // Toggle favorite function
  const toggleFavorite = async (movie: MovieData) => {
    if (!user) {
      router.push("/login");
      return;
    }

    const movieIdString = movie.id.toString();
    const docRef = doc(db, "users", user.uid, "favorites", movieIdString);

    try {
      if (favorites.has(movie.id)) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, {
          mal_id: movie.id,
          title: movie.title,
          image_url: movie.poster_path
            ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}`
            : "/placeholder-poster.jpg",
          score: movie.vote_average || 0,
          status: movie.release_date ? "Released" : "TBA",
          chapters: null,
          type: "movie",
          added_at: new Date().toISOString(),
        });
      }
    } catch (err) {
      console.error("Gagal update favorite:", err);
    }
  };

  // Handler untuk pagination
  const handlePageChange = useCallback(
    (newPage: number) => {
      console.log("Page change requested:", {
        from: effectivePage,
        to: newPage,
      });
      onPageChange?.(newPage);
    },
    [effectivePage, onPageChange]
  );

  // Format date
  const formatDate = useCallback((dateString: string) => {
    if (!dateString) return "TBA";
    const date = new Date(dateString);
    return date.getFullYear().toString();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
        <p className="text-muted-foreground">Mengambil data movies...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-red-400 mb-2">
            Error Mengambil Data
          </h3>
          <p className="text-muted-foreground mb-4">
            {error instanceof Error ? error.message : "Terjadi kesalahan"}
          </p>
          <p className="text-sm text-muted-foreground">
            Pastikan API key TMDB sudah dikonfigurasi dengan benar.
          </p>
        </div>
      </div>
    );
  }

  if (!filteredMovies || filteredMovies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <Grid3X3 className="w-16 h-16 text-muted-foreground/50" />
        <div className="text-center">
          <h3 className="text-lg font-semibold text-muted-foreground mb-2">
            Tidak Ada Movie Ditemukan
          </h3>
          <p className="text-muted-foreground">
            {currentQuery
              ? `Tidak ada movie untuk pencarian "${currentQuery}"`
              : currentGenre
              ? `Tidak ada movie untuk genre yang dipilih`
              : "Tidak ada movie yang tersedia"}
          </p>
          {safeMode && (
            <p className="text-xs text-muted-foreground/70 mt-2">
              Safe mode aktif - konten dewasa disembunyikan
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header & Stats */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            {currentQuery ? (
              <>
                Hasil untuk &ldquo;
                <span className="text-purple-400">{currentQuery}</span>&rdquo;
              </>
            ) : currentGenre ? (
              <>Genre: </>
            ) : (
              "Popular Movies"
            )}
          </h2>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {safeMode && (
              <>
                <div className="flex items-center gap-1 text-green-400">
                  <EyeOff className="w-3 h-3" />
                  <span>Safe Mode</span>
                </div>
              </>
            )}
            {isFetching && (
              <>
                <span>•</span>
                <div className="flex items-center gap-1 text-blue-400">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  <span>Updating...</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Movie Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {filteredMovies?.map((movie: MovieData) => (
          <Card
            key={movie.id}
            className="group relative flex flex-col bg-slate-900 rounded-xl border border-slate-800 shadow-md hover:shadow-2xl hover:shadow-black/50 hover:-translate-y-1 hover:border-slate-600 transition-all duration-300 overflow-hidden p-0"
          >
            {/* Bagian Image Poster */}
            <div className="relative w-full aspect-2/3 overflow-hidden bg-slate-800">
              <Link href={`/movies/detail/${movie.id}`}>
                <Image
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                  src={
                    movie.poster_path
                      ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}`
                      : "/placeholder-poster.jpg"
                  }
                  alt={movie.title}
                  className="object-cover transition-transform duration-500 group-hover:scale-110 opacity-90 group-hover:opacity-100 cursor-pointer"
                  loading="lazy"
                />
              </Link>

              {/* Language Badge (Pojok Kiri Atas) */}
              <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm px-1.5 py-0.5 rounded text-[10px] font-bold text-white border border-white/20 uppercase">
                {movie.original_language}
              </div>

              {/* Heart Favorite Button (Pojok Kanan Atas) */}
              <button
                onClick={() => toggleFavorite(movie)}
                className="absolute top-3 right-3 z-10 p-2 rounded-full transition-all duration-300 hover:scale-110 focus:outline-none bg-black/20 hover:bg-black/40 backdrop-blur-sm"
              >
                <Heart
                  className={`w-5 h-5 transition-colors cursor-pointer ${
                    favorites.has(movie.id)
                      ? "fill-red-500 text-red-500"
                      : "text-slate-300 hover:text-red-400"
                  }`}
                />
              </button>
            </div>

            {/* Bagian Konten Judul */}
            <div className="flex flex-col grow p-4 space-y-3">
              <Link href={`/movies/detail/${movie.id}`}>
                <h3
                  className="font-bold text-base md:text-lg line-clamp-2 leading-tight text-slate-100 group-hover:text-blue-400 transition-colors"
                  title={movie.title}
                >
                  {movie.title}
                </h3>
              </Link>
            </div>

            {/* Bagian Footer Card */}
            <div className="flex flex-col gap-3 mt-auto p-4 pt-0 border-t border-slate-800/50">
              {/* Overview singkat (Baris 1) */}
              <div className="flex items-center gap-1.5 overflow-hidden pt-3 text-slate-400">
                <BookOpen className="w-3.5 h-3.5 shrink-0" />
                <span className="text-xs md:text-sm line-clamp-1">
                  {movie.overview ? movie.overview : "No overview"}
                </span>
              </div>

              {/* Baris Bawah: Tanggal & Rating (Baris 2) */}
              <div className="flex justify-between items-center mt-1">
                {/* Release Date (Kiri) */}
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300 bg-slate-800 px-2 py-1 rounded-md border border-slate-700">
                  <Calendar className="w-3 h-3 text-purple-400" />
                  <span>{formatDate(movie.release_date)}</span>
                </div>

                {/* Rating Bintang (Kanan) */}
                <div className="flex items-center gap-1 text-xs font-bold text-yellow-500">
                  <Star className="w-3.5 h-3.5 fill-yellow-500" />
                  <span>
                    {movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {movieResponse && movieResponse.total_pages > 1 && (
        <MoviePagination
          currentPage={effectivePage}
          totalPages={movieResponse.total_pages}
          onPageChange={handlePageChange}
          totalResults={movieResponse.total_results}
        />
      )}
    </div>
  );
};

export default ListMovies;
