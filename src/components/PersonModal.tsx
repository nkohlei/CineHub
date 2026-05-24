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

interface PersonModalProps {
  personId: number | null;
  onClose: () => void;
  onSelectMovie: (
    tmdbId: number,
    title: string,
    posterPath: string | null,
    backdropPath: string | null
  ) => void;
}

export default function PersonModal({
  personId,
  onClose,
  onSelectMovie,
}: PersonModalProps) {
  const { language } = useLanguage();
  const [details, setDetails] = useState<PersonDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [sortBy, setSortBy] = useState<'popularity' | 'rating' | 'date'>('popularity');
  const modalScrollRef = useRef<HTMLDivElement>(null);
  const [ratingCache, setRatingCache] = useState<Record<number, string>>({});

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

  const getResolvedRating = (movie: PersonMovieCredit) => {
    const cached = ratingCache[movie.id];
    if (cached !== undefined) {
      return cached === "N/A" ? 0 : Number(cached);
    }
    return movie.voteAverage;
  };

  useEffect(() => {
    if (personId) {
      setLoading(true);
      setDetails(null);
      setIsExpanded(false);
      
      fetch(`/api/tmdb/person/${personId}?language=${language}`)
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch person details");
          return res.json();
        })
        .then((data) => {
          setDetails(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    } else {
      setDetails(null);
    }
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

                      {details.movies.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-zinc-500">
                          <Film className="w-8 h-8 mb-2 opacity-50" />
                          <p className="text-sm">
                            {language === "tr" ? "Film bulunamadı." : "No movies found."}
                          </p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 sm:gap-4">
                          {[...(details.movies || [])]
                            .sort((a, b) => {
                              if (sortBy === "rating") {
                                return getResolvedRating(b) - getResolvedRating(a);
                              }
                              if (sortBy === "date") {
                                const dateA = a.releaseDate ? new Date(a.releaseDate).getTime() : 0;
                                const dateB = b.releaseDate ? new Date(b.releaseDate).getTime() : 0;
                                return dateB - dateA;
                              }
                              return b.popularity - a.popularity;
                            })
                            .map((movie) => {
                              const posterUrl = movie.posterPath
                                ? `https://image.tmdb.org/t/p/w342${movie.posterPath}`
                                : null;
                              const year = movie.releaseDate
                                ? movie.releaseDate.split("-")[0]
                                : null;

                              return (
                                <div
                                  key={movie.id}
                                  onClick={() => {
                                    onSelectMovie(
                                      movie.id,
                                      movie.title,
                                      movie.posterPath,
                                      movie.backdropPath
                                    );
                                    onClose();
                                  }}
                                  className="group cursor-pointer text-left snap-start"
                                >
                                  {/* Poster Image container */}
                                  <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-zinc-900/60 border border-zinc-800/60 shadow-md group-hover:scale-105 group-hover:border-purple-500/40 transition-all duration-300">
                                    {posterUrl ? (
                                      <Image
                                        src={posterUrl}
                                        alt={movie.title}
                                        fill
                                        sizes="(max-width: 640px) 100px, 150px"
                                        className="object-cover"
                                      />
                                    ) : (
                                      <div className="w-full h-full bg-gradient-to-br from-zinc-800/80 to-zinc-900/80 flex flex-col items-center justify-center p-2 text-center">
                                        <Film className="w-7 h-7 text-zinc-600 mb-1" />
                                        <span className="text-[9px] text-zinc-500 font-semibold truncate w-full">
                                          {movie.title}
                                        </span>
                                      </div>
                                    )}

                                    {/* NEW: Hover Rating Badge */}
                                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/80 backdrop-blur-sm text-yellow-500 font-semibold text-[10px] sm:text-xs px-1.5 py-0.5 rounded-md flex items-center gap-1 border border-white/10 shadow-lg z-10">
                                      <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                      {ratingCache[movie.id] !== undefined
                                        ? ratingCache[movie.id]
                                        : (movie.voteAverage ? movie.voteAverage.toFixed(1) : "N/A")}
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

                                  {/* Movie title and info below poster */}
                                  <h4 className="text-xs font-semibold text-zinc-300 mt-2 line-clamp-1 group-hover:text-purple-400 transition-colors">
                                    {movie.title}
                                  </h4>
                                  {year && (
                                    <span className="text-[10px] text-zinc-500 font-medium font-mono">
                                      {year}
                                    </span>
                                  )}
                                </div>
                              );
                            })}
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
