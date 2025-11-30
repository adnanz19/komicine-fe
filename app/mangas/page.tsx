import { Suspense } from "react";
import MangaViews from "@/components/mangasView/MangaViews"; // Sesuaikan path
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Daftar Manga",
};

export default function MangasPage() {
  return (
    <Suspense fallback={<div className="text-center p-10 text-white">Loading Mangas...</div>}>
      <MangaViews />
    </Suspense>
  );
}