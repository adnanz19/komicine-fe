import MovieViews from "@/components/movieView/MovieViews";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Daftar Movie",
};

export default function MoviesPage() {
  return <MovieViews />;
}
