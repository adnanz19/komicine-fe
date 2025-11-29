"use client";
import React, { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import HeroMangas from "./pageView/HeroMangas";
import ListMangas from "./pageView/ListMangas";
import { BackgroundBeamsWithCollision } from "../ui/shadcn-io/background-beams-with-collision";

const MangaViews = () => {
  const searchParams = useSearchParams();

  const searchQuery = useMemo(() => {
    return searchParams.get("q") || "";
  }, [searchParams]);

  const handleSearch = () => {};
  return (
     <BackgroundBeamsWithCollision className="relative  pb-20 px-6 md:px-10 overflow-hidden bg-background">

    <div className="min-h-screen bg-background">
      <HeroMangas onSearch={handleSearch} />
      <ListMangas searchQuery={searchQuery} />
    </div>
     </BackgroundBeamsWithCollision>
  );
};

export default MangaViews;
