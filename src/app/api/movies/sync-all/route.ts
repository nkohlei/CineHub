import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { FALLBACK_MOVIES } from "@/lib/fallback-data";
import { getMovieDetails, findTmdbId } from "@/lib/tmdb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const dynamic = "force-dynamic";
export const revalidate = 0;

let prismaAvailable = true;

async function getPrisma() {
  try {
    const { prisma } = await import("@/lib/prisma");
    return prisma;
  } catch {
    prismaAvailable = false;
    return null;
  }
}

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = (session.user as any).id;

  const { searchParams } = new URL(request.url);
  const lang = searchParams.get("language") || "en";

  try {
    const prisma = await getPrisma();
    let movies: any[] = [];
    let isDb = false;

    if (prisma && prismaAvailable) {
      try {
        movies = await prisma.movie.findMany({
          where: { userId }
        });
        isDb = true;
      } catch (err) {
        console.warn("DB unavailable during sync-all, falling back to local file:", err);
        prismaAvailable = false;
      }
    }

    if (!isDb) {
      movies = FALLBACK_MOVIES;
    }

    console.log(`Starting dynamic OMDb Mass Sync for ${movies.length} movies...`);
    const tmdbKeyLength = process.env.TMDB_API_KEY ? process.env.TMDB_API_KEY.length : 0;
    const omdbKeyLength = process.env.OMDB_API_KEY ? process.env.OMDB_API_KEY.length : 0;
    console.log(`[Mass Sync Init] TMDB Key length: ${tmdbKeyLength}, OMDB Key length: ${omdbKeyLength}`);
    let updatedCount = 0;

    for (const movie of movies) {
      try {
        let tmdbId = movie.tmdbId;

        // If no pre-existing TMDB ID, perform a search lookup first using helper
        if (!tmdbId) {
          console.log(`[Mass Sync] Querying TMDB ID search for: "${movie.title}"`);
          tmdbId = await findTmdbId(movie.title, lang);
        }

        if (!tmdbId) {
          console.warn(`[Mass Sync] Skipping ${movie.title} - No TMDB match found.`);
          continue;
        }

        console.log(`[Mass Sync] Fetching details for ${movie.title} with TMDB ID ${tmdbId}`);
        // Fetch detailed TMDB metadata using correct api_key parameter helper
        const tmdbDetails = await getMovieDetails(Number(tmdbId), lang);

        if (tmdbDetails.imdb_id) {
          const omdbUrl = `https://www.omdbapi.com/?i=${tmdbDetails.imdb_id}&apikey=${process.env.OMDB_API_KEY}`;
          const omdbData = await fetch(omdbUrl).then((r) => r.json());

          let finalImdbRating: string = "...";

          if (omdbData.Response === "True" && omdbData.imdbRating !== "N/A") {
            finalImdbRating = omdbData.imdbRating;
            console.log(`✅ SUCCESS: ${movie.title} -> IMDb: ${omdbData.imdbRating}`);
          } else if (omdbData.Error) {
            finalImdbRating = "ERR: " + omdbData.Error;
            console.error(`❌ OMDB FAILED for ${movie.title}:`, omdbData.Error);
          } else {
            finalImdbRating = "ERR: Unknown Error";
            console.error(`❌ OMDB FAILED for ${movie.title}: Unknown error`);
          }

          const posterPath = tmdbDetails.poster_path || null;
          const backdropPath = tmdbDetails.backdrop_path || null;
          const rating = tmdbDetails.vote_average ? parseFloat(tmdbDetails.vote_average.toFixed(1)) : null;
          const trailerKey = tmdbDetails.trailerKey || null;
          const cast = tmdbDetails.cast || [];
          const releaseDate = tmdbDetails.release_date || null;

          // Update DB (Prisma)
          let syncedSuccessfullyInDb = false;
          if (isDb && prisma) {
            try {
              await prisma.movie.update({
                where: { id: movie.id, userId },
                data: {
                  title: tmdbDetails.title || movie.title,
                  tmdbId: Number(tmdbId),
                  posterPath: posterPath,
                  backdropPath: backdropPath,
                  rating: rating,
                  imdbRating: finalImdbRating,
                  trailerKey: trailerKey,
                  releaseDate: releaseDate,
                  cast: cast as any
                }
              });
              syncedSuccessfullyInDb = true;
            } catch (dbErr) {
              console.warn(`Failed to update DB for ${movie.title}:`, dbErr);
            }
          }

          // Update Local file fallback
          if (!syncedSuccessfullyInDb) {
            const filePath = path.join(process.cwd(), "src/lib/fallback-data.ts");
            let content = fs.readFileSync(filePath, "utf8");

            const regex = new RegExp(`({[^}]+id:\\s*"${movie.id}"[^}]+})`);
            content = content.replace(regex, (fullMatch) => {
              let clean = fullMatch.replace(/\s*}\s*$/, "");

              clean = clean.replace(/,?\s*posterPath:\s*[^,]+/g, "");
              clean = clean.replace(/,?\s*backdropPath:\s*[^,]+/g, "");
              clean = clean.replace(/,?\s*rating:\s*[^,]+/g, "");
              clean = clean.replace(/,?\s*imdbRating:\s*[^,]+/g, "");
              clean = clean.replace(/,?\s*trailerKey:\s*[^,]+/g, "");
              clean = clean.replace(/,?\s*tmdbId:\s*[^,]+/g, "");
              clean = clean.replace(/,?\s*cast:\s*[^,]+/g, "");
              clean = clean.replace(/,?\s*releaseDate:\s*[^,]+/g, "");

              const castJsonStr = JSON.stringify(cast);

              return `${clean}, tmdbId: ${tmdbId}, posterPath: ${posterPath ? `"${posterPath}"` : "null"}, backdropPath: ${backdropPath ? `"${backdropPath}"` : "null"}, trailerKey: ${trailerKey ? `"${trailerKey}"` : "null"}, rating: ${rating || "null"}, imdbRating: ${finalImdbRating ? `"${finalImdbRating}"` : "null"}, releaseDate: ${releaseDate ? `"${releaseDate}"` : "null"}, cast: ${castJsonStr} }`;
            });

            fs.writeFileSync(filePath, content, "utf8");

            movie.tmdbId = Number(tmdbId);
            movie.posterPath = posterPath;
            movie.backdropPath = backdropPath;
            movie.rating = rating;
            movie.imdbRating = finalImdbRating;
            movie.trailerKey = trailerKey;
            movie.cast = cast;
            movie.releaseDate = releaseDate;
          }

          updatedCount++;
        } else {
          console.warn(`[Mass Sync] Warning: No IMDb ID on details for ${movie.title}`);
        }
      } catch (err) {
        console.error(`[Mass Sync] Error syncing "${movie.title}":`, err);
      }

      // MANDATORY 500ms delay to respect API limits and force success
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    return NextResponse.json({
      success: true,
      message: `Mass sync completed! Re-hydrated ${updatedCount} movies with real OMDb ratings.`,
      updatedCount
    });
  } catch (error) {
    console.error("Global mass sync route failed:", error);
    return NextResponse.json({ error: "Sync all failed" }, { status: 500 });
  }
}
