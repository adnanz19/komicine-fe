"use client";
import React, { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { BackgroundBeamsWithCollision } from "../ui/shadcn-io/background-beams-with-collision";
import { useSafeMode } from "@/hooks/useSafeMode";
import HeroAnimes from "./pageView/HeroAnimes";
import ListAnimes from "./pageView/ListAnimes";
import { Particles } from "../ui/shadcn-io/particles";

const AnimeViews = () => {
  const searchParams = useSearchParams();

  const { safeMode } = useSafeMode();

  const searchQuery = useMemo(() => {
    const genreParam = searchParams.get("genre");
    if (genreParam) return "";
    return searchParams.get("q") || "";
  }, [searchParams]);

  const handleSearch = () => {};

  return (
    <div className="relative pb-20 px-6 md:px-10 overflow-hidden bg-background">
      <div className="min-h-screen bg-background">
        <HeroAnimes onSearch={handleSearch} />
        <ListAnimes searchQuery={searchQuery} safeMode={safeMode} />
      </div>

      <Particles
        className="absolute inset-0"
        quantity={100}
        ease={80}
        staticity={50}
        color="#ffffff"
        size={0.8}
      />
    </div>
  );
};

export default AnimeViews;
