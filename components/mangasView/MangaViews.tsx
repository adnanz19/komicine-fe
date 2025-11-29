"use client";
import React, { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import HeroMangas from "./pageView/HeroMangas";
import ListMangas from "./pageView/ListMangas";
import { BackgroundBeamsWithCollision } from "../ui/shadcn-io/background-beams-with-collision";
import { useSafeMode } from "@/hooks/useSafeMode";

const MangaViews = () => {
  const searchParams = useSearchParams();

  const { safeMode } = useSafeMode();

  const searchQuery = useMemo(() => {
    const genreParam = searchParams.get("genre");
    if (genreParam) return ""; // Clear text search jika ada genre
    return searchParams.get("q") || "";
  }, [searchParams]);

  const handleSearch = () => {
  };

  return (
    <BackgroundBeamsWithCollision className="relative pb-20 px-6 md:px-10 overflow-hidden bg-background">
      <div className="min-h-screen bg-background">
        <HeroMangas onSearch={handleSearch} />
        <ListMangas searchQuery={searchQuery} safeMode={safeMode} />
      </div>
    </BackgroundBeamsWithCollision>
  );
};

export default MangaViews;