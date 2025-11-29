"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Star,
  Globe,
  DollarSign,
  Heart,
  Eye,
  Info,
  Users,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { MovieDetail } from "@/types/movie";
import Image from "next/image";
import Link from "next/link";

// TMDB API Configuration
const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY || "";
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";
const TMDB_BACKDROP_BASE_URL = "https://image.tmdb.org/t/p/original";

const fetchMovieDetail = async (movieId: string): Promise<MovieDetail> => {
  try {
    const url = `${TMDB_BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}&append_to_response=videos,credits,similar`;

    // console.log("Fetching movie detail from TMDB:", movieId);

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // console.log(" Movie detail fetched successfully:", data);

    return data;
  } catch (error) {
    console.error("❌ Error fetching movie detail:", error);
    throw error;
  }
};

const DetailMovies: React.FC = () => {
  const params = useParams();
  const router = useRouter();

  const movieId = params.id as string;

  // TanStack Query untuk fetch movie detail
  const {
    data: movie,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["movie-detail", movieId],
    queryFn: () => fetchMovieDetail(movieId),
    enabled: !!movieId,
    staleTime: 1000 * 60 * 15, // 15 menit
    gcTime: 1000 * 60 * 30, // 30 menit
  });

  // Format helpers
  const formatDate = (dateString: string) => {
    if (!dateString) return "TBA";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatRuntime = (minutes: number | null) => {
    if (!minutes) return "N/A";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        {/* Loading skeleton */}
        <div className="relative h-[70vh] bg-linear-to-b from-muted/50 to-background animate-pulse">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-muted rounded-full mb-4 mx-auto animate-pulse"></div>
              <div className="h-6 bg-muted rounded w-48 mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !movie) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-400 mb-4">
            Movie Tidak Ditemukan
          </h1>
          <p className="text-muted-foreground mb-6">
            {error instanceof Error ? error.message : "Terjadi kesalahan"}
          </p>
          <Button onClick={() => router.back()} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section dengan Backdrop */}
      <div className="relative h-[70vh] overflow-hidden">
        {/* Backdrop Image */}
        {movie.backdrop_path && (
          <div className="absolute inset-0">
            <Image
            width={1200}
            height={700}
              src={`${TMDB_BACKDROP_BASE_URL}${movie.backdrop_path}`}
              alt={movie.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/60" />
            <div className="absolute inset-0 bg-linear-to-t from-background via-transparent to-transparent" />
          </div>
        )}

        {/* Back Button */}
        <div className="absolute top-6 left-6 z-20">
          <Button
            onClick={() => router.back()}
            variant="outline"
            size="sm"
            className="bg-background/80 backdrop-blur-sm border-border/50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </Button>
        </div>

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-[300px_1fr] gap-8 items-end">
              {/* Poster */}
              <div className="hidden md:block">
                <Image
                    width={300}
                    height={450}
                  src={
                    movie.poster_path
                      ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}`
                      : "/placeholder-poster.jpg"
                  }
                  alt={movie.title}
                  className="w-full rounded-lg shadow-2xl"
                />
              </div>

              {/* Info */}
              <div className="space-y-4">
                <div>
                  <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">
                    {movie.title}
                  </h1>
                  {movie.original_title !== movie.title && (
                    <p className="text-lg text-white/80">
                      {movie.original_title}
                    </p>
                  )}
                  {movie.tagline && (
                    <p className="text-lg text-white/90 italic mt-2">
                      &ldquo;{movie.tagline}&rdquo;
                    </p>
                  )}
                </div>

                {/* Rating & Info Row */}
                <div className="flex flex-wrap items-center gap-4 text-white/90">
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">
                      {movie.vote_average.toFixed(1)}
                    </span>
                    <span className="text-white/60">
                      ({movie.vote_count.toLocaleString()} votes)
                    </span>
                  </div>
                  <Separator
                    orientation="vertical"
                    className="h-4 bg-white/30"
                  />
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(movie.release_date)}</span>
                  </div>
                  {movie.runtime && (
                    <>
                      <Separator
                        orientation="vertical"
                        className="h-4 bg-white/30"
                      />
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{formatRuntime(movie.runtime)}</span>
                      </div>
                    </>
                  )}
                  {movie.adult && (
                    <>
                      <Separator
                        orientation="vertical"
                        className="h-4 bg-white/30"
                      />
                      <Badge variant="destructive" className="text-xs">
                        18+
                      </Badge>
                    </>
                  )}
                </div>

                {/* Genres */}
                <div className="flex flex-wrap gap-2">
                  {movie.genres.map((genre) => (
                    <Badge
                      key={genre.id}
                      variant="secondary"
                      className="bg-white/20 text-white hover:bg-white/30"
                    >
                      {genre.name}
                    </Badge>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 pt-4">
                  <Button
                    size="lg"
                    variant="outline"
                    className="bg-white/10 border-white/30 text-white hover:bg-white/20 cursor-pointer"
                  >
                    <Heart className="w-5 h-5 mr-2" />
                    Favorite
                  </Button>
                  <Link href={`https://www.themoviedb.org/movie/${movie.id}`} target="_blank" rel="noopener noreferrer">
                  <Button
                    size="lg"
                    variant="outline"
                    className="bg-white/10 border-white/30 text-white hover:bg-white/20 cursor-pointer"
                    >
                    <Info className="w-5 h-5 mr-2" />
                    More Info
                  </Button>
                      </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detail Content */}
      <div className="max-w-6xl mx-auto p-6 md:p-10 space-y-8">
        {/* Overview */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-4">Overview</h2>
            <p className="text-muted-foreground leading-relaxed">
              {movie.overview || "No overview available."}
            </p>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Budget */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-600/20 rounded-lg">
                  <DollarSign className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Budget</p>
                  <p className="font-semibold">
                    {movie.budget ? formatCurrency(movie.budget) : "N/A"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Revenue */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-600/20 rounded-lg">
                  <DollarSign className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Revenue</p>
                  <p className="font-semibold">
                    {movie.revenue ? formatCurrency(movie.revenue) : "N/A"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Popularity */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-600/20 rounded-lg">
                  <Eye className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Popularity</p>
                  <p className="font-semibold">{movie.popularity.toFixed(1)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Status */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-600/20 rounded-lg">
                  <Users className="w-5 h-5 text-yellow-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="font-semibold">{movie.status || "Unknown"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Details */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Production Info */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="text-xl font-bold">Production</h3>

              {movie.production_companies.length > 0 && (
                <div>
                  <h4 className="font-medium text-muted-foreground mb-2">
                    Companies
                  </h4>
                  <div className="space-y-1">
                    {movie.production_companies.slice(0, 3).map((company) => (
                      <p key={company.id} className="text-sm">
                        {company.name}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {movie.production_countries.length > 0 && (
                <div>
                  <h4 className="font-medium text-muted-foreground mb-2">
                    Countries
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {movie.production_countries.map((country) => (
                      <Badge
                        key={country.iso_3166_1}
                        variant="outline"
                        className="text-xs"
                      >
                        {country.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Language Info */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="text-xl font-bold">Languages</h3>

              <div>
                <h4 className="font-medium text-muted-foreground mb-2">
                  Original Language
                </h4>
                <p className="text-sm uppercase">{movie.original_language}</p>
              </div>

              {movie.spoken_languages.length > 0 && (
                <div>
                  <h4 className="font-medium text-muted-foreground mb-2">
                    Spoken Languages
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {movie.spoken_languages.map((lang) => (
                      <Badge
                        key={lang.iso_639_1}
                        variant="outline"
                        className="text-xs"
                      >
                        {lang.english_name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {movie.homepage && (
                <div>
                  <h4 className="font-medium text-muted-foreground mb-2">
                    Official Website
                  </h4>
                  <a
                    href={movie.homepage}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1"
                  >
                    <Globe className="w-3 h-3" />
                    Visit Website
                  </a>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DetailMovies;
