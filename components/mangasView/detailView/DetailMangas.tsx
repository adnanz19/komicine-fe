"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Heart,
  BookOpen,
  Calendar,
  Star,
  Users,
  Trophy,
  ArrowLeft,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { MangaDetail, DetailMangasProps } from "@/types/manga";

const fetchMangaDetail = async (id: string): Promise<MangaDetail> => {
  const apiUrl = process.env.NEXT_PUBLIC_JIKAN_API_URL;
  const response = await axios.get(`${apiUrl}/manga/${id}`);
  return response.data.data;
};

const DetailMangas = ({ mangaId }: DetailMangasProps) => {
  const {
    data: manga,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["manga", mangaId],
    queryFn: () => fetchMangaDetail(mangaId),
    enabled: !!mangaId,
  });

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

  if (error || !manga) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 p-6 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">
            Manga tidak ditemukan
          </h1>
          <Link href="/mangas">
            <Button
              variant="outline"
              className="text-white border-white hover:bg-white hover:text-slate-900"
            >
              Kembali ke Daftar Manga
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
          <Link href="/mangas">
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
                      manga.images.jpg.large_image_url ||
                      manga.images.jpg.image_url
                    }
                    alt={manga.title}
                    fill
                    className="object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="p-4 space-y-3">
                  <Button className="w-full bg-red-600 hover:bg-red-700 cursor-pointer ">
                    <Heart className="w-4 h-4 mr-2 " />
                    Tambah ke Favorit
                  </Button>

                  <div className="grid grid-cols-2 gap-2 text-sm text-gray-300">
                    <div className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4" />
                      <span>{manga.chapters || "?"} Ch.</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{manga.volumes || "?"} Vol.</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span>{manga.score?.toFixed(1) || "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{manga.members?.toLocaleString()}</span>
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
                  {manga.title}
                </h1>

                {/* Alternative Titles */}
                {(manga.title_english || manga.title_japanese) && (
                  <div className="mb-4 space-y-1">
                    {manga.title_english && (
                      <p className="text-gray-300">
                        English: {manga.title_english}
                      </p>
                    )}
                    {manga.title_japanese && (
                      <p className="text-gray-300">
                        Japanese: {manga.title_japanese}
                      </p>
                    )}
                  </div>
                )}

                {/* Stats */}
                <div className="flex flex-wrap gap-4 mb-6">
                  {manga.rank && (
                    <div className="flex items-center gap-1 bg-yellow-600/20 text-yellow-400 px-3 py-1 rounded-full">
                      <Trophy className="w-4 h-4" />
                      <span>Rank #{manga.rank}</span>
                    </div>
                  )}
                  <Badge
                    variant="secondary"
                    className="bg-blue-600/20 text-blue-400"
                  >
                    {manga.type}
                  </Badge>
                  <Badge
                    variant="secondary"
                    className={`${
                      manga.status === "Finished"
                        ? "bg-green-600/20 text-green-400"
                        : "bg-blue-600/20 text-blue-400"
                    }`}
                  >
                    {manga.status}
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="bg-purple-600/20 text-purple-400"
                  >
                    Popularity #{manga.popularity}
                  </Badge>
                </div>

                {/* Publication Info */}
                <div className="mb-6 text-gray-300">
                  <p>
                    <strong>Published:</strong> {manga.published.string}
                  </p>
                  {manga.authors.length > 0 && (
                    <p>
                      <strong>Author:</strong>{" "}
                      {manga.authors.map((author) => author.name).join(", ")}
                    </p>
                  )}
                </div>

                {/* Genres */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-3">
                    Genres
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {manga.genres.map((genre) => (
                      <Badge
                        key={genre.mal_id}
                        variant="outline"
                        className="border-gray-600 text-gray-300"
                      >
                        {genre.name}
                      </Badge>
                    ))}
                    {manga.themes.map((theme) => (
                      <Badge
                        key={theme.mal_id}
                        variant="outline"
                        className="border-gray-600 text-gray-300"
                      >
                        {theme.name}
                      </Badge>
                    ))}
                    {manga.demographics.map((demo) => (
                      <Badge
                        key={demo.mal_id}
                        variant="outline"
                        className="border-gray-600 text-gray-300"
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
                    {manga.synopsis || "No synopsis available."}
                  </p>
                </div>

                {/* Background */}
                {manga.background && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">
                      Background
                    </h3>
                    <p className="text-gray-300 leading-relaxed">
                      {manga.background}
                    </p>
                  </div>
                )}

                {manga.url && (
                  <div className="mt-8">
                    <Link
                      href={manga.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button
                        variant="outline"
                        className="w-full border-slate-600 text-slate-300 hover:bg-white hover:text-slate-900 hover:border-white transition-colors duration-300 cursor-pointer  "
                      >
                        <span>More Info</span>
                        <ExternalLink className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                )}
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailMangas;
