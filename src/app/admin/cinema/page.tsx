"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Search, Loader2, Film, CheckCircle2, Star, ArrowLeft, Send } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface TMDBMovie {
  id: number;
  title?: string;
  name?: string;
  original_title?: string;
  original_name?: string;
  media_type?: string;
  release_date?: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  overview?: string;
  vote_average?: number;
}

export default function AdminCinemaPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<TMDBMovie[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [tmdbSelection, setTmdbSelection] = useState<TMDBMovie | null>(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [publishing, setPublishing] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const searchTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Secure client checking layer
  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated") {
      router.push("/");
      return;
    }
    
    const userId = (session?.user as any)?.id;
    const shareId = (session?.user as any)?.shareId;
    if (userId !== "A0VFMN" && shareId !== "A0VFMN") {
      router.push("/");
    }
  }, [session, status, router]);

  // Debounced search
  useEffect(() => {
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);

    if (searchQuery.trim().length <= 2) {
      setResults([]);
      return;
    }

    setSearchLoading(true);
    searchTimerRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?query=${encodeURIComponent(searchQuery)}`);
        if (res.ok) {
          const data = await res.json();
          // Filter to movies only
          const movies = (data || []).filter((item: any) => item.media_type === "movie" || !item.media_type);
          setResults(movies);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setSearchLoading(false);
      }
    }, 400);

    return () => {
      if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    };
  }, [searchQuery]);

  const handleFilmPublish = async () => {
    if (!tmdbSelection) {
      setErrorMsg("Lütfen önce TMDB üzerinden bir film seçin.");
      return;
    }
    if (!videoUrl.trim()) {
      setErrorMsg("Lütfen geçerli bir video akış URL'si girin.");
      return;
    }

    setPublishing(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const payload = {
        movieId: tmdbSelection.id,
        title: tmdbSelection.title || tmdbSelection.name || "İsimsiz Film",
        poster: `https://image.tmdb.org/t/p/w500${tmdbSelection.poster_path}`,
        overview: tmdbSelection.overview || "",
        imdbRating: tmdbSelection.vote_average || 0,
        videoStreamUrl: videoUrl.trim(),
      };

      const res = await fetch("/api/admin/publish-cinema", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setSuccessMsg("Haftanın filmi başarıyla güncellendi ve bildirimler tetiklendi!");
        setSearchQuery("");
        setResults([]);
        setTmdbSelection(null);
        setVideoUrl("");
      } else {
        const data = await res.json();
        setErrorMsg(data.error || "Yayınlama başarısız oldu.");
      }
    } catch (err) {
      setErrorMsg("Sunucu ile iletişim kurulamadı.");
    } finally {
      setPublishing(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-zinc-950 text-zinc-400">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
      </div>
    );
  }

  const userId = (session?.user as any)?.id;
  const shareId = (session?.user as any)?.shareId;
  if (userId !== "A0VFMN" && shareId !== "A0VFMN") {
    return null; 
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="flex items-center gap-2 text-zinc-400 hover:text-zinc-200 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>Panale Dön</span>
          </Link>
          <span className="text-xs bg-purple-500/10 border border-purple-500/20 text-purple-400 font-semibold px-3 py-1 rounded-full">
            Yönetici Paneli
          </span>
        </div>

        <div className="bg-zinc-900/40 border border-zinc-800/80 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl">
          <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent font-sans">
            Haftanın Filmini Yayınla
          </h2>

          <div className="space-y-6">
            {/* Search Box */}
            <div className="relative">
              <label className="block text-sm font-semibold text-zinc-400 mb-2">TMDB Film Ara</label>
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Yayınlamak istediğiniz filmin adını yazın..."
                  className="w-full px-4 py-3 pl-10 pr-10 rounded-xl bg-zinc-950 border border-zinc-850 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-purple-500/30 focus:ring-1 focus:ring-purple-500/15 transition-all"
                />
                {searchLoading && (
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
                    <Loader2 className="w-4 h-4 text-purple-400 animate-spin" />
                  </div>
                )}
              </div>

              {/* Search Results Dropdown */}
              {results.length > 0 && (
                <div className="absolute top-full mt-2 left-0 right-0 rounded-xl bg-zinc-950 border border-zinc-850 overflow-hidden z-50 max-h-60 overflow-y-auto shadow-2xl">
                  {results.map((movie) => {
                    const year = movie.release_date ? movie.release_date.split("-")[0] : "";
                    const posterUrl = movie.poster_path
                      ? `https://image.tmdb.org/t/p/w92${movie.poster_path}`
                      : null;
                    return (
                      <button
                        key={movie.id}
                        onClick={() => {
                          setTmdbSelection(movie);
                          setSearchQuery("");
                          setResults([]);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-left cursor-pointer border-b border-zinc-900 last:border-none"
                      >
                        <div className="w-9 h-13 rounded bg-zinc-800 overflow-hidden flex-shrink-0 relative">
                          {posterUrl ? (
                            <Image src={posterUrl} alt={movie.title || ""} fill className="object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Film className="w-4 h-4 text-zinc-600" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-zinc-100 truncate">{movie.title || movie.name}</p>
                          {year && <p className="text-xs text-zinc-500 mt-0.5">{year}</p>}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Selection Card */}
            {tmdbSelection && (
              <div className="bg-zinc-950/50 border border-zinc-800/50 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row gap-4 sm:items-start">
                <div className="w-24 h-36 rounded-xl overflow-hidden relative bg-zinc-900 border border-zinc-850 flex-shrink-0">
                  {tmdbSelection.poster_path ? (
                    <Image
                      src={`https://image.tmdb.org/t/p/w185${tmdbSelection.poster_path}`}
                      alt={tmdbSelection.title || ""}
                      fill
                      className="object-cover animate-fade-in"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Film className="w-6 h-6 text-zinc-700" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1.5">
                    <h3 className="text-lg font-bold text-zinc-100 truncate">
                      {tmdbSelection.title || tmdbSelection.name}
                    </h3>
                    {tmdbSelection.vote_average && (
                      <span className="flex items-center gap-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/25 px-2 py-0.5 rounded-full text-xs font-semibold">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        {tmdbSelection.vote_average.toFixed(1)}
                      </span>
                    )}
                  </div>
                  {tmdbSelection.release_date && (
                    <p className="text-xs text-zinc-500 font-medium mb-2">
                      Yayın Yılı: {tmdbSelection.release_date.split("-")[0]}
                    </p>
                  )}
                  <p className="text-xs text-zinc-400 leading-relaxed line-clamp-3">
                    {tmdbSelection.overview || "Açıklama bulunamadı."}
                  </p>
                </div>
              </div>
            )}

            {/* Video URL Input */}
            <div>
              <label className="block text-sm font-semibold text-zinc-400 mb-2">Video Akış URL'si (Cloudflare R2 / CDN)</label>
              <input
                type="text"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="Örn: https://cdn.oxynema.dev/stream/movie-12345.mp4"
                className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-850 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-purple-500/30 focus:ring-1 focus:ring-purple-500/15 transition-all"
              />
              <span className="text-[11px] text-zinc-500 mt-1.5 block leading-normal">
                Not: Video stream akışını optimize etmek için Cloudflare Worker CDN önbelleğini kullanabilirsiniz.
              </span>
            </div>

            {errorMsg && (
              <div className="text-sm font-semibold text-rose-400 bg-rose-500/5 border border-rose-500/10 p-3 rounded-xl text-center">
                {errorMsg}
              </div>
            )}

            {successMsg && (
              <div className="text-sm font-semibold text-emerald-400 bg-emerald-500/5 border border-emerald-500/10 p-3 rounded-xl text-center flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                {successMsg}
              </div>
            )}

            {/* Publish Button */}
            <button
              onClick={handleFilmPublish}
              disabled={publishing}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-3.5 px-6 rounded-xl transition-all duration-300 shadow-lg shadow-purple-950/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4 cursor-pointer"
            >
              {publishing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Yayınlanıyor...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 text-purple-200" />
                  <span>Haftanın Filmini Yayınla</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
