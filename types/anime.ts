export interface AnimeImage {
  image_url: string;
  small_image_url: string;
  large_image_url: string;
}

export interface AnimeImages {
  jpg: AnimeImage;
  webp: AnimeImage;
}

export interface AnimeTrailer {
  youtube_id?: string;
  url?: string;
  embed_url?: string;
  images?: {
    image_url?: string;
    small_image_url?: string;
    medium_image_url?: string;
    large_image_url?: string;
    maximum_image_url?: string;
  };
}

export interface AnimeGenre {
  mal_id: number;
  type: string;
  name: string;
  url: string;
}

export interface AnimeTheme {
  mal_id: number;
  type: string;
  name: string;
  url: string;
}

export interface AnimeDemographic {
  mal_id: number;
  type: string;
  name: string;
  url: string;
}

export interface AnimeStudio {
  mal_id: number;
  type: string;
  name: string;
  url: string;
}

export interface AnimeProducer {
  mal_id: number;
  type: string;
  name: string;
  url: string;
}

export interface AnimeAired {
  from: string;
  to: string;
  prop: {
    from: {
      day: number;
      month: number;
      year: number;
    };
    to?: {
      day: number;
      month: number;
      year: number;
    };
  };
  string: string;
}

export interface AnimeBroadcast {
  day: string;
  time: string;
  timezone: string;
  string: string;
}

export interface AnimeTitle {
  type: string;
  title: string;
}

// Interface untuk List Anime (ListAnimes component)
export interface AnimeData {
  mal_id: number;
  url: string;
  images: AnimeImages;
  trailer?: AnimeTrailer;
  approved: boolean;
  titles: AnimeTitle[];
  title: string;
  title_english?: string;
  title_japanese?: string;
  title_synonyms: string[];
  type: string;
  source: string;
  episodes: number;
  status: string;
  airing: boolean;
  aired: AnimeAired;
  duration: string;
  rating?: string;
  score: number;
  scored_by?: number;
  rank?: number;
  popularity: number;
  members: number;
  favorites?: number;
  synopsis?: string;
  background?: string;
  season?: string;
  year?: number;
  broadcast?: AnimeBroadcast;
  producers?: AnimeProducer[];
  licensors?: AnimeProducer[];
  studios?: AnimeStudio[];
  genres: AnimeGenre[];
  explicit_genres?: AnimeGenre[];
  themes: AnimeTheme[];
  demographics: AnimeDemographic[];
}

// Interface untuk Detail Anime
export type AnimeDetail = AnimeData;

// Interface untuk API Response
export interface AnimeApiResponse {
  data: AnimeData[];
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
export interface ListAnimesProps {
  searchQuery: string;
  safeMode?: boolean;
}

export interface HeroAnimesProps {
  onSearch: (query: string) => void;
}

export interface DetailAnimesProps {
  animeId: string;
}

export interface AnimePaginationProps {
  pagination: {
    last_visible_page: number;
    has_next_page: boolean;
    current_page: number;
    items?: {
      count: number;
      total: number;
      per_page: number;
    };
  };
  currentPage: number;
  onPageChange: (page: number) => void;
}
