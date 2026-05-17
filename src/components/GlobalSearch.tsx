"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, Loader2, Film, Plus } from "lucide-react";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";

interface TMDBMovie {
  id: number;
  title: string;
  release_date?: string;
  poster_path?: string | null;
}

interface GlobalSearchProps {
  onMovieAdded?: () => void;
}

export default function GlobalSearch({ onMovieAdded }: GlobalSearchProps) {
  const router = useRouter();
  const { t, language } = useLanguage();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<TMDBMovie[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    if (query.trim().length <= 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    setLoading(true);
    timerRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?query=${encodeURIComponent(query)}&language=${language}`);
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || "Failed to fetch search results");
        }
        const data = await res.json();
        if (Array.isArray(data)) {
          setResults(data);
          setIsOpen(true);
          setErrorMsg(null);
        } else {
          setResults([]);
        }
      } catch (err) {
        console.error("Global search fetch failed:", err);
        setErrorMsg((err as Error).message);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [query]);

  const handleAddMovie = async (movie: TMDBMovie) => {
    try {
      const res = await fetch("/api/movies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tmdbId: movie.id,
          title: movie.title,
          posterPath: movie.poster_path || null,
          isWatched: false, // Force isWatched false
          language: language,
        }),
      });

      if (res.ok) {
        setSuccessMsg(`Added "${movie.title}" successfully!`);
        setQuery("");
        setResults([]);
        setIsOpen(false);
        setErrorMsg(null);

        // Refresh dynamic server states
        router.refresh();

        // Call optional parent handler for mock fallback refreshing
        if (onMovieAdded) {
          onMovieAdded();
        }

        setTimeout(() => setSuccessMsg(null), 3000);
      } else {
        const data = await res.json();
        setErrorMsg(data.error || "Failed to add movie");
        setTimeout(() => setErrorMsg(null), 3500);
      }
    } catch (err) {
      console.error("Failed to add movie:", err);
      setErrorMsg("Failed to add movie.");
      setTimeout(() => setErrorMsg(null), 3500);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t.searchPlaceholder}
          className="w-full px-4 py-3 pl-10 pr-10 rounded-xl glass text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-purple-500/30 focus:ring-1 focus:ring-purple-500/15 transition-all"
        />
        {loading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Loader2 className="w-4 h-4 text-purple-400 animate-spin" />
          </div>
        )}
      </div>

      {/* Floating Alerts */}
      {successMsg && (
        <div className="absolute -bottom-10 left-0 right-0 text-center text-xs font-semibold text-emerald-400 animate-pulse">
          {successMsg}
        </div>
      )}
      {errorMsg && (
        <div className="absolute -bottom-10 left-0 right-0 text-center text-xs font-semibold text-rose-400 animate-pulse">
          {errorMsg}
        </div>
      )}

      {/* Absolute Dropdown overlay */}
      {isOpen && (
        <div className="absolute top-full mt-2 left-0 right-0 rounded-xl glass-heavy overflow-hidden z-[150] max-h-80 overflow-y-auto shadow-2xl border border-zinc-800/40">
          {results.length === 0 ? (
            <div className="px-4 py-4 text-sm text-zinc-500 text-center">
              {t.noMoviesFound}
            </div>
          ) : (
            results.map((movie) => {
              const year = movie.release_date ? movie.release_date.split("-")[0] : "";
              const posterUrl = movie.poster_path
                ? `https://image.tmdb.org/t/p/w154${movie.poster_path}`
                : null;

              return (
                <button
                  key={movie.id}
                  onClick={() => handleAddMovie(movie)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-left cursor-pointer border-b border-zinc-800/30 last:border-0"
                >
                  <div className="w-9 h-13 rounded bg-zinc-800/60 overflow-hidden flex-shrink-0 relative">
                    {posterUrl ? (
                      <Image
                        src={posterUrl}
                        alt={movie.title}
                        fill
                        sizes="36px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Film className="w-4 h-4 text-zinc-600" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-zinc-100 truncate">
                      {movie.title}
                    </p>
                    {year && (
                      <p className="text-xs text-zinc-500 mt-0.5">{year}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-purple-400 font-semibold flex-shrink-0 bg-purple-500/5 hover:bg-purple-500/10 px-2.5 py-1.5 rounded-lg border border-purple-500/15">
                    <Plus className="w-3 h-3" />
                    <span>{t.add}</span>
                  </div>
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
