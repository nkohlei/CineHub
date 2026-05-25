import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getMovieDetails } from "@/lib/tmdb";
import { Star, Clock, ArrowLeft, User, Film } from "lucide-react";

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

  const year = movie.release_date ? movie.release_date.split("-")[0] : "";
  const ratingStr = movie.vote_average ? movie.vote_average.toFixed(1) : "N/A";
  const posterUrl = movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null;
  const backdropUrl = movie.backdrop_path ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}` : null;

  const formatRuntime = (mins: number) => {
    if (!mins) return "";
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h}s ${m}m`;
  };

  return (
    <div className="relative min-h-screen bg-[#08080e] text-zinc-100 flex flex-col items-center justify-start pb-16 overflow-x-hidden">
      
      {/* Dynamic Background Backdrop */}
      {backdropUrl && (
        <div className="absolute top-0 left-0 right-0 h-[50vh] sm:h-[60vh] overflow-hidden select-none pointer-events-none">
          <Image 
            src={backdropUrl} 
            alt={movie.title} 
            fill 
            priority
            className="object-cover opacity-35" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#08080e] via-[#08080e]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#08080e]/40 to-transparent" />
        </div>
      )}

      {/* Sleek Navigation Header */}
      <header className="relative w-full max-w-5xl h-16 flex items-center justify-between px-4 sm:px-8 z-30 mt-4">
        <Link 
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl glass-heavy hover:bg-white/10 text-xs sm:text-sm font-semibold text-zinc-200 transition-all hover:scale-105 active:scale-95 shadow-md border border-white/5"
        >
          <ArrowLeft className="w-4 h-4 text-purple-400" />
          <span>Geri Dön</span>
        </Link>
        
        <Link href="/" className="flex items-center gap-2 select-none">
          <span className="text-lg font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 uppercase">
            Oxynema
          </span>
        </Link>
      </header>

      {/* Main Container */}
      <main className="relative w-full max-w-4xl px-4 sm:px-8 z-20 mt-6 sm:mt-12 flex-1 flex flex-col gap-8">
        
        {/* Core Movie Info Section */}
        <section className="flex flex-col md:flex-row gap-6 md:gap-10 items-center md:items-start">
          
          {/* Movie Poster Card */}
          <div className="relative w-48 sm:w-60 aspect-[2/3] rounded-2xl overflow-hidden glass-heavy border border-white/10 shadow-2xl flex-shrink-0 hover:scale-[1.02] transition-transform duration-300">
            {posterUrl ? (
              <Image 
                src={posterUrl} 
                alt={movie.title} 
                fill 
                priority
                sizes="(max-width: 640px) 192px, 240px"
                className="object-cover" 
              />
            ) : (
              <div className="w-full h-full bg-zinc-900 flex flex-col items-center justify-center text-zinc-500">
                <Film className="w-12 h-12 mb-2 opacity-50" />
                <span className="text-xs">{movie.title}</span>
              </div>
            )}
          </div>

          {/* Details Metadata */}
          <div className="flex-1 text-center md:text-left min-w-0">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight flex flex-wrap items-center justify-center md:justify-start gap-y-2 mb-3">
              {movie.title}
              {year && (
                <span className="text-lg sm:text-xl font-normal text-zinc-500 font-mono ml-2">
                  ({year})
                </span>
              )}
            </h1>

            {/* Badges */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 mb-5 text-xs sm:text-sm">
              <span className="inline-flex items-center gap-1 font-bold text-[#F5C518] bg-[#F5C518]/10 px-2.5 py-1 rounded-lg border border-[#F5C518]/20 shadow-sm">
                <Star className="w-3.5 h-3.5 fill-[#F5C518] text-[#F5C518]" />
                <span>IMDb {ratingStr}</span>
              </span>

              {movie.runtime ? (
                <span className="inline-flex items-center gap-1 text-zinc-300 bg-zinc-900/60 border border-zinc-800 px-2.5 py-1 rounded-lg">
                  <Clock className="w-3.5 h-3.5 text-purple-400" />
                  <span>{formatRuntime(movie.runtime)}</span>
                </span>
              ) : null}

              {movie.genres?.map((g: any) => (
                <span 
                  key={g.id} 
                  className="px-2.5 py-1 rounded-lg bg-zinc-900/40 border border-zinc-800 text-zinc-300"
                >
                  {g.name}
                </span>
              ))}
            </div>

            {/* Overview / Storyline */}
            <div className="bg-zinc-900/40 border border-zinc-800/30 p-5 rounded-2xl backdrop-blur-md shadow-inner text-sm sm:text-base leading-relaxed text-zinc-300 mb-6">
              <h2 className="text-xs font-black uppercase text-purple-400 tracking-widest mb-2">Özet</h2>
              <p>{movie.overview || "Bu film için Türkçe özet bulunmamaktadır."}</p>
            </div>
          </div>
        </section>

        {/* Video / Trailer Section */}
        {movie.trailerKey && (
          <section className="bg-zinc-900/20 border border-zinc-850 p-4 rounded-3xl backdrop-blur-sm shadow-xl">
            <h2 className="text-xs font-black uppercase text-purple-400 tracking-widest mb-4 px-1">Fragman</h2>
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-zinc-800/50 shadow-lg">
              <iframe
                src={`https://www.youtube.com/embed/${movie.trailerKey}?rel=0`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>
          </section>
        )}

        {/* Cast Section */}
        {movie.cast && movie.cast.length > 0 && (
          <section className="bg-zinc-900/20 border border-zinc-850 p-5 rounded-3xl backdrop-blur-sm shadow-xl">
            <h2 className="text-xs font-black uppercase text-purple-400 tracking-widest mb-4">Oyuncular</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {movie.cast.map((c: any) => {
                const avatar = c.profile_path ? `https://image.tmdb.org/t/p/w185${c.profile_path}` : null;
                return (
                  <div key={c.id} className="flex flex-col items-center text-center p-2 rounded-xl bg-zinc-950/20 border border-zinc-855/30">
                    <div className="relative w-14 h-14 rounded-full overflow-hidden mb-2 bg-zinc-800 border border-purple-500/10">
                      {avatar ? (
                        <Image 
                          src={avatar} 
                          alt={c.name} 
                          fill 
                          sizes="56px"
                          className="object-cover" 
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <User className="w-6 h-6 text-zinc-600" />
                        </div>
                      )}
                    </div>
                    <span className="text-[11px] font-bold text-zinc-200 line-clamp-1 w-full">{c.name}</span>
                    <span className="text-[9px] text-zinc-500 line-clamp-1 w-full mt-0.5">{c.character}</span>
                  </div>
                );
              })}
            </div>
          </section>
        )}

      </main>
    </div>
  );
}
