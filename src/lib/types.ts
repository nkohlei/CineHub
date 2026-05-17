// ——— Database Record ———
export interface MovieRecord {
  id: string;
  title: string;
  isWatched: boolean;
  watchedAt: string | null;
  tagColor: string | null;
  ratingTier?: string | null;
  tmdbId: number | null;
  posterPath: string | null;
  backdropPath: string | null;
  trailerKey: string | null;
  rating: number | null;
  imdbRating?: string | null;
  releaseDate?: string | null;
  cast?: any | null;
  createdAt: string;
}

// ——— TMDB API Types ———
export interface TMDBSearchResult {
  id: number;
  title: string;
  release_date: string;
  poster_path: string | null;
  overview: string;
  vote_average: number;
}

export interface TMDBMovieDetails {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  release_date: string;
  runtime: number;
  genres: { id: number; name: string }[];
  trailerKey: string | null;
  cast: CastMember[];
  imdb_id?: string | null;
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

// ——— Frontend Props ———
export interface MovieCardProps {
  movie: MovieRecord;
  onSelect: (movie: MovieRecord) => void;
}

export interface TMDBData {
  posterUrl: string | null;
  backdropUrl: string | null;
  overview: string;
  rating: number;
  trailerKey: string | null;
  cast: CastMember[];
  year: string;
  runtime: number;
  genres: string[];
}
