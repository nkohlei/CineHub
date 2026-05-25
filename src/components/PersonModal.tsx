"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { X, User, Film, Calendar, Loader2, Star } from "lucide-react";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";

interface PersonMovieCredit {
  id: number;
  title: string;
  posterPath: string | null;
  backdropPath: string | null;
  releaseDate: string | null;
  popularity: number;
  voteAverage: number;
  character: string | null;
  job: string | null;
}

interface PersonDetails {
  id: number;
  name: string;
  biography: string;
  profilePath: string | null;
  knownForDepartment: string;
  movies: PersonMovieCredit[];
}

interface MovieCreditCardProps {
  movie: PersonMovieCredit;
  ratingCache: Record<number, string>;
  databaseMovies?: any[];
  onSelectMovie: (
    tmdbId: number,
    title: string,
    posterPath: string | null,
    backdropPath: string | null
  ) => void;
  onClose: () => void;
  updateRatingCache: (id: number, rating: string) => void;
}

function MovieCreditCard({
  movie,
  ratingCache,
  databaseMovies,
  onSelectMovie,
  onClose,
  updateRatingCache,
}: MovieCreditCardProps) {
  const { language } = useLanguage();

  // 1. Get rating from cache or db movies
  const cachedRating = ratingCache[movie.id];
  let dbRating: string | null = null;
  if (databaseMovies) {
    const dbMovie = databaseMovies.find((m) => Number(m.tmdbId) === Number(movie.id));
    if (dbMovie) {
      dbRating = dbMovie.imdbRating || (dbMovie.rating ? dbMovie.rating.toFixed(1) : null);
    }
  }

  const displayRating = cachedRating || (dbRating && dbRating !== "..." ? dbRating : null) || (movie.voteAverage ? Number(movie.voteAverage).toFixed(1) : null);

  const posterUrl = movie.posterPath
    ? `https://image.tmdb.org/t/p/w342${movie.posterPath}`
    : null;
  const year = movie.releaseDate ? movie.releaseDate.split("-")[0] : null;
  const resolvedTitle = movie.title || "İsimsiz Film";

  return (
    <div
      onClick={() => {
        onSelectMovie(movie.id, resolvedTitle, movie.posterPath, movie.backdropPath);
        onClose();
      }}
      className="group cursor-pointer text-left snap-start"
    >
      <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-zinc-900/60 border border-zinc-800/60 shadow-md group-hover:scale-105 group-hover:border-purple-500/40 transition-all duration-300">
        {posterUrl ? (
          <Image
            src={posterUrl}
            alt={resolvedTitle}
            fill
            sizes="(max-width: 640px) 100px, 150px"
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-zinc-800/80 to-zinc-900/80 flex flex-col items-center justify-center p-2 text-center">
            <Film className="w-7 h-7 text-zinc-600 mb-1" />
            <span className="text-[9px] text-zinc-500 font-semibold truncate w-full">
              {resolvedTitle}
            </span>
          </div>
        )}

        {/* Hover Rating Badge */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/80 backdrop-blur-sm text-yellow-500 font-semibold text-[10px] sm:text-xs px-1.5 py-0.5 rounded-md flex items-center gap-1 border border-white/10 shadow-lg z-10">
          <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
          <span>{displayRating || "N/A"}</span>
        </div>

        {/* Hover overlay detail */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-2">
          {movie.character ? (
            <p className="text-[10px] text-purple-300 font-semibold truncate leading-tight">
              {movie.character}
            </p>
          ) : movie.job ? (
            <p className="text-[10px] text-emerald-300 font-semibold truncate leading-tight">
              {movie.job}
            </p>
          ) : null}
          {year && (
            <span className="text-[9px] text-zinc-400 font-medium mt-0.5 flex items-center gap-0.5">
              <Calendar className="w-2.5 h-2.5" />
              {year}
            </span>
          )}
        </div>
      </div>

      {/* Movie title and role info below poster */}
      <h4 className="text-xs font-semibold text-zinc-300 mt-2 line-clamp-1 group-hover:text-purple-400 transition-colors">
        {resolvedTitle}
      </h4>
      {movie.character && (
        <p className="text-[10px] text-purple-400/80 truncate mt-0.5 font-medium">
          {language === "tr" ? "Rol: " : "Role: "}{movie.character}
        </p>
      )}
      {year && (
        <span className="text-[10px] text-zinc-500 font-medium font-mono">
          {year}
        </span>
      )}
    </div>
  );
}

interface PersonModalProps {
  personId: number | null;
  onClose: () => void;
  onSelectMovie: (
    tmdbId: number,
    title: string,
    posterPath: string | null,
    backdropPath: string | null
  ) => void;
  databaseMovies?: any[];
}

export default function PersonModal({
  personId,
  onClose,
  onSelectMovie,
  databaseMovies,
}: PersonModalProps) {
  const { language } = useLanguage();
  const [details, setDetails] = useState<PersonDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [sortBy, setSortBy] = useState<'popularity' | 'rating' | 'date'>('popularity');
  const modalScrollRef = useRef<HTMLDivElement>(null);
  const [ratingCache, setRatingCache] = useState<Record<number, string>>({});
  const [filmography, setFilmography] = useState<any[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem("oxynema_rating_cache");
        if (cached) {
          setRatingCache(JSON.parse(cached));
        }
      } catch (e) {
        console.error("Failed to load rating cache:", e);
      }
    }
  }, [personId]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleCacheUpdate = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail && customEvent.detail.id) {
        setRatingCache((prev) => ({
          ...prev,
          [customEvent.detail.id]: customEvent.detail.rating,
        }));
      }
    };
    window.addEventListener("oxynema_rating_cache_update", handleCacheUpdate);
    return () => {
      window.removeEventListener("oxynema_rating_cache_update", handleCacheUpdate);
    };
  }, []);

  const getResolvedRating = (movie: PersonMovieCredit) => {
    // 1. Check local storage / ratingCache state first
    const cached = ratingCache[movie.id];
    if (cached !== undefined) {
      return cached === "N/A" ? 0 : Number(cached);
    }
    
    // 2. Check databaseMovies prop if provided
    if (databaseMovies) {
      const dbMovie = databaseMovies.find((m) => Number(m.tmdbId) === Number(movie.id));
      if (dbMovie) {
        const dbRating = dbMovie.imdbRating || (dbMovie.rating ? dbMovie.rating.toFixed(1) : null);
        if (dbRating && dbRating !== "...") {
          return dbRating === "N/A" ? 0 : Number(dbRating);
        }
      }
    }
    
    // 3. Fallback to credit's stale voteAverage
    return movie.voteAverage;
  };

  useEffect(() => {
    async function loadCorrectActorData() {
      if (!personId) {
        setDetails(null);
        setFilmography([]);
        return;
      }
      setLoading(true);
      setDetails(null);
      setFilmography([]);
      setIsExpanded(false);

      try {
        // 1. Get the list of movies the actor was in
        const res = await fetch(`/api/tmdb/person/${personId}?language=${language}`);
        if (!res.ok) throw new Error("Failed to fetch person details");
        const data = await res.json();
        
        // Save person basic details
        setDetails(data);
        const rawMovies = data.movies || [];

        // 2. Sort them by popularity initially to get the top 20 hits
        const topMovies = [...rawMovies]
          .sort((a: any, b: any) => (b.popularity || 0) - (a.popularity || 0))
          .slice(0, 20); // Limit to top 20 to avoid rate limiting initial paint

        // 3. CRITICAL: Fetch the 100% CORRECT live data for each movie from individual endpoints
        const hydratedMovies = await Promise.all(
          topMovies.map(async (m: any) => {
            try {
              const detailRes = await fetch(`/api/tmdb/${m.id}?language=${language}`);
              if (!detailRes.ok) throw new Error("Failed to fetch movie detail");
              const freshDetails = await detailRes.json();
              
              const posterPath = freshDetails.posterUrl
                ? freshDetails.posterUrl.substring(freshDetails.posterUrl.lastIndexOf("/"))
                : (m.posterPath || m.poster_path || null);
              const backdropPath = freshDetails.backdropUrl
                ? freshDetails.backdropUrl.substring(freshDetails.backdropUrl.lastIndexOf("/"))
                : (m.backdropPath || m.backdrop_path || null);

              return {
                id: m.id,
                title: freshDetails.title || m.title || "İsimsiz Film",
                voteAverage: freshDetails.rating || freshDetails.vote_average || freshDetails.voteAverage || m.voteAverage || m.vote_average || 0,
                posterPath,
                backdropPath,
                releaseDate: freshDetails.releaseDate || m.releaseDate || m.release_date || null,
                popularity: freshDetails.popularity || m.popularity || 0,
                character: m.character || null,
                job: m.job || null,
              };
            } catch (err) {
              console.error(`Failed to hydrate details for movie ID ${m.id}`, err);
              // Fallback safe mapping only if individual fetch fails
              return {
                id: m.id,
                title: m.title || "İsimsiz Film",
                voteAverage: m.voteAverage || m.vote_average || 0,
                posterPath: m.posterPath || m.poster_path || null,
                backdropPath: m.backdropPath || m.backdrop_path || null,
                releaseDate: m.releaseDate || m.release_date || null,
                popularity: m.popularity || 0,
                character: m.character || null,
                job: m.job || null,
              };
            }
          })
        );

        setFilmography(hydratedMovies);
      } catch (error) {
        console.error("Failed to hydrate actor filmography correctly", error);
      } finally {
        setLoading(false);
      }
    }

    loadCorrectActorData();
  }, [personId, language]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  return (
    <AnimatePresence>
      {personId && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" />

          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 24 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full h-full max-h-screen md:h-[90vh] md:w-[95vw] md:max-w-3xl rounded-none md:rounded-2xl glass-heavy z-10 flex flex-col overflow-hidden"
          >
            {/* Header Area with Close Button */}
            <div className="absolute top-0 left-0 w-full h-12 bg-zinc-900/90 z-50 flex justify-end items-center px-4 border-b border-zinc-800/30">
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-zinc-800 hover:bg-zinc-700 text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content Container */}
            <div
              ref={modalScrollRef}
              className="flex-1 w-full overflow-y-auto scrollbar-none pt-12"
            >
              {loading ? (
                <div className="flex flex-col items-center justify-center py-32 gap-3">
                  <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
                  <p className="text-zinc-500 text-sm">
                    {language === "tr" ? "Profil yükleniyor..." : "Loading profile..."}
                  </p>
                </div>
              ) : (
                details && (
                  <div className="px-4 py-6 md:px-10 md:py-10">
                    {/* Top Header Section */}
                    <div className="flex flex-col sm:flex-row gap-5 items-center sm:items-start border-b border-zinc-800/40 pb-6 mb-6">
                      {/* Circular profile picture */}
                      <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden bg-zinc-800/60 border-2 border-purple-500/30 shadow-lg flex-shrink-0">
                        {details.profilePath ? (
                          <Image
                            src={`https://image.tmdb.org/t/p/h632${details.profilePath}`}
                            alt={details.name}
                            fill
                            priority
                            sizes="(max-width: 640px) 112px, 128px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <User className="w-12 h-12 text-zinc-600" />
                          </div>
                        )}
                      </div>

                      {/* Name and Biography */}
                      <div className="flex-1 text-center sm:text-left min-w-0">
                        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-1.5">
                          {details.name}
                        </h2>
                        {details.knownForDepartment && (
                          <span className="inline-block text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 mb-3.5">
                            {details.knownForDepartment}
                          </span>
                        )}

                        {details.biography ? (
                          <div>
                            <p
                              className={`text-sm text-zinc-300 leading-relaxed transition-all duration-300 ${
                                !isExpanded ? "line-clamp-4" : ""
                              }`}
                            >
                              {details.biography}
                            </p>
                            {details.biography.length > 250 && (
                              <button
                                onClick={() => setIsExpanded(!isExpanded)}
                                className="text-xs font-bold text-purple-400 hover:text-purple-300 mt-2 hover:underline cursor-pointer border-none bg-transparent outline-none"
                              >
                                {isExpanded
                                  ? (language === "tr" ? "Daha Az Göster" : "Read Less")
                                  : (language === "tr" ? "Devamını Oku" : "Read More")}
                              </button>
                            )}
                          </div>
                        ) : (
                          <p className="text-sm text-zinc-500 italic">
                            {language === "tr"
                              ? "Biyografi bulunamadı."
                              : "No biography available."}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    {/* Bottom Filmography Section */}
                    <div>
                      <div className="flex flex-row items-center justify-between gap-4 mb-4 pb-2 border-b border-zinc-800/20">
                        <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest">
                          {language === "tr" ? "Filmografi" : "Filmography"}
                        </h3>
                        
                        {/* Sort Dropdown */}
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-zinc-500 font-semibold hidden sm:inline">
                            {language === "tr" ? "Sırala:" : "Sort by:"}
                          </span>
                          <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as any)}
                            className="bg-zinc-900/60 border border-zinc-850 text-zinc-300 text-xs font-semibold px-2.5 py-1.5 rounded-lg focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30 cursor-pointer shadow-md"
                          >
                            <option value="popularity">
                              {language === "tr" ? "Popüler" : "Popularity"}
                            </option>
                            <option value="rating">
                              {language === "tr" ? "Puan" : "Rating"}
                            </option>
                            <option value="date">
                              {language === "tr" ? "Tarih" : "Date"}
                            </option>
                          </select>
                        </div>
                      </div>

                      {filmography.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-zinc-500">
                          <Film className="w-8 h-8 mb-2 opacity-50" />
                          <p className="text-sm">
                            {language === "tr" ? "Film bulunamadı." : "No movies found."}
                          </p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 sm:gap-4">
                          {[...filmography]
                            .filter((movie) => movie && movie.id)
                            .sort((a, b) => {
                              if (sortBy === "rating") {
                                const diff = getResolvedRating(b) - getResolvedRating(a);
                                if (Math.abs(diff) > 0.01) return diff;
                                return (b.popularity || 0) - (a.popularity || 0);
                              }
                              if (sortBy === "date") {
                                const dateA = a.releaseDate ? new Date(a.releaseDate).getTime() : 0;
                                const dateB = b.releaseDate ? new Date(b.releaseDate).getTime() : 0;
                                if (dateA !== dateB) return dateB - dateA;
                                return (b.popularity || 0) - (a.popularity || 0);
                              }
                              return (b.popularity || 0) - (a.popularity || 0);
                            })
                            .map((movie) => (
                              <MovieCreditCard
                                key={movie.id}
                                movie={movie}
                                ratingCache={ratingCache}
                                databaseMovies={databaseMovies}
                                onSelectMovie={onSelectMovie}
                                onClose={onClose}
                                updateRatingCache={(id, rating) => {
                                  setRatingCache((prev) => ({
                                    ...prev,
                                    [id]: rating,
                                  }));
                                  try {
                                    const cachedRatingsStr = localStorage.getItem("oxynema_rating_cache") || "{}";
                                    const cachedRatings = JSON.parse(cachedRatingsStr);
                                    cachedRatings[id] = rating;
                                    localStorage.setItem("oxynema_rating_cache", JSON.stringify(cachedRatings));
                                  } catch (e) {
                                    console.error("Failed to update rating cache in storage", e);
                                  }
                                }}
                              />
                            ))
                          }
                        </div>
                      )}
                    </div>
                  </div>
                )
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
