"use client";
import React, { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { BackgroundBeamsWithCollision } from "../ui/shadcn-io/background-beams-with-collision";
import { useSafeMode } from "@/hooks/useSafeMode";
import HeroAnimes from "./pageView/HeroAnimes";
import ListAnimes from "./pageView/ListAnimes";

const AnimeViews = () => {
  const searchParams = useSearchParams();

  const { safeMode } = useSafeMode();

  const searchQuery = useMemo(() => {
    const genreParam = searchParams.get("genre");
    if (genreParam) return ""; 
    return searchParams.get("q") || "";
  }, [searchParams]);

  const handleSearch = () => {
  };

  return (
    <BackgroundBeamsWithCollision className="relative pb-20 px-6 md:px-10 overflow-hidden bg-background">
      <div className="min-h-screen bg-background">
        <HeroAnimes onSearch={handleSearch} />
        <ListAnimes searchQuery={searchQuery} safeMode={safeMode} />
      </div>
    </BackgroundBeamsWithCollision>
  );
};

export default AnimeViews;