"use client";

import React, { useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import HeroMovies from "./pageView/HeroMovies";
import ListMovies from "./pageView/ListMovies";
import { BackgroundBeamsWithCollision } from "../ui/shadcn-io/background-beams-with-collision";
import { Particles } from "../ui/shadcn-io/particles";

const MovieViews: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Handler untuk search dari hero component
  const handleSearch = useCallback(
    (keyword: string) => {
      console.log("🔍 MovieViews: Search triggered", { keyword });

      if (keyword.trim()) {
        const params = new URLSearchParams();
        params.set("q", keyword.trim());
        router.push(`/movies?${params.toString()}`);
      } else {
        router.push("/movies");
      }
    },
    [router]
  );

  // Handler untuk pagination
  const handlePageChange = useCallback(
    (newPage: number) => {
      console.log("MovieViews: Page change", { newPage });

      const params = new URLSearchParams(searchParams.toString());

      if (newPage === 1) {
        params.delete("page");
      } else {
        params.set("page", newPage.toString());
      }

      const newUrl = params.toString()
        ? `/movies?${params.toString()}`
        : "/movies";
      router.push(newUrl);
    },
    [router, searchParams]
  );

  // Get current search keyword from URL
  const currentKeyword = searchParams.get("q") || "";

  return (
    <div className="relative pb-20 px-6 md:px-10 overflow-hidden bg-background">
      <div className="min-h-screen bg-background">
        <HeroMovies onSearch={handleSearch} />
        <ListMovies
          searchKeyword={currentKeyword}
          onPageChange={handlePageChange}
        />
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

export default MovieViews;
