
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

// Props interfaces
export interface ListMangasProps {
  searchQuery: string;
}

export interface DetailMangasProps {
  mangaId: string;
}

export interface HeroMangasProps {
  onSearch?: (keyword: string) => void;
}

// Category interface untuk Hero component
export interface CategoryItem {
  name: string;
  icon: React.ReactNode;
}
