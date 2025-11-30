import { Suspense } from "react"; // 1. Import Suspense
import AnimeViews from "@/components/animeView/AnimeView"; // Sesuaikan path import kamu
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Daftar Anime",
};

export default function AnimesPage() {
  return (
    // 2. Bungkus komponen view dengan Suspense
    <Suspense fallback={
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    }>
      <AnimeViews />
    </Suspense>
  );
}