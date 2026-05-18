import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as any).id;

  try {
    const { inboxItemId, action } = await req.json();

    if (!inboxItemId || typeof inboxItemId !== "string") {
      return NextResponse.json({ error: "Invalid Inbox Item ID" }, { status: 400 });
    }

    if (action !== "accept" && action !== "delete") {
      return NextResponse.json({ error: "Invalid Action" }, { status: 400 });
    }

    // Fetch user and their inbox
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { inbox: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const inbox = Array.isArray(user.inbox) ? user.inbox : [];
    const item = inbox.find((i: any) => i.id === inboxItemId) as any;

    if (!item) {
      return NextResponse.json({ error: "Inbox item not found" }, { status: 404 });
    }

    // Filter out this item from the inbox
    const updatedInbox = inbox.filter((i: any) => i.id !== inboxItemId);

    if (action === "delete") {
      // Just remove the item from the inbox
      await prisma.user.update({
        where: { id: userId },
        data: { inbox: updatedInbox },
      });
      return NextResponse.json({ success: true });
    }

    // action === 'accept'
    // Fetch recipient's existing movies for deduplication
    const existingMovies = await prisma.movie.findMany({
      where: { userId },
      select: { tmdbId: true, imdbRating: true, title: true },
    });

    let addedCount = 0;

    if (item.type === "movie") {
      const movieData = item.data;
      
      // Deduplication check
      const isDuplicate = existingMovies.some((existing) => {
        const tmdbMatch = movieData.tmdbId && existing.tmdbId && movieData.tmdbId === existing.tmdbId;
        const imdbMatch = movieData.imdbRating && existing.imdbRating && 
                          movieData.imdbRating !== "ERR: " && 
                          existing.imdbRating !== "ERR: " && 
                          movieData.imdbRating === existing.imdbRating;
        return tmdbMatch || imdbMatch;
      });

      if (!isDuplicate) {
        await prisma.movie.create({
          data: {
            title: movieData.title,
            tmdbId: movieData.tmdbId || null,
            posterPath: movieData.posterPath || null,
            backdropPath: movieData.backdropPath || null,
            trailerKey: movieData.trailerKey || null,
            rating: movieData.rating || null,
            imdbRating: movieData.imdbRating || null,
            releaseDate: movieData.releaseDate || null,
            cast: movieData.cast || null,
            isWatched: false, // shared movies are added to recipient's watchlist
            watchedAt: null,
            userId: userId,
          },
        });
        addedCount = 1;
      }
    } else if (item.type === "list") {
      const incomingMovies = Array.isArray(item.data) ? item.data : [];

      // STRICT IDEMPOTENT DEDUPLICATION LOGIC
      const uniqueIncoming = incomingMovies.filter((incoming: any) => {
        const isDuplicate = existingMovies.some((existing) => {
          const tmdbMatch = incoming.tmdbId && existing.tmdbId && incoming.tmdbId === existing.tmdbId;
          const imdbMatch = incoming.imdbRating && existing.imdbRating && 
                            incoming.imdbRating !== "ERR: " && 
                            existing.imdbRating !== "ERR: " && 
                            incoming.imdbRating === existing.imdbRating;
          return tmdbMatch || imdbMatch;
        });
        return !isDuplicate;
      });

      if (uniqueIncoming.length > 0) {
        // Bulk insert new films linked to user
        await prisma.movie.createMany({
          data: uniqueIncoming.map((m: any) => ({
            title: m.title,
            tmdbId: m.tmdbId || null,
            posterPath: m.posterPath || null,
            backdropPath: m.backdropPath || null,
            trailerKey: m.trailerKey || null,
            rating: m.rating || null,
            imdbRating: m.imdbRating || null,
            releaseDate: m.releaseDate || null,
            cast: m.cast || null,
            isWatched: false, // integrated as watchlist
            watchedAt: null,
            userId: userId,
          })),
        });
        addedCount = uniqueIncoming.length;
      }
    }

    // Save user with cleared inbox item
    await prisma.user.update({
      where: { id: userId },
      data: { inbox: updatedInbox },
    });

    return NextResponse.json({ success: true, addedCount });
  } catch (error) {
    console.error("Inbox Action API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
