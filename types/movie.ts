// Movie types for TMDB API
export interface MovieData {
  adult: boolean;
  backdrop_path: string | null;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export interface MovieApiResponse {
  page: number;
  results: MovieData[];
  total_pages: number;
  total_results: number;
}

export interface MovieGenre {
  id: number;
  name: string;
}

export interface MovieDetail extends MovieData {
  belongs_to_collection?: {
    id: number;
    name: string;
    poster_path: string | null;
    backdrop_path: string | null;
  };
  budget: number;
  genres: MovieGenre[];
  homepage: string | null;
  imdb_id: string | null;
  origin_country: string[];
  production_companies: Array<{
    id: number;
    logo_path: string | null;
    name: string;
    origin_country: string;
  }>;
  production_countries: Array<{
    iso_3166_1: string;
    name: string;
  }>;
  revenue: number;
  runtime: number | null;
  spoken_languages: Array<{
    english_name: string;
    iso_639_1: string;
    name: string;
  }>;
  status: string;
  tagline: string | null;
}

// Props interfaces
export interface ListMoviesProps {
  searchKeyword?: string;
  onPageChange?: (page: number) => void;
}

export interface HeroMoviesProps {
  onSearch?: (keyword: string) => void;
}

export interface DetailMoviesProps {
  movieId: string;
}

export interface MoviePaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange?: (page: number) => void;
  totalResults: number;
}

// Movie genre mapping
export const MOVIE_GENRES: { [key: number]: string } = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  14: "Fantasy",
  36: "History",
  27: "Horror",
  10402: "Music",
  9648: "Mystery",
  10749: "Romance",
  878: "Science Fiction",
  10770: "TV Movie",
  53: "Thriller",
  10752: "War",
  37: "Western",
};
