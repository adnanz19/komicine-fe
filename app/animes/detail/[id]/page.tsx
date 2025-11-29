"use client";

import DetailAnimes from "@/components/animeView/detailView/DetailAnimes";
import { useParams } from "next/navigation";

export default function AnimeDetailPage() {
  const params = useParams();
  const animeId = params.id as string;

  return <DetailAnimes animeId={animeId} />;
}