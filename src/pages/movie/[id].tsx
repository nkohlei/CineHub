import { useEffect } from "react";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { getMovieDetails } from "@/lib/tmdb";

type MovieDetailsProps = {
  movie: {
    title: string;
    overview: string;
    year: string;
    ratingStr: string;
    posterUrl: string;
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

export default function MovieMetaDataPage({ movie }: MovieDetailsProps) {
  const router = useRouter();

  // Perform client-side redirect for real users
  useEffect(() => {
    if (movie?.tmdbId) {
      router.replace(`/?movie=${movie.tmdbId}`);
    } else {
      router.replace("/");
    }
  }, [movie, router]);

  if (!movie) {
    return (
      <>
        <Head>
          <title>Oxynema - Sinema Keşif Platformu</title>
          <meta name="description" content="Oxynema ile film keşfedin, listenizi oluşturun ve arkadaşlarınızla paylaşın." />
        </Head>
        <div style={{ padding: "20px", fontFamily: "sans-serif", color: "#fff", background: "#09090b", minHeight: "100vh" }}>
          <h1>Oxynema</h1>
          <p>Film bulunamadı.</p>
        </div>
      </>
    );
  }

  return (
    <>
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
      
      {/* Fallback loader/container while redirect triggers */}
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
        fontFamily: "sans-serif",
        color: "#fff",
        background: "#09090b",
        minHeight: "100vh",
        textAlign: "center"
      }}>
        <div style={{ maxWidth: "500px", background: "#18181b", padding: "30px", borderRadius: "12px", border: "1px solid #27272a" }}>
          <img src={movie.posterUrl} alt={movie.title} style={{ width: "200px", borderRadius: "8px", boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.5)" }} />
          <h1 style={{ marginTop: "20px", fontSize: "24px" }}>{movie.title} ({movie.year})</h1>
          <p style={{ color: "#a1a1aa", fontSize: "16px", margin: "10px 0" }}>⭐ IMDb: {movie.ratingStr}/10</p>
          <p style={{ color: "#d4d4d8", fontSize: "14px", lineHeight: "1.6" }}>{movie.overview}</p>
        </div>
      </div>
    </>
  );
}
