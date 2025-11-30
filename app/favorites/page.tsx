import { Suspense } from "react";
import FavoritesView from "@/components/favoriteView/FavoritesView"; // Sesuaikan path
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Koleksi Favorit",
};

export default function FavoritesPage() {
  return (
    <Suspense fallback={<div className="text-center p-10 text-white">Loading Favorites...</div>}>
      <FavoritesView />
    </Suspense>
  );
}