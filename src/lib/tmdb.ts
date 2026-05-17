const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p";

function getApiKey(): string {
  const key = process.env.TMDB_API_KEY;
  if (!key) throw new Error("TMDB_API_KEY is not set in environment variables");
  return key;
}

export function getPosterUrl(path: string | null, size: string = "w500"): string | null {
  if (!path) return null;
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
}

export function getBackdropUrl(path: string | null, size: string = "w1280"): string | null {
  if (!path) return null;
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
}

export function getProfileUrl(path: string | null, size: string = "w185"): string | null {
  if (!path) return null;
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
}

export async function searchMovies(query: string, lang: string = "en") {
  const languageParam = lang === "tr" ? "tr-TR" : "en-US";
  const res = await fetch(
    `${TMDB_BASE_URL}/search/movie?api_key=${getApiKey()}&query=${encodeURIComponent(query)}&include_adult=false&language=${languageParam}&page=1`
  );
  if (!res.ok) throw new Error(`TMDB search failed: ${res.status}`);
  const data = await res.json();
  // Sort by popularity descending
  const results = data.results || [];
  results.sort((a: any, b: any) => b.popularity - a.popularity);
  return results.slice(0, 8);
}

export async function getMovieDetails(tmdbId: number, lang: string = "en") {
  const languageParam = lang === "tr" ? "tr-TR" : "en-US";
  const res = await fetch(
    `${TMDB_BASE_URL}/movie/${tmdbId}?api_key=${getApiKey()}&language=${languageParam}&append_to_response=videos,credits`
  );
  if (!res.ok) throw new Error(`TMDB details failed: ${res.status}`);
  const data = await res.json();

  // Extract YouTube trailer
  const trailer = data.videos?.results?.find(
    (v: { site: string; type: string }) => v.site === "YouTube" && v.type === "Trailer"
  );

  // Extract top 6 cast members
  const cast = (data.credits?.cast || []).slice(0, 6).map(
    (c: { id: number; name: string; character: string; profile_path: string | null }) => ({
      id: c.id,
      name: c.name,
      character: c.character,
      profile_path: c.profile_path,
    })
  );

  return {
    id: data.id,
    title: data.title,
    overview: data.overview,
    poster_path: data.poster_path,
    backdrop_path: data.backdrop_path,
    vote_average: data.vote_average,
    release_date: data.release_date,
    runtime: data.runtime,
    genres: data.genres || [],
    trailerKey: trailer?.key || null,
    cast,
    imdb_id: data.imdb_id || null,
  };
}

// Search by title and return the most popular match's tmdbId
export async function findTmdbId(title: string, lang: string = "en"): Promise<number | null> {
  // Clean up title: take part before "/" if present
  const cleanTitle = title.split("/")[0].trim();
  const results = await searchMovies(cleanTitle, lang);
  return results.length > 0 ? results[0].id : null;
}
