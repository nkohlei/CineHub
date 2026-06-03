"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ArrowLeft, Loader2, Star, Clock, Film, AlertCircle, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface ActiveCinemaMovie {
  id: string;
  movieId: number;
  title: string;
  poster: string;
  overview: string;
  imdbRating: number | null;
  videoStreamUrl: string;
  publishedAt: string;
}

interface MovieDetails {
  runtime?: number;
  genres?: string[];
  backdropUrl?: string | null;
  cast?: Array<{ name: string; character: string; profileUrl: string | null }>;
}

export default function CinemaRoomPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [activeMovie, setActiveMovie] = useState<ActiveCinemaMovie | null>(null);
  const [movieDetails, setMovieDetails] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated") {
      router.push("/login?redirect=/cinema");
      return;
    }

    async function fetchCinemaData() {
      try {
        const res = await fetch("/api/cinema/active");
        if (!res.ok) {
          throw new Error("Active cinema movie fetch failed.");
        }
        const data: ActiveCinemaMovie | null = await res.json();
        if (data) {
          setActiveMovie(data);
          // Query proxy endpoint for extra details like runtime, genres, backdrop, cast
          const detailsRes = await fetch(`/api/tmdb/${data.movieId}`);
          if (detailsRes.ok) {
            const detailsData = await detailsRes.json();
            setMovieDetails(detailsData);
          }
        }
      } catch (err) {
        console.error(err);
        setError("Film bilgileri yüklenirken bir sorun oluştu.");
      } finally {
        setLoading(false);
      }
    }

    fetchCinemaData();
  }, [status, router]);

  if (status === "loading" || loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-zinc-950 text-zinc-400">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4">
        <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl max-w-md text-center">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-zinc-150 mb-2">Hata Oluştu</h3>
          <p className="text-sm text-zinc-400 mb-6">{error}</p>
          <Link href="/" className="px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-sm font-semibold rounded-xl transition-all">
            Anasayfaya Dön
          </Link>
        </div>
      </div>
    );
  }

  if (!activeMovie) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4 text-center">
        <div className="max-w-md bg-zinc-900/30 border border-zinc-800/80 backdrop-blur-md p-8 rounded-3xl">
          <Film className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-zinc-200 mb-2">Cinema Room Boş</h3>
          <p className="text-sm text-zinc-500 mb-6">Şu an için seçilmiş bir haftanın filmi bulunmamaktadır. Lütfen daha sonra tekrar kontrol edin.</p>
          <Link href="/" className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-purple-950/20">
            Kütüphaneye Dön
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 pb-16">
      {/* Background Backdrop Blur */}
      {movieDetails?.backdropUrl && (
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none opacity-20">
          <Image
            src={movieDetails.backdropUrl}
            alt="backdrop"
            fill
            className="object-cover blur-[80px]"
            priority
          />
          <div className="absolute inset-0 bg-zinc-950/80" />
        </div>
      )}

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <Link href="/" className="flex items-center gap-2 text-zinc-400 hover:text-zinc-200 transition-colors font-semibold text-sm">
            <ArrowLeft className="w-4 h-4" />
            <span>Kütüphaneye Dön</span>
          </Link>
          <div className="flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 text-purple-400 px-3.5 py-1 rounded-full text-xs font-semibold select-none shadow-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Haftanın Filmi</span>
          </div>
        </div>

        {/* Video Player Section */}
        <div className="w-full aspect-video rounded-2xl sm:rounded-3xl overflow-hidden bg-black border border-zinc-800/80 shadow-2xl relative mb-8 group">
          <video
            src={`/api/proxy-video?url=${encodeURIComponent(activeMovie.videoStreamUrl)}`}
            className="w-full h-full object-contain"
            controls
            preload="metadata"
            playsInline
          />
        </div>

        {/* Content details grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left/Main Column - Metadata & Description */}
          <div className="md:col-span-2 space-y-6">
            <div>
              <div className="flex items-center gap-3 flex-wrap mb-3">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-100">
                  {activeMovie.title}
                </h1>
                
                {activeMovie.imdbRating && (
                  <div className="flex items-center gap-1 bg-amber-500/10 text-amber-400 border border-amber-500/25 px-2.5 py-0.5 rounded-full text-xs font-bold shadow-sm">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{activeMovie.imdbRating.toFixed(1)}</span>
                  </div>
                )}

                {movieDetails?.runtime && (
                  <div className="flex items-center gap-1 bg-zinc-900/60 text-zinc-400 border border-zinc-800 px-2.5 py-0.5 rounded-full text-xs font-semibold">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{movieDetails.runtime} dk</span>
                  </div>
                )}
              </div>

              {/* Genre Tags */}
              {movieDetails?.genres && movieDetails.genres.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {movieDetails.genres.map((genre) => (
                    <span
                      key={genre}
                      className="text-[11px] font-semibold bg-zinc-900/80 border border-zinc-800/80 text-zinc-400 px-2.5 py-1 rounded-md"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-zinc-900/30 border border-zinc-800/40 backdrop-blur-md rounded-2xl p-5 sm:p-6">
              <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-3">Özet</h3>
              <p className="text-zinc-300 text-sm leading-relaxed whitespace-pre-line">
                {activeMovie.overview || "Açıklama bulunamadı."}
              </p>
            </div>
          </div>

          {/* Right Column - Poster & Cast Summary */}
          <div className="space-y-6">
            {/* Poster Card */}
            <div className="hidden md:block w-full aspect-[2/3] rounded-2xl overflow-hidden relative border border-zinc-800 bg-zinc-900 shadow-xl">
              <Image
                src={activeMovie.poster}
                alt={activeMovie.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 350px"
                priority
              />
            </div>

            {/* Cast Section */}
            {movieDetails?.cast && movieDetails.cast.length > 0 && (
              <div className="bg-zinc-900/30 border border-zinc-800/40 backdrop-blur-md rounded-2xl p-5">
                <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-4">Oyuncular</h3>
                <div className="space-y-3.5 max-h-60 overflow-y-auto pr-1">
                  {movieDetails.cast.slice(0, 5).map((actor, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full overflow-hidden relative bg-zinc-800 flex-shrink-0 border border-zinc-700/30">
                        {actor.profileUrl ? (
                          <Image src={actor.profileUrl} alt={actor.name} fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs text-zinc-600 font-bold bg-zinc-900">
                            {actor.name[0]}
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-zinc-200 truncate">{actor.name}</p>
                        <p className="text-[10px] text-zinc-500 truncate">{actor.character}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
