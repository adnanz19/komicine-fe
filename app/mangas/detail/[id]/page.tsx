"use client";

import { useParams } from "next/navigation";
import DetailMangas from "@/components/mangasView/detailView/DetailMangas";

export default function MangaDetailPage() {
  const params = useParams();
  const mangaId = params.id as string;

  return <DetailMangas mangaId={mangaId} />;
}