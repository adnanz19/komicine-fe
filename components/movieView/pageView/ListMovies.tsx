"use client";

import React, { useCallback, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { Loader2, Grid3X3, Star, Calendar,  EyeOff, BookOpen } from "lucide-react";
import { Card,  } from "@/components/ui/card";
import MoviePagination from "./MoviePagination";
import { MovieData, MovieApiResponse, ListMoviesProps } from "@/types/movie";
import { useSafeMode } from "@/hooks/useSafeMode";
import Link from "next/link";
import Image from "next/image";

// TMDB API Configuration
const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY || "";
const TMDB_BASE_URL = process.env.NEXT_PUBLIC_TMDB_API_URL || "";
const TMDB_IMAGE_BASE_URL = process.env.NEXT_PUBLIC_TMDB_IMAGE_BASE_URL || ""   ;

// Genre mapping for TMDB
const GENRE_MAP: Record<number, string> = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  14: "Fantasy",
  36: "History",
  27: "Horror",
  10402: "Music",
  9648: "Mystery",
  10749: "Romance",
  878: "Science Fiction",
  10770: "TV Movie",
  53: "Thriller",
  10752: "War",
  37: "Western",
};

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

  // Gunakan custom hook untuk safe mode
  const { safeMode } = useSafeMode();

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
              <>
                Genre:{" "}
                <span className="text-purple-400">
                  {GENRE_MAP[parseInt(currentGenre)] || `ID ${currentGenre}`}
                </span>
              </>
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
              
              {/* Tambahan: Bahasa (Pocok Kanan Atas Poster - Rapi & Kecil) */}
              <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm px-1.5 py-0.5 rounded text-[10px] font-bold text-white border border-white/20 uppercase">
                {movie.original_language}
              </div>
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
                  <span>{movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}</span>
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
