"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, Loader2, Film, Plus, User, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";

interface TMDBMovie {
  id: number;
  title?: string;
  name?: string;
  media_type?: "movie" | "person" | "tv";
  release_date?: string;
  poster_path?: string | null;
  profile_path?: string | null;
  known_for_department?: string;
  backdrop_path?: string | null;
}

interface GlobalSearchProps {
  onMovieAdded?: () => void;
  onSelectPerson?: (id: number) => void;
  onSelectMovie?: (id: number, title: string, posterPath: string | null, backdropPath: string | null) => void;
}

export default function GlobalSearch({ onMovieAdded, onSelectPerson, onSelectMovie }: GlobalSearchProps) {
  const router = useRouter();
  const { t, language } = useLanguage();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<TMDBMovie[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [recentSearches, setRecentSearches] = useState<TMDBMovie[]>([]);

  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("oxynema_recent_searches");
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load search history", e);
      }
    }
  }, []);

  const addToHistory = (item: TMDBMovie) => {
    const historyItem = {
      id: item.id,
      title: item.title || undefined,
      name: item.name || undefined,
      media_type: item.media_type || (item.title ? "movie" : "person"),
      release_date: item.release_date || undefined,
      poster_path: item.poster_path || null,
      profile_path: item.profile_path || null,
      known_for_department: item.known_for_department || undefined,
    };

    setRecentSearches((prev) => {
      const filtered = prev.filter((x) => x.id !== item.id);
      const updated = [historyItem, ...filtered].slice(0, 5);
      localStorage.setItem("oxynema_recent_searches", JSON.stringify(updated));
      return updated;
    });
  };

  const clearHistory = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRecentSearches([]);
    localStorage.removeItem("oxynema_recent_searches");
    setIsOpen(false);
  };

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

    if (query.trim().length === 0) {
      setResults([]);
      if (recentSearches.length > 0) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
      return;
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

  const handleMovieClick = (movie: TMDBMovie) => {
    addToHistory(movie);
    // Forcefully wipe the search state to close the dropdown and blur active element
    setQuery("");
    setResults([]);
    setIsOpen(false);
    if (typeof document !== "undefined" && document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    
    // Trigger the clean detail view instead of forced adding
    if (onSelectMovie) {
      onSelectMovie(
        movie.id,
        movie.title || movie.name || "",
        movie.poster_path || null,
        movie.backdrop_path || null
      );
    }
  };

  const handleAddMovie = async (movie: TMDBMovie) => {
    addToHistory(movie);
    // Forcefully wipe the search state to close the dropdown and blur active element
    setQuery("");
    setResults([]);
    setIsOpen(false);
    if (typeof document !== "undefined" && document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }

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
      setTimeout(() => setErrorMsg(null), 3550);
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
          onFocus={() => {
            if (query.trim().length === 0 && recentSearches.length > 0) {
              setIsOpen(true);
            }
          }}
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

      {/* Recent Searches history overlay */}
      {isOpen && query.trim().length === 0 && recentSearches.length > 0 && (
        <div className="absolute top-full mt-2 left-0 right-0 rounded-xl glass-heavy overflow-hidden z-[150] max-h-80 overflow-y-auto shadow-2xl border border-zinc-800/40">
          <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800/40 bg-zinc-950/20">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
              {language === "tr" ? "Geçmiş Aramalar" : "Recent Searches"}
            </span>
            <button
              onClick={clearHistory}
              className="text-[10px] font-bold text-rose-400 hover:text-rose-350 hover:underline cursor-pointer border-none bg-transparent outline-none"
            >
              {language === "tr" ? "Temizle" : "Clear"}
            </button>
          </div>
          {recentSearches.map((item) => {
            const isPerson = item.media_type === "person";

            if (isPerson) {
              const avatarUrl = item.profile_path
                ? `https://image.tmdb.org/t/p/w185${item.profile_path}`
                : null;

              return (
                <button
                  key={`hist-person-${item.id}`}
                  onClick={() => {
                    addToHistory(item);
                    if (onSelectPerson) {
                      onSelectPerson(item.id);
                    }
                    setQuery("");
                    setIsOpen(false);
                    if (typeof document !== "undefined" && document.activeElement instanceof HTMLElement) {
                      document.activeElement.blur();
                    }
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-left cursor-pointer border-b border-zinc-800/30 last:border-0"
                >
                  <div className="w-10 h-10 rounded-full bg-zinc-800/60 overflow-hidden flex-shrink-0 relative border border-zinc-700/30">
                    {avatarUrl ? (
                      <Image
                        src={avatarUrl}
                        alt={item.name || "Person"}
                        fill
                        sizes="40px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User className="w-5 h-5 text-zinc-500" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-zinc-100 truncate">
                      {item.name}
                    </p>
                    {item.known_for_department && (
                      <p className="text-xs text-zinc-500 mt-0.5">{item.known_for_department}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-zinc-400 font-semibold flex-shrink-0 bg-zinc-850 hover:bg-zinc-800 px-2.5 py-1.5 rounded-lg border border-zinc-800/50">
                    <span>{language === "tr" ? "Profil" : "Profile"}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </button>
              );
            }

            const year = item.release_date ? item.release_date.split("-")[0] : "";
            const posterUrl = item.poster_path
              ? `https://image.tmdb.org/t/p/w154${item.poster_path}`
              : null;

            return (
              <button
                key={`hist-movie-${item.id}`}
                onClick={() => handleMovieClick(item)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-left cursor-pointer border-b border-zinc-800/30 last:border-0"
              >
                <div className="w-9 h-13 rounded bg-zinc-800/60 overflow-hidden flex-shrink-0 relative">
                  {posterUrl ? (
                    <Image
                      src={posterUrl}
                      alt={item.title || "Movie"}
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
                    {item.title}
                  </p>
                  {year && (
                    <p className="text-xs text-zinc-500 mt-0.5">{year}</p>
                  )}
                </div>
                <div className="flex items-center gap-1 text-xs text-zinc-400 font-semibold flex-shrink-0 bg-zinc-850 hover:bg-zinc-800 px-2.5 py-1.5 rounded-lg border border-zinc-800/50">
                  <span>{language === "tr" ? "Detaylar" : "Details"}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Absolute Dropdown overlay */}
      {isOpen && query.trim().length > 0 && (
        <div className="absolute top-full mt-2 left-0 right-0 rounded-xl glass-heavy overflow-hidden z-[150] max-h-80 overflow-y-auto shadow-2xl border border-zinc-800/40">
          {results.length === 0 ? (
            <div className="px-4 py-4 text-sm text-zinc-500 text-center">
              {t.noMoviesFound}
            </div>
          ) : (
            results.map((movie) => {
              const isPerson = movie.media_type === "person";
              
              if (isPerson) {
                const avatarUrl = movie.profile_path
                  ? `https://image.tmdb.org/t/p/w185${movie.profile_path}`
                  : null;

                return (
                  <button
                    key={`person-${movie.id}`}
                    onClick={() => {
                      addToHistory(movie);
                      if (onSelectPerson) {
                        onSelectPerson(movie.id);
                      }
                      setQuery("");
                      setIsOpen(false);
                      if (typeof document !== "undefined" && document.activeElement instanceof HTMLElement) {
                        document.activeElement.blur();
                      }
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-left cursor-pointer border-b border-zinc-800/30 last:border-0"
                  >
                    <div className="w-10 h-10 rounded-full bg-zinc-800/60 overflow-hidden flex-shrink-0 relative border border-zinc-700/30">
                      {avatarUrl ? (
                        <Image
                          src={avatarUrl}
                          alt={movie.name || "Person"}
                          fill
                          sizes="40px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <User className="w-5 h-5 text-zinc-500" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-zinc-100 truncate">
                        {movie.name}
                      </p>
                      {movie.known_for_department && (
                        <p className="text-xs text-zinc-500 mt-0.5">{movie.known_for_department}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-zinc-400 font-semibold flex-shrink-0 bg-zinc-850 hover:bg-zinc-800 px-2.5 py-1.5 rounded-lg border border-zinc-800/50">
                      <span>{language === "tr" ? "Profil" : "Profile"}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  </button>
                );
              }

              const year = movie.release_date ? movie.release_date.split("-")[0] : "";
              const posterUrl = movie.poster_path
                ? `https://image.tmdb.org/t/p/w154${movie.poster_path}`
                : null;

              return (
                <button
                  key={`movie-${movie.id}`}
                  onClick={() => handleMovieClick(movie)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-left cursor-pointer border-b border-zinc-800/30 last:border-0"
                >
                  <div className="w-9 h-13 rounded bg-zinc-800/60 overflow-hidden flex-shrink-0 relative">
                    {posterUrl ? (
                      <Image
                        src={posterUrl}
                        alt={movie.title || "Movie"}
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
                  <div className="flex items-center gap-1 text-xs text-zinc-400 font-semibold flex-shrink-0 bg-zinc-850 hover:bg-zinc-800 px-2.5 py-1.5 rounded-lg border border-zinc-800/50">
                    <span>{language === "tr" ? "Detaylar" : "Details"}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
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
