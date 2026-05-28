import { GetServerSideProps } from "next";
import Head from "next/head";
import { getMovieDetails } from "@/lib/tmdb";
import { Providers } from "@/components/Providers";
import DashboardClient from "@/app/DashboardClient";
import { MovieRecord } from "@/lib/types";

type MovieDetailsProps = {
  movie: {
    title: string;
    overview: string;
    year: string;
    ratingStr: string;
    posterUrl: string;
    backdropPath: string | null;
    trailerKey: string | null;
    tmdbId: number;
  } | null;
};

export const getServerSideProps: GetServerSideProps<MovieDetailsProps> = async (context) => {
  const { id } = context.params || {};
  const tmdbId = parseInt(id as string, 10);

  if (isNaN(tmdbId)) {
    return { notFound: true };
  }

  try {
    const movie = await getMovieDetails(tmdbId, "en");
    const year = movie.release_date ? movie.release_date.split("-")[0] : "";
    const ratingStr = movie.vote_average ? movie.vote_average.toFixed(1) : "N/A";
    const posterUrl = movie.poster_path 
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` 
      : "https://oxynema.vercel.app/images/og-preview.png";

    return {
      props: {
        movie: {
          title: movie.title || "İsimsiz Film",
          overview: movie.overview || "",
          year,
          ratingStr,
          posterUrl,
          backdropPath: movie.backdrop_path ? `/t/p/original${movie.backdrop_path}` : null,
          trailerKey: movie.trailerKey || null,
          tmdbId,
        },
      },
    };
  } catch (error) {
    console.error("Failed to fetch movie details in Pages Router getServerSideProps:", error);
    return {
      props: {
        movie: null,
      },
    };
  }
};

export default function MoviePage({ movie }: MovieDetailsProps) {
  if (!movie) {
    return (
      <Providers>
        <Head>
          <title>Oxynema - Sinema Keşif Platformu</title>
          <meta name="description" content="Oxynema ile film keşfedin, listenizi oluşturun ve arkadaşlarınızla paylaşın." />
        </Head>
        <DashboardClient initialMovie={null} />
      </Providers>
    );
  }

  const initialMovieRecord: MovieRecord = {
    id: `temp-${movie.tmdbId}`,
    title: movie.title,
    isWatched: false,
    watchedAt: null,
    tagColor: null,
    tmdbId: movie.tmdbId,
    posterPath: movie.posterUrl ? movie.posterUrl.substring(movie.posterUrl.lastIndexOf("/t/p/")) : null,
    backdropPath: movie.backdropPath,
    trailerKey: movie.trailerKey,
    rating: movie.ratingStr !== "N/A" ? parseFloat(movie.ratingStr) : null,
    createdAt: new Date().toISOString(),
  };

  return (
    <Providers>
      <Head>
        <title>{`${movie.title} (${movie.year}) - Oxynema`}</title>
        <meta name="description" content={`${movie.title} - IMDb: ${movie.ratingStr}. ${movie.overview.substring(0, 160)}`} />
        
        {/* Open Graph Tags for Social Previews */}
        <meta property="og:type" content="video.movie" />
        <meta property="og:title" content={`🍿 ${movie.title} (${movie.year}) - Oxynema`} />
        <meta property="og:description" content={`⭐ IMDb: ${movie.ratingStr}/10 | ${movie.overview.substring(0, 150)}...`} />
        <meta property="og:image" content={movie.posterUrl} />
        <meta property="og:image:width" content="500" />
        <meta property="og:image:height" content="750" />
        <meta property="og:url" content={`https://oxynema.vercel.app/movie/${movie.tmdbId}`} />
        <meta property="og:site_name" content="Oxynema" />

        {/* Twitter/X Cards */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${movie.title} - Oxynema`} />
        <meta name="twitter:description" content={movie.overview.substring(0, 150)} />
        <meta name="twitter:image" content={movie.posterUrl} />
      </Head>
      <DashboardClient initialMovie={initialMovieRecord} />
    </Providers>
  );
}
