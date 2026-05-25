import { NextRequest, NextResponse } from "next/server";
import { getMovieDetails } from "@/lib/tmdb";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return new NextResponse("Movie ID is required", { status: 400 });
  }

  const tmdbId = parseInt(id, 10);
  if (isNaN(tmdbId)) {
    return new NextResponse("Invalid Movie ID", { status: 400 });
  }

  try {
    let movie;
    try {
      movie = await getMovieDetails(tmdbId, "tr");
    } catch (err) {
      try {
        movie = await getMovieDetails(tmdbId, "en");
      } catch (e) {
        return new NextResponse("Movie not found in TMDB", { status: 404 });
      }
    }
    const year = movie.release_date ? movie.release_date.split("-")[0] : "";
    const imageUrl = movie.poster_path 
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : "https://oxynema.netlify.app/images/og-preview.png";
    const titleText = `🍿 ${movie.title} (${year}) - Oxynema`;
    const descriptionText = `⭐ IMDb: ${movie.vote_average?.toFixed(1)}/10 | ${movie.overview?.substring(0, 150)}...`;

    // Emit raw static metadata layout directly into the scraper bot's pipeline
    const html = `<!DOCTYPE html>
<html>
  <head>
    <title>${titleText}</title>
    <meta name="description" content="${descriptionText}" />
    <meta property="og:type" content="video.movie" />
    <meta property="og:title" content="${titleText}" />
    <meta property="og:description" content="${descriptionText}" />
    <meta property="og:image" content="${imageUrl}" />
    <meta property="og:image:secure_url" content="${imageUrl}" />
    <meta property="og:image:type" content="image/jpeg" />
    <meta property="og:image:width" content="500" />
    <meta property="og:image:height" content="750" />
    <meta property="og:url" content="https://oxynema.netlify.app/movie/${id}" />
    <meta property="og:site_name" content="Oxynema" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:image" content="${imageUrl}" />
  </head>
  <body>
    <p>Redirecting to Oxynema...</p>
  </body>
</html>`;

    return new NextResponse(html, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
      },
    });
  } catch (error) {
    console.error("share-metadata endpoint failed:", error);
    return new NextResponse("Metadata Generation Failed", { status: 500 });
  }
}
