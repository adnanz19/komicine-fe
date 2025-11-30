import { Suspense } from "react";
import MovieViews from "@/components/movieView/MovieViews";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Daftar Movie",
};

export default function MoviesPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center min-h-screen text-white">
        Loading Movies...
      </div>
    }>
      <MovieViews />
    </Suspense>
  );
}