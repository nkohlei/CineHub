import { Metadata } from "next";
import DashboardClient from "./DashboardClient";
import { getMovieDetails } from "@/lib/tmdb";

type Props = {
  searchParams: Promise<{ movie?: string }>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { movie } = await searchParams;
  
  if (!movie) {
    return {};
  }

  const tmdbId = parseInt(movie, 10);
  if (isNaN(tmdbId)) {
    return {};
  }

  try {
    const movieDetails = await getMovieDetails(tmdbId, "en");
    const year = movieDetails.release_date ? movieDetails.release_date.split("-")[0] : "";
    const ratingStr = movieDetails.vote_average ? movieDetails.vote_average.toFixed(1) : "N/A";
    const posterUrl = movieDetails.poster_path 
      ? `https://image.tmdb.org/t/p/w500${movieDetails.poster_path}` 
      : "https://oxynema.netlify.app/images/og-preview.png";

    return {
      title: `${movieDetails.title} (${year}) - Oxynema`,
      description: `${movieDetails.title} - IMDb: ${ratingStr}. ${movieDetails.overview?.substring(0, 160)}`,
      openGraph: {
        type: "video.movie",
        title: `🍿 ${movieDetails.title} (${year}) - Oxynema`,
        description: `⭐ IMDb: ${ratingStr}/10 | ${movieDetails.overview?.substring(0, 150)}...`,
        images: [
          {
            url: posterUrl,
            width: 500,
            height: 750,
            alt: movieDetails.title,
          }
        ],
        url: `https://oxynema.netlify.app/?movie=${tmdbId}`,
        siteName: "Oxynema",
      },
      twitter: {
        card: "summary_large_image",
        title: `${movieDetails.title} - Oxynema`,
        description: movieDetails.overview?.substring(0, 150),
        images: [posterUrl],
      }
    };
  } catch (error) {
    console.error("Home generateMetadata failed:", error);
    return {};
  }
}

export default function DashboardPage() {
  return <DashboardClient />;
}
