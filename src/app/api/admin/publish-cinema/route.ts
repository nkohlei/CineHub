import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as any).id;
  const shareId = (session.user as any).shareId;

  if (userId !== "A0VFMN" && shareId !== "A0VFMN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { movieId, title, poster, overview, imdbRating, videoStreamUrl } = body;

    if (!movieId || !title || !poster || !videoStreamUrl) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Delete existing weekly films to ensure only one is active
    await prisma.cinemaMovie.deleteMany({});

    const parsedRating = imdbRating ? parseFloat(String(imdbRating)) : null;

    const cinemaMovie = await prisma.cinemaMovie.create({
      data: {
        movieId: Number(movieId),
        title,
        poster,
        overview: overview || "",
        imdbRating: isNaN(parsedRating as number) ? null : parsedRating,
        videoStreamUrl,
        publishedAt: new Date()
      }
    });

    return NextResponse.json({ success: true, movie: cinemaMovie });
  } catch (error) {
    console.error("Failed to publish weekly movie:", error);
    return NextResponse.json({ error: "Failed to publish weekly movie" }, { status: 500 });
  }
}
