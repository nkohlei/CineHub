import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

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

function saveFallbackMoviesToFile(moviesList: any[]) {
  try {
    const filePath = path.join(process.cwd(), "src/lib/fallback-data.ts");
    const fileContent = `import { MovieRecord } from "./types";\n\n// Complete 49-movie fallback dataset — used when the database is unavailable\nexport const FALLBACK_MOVIES: MovieRecord[] = ${JSON.stringify(moviesList, null, 2)};\n`;
    fs.writeFileSync(filePath, fileContent, "utf8");
  } catch (err) {
    console.error("Failed to save fallback-data.ts:", err);
  }
}

// PATCH /api/movies/[id] — Update a movie
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = (session.user as any).id;

  try {
    const { id } = await params;
    const body = await request.json();

    if (body.watchedAt && typeof body.watchedAt === "string") {
      body.watchedAt = new Date(body.watchedAt);
    }

    const prisma = await getPrisma();
    if (prisma && prismaAvailable) {
      try {
        // Enforce ownership check
        const existingMovie = await prisma.movie.findFirst({
          where: { id, userId }
        });
        if (!existingMovie) {
          return NextResponse.json({ error: "Movie not found or unauthorized" }, { status: 404 });
        }

        const movie = await prisma.movie.update({
          where: { id },
          data: body,
        });
        return NextResponse.json(movie);
      } catch (dbError) {
        console.warn("⚠ Database query failed in PATCH, falling back to local file:", (dbError as Error).message);
        prismaAvailable = false;
      }
    }

    // Fallback file patching
    try {
      const fallbackDataModule = require("@/lib/fallback-data");
      const moviesList = fallbackDataModule.FALLBACK_MOVIES;
      const idx = moviesList.findIndex((m: any) => m.id === id);
      if (idx !== -1) {
        moviesList[idx] = { ...moviesList[idx], ...body };
        saveFallbackMoviesToFile(moviesList);
        return NextResponse.json(moviesList[idx]);
      }
      return NextResponse.json({ error: "Movie not found in fallback data" }, { status: 404 });
    } catch (e) {
      console.error("Failed to patch in-memory fallback list:", e);
      return NextResponse.json({ error: "Failed to update movie in fallback" }, { status: 500 });
    }
  } catch (error) {
    console.error("Failed to update movie:", error);
    return NextResponse.json({ error: "Failed to update movie" }, { status: 500 });
  }
}

// DELETE /api/movies/[id] — Delete a movie
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = (session.user as any).id;

  try {
    const { id } = await params;

    const prisma = await getPrisma();
    if (prisma && prismaAvailable) {
      try {
        // Enforce ownership check
        const existingMovie = await prisma.movie.findFirst({
          where: { id, userId }
        });
        if (!existingMovie) {
          return NextResponse.json({ error: "Movie not found or unauthorized" }, { status: 404 });
        }

        await prisma.movie.delete({ where: { id } });
        return NextResponse.json({ success: true });
      } catch (dbError) {
        console.warn("⚠ Database query failed in DELETE, falling back to local file:", (dbError as Error).message);
        prismaAvailable = false;
      }
    }

    // Fallback file deletion
    try {
      const fallbackDataModule = require("@/lib/fallback-data");
      const moviesList = fallbackDataModule.FALLBACK_MOVIES;
      const idx = moviesList.findIndex((m: any) => m.id === id);
      if (idx !== -1) {
        moviesList.splice(idx, 1);
        saveFallbackMoviesToFile(moviesList);
        return NextResponse.json({ success: true });
      }
      return NextResponse.json({ error: "Movie not found in fallback data" }, { status: 404 });
    } catch (e) {
      console.error("Failed to delete from in-memory fallback list:", e);
      return NextResponse.json({ error: "Failed to delete movie in fallback" }, { status: 500 });
    }
  } catch (error) {
    console.error("Failed to delete movie:", error);
    return NextResponse.json({ error: "Failed to delete movie" }, { status: 500 });
  }
}
