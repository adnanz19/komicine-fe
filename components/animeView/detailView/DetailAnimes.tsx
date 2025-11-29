"use client";

import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Heart,
  Play,
  Calendar,
  Star,
  Users,
  Trophy,
  ArrowLeft,
  ExternalLink,
  Clock,
  Tv,
} from "lucide-react";
import Link from "next/link";
import { AnimeDetail, DetailAnimesProps } from "@/types/anime";
import { useRouter } from "next/navigation";

// --- IMPORT FIREBASE ---
import { auth, db } from "@/lib/firebase";
import { doc, setDoc, deleteDoc, onSnapshot } from "firebase/firestore";
import { onAuthStateChanged, User } from "firebase/auth";

const fetchAnimeDetail = async (id: string): Promise<AnimeDetail> => {
  const apiUrl = process.env.NEXT_PUBLIC_JIKAN_API_URL;
  const response = await axios.get(`${apiUrl}/anime/${id}`);
  return response.data.data;
};

const DetailAnimes = ({ animeId }: DetailAnimesProps) => {
  const router = useRouter();

  // --- STATE FIREBASE ---
  const [user, setUser] = useState<User | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);

  const {
    data: anime,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["anime", animeId],
    queryFn: () => fetchAnimeDetail(animeId),
    enabled: !!animeId,
  });

  // 1. Cek User Login
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // 2. Cek Status Favorite di Database (Realtime)
  useEffect(() => {
    if (!user || !animeId) {
      setIsFavorite(false);
      return;
    }

    // Path: users/{uid}/favorites/{animeId}
    const docRef = doc(db, "users", user.uid, "favorites", animeId.toString());

    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      setIsFavorite(docSnap.exists());
    });

    return () => unsubscribe();
  }, [user, animeId]);

  // 3. Fungsi Toggle Favorite
  const handleToggleFavorite = async () => {
    if (!user) {
      router.push("/login");
      return;
    }
    if (!anime) return;

    const docRef = doc(db, "users", user.uid, "favorites", animeId.toString());

    try {
      if (isFavorite) {
        // Hapus
        await deleteDoc(docRef);
      } else {
        // Simpan (Dengan tipe "Anime")
        await setDoc(docRef, {
          mal_id: anime.mal_id,
          title: anime.title,
          image_url: anime.images.jpg.image_url,
          score: anime.score || 0,
          status: anime.status,

          type: "Anime", // PENTING UNTUK FILTER
          episodes: anime.episodes, // Simpan Episode

          added_at: new Date().toISOString(),
        });
      }
    } catch (err) {
      console.error("Gagal update favorite anime:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="lg:w-1/3">
                <div className="bg-slate-800 h-96 w-full rounded-xl"></div>
              </div>
              <div className="lg:w-2/3 space-y-4">
                <div className="bg-slate-800 h-8 w-3/4 rounded"></div>
                <div className="bg-slate-800 h-6 w-1/2 rounded"></div>
                <div className="bg-slate-800 h-4 w-full rounded"></div>
                <div className="bg-slate-800 h-4 w-full rounded"></div>
                <div className="bg-slate-800 h-4 w-2/3 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !anime) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 p-6 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">
            Anime tidak ditemukan
          </h1>
          <Link href="/animes">
            <Button
              variant="outline"
              className="text-white border-white hover:bg-white hover:text-slate-900"
            >
              Kembali ke Daftar Anime
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <Link href="/animes">
            <Button
              variant="ghost"
              className="text-white hover:bg-white/10 mb-6"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali
            </Button>
          </Link>
        </div>
      </div>

      <div className="px-6 pb-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Image Section */}
            <div className="lg:w-1/3">
              <Card className="overflow-hidden bg-slate-800/50 border-slate-700 p-0">
                <div className="relative aspect-3/4 w-full">
                  <Image
                    src={
                      anime.images.jpg.large_image_url ||
                      anime.images.jpg.image_url
                    }
                    alt={anime.title}
                    fill
                    className="object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="p-4 space-y-3">
                  {/* --- TOMBOL FAVORITE DINAMIS --- */}
                  <Button
                    onClick={handleToggleFavorite}
                    className={`w-full cursor-pointer transition-all duration-300 ${
                      isFavorite
                        ? "bg-slate-700 hover:bg-slate-600 text-white" // Style Favorit (Abu)
                        : "bg-red-600 hover:bg-red-700 text-white" // Style Belum Favorit (Merah)
                    }`}
                  >
                    <Heart
                      className={`w-4 h-4 mr-2 ${
                        isFavorite ? "fill-red-500 text-red-500" : ""
                      }`}
                    />
                    {isFavorite ? "Hapus dari Favorit" : "Tambah ke Favorit"}
                  </Button>

                  {/* Watch Trailer Button */}
                  {anime.trailer?.embed_url && (
                    <Button
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      asChild
                    >
                      <Link href={anime.trailer.embed_url} target="_blank">
                        <Play className="w-4 h-4 mr-2" />
                        Watch Trailer
                      </Link>
                    </Button>
                  )}

                  <div className="grid grid-cols-2 gap-2 text-sm text-gray-300">
                    {/* Episodes instead of Chapters */}
                    <div className="flex items-center gap-1">
                      <Tv className="w-4 h-4" />
                      <span>{anime.episodes || "?"} Eps</span>
                    </div>
                    {/* Duration */}
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{anime.duration || "?"}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span>{anime.score?.toFixed(1) || "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{anime.members?.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Details Section */}
            <div className="lg:w-2/3">
              <Card className="bg-slate-800/30 border-slate-700 p-6 backdrop-blur-sm">
                {/* Title */}
                <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
                  {anime.title}
                </h1>

                {/* Alternative Titles */}
                {(anime.title_english || anime.title_japanese) && (
                  <div className="mb-4 space-y-1">
                    {anime.title_english &&
                      anime.title_english !== anime.title && (
                        <p className="text-gray-300">
                          English: {anime.title_english}
                        </p>
                      )}
                    {anime.title_japanese && (
                      <p className="text-gray-300">
                        Japanese: {anime.title_japanese}
                      </p>
                    )}
                  </div>
                )}

                {/* Stats */}
                <div className="flex flex-wrap gap-4 mb-6">
                  {anime.rank && (
                    <div className="flex items-center gap-1 bg-yellow-600/20 text-yellow-400 px-3 py-1 rounded-full">
                      <Trophy className="w-4 h-4" />
                      <span>Rank #{anime.rank}</span>
                    </div>
                  )}
                  <Badge
                    variant="secondary"
                    className="bg-blue-600/20 text-blue-400"
                  >
                    {anime.type}
                  </Badge>
                  <Badge
                    variant="secondary"
                    className={`${
                      anime.status === "Finished Airing"
                        ? "bg-green-600/20 text-green-400"
                        : anime.status === "Currently Airing"
                        ? "bg-blue-600/20 text-blue-400"
                        : "bg-gray-600/20 text-gray-400"
                    }`}
                  >
                    {anime.status}
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="bg-purple-600/20 text-purple-400"
                  >
                    Popularity #{anime.popularity}
                  </Badge>
                  {anime.rating && (
                    <Badge
                      variant="secondary"
                      className="bg-red-600/20 text-red-400"
                    >
                      {anime.rating}
                    </Badge>
                  )}
                </div>

                {/* Anime Info */}
                <div className="mb-6 text-gray-300 space-y-2">
                  {anime.aired?.string && (
                    <p>
                      <strong>Aired:</strong> {anime.aired.string}
                    </p>
                  )}
                  {anime.source && (
                    <p>
                      <strong>Source:</strong> {anime.source}
                    </p>
                  )}
                  {anime.studios && anime.studios.length > 0 && (
                    <p>
                      <strong>Studio:</strong>{" "}
                      {anime.studios.map((studio) => studio.name).join(", ")}
                    </p>
                  )}
                  {anime.season && anime.year && (
                    <p>
                      <strong>Season:</strong> {anime.season} {anime.year}
                    </p>
                  )}
                  {anime.broadcast?.string && (
                    <p>
                      <strong>Broadcast:</strong> {anime.broadcast.string}
                    </p>
                  )}
                  {anime.scored_by && (
                    <p>
                      <strong>Scored by:</strong>{" "}
                      {anime.scored_by.toLocaleString()} users
                    </p>
                  )}
                </div>

                {/* Genres */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-3">
                    Genres
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {anime.genres?.map((genre) => (
                      <Badge
                        key={genre.mal_id}
                        variant="outline"
                        className="border-gray-600 text-gray-300"
                      >
                        {genre.name}
                      </Badge>
                    ))}
                    {anime.themes?.map((theme) => (
                      <Badge
                        key={theme.mal_id}
                        variant="outline"
                        className="border-purple-600 text-purple-300"
                      >
                        {theme.name}
                      </Badge>
                    ))}
                    {anime.demographics?.map((demo) => (
                      <Badge
                        key={demo.mal_id}
                        variant="outline"
                        className="border-blue-600 text-blue-300"
                      >
                        {demo.name}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Synopsis */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-3">
                    Synopsis
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    {anime.synopsis || "No synopsis available."}
                  </p>
                </div>

                {/* Background */}
                {anime.background && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-white mb-3">
                      Background
                    </h3>
                    <p className="text-gray-300 leading-relaxed">
                      {anime.background}
                    </p>
                  </div>
                )}

                {/* External Links */}
                <div className="mt-8 space-y-3">
                  {anime.url && (
                    <Link
                      href={anime.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button
                        variant="outline"
                        className="w-full border-slate-600 text-slate-300 hover:bg-white hover:text-slate-900 hover:border-white transition-colors duration-300 cursor-pointer"
                      >
                        <span>View on MyAnimeList</span>
                        <ExternalLink className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  )}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailAnimes;