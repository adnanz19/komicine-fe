export interface MangaImage {
  jpg: {
    image_url: string;
    large_image_url?: string;
  };
}

export interface MangaAuthor {
  mal_id: number;
  name: string;
}

export interface MangaGenre {
  mal_id: number;
  name: string;
}

export interface MangaTheme {
  mal_id: number;
  name: string;
}

export interface MangaDemographic {
  mal_id: number;
  name: string;
}

export interface MangaPublished {
  from: string;
  to?: string;
  string: string;
}

// Interface untuk List Manga (ListMangas component)
export interface MangaData {
  mal_id: number;
  url: string;
  title: string;
  images: MangaImage;
  chapters: number | null;
  status: string;
  score: number;
  members: number;
  genres?: MangaGenre[]; // Optional karena tidak semua response API include genres
}

// Interface untuk Detail Manga (DetailMangas component)
export interface MangaDetail {
  mal_id: number;
  url: string;
  title: string;
  title_english?: string;
  title_japanese?: string;
  images: MangaImage;
  type: string;
  chapters?: number;
  volumes?: number;
  status: string;
  published: MangaPublished;
  score: number;
  scored_by: number;
  rank?: number;
  popularity: number;
  members: number;
  favorites: number;
  synopsis: string;
  background?: string;
  authors: MangaAuthor[];
  genres: MangaGenre[];
  themes: MangaTheme[];
  demographics: MangaDemographic[];
}

export interface MangaApiResponse {
  data: MangaData[];
  pagination: {
    last_visible_page: number;
    has_next_page: boolean;
    current_page: number;
    items: {
      count: number;
      total: number;
      per_page: number;
    };
  };
}

// Props interfaces
export interface ListMangasProps {
  searchQuery: string;
  safeMode?: boolean;
}

export interface DetailMangasProps {
  mangaId: string;
}

export interface HeroMangasProps {
  onSearch?: (keyword: string) => void;
}

export interface SafeModeState {
  enabled: boolean;
}

export interface FilterSettings {
  safeMode: boolean;
  hiddenGenres: string[];
}

// Category interface untuk Hero component
export interface CategoryItem {
  name: string;
  icon: React.ReactNode;
}
