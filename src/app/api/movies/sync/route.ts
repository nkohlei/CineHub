import { NextRequest, NextResponse } from "next/server";
import { searchMovies, getMovieDetails } from "@/lib/tmdb";
import fs from "fs";
import path from "path";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

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

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = (session.user as any).id;

  const { searchParams } = new URL(request.url);
  const lang = searchParams.get("language") || "en";

  try {
    const prisma = await getPrisma();
    let moviesToSync = [];
    let isDb = false;

    if (prisma && prismaAvailable) {
      try {
        moviesToSync = await prisma.movie.findMany({
          where: {
            userId,
            OR: [
              { posterPath: null },
              { posterPath: "" }
            ]
          }
        });
        isDb = true;
      } catch (err) {
        console.warn("DB unavailable during sync, falling back to local file:", err);
        prismaAvailable = false;
      }
    }

    if (!isDb) {
      // Fallback: read from local file
      const { FALLBACK_MOVIES } = require("@/lib/fallback-data");
      moviesToSync = FALLBACK_MOVIES.filter((m: any) => !m.posterPath);
    }

    console.log(`Starting sequential sync for ${moviesToSync.length} movies...`);
    let updatedCount = 0;

    for (const movie of moviesToSync) {
      // Intentional delay between TMDB requests to completely avoid rate limits (429)
      await new Promise((resolve) => setTimeout(resolve, 350));

      try {
        let tmdbId = movie.tmdbId;
        const cleanTitle = movie.title.split("/")[0].trim();

        if (!tmdbId) {
          console.log(`Searching TMDB for: ${cleanTitle}`);
          const searchResults = await searchMovies(cleanTitle, lang);
          if (searchResults && searchResults.length > 0) {
            tmdbId = searchResults[0].id;
          }
        }

        if (tmdbId) {
          console.log(`Fetching TMDB details for ID ${tmdbId} (${cleanTitle})`);
          const details = await getMovieDetails(tmdbId, lang);
          const posterPath = details.poster_path || null;
          const backdropPath = details.backdrop_path || null;
          const rating = details.vote_average || null;
          const trailerKey = details.trailerKey || null;

          let syncedSuccessfullyInDb = false;
          if (isDb && prisma) {
            try {
              await prisma.movie.update({
                where: { id: movie.id, userId },
                data: {
                  title: details.title || movie.title,
                  tmdbId,
                  posterPath,
                  backdropPath,
                  rating,
                  trailerKey
                }
              });
              syncedSuccessfullyInDb = true;
            } catch (dbErr) {
              console.warn(`Failed to update movie ${movie.title} in DB midway, falling back to local file:`, dbErr);
            }
          }

          if (!syncedSuccessfullyInDb) {
            // Write directly to fallback-data.ts file!
            const filePath = path.join(process.cwd(), "src/lib/fallback-data.ts");
            let content = fs.readFileSync(filePath, "utf8");
            
            // Match the specific object by its ID in the fallback array
            const regex = new RegExp(`({[^}]+id:\\s*"${movie.id}"[^}]+})`);
            content = content.replace(regex, (fullMatch) => {
              // Strip trailing ' }' and existing properties we want to overwrite
              let clean = fullMatch.replace(/\s*}\s*$/, "");
              
              // Remove fields if they are already present so we don't duplicate them
              clean = clean.replace(/,?\s*posterPath:\s*[^,]+/g, "");
              clean = clean.replace(/,?\s*backdropPath:\s*[^,]+/g, "");
              clean = clean.replace(/,?\s*rating:\s*[^,]+/g, "");
              clean = clean.replace(/,?\s*trailerKey:\s*[^,]+/g, "");
              clean = clean.replace(/,?\s*tmdbId:\s*[^,]+/g, "");

              return `${clean}, tmdbId: ${tmdbId}, posterPath: ${posterPath ? `"${posterPath}"` : "null"}, backdropPath: ${backdropPath ? `"${backdropPath}"` : "null"}, trailerKey: ${trailerKey ? `"${trailerKey}"` : "null"}, rating: ${rating || "null"} }`;
            });
            
            fs.writeFileSync(filePath, content, "utf8");

            // Also update in-memory to reflect immediately
            movie.tmdbId = tmdbId;
            movie.posterPath = posterPath;
            movie.backdropPath = backdropPath;
            movie.rating = rating;
            movie.trailerKey = trailerKey;
          }

          updatedCount++;
        }
      } catch (err) {
        console.error(`Failed to sync movie "${movie.title}":`, err);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Successfully synced ${updatedCount} movies.`,
      updatedCount
    });
  } catch (error) {
    console.error("Global sync endpoint failed:", error);
    return NextResponse.json({ error: "Sync failed" }, { status: 500 });
  }
}
