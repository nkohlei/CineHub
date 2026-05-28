import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getMovieDetails } from "@/lib/tmdb";
import DashboardClient from "../../DashboardClient";
import { MovieRecord } from "@/lib/types";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const tmdbId = parseInt(id, 10);
  
  if (isNaN(tmdbId)) {
    return { title: "Movie Not Found - Oxynema" };
  }

  try {
    const movie = await getMovieDetails(tmdbId, "en");
    const year = movie.release_date ? movie.release_date.split("-")[0] : "";
    const ratingStr = movie.vote_average ? movie.vote_average.toFixed(1) : "N/A";
    const posterUrl = movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : "https://oxynema.netlify.app/images/og-preview.png";

    return {
      title: `${movie.title} (${year}) - Oxynema`,
      description: `${movie.title} - IMDb: ${ratingStr}. ${movie.overview?.substring(0, 160)}`,
      openGraph: {
        type: "video.movie",
        title: `🍿 ${movie.title} (${year}) - Oxynema`,
        description: `⭐ IMDb: ${ratingStr}/10 | ${movie.overview?.substring(0, 150)}...`,
        images: [
          {
            url: posterUrl,
            width: 500,
            height: 750,
            alt: movie.title,
          }
        ],
        url: `https://oxynema.netlify.app/movie/${tmdbId}`,
        siteName: "Oxynema",
      },
      twitter: {
        card: "summary_large_image",
        title: `${movie.title} - Oxynema`,
        description: movie.overview?.substring(0, 150),
        images: [posterUrl],
      }
    };
  } catch (error) {
    console.error("generateMetadata failed:", error);
    return {
      title: "Oxynema - Sinema Keşif Platformu",
      description: "Oxynema ile film keşfedin, listenizi oluşturun ve arkadaşlarınızla paylaşın.",
    };
  }
}

export default async function MoviePage({ params }: Props) {
  const { id } = await params;
  const tmdbId = parseInt(id, 10);

  if (isNaN(tmdbId)) {
    notFound();
  }

  let movie;
  try {
    movie = await getMovieDetails(tmdbId, "tr");
  } catch (error) {
    try {
      movie = await getMovieDetails(tmdbId, "en");
    } catch (e) {
      console.error("Failed to load movie details:", e);
      notFound();
    }
  }

  const resolvedRating = movie.vote_average ? Number(movie.vote_average) : null;

  const initialMovie: MovieRecord = {
    id: `temp-${tmdbId}`,
    title: movie.title || "İsimsiz Film",
    isWatched: false,
    watchedAt: null,
    tagColor: null,
    tmdbId,
    posterPath: movie.poster_path ? `/t/p/w500${movie.poster_path}` : null,
    backdropPath: movie.backdrop_path ? `/t/p/original${movie.backdrop_path}` : null,
    trailerKey: movie.trailerKey || null,
    rating: resolvedRating,
    createdAt: new Date().toISOString(),
  };

  return <DashboardClient initialMovie={initialMovie} />;
}
