import { NextRequest, NextResponse } from "next/server";
import { FALLBACK_MOVIES } from "@/lib/fallback-data";
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

// GET /api/movies — Fetch all movies for the logged-in user with fallback to local data
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = (session.user as any).id;

  const { searchParams } = new URL(request.url);
  const watched = searchParams.get("watched");

  // Try database first
  if (prismaAvailable) {
    try {
      const prisma = await getPrisma();
      if (prisma) {
        const where: any = { userId };
        if (watched !== null) {
          where.isWatched = watched === "true";
        }
        
        const movies = await prisma.movie.findMany({
          where,
          orderBy: watched === "true" ? { watchedAt: "desc" } : { createdAt: "asc" },
        });
        
        return NextResponse.json(movies);
      }
    } catch (error) {
      console.warn("⚠ Database unavailable, using fallback data:", (error as Error).message);
      prismaAvailable = false;
    }
  }

  // Fallback: return local JSON data
  let data = FALLBACK_MOVIES;
  if (watched === "true") {
    data = data.filter((m) => m.isWatched).sort(
      (a, b) => new Date(b.watchedAt || 0).getTime() - new Date(a.watchedAt || 0).getTime()
    );
  } else if (watched === "false") {
    data = data.filter((m) => !m.isWatched);
  }

  return NextResponse.json(data);
}

import { getMovieDetails } from "@/lib/tmdb";
import fs from "fs";
import path from "path";

function appendToFallbackFile(movie: { id: string; title: string; tmdbId: number | null; posterPath: string | null; backdropPath: string | null; trailerKey: string | null; rating: number | null; imdbRating: string | null; releaseDate: string | null }) {
  try {
    const filePath = path.join(process.cwd(), "src/lib/fallback-data.ts");
    let content = fs.readFileSync(filePath, "utf8");
    const arrayEndIndex = content.lastIndexOf("];");
    if (arrayEndIndex !== -1) {
      const newMovieStr = `  { id: "${movie.id}", title: "${movie.title.replace(/"/g, '\\"')}", isWatched: false, watchedAt: null, tagColor: null, tmdbId: ${movie.tmdbId || null}, createdAt: "${new Date().toISOString()}", posterPath: ${movie.posterPath ? `"${movie.posterPath}"` : "null"}, backdropPath: ${movie.backdropPath ? `"${movie.backdropPath}"` : "null"}, trailerKey: ${movie.trailerKey ? `"${movie.trailerKey}"` : "null"}, rating: ${movie.rating || "null"}, imdbRating: ${movie.imdbRating ? `"${movie.imdbRating}"` : "null"}, releaseDate: ${movie.releaseDate ? `"${movie.releaseDate}"` : "null"} },\n`;
      content = content.slice(0, arrayEndIndex) + newMovieStr + content.slice(arrayEndIndex);
      fs.writeFileSync(filePath, content, "utf8");
      
      // Update global array in memory so it takes effect instantly without server restart
      try {
        FALLBACK_MOVIES.push({
          id: movie.id,
          title: movie.title,
          isWatched: false,
          watchedAt: null,
          tagColor: null,
          tmdbId: movie.tmdbId,
          createdAt: new Date().toISOString(),
          posterPath: movie.posterPath,
          backdropPath: movie.backdropPath,
          trailerKey: movie.trailerKey,
          rating: movie.rating,
          imdbRating: movie.imdbRating,
          releaseDate: movie.releaseDate
        });
      } catch (e) {
        console.warn("Could not hot-update in-memory fallback list:", e);
      }
    }
  } catch (err) {
    console.error("Failed to append to fallback-data.ts:", err);
    return false;
  }
  return true;
}

async function fetchImdbRating(imdbId: string | null): Promise<string | null> {
  const apiKey = process.env.OMDB_API_KEY;
  if (!apiKey || !imdbId) return null;
  try {
    const res = await fetch(`https://www.omdbapi.com/?i=${imdbId}&apikey=${apiKey}`);
    if (!res.ok) return null;
    const data = await res.json();
    if (data && data.imdbRating && data.imdbRating !== "N/A") {
      return data.imdbRating;
    }
    return null;
  } catch (err) {
    console.warn("Failed to fetch IMDb rating from OMDb:", err);
    return null;
  }
}

// POST /api/movies — Create a new movie for the logged-in user
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = (session.user as any).id;

  try {
    const body = await request.json();
    const { title, tmdbId, language } = body;
    let { posterPath, rating } = body;

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    let finalTitle = title;
    let backdropPath = null;
    let trailerKey = null;
    let imdbRating = null;
    let releaseDate = null;
    let cast = null;

    if (tmdbId) {
      try {
        const details = await getMovieDetails(tmdbId, language || "en");
        finalTitle = details.title || title;
        posterPath = posterPath || details.poster_path;
        backdropPath = details.backdrop_path;
        trailerKey = details.trailerKey;
        rating = rating || details.vote_average;
        releaseDate = details.release_date;
        cast = details.cast || [];
        
        if (details.imdb_id) {
          imdbRating = await fetchImdbRating(details.imdb_id);
        }
      } catch (err) {
        console.warn("Failed to fetch TMDB details during creation:", err);
      }
    }

    const prisma = await getPrisma();
    if (prisma && prismaAvailable) {
      try {
        const existing = await prisma.movie.findFirst({ where: { title: finalTitle, userId } });
        if (existing) {
          return NextResponse.json({ error: "Movie already exists" }, { status: 409 });
        }

        const movie = await prisma.movie.create({
          data: {
            title: finalTitle,
            tmdbId: tmdbId || null,
            isWatched: false,
            posterPath: posterPath || null,
            backdropPath: backdropPath || null,
            trailerKey: trailerKey || null,
            rating: rating || null,
            imdbRating: imdbRating || null,
            releaseDate: releaseDate || null,
            cast: cast as any,
            userId: userId
          },
        });

        return NextResponse.json(movie, { status: 201 });
      } catch (dbError) {
        console.warn("⚠ Database query failed in POST, falling back to local file:", (dbError as Error).message);
        prismaAvailable = false;
      }
    }

    // Database is down/unavailable, let's write to fallback file!
    const mockMovie = {
      id: `f_${Date.now()}`,
      title: finalTitle,
      tmdbId: tmdbId || null,
      posterPath: posterPath || null,
      backdropPath: backdropPath || null,
      trailerKey: trailerKey || null,
      rating: rating || null,
      imdbRating: imdbRating || null,
      releaseDate: releaseDate || null,
      cast: cast
    };
    appendToFallbackFile(mockMovie);
    return NextResponse.json(mockMovie, { status: 201 });
  } catch (error) {
    console.error("Failed to create movie:", error);
    return NextResponse.json({ error: "Failed to create movie" }, { status: 500 });
  }
}
