import { PrismaClient } from "@prisma/client";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
function getApiKey(): string {
  const key = process.env.TMDB_API_KEY;
  if (!key) throw new Error("TMDB_API_KEY is not set in environment variables");
  return key;
}

export async function searchMovies(query: string) {
  const res = await fetch(
    `${TMDB_BASE_URL}/search/movie?api_key=${getApiKey()}&query=${encodeURIComponent(query)}&include_adult=false&language=en-US&page=1`
  );
  if (!res.ok) throw new Error(`TMDB search failed: ${res.status}`);
  const data = await res.json();
  // Sort by popularity descending
  const results = data.results || [];
  results.sort((a: any, b: any) => b.popularity - a.popularity);
  return results.slice(0, 8);
}

export async function getMovieDetails(tmdbId: number) {
  const res = await fetch(
    `${TMDB_BASE_URL}/movie/${tmdbId}?api_key=${getApiKey()}&language=en-US&append_to_response=videos,credits`
  );
  if (!res.ok) throw new Error(`TMDB details failed: ${res.status}`);
  const data = await res.json();

  const trailer = data.videos?.results?.find(
    (v: { site: string; type: string }) => v.site === "YouTube" && v.type === "Trailer"
  );

  return {
    poster_path: data.poster_path,
    backdrop_path: data.backdrop_path,
    vote_average: data.vote_average,
    trailerKey: trailer?.key || null,
  };
}

const prisma = new PrismaClient();

async function main() {
  console.log("Syncing movies...");
  const movies = await prisma.movie.findMany();
  for (const movie of movies) {
    console.log(`Syncing ${movie.title}...`);
    try {
      let tmdbId = movie.tmdbId;
      if (!tmdbId) {
        const cleanTitle = movie.title.split("/")[0].trim();
        const results = await searchMovies(cleanTitle);
        if (results.length > 0) {
          tmdbId = results[0].id;
        }
      }

      if (tmdbId) {
        const details = await getMovieDetails(tmdbId);
        await prisma.movie.update({
          where: { id: movie.id },
          data: {
            tmdbId,
            posterPath: details.poster_path,
            backdropPath: details.backdrop_path,
            trailerKey: details.trailerKey,
            rating: details.vote_average,
          },
        });
        console.log(`Updated ${movie.title}`);
      } else {
        console.log(`Could not find tmdbId for ${movie.title}`);
      }
    } catch (e) {
      console.error(`Error syncing ${movie.title}`, e);
    }
  }
}

main().finally(() => prisma.$disconnect());
