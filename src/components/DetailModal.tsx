"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useCallback, useRef } from "react";
import { MovieRecord, CastMember } from "@/lib/types";
import { X, Star, Play, Clock, Heart, ThumbsUp, Award, User, Trash, Eye, Film, ChevronLeft, ChevronRight, Send, Loader2 } from "lucide-react";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";

interface DetailModalProps {
  movie: MovieRecord | null;
  onClose: () => void;
  onMarkWatched?: (id: string, tagColor: string) => void;
  onDelete?: (id: string) => void;
  onOpenEvaluation?: (movie: MovieRecord) => void;
  friends?: { id: string; name: string; shareId: string; image?: string }[];
  showToast?: (message: string, type: "success" | "error") => void;
}

interface FullDetails {
  posterUrl: string | null;
  backdropUrl: string | null;
  overview: string;
  rating: number;
  trailerKey: string | null;
  year: string;
  runtime: number;
  genres: string[];
  cast: (CastMember & { profileUrl: string | null })[];
}

interface RecommendedMovie {
  id: number;
  title: string;
  poster_path: string | null;
  release_date?: string;
}

export default function DetailModal({ movie, onClose, onMarkWatched, onDelete, onOpenEvaluation, friends = [], showToast }: DetailModalProps) {
  const { t, language } = useLanguage();
  const [details, setDetails] = useState<FullDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const [activeTmdbId, setActiveTmdbId] = useState<number | null>(null);
  const [activeTitle, setActiveTitle] = useState("");
  const [recommendations, setRecommendations] = useState<RecommendedMovie[]>([]);

  const [sharePopoverOpen, setSharePopoverOpen] = useState(false);
  const [sharingUserId, setSharingUserId] = useState<string | null>(null);

  const handleShareMovie = async (friend: { id: string; name: string }) => {
    if (!movie) return;
    setSharingUserId(friend.id);
    try {
      // Build movie details to share
      const activeMovieObj = {
        title: activeTitle,
        tmdbId: activeTmdbId,
        rating: details?.rating || movie.rating || null,
        imdbRating: activeTmdbId === movie.tmdbId ? movie.imdbRating : (details?.rating?.toString() || null),
        posterPath: activeTmdbId === movie.tmdbId ? movie.posterPath : (details?.posterUrl ? details.posterUrl.substring(details.posterUrl.indexOf("/t/p/")) : null),
        backdropPath: activeTmdbId === movie.tmdbId ? movie.backdropPath : (details?.backdropUrl ? details.backdropUrl.substring(details.backdropUrl.indexOf("/t/p/")) : null),
        trailerKey: activeTmdbId === movie.tmdbId ? movie.trailerKey : (details?.trailerKey || null),
        releaseDate: details?.year || movie.releaseDate || null,
        cast: details?.cast ? details.cast.slice(0, 10) : movie.cast
      };

      const res = await fetch("/api/user/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          friendId: friend.id,
          type: "movie",
          data: activeMovieObj
        })
      });

      if (res.ok) {
        if (showToast) {
          showToast(`${activeTitle} ${language === 'tr' ? 'başarıyla paylaşıldı!' : 'shared successfully!'}`, "success");
        }
        setSharePopoverOpen(false);
      } else {
        const errorData = await res.json();
        if (showToast) {
          showToast(errorData.error || "Failed to share movie", "error");
        }
      }
    } catch (err) {
      console.error("Error sharing movie:", err);
      if (showToast) {
        showToast("Connection error", "error");
      }
    } finally {
      setSharingUserId(null);
    }
  };

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const carouselRef = useRef<HTMLDivElement>(null);
  const modalScrollRef = useRef<HTMLDivElement>(null);

  const checkScrollBounds = useCallback(() => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setCanScrollLeft(scrollLeft > 5);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5);
    }
  }, []);

  const scrollCarousel = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const scrollAmount = 250;
      const currentScroll = carouselRef.current.scrollLeft;
      const target = direction === "left" ? currentScroll - scrollAmount : currentScroll + scrollAmount;
      carouselRef.current.scrollTo({
        left: target,
        behavior: "smooth"
      });
    }
  };

  useEffect(() => {
    const el = carouselRef.current;
    if (el) {
      el.addEventListener("scroll", checkScrollBounds);
      checkScrollBounds();
      const timer = setTimeout(checkScrollBounds, 150);
      return () => {
        el.removeEventListener("scroll", checkScrollBounds);
        clearTimeout(timer);
      };
    }
  }, [recommendations, checkScrollBounds]);

  useEffect(() => {
    setConfirmDelete(false);
    if (movie) {
      setActiveTmdbId(movie.tmdbId);
      setActiveTitle(movie.title.split("/")[0].trim());
    } else {
      setActiveTmdbId(null);
      setActiveTitle("");
    }
  }, [movie]);

  useEffect(() => {
    if (activeTmdbId) {
      setLoading(true);
      setShowTrailer(false);
      setDetails(null); // Wipe old details instantly to prevent stale UI data
      fetch(`/api/tmdb/${activeTmdbId}?language=${language}`)
        .then((res) => res.json())
        .then((data) => { setDetails(data); setLoading(false); })
        .catch(() => setLoading(false));
    } else {
      setDetails(null);
    }
  }, [activeTmdbId, language]);

  useEffect(() => {
    if (activeTmdbId) {
      const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY || "746dc181904a3b9d0d2d2f2cb9594412";
      const languageParam = language === 'tr' ? 'tr-TR' : 'en-US';
      const url = `https://api.themoviedb.org/3/movie/${activeTmdbId}/recommendations?api_key=${apiKey}&language=${languageParam}`;
      
      fetch(url)
        .then((res) => res.json())
        .then((data) => {
          if (data && data.results) {
            setRecommendations(data.results.slice(0, 8));
          } else {
            setRecommendations([]);
          }
        })
        .catch((err) => {
          console.error("Failed to fetch recommendations:", err);
          setRecommendations([]);
        });
    } else {
      setRecommendations([]);
    }
  }, [activeTmdbId, language]);

  const handleSelectRecommendation = (rec: RecommendedMovie) => {
    setActiveTmdbId(rec.id);
    setActiveTitle(rec.title);
    if (modalScrollRef.current) {
      modalScrollRef.current.scrollTo(0, 0);
    }
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") onClose();
  }, [onClose]);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (movie) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [movie]);

  const formatRuntime = (mins: number) => {
    if (!mins) return "";
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h}${t.hours} ${m}${t.minutes}`;
  };

  // Safely extract cast list from either movie or loaded details
  let castList: any[] = [];
  if (movie && movie.cast && activeTmdbId === movie.tmdbId) {
    try {
      const parsed = typeof movie.cast === "string" ? JSON.parse(movie.cast) : movie.cast;
      if (Array.isArray(parsed)) {
        castList = parsed.map((c: any) => ({
          id: c.id,
          name: c.name,
          character: c.character,
          profileUrl: c.profile_path ? `https://image.tmdb.org/t/p/w185${c.profile_path}` : null
        }));
      }
    } catch (e) {
      console.error("Failed to parse movie cast data:", e);
    }
  }

  if (castList.length === 0 && details?.cast) {
    castList = details.cast;
  }

  return (
    <AnimatePresence>
      {movie && (
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
            {/* Absolute close button anchored inside the relative box */}
            {/* Inner scrollable container */}
            <div
              ref={modalScrollRef}
              className="flex-1 w-full overflow-y-auto scrollbar-none rounded-none md:rounded-2xl relative"
            >
              {/* Premium Circular Medium-Grey Scrolling Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 md:top-6 md:right-6 z-[250] scale-90 md:scale-100 p-2.5 rounded-full bg-zinc-700/60 hover:bg-zinc-600/80 border border-zinc-600 text-zinc-300 hover:text-white transition-all shadow-md cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            {/* Backdrop image */}
            {(details?.backdropUrl || movie.backdropPath) && !showTrailer && (
              <div className="relative h-48 sm:h-56 md:h-72 overflow-hidden rounded-none md:rounded-t-2xl">
                <Image src={details?.backdropUrl || ('https://image.tmdb.org/t/p/original' + movie.backdropPath)} alt={activeTitle} fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#08080e] via-[#08080e]/60 to-transparent" />
                {(details?.trailerKey || movie.trailerKey) && (
                  <button
                    onClick={() => setShowTrailer(true)}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-white/10 backdrop-blur-xl border border-white/15 flex items-center justify-center hover:bg-white/20 transition-all cursor-pointer group"
                  >
                    <Play className="w-7 h-7 text-white ml-0.5 group-hover:scale-110 transition-transform" fill="currentColor" />
                  </button>
                )}
              </div>
            )}

            {/* Trailer embed */}
            <AnimatePresence>
              {showTrailer && (details?.trailerKey || movie?.trailerKey) && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                  <div className="relative w-full aspect-video rounded-t-lg border-b border-zinc-800">
                    <iframe
                      src={`https://www.youtube.com/embed/${details?.trailerKey || movie.trailerKey}?autoplay=1&rel=0`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="absolute inset-0 w-full h-full"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Content */}
            <div className="px-4 py-6 md:px-10 md:py-12">

              {/* Title & meta */}
              <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
                <div className="flex-1 min-w-[250px]">
                  <h2 className="text-2xl sm:text-3xl font-bold text-white flex items-center flex-wrap gap-y-2">
                    {activeTitle}
                    <span className="inline-flex items-center gap-1 ml-3 text-sm font-bold text-[#F5C518] bg-[#F5C518]/10 px-2 py-0.5 rounded border border-[#F5C518]/20">
                      IMDb {activeTmdbId === movie?.tmdbId ? (movie?.imdbRating || "...") : (details?.rating || "...")}
                    </span>
                  </h2>
                  <div className="flex flex-wrap items-center gap-2 mt-2 text-xs sm:text-sm text-zinc-400">
                    {details?.year && <span>{details.year}</span>}
                    {details?.runtime ? (
                      <>
                        <span className="w-1 h-1 rounded-full bg-zinc-600" />
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{formatRuntime(details.runtime)}</span>
                      </>
                    ) : null}
                    {details?.genres?.map((g) => (
                      <span key={g} className="px-2.5 py-0.5 rounded-full bg-zinc-800/60 border border-zinc-700/30 text-xs text-zinc-300">{g}</span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2 relative z-50">
                  {/* Watched Shortcut Button */}
                  {!movie?.isWatched && activeTmdbId === movie?.tmdbId && onOpenEvaluation && (
                    <button
                      onClick={() => onOpenEvaluation(movie)}
                      className="flex items-center gap-1 md:gap-1.5 bg-zinc-900/60 hover:bg-zinc-800/80 border border-zinc-800 text-zinc-300 px-2.5 py-1.5 md:px-4 md:py-2 rounded-xl text-[11px] md:text-sm font-medium transition-all hover:shadow-[0_0_15px_rgba(168,85,247,0.2)] hover:border-purple-500/20 cursor-pointer"
                    >
                      <Eye className="w-4 h-4 text-purple-400" />
                      <span>{t.watchedShortcut}</span>
                    </button>
                  )}

                  {/* Share Button (always visible if movie exists) */}
                  {movie && (
                    <div className="relative">
                      <button
                        onClick={() => setSharePopoverOpen(!sharePopoverOpen)}
                        className="flex items-center gap-1 md:gap-1.5 bg-zinc-900/60 hover:bg-zinc-800/80 border border-zinc-800 text-zinc-300 px-2.5 py-1.5 md:px-4 md:py-2 rounded-xl text-[11px] md:text-sm font-medium transition-all hover:shadow-[0_0_15px_rgba(168,85,247,0.2)] hover:border-purple-500/20 cursor-pointer"
                      >
                        <Send className="w-4 h-4 text-emerald-400" />
                        <span>{t.share}</span>
                      </button>

                      {/* Click-outside backdrop overlay to dismiss popover gracefully */}
                      {sharePopoverOpen && (
                        <div 
                          className="fixed inset-0 z-[90] cursor-default" 
                          onClick={() => setSharePopoverOpen(false)}
                        />
                      )}

                      {/* Share Action Popover */}
                      <AnimatePresence>
                        {sharePopoverOpen && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className="absolute right-0 mt-2 w-56 z-[100] origin-top-right bg-zinc-900/95 backdrop-blur-xl border border-zinc-800 p-2 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.7)]"
                          >
                            <p className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider px-2.5 py-1.5 border-b border-zinc-800/80 mb-1">{t.friendsTitle}</p>
                            {friends.length === 0 ? (
                              <p className="text-xs text-zinc-500 px-2.5 py-3 text-center">{t.noFriends}</p>
                            ) : (
                              <div className="max-h-40 overflow-y-auto scrollbar-none space-y-0.5">
                                {friends.map((friend) => (
                                  <button
                                    key={friend.id}
                                    disabled={sharingUserId !== null}
                                    onClick={() => handleShareMovie(friend)}
                                    className="w-full text-left px-2.5 py-2 text-xs rounded-lg transition-all flex items-center justify-between hover:bg-white/5 text-zinc-300 hover:text-white cursor-pointer disabled:opacity-50"
                                  >
                                    <div className="flex items-center gap-2 truncate">
                                      {friend.image ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={friend.image} alt={friend.name} className="w-4 h-4 rounded-full border border-purple-500/20" />
                                      ) : (
                                        <div className="w-4 h-4 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center text-[8px]">{friend.name?.[0] || "U"}</div>
                                      )}
                                      <span className="truncate">{friend.name}</span>
                                    </div>
                                    {sharingUserId === friend.id ? (
                                      <Loader2 className="w-3.5 h-3.5 animate-spin text-purple-400" />
                                    ) : (
                                      <span className="text-[9px] text-zinc-600 font-mono">{friend.shareId}</span>
                                    )}
                                  </button>
                                ))}
                              </div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                </div>
              </div>

              {/* Loading shimmer */}
              {loading && (
                <div className="space-y-3 mb-6">
                  <div className="h-4 shimmer rounded w-full" />
                  <div className="h-4 shimmer rounded w-5/6" />
                  <div className="h-4 shimmer rounded w-4/6" />
                </div>
              )}

              {/* Overview */}
              {details?.overview && (
                <p className="text-sm text-zinc-300 leading-relaxed mb-6">{details.overview}</p>
              )}

              {/* Cast */}
              {loading ? (
                <div className="mb-6">
                  <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-3">{t.cast}</h3>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="text-center animate-pulse">
                        <div className="w-12 h-12 mx-auto rounded-full bg-zinc-800/50 mb-1.5" />
                        <div className="h-2.5 bg-zinc-800/40 rounded w-16 mx-auto mb-1" />
                        <div className="h-2 bg-zinc-800/30 rounded w-12 mx-auto" />
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                castList && castList.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-3">{t.cast}</h3>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                      {castList.map((member) => (
                        <div key={member.id} className="text-center">
                          <div className="relative w-12 h-12 mx-auto rounded-full overflow-hidden bg-zinc-800/60 border border-zinc-700/30 mb-1.5">
                            {member.profileUrl ? (
                              <Image src={member.profileUrl} alt={member.name} fill className="object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <User className="w-5 h-5 text-zinc-600" />
                              </div>
                            )}
                          </div>
                          <p className="text-[11px] font-medium text-zinc-200 truncate">{member.name}</p>
                          <p className="text-[10px] text-zinc-500 truncate">{member.character}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              )}

              {/* Recommendations */}
              {recommendations.length > 0 && (
                <div className="mb-6 border-t border-zinc-800/50 pt-5">
                  <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-3">{t.similarMovies}</h3>
                  
                  <div className="relative group">
                    {/* Left Scroll Arrow */}
                    {canScrollLeft && (
                      <button
                        onClick={() => scrollCarousel("left")}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-zinc-950/70 hover:bg-zinc-900 border border-zinc-800/80 h-10 w-10 rounded-full hidden md:flex items-center justify-center lg:opacity-0 group-hover:opacity-100 opacity-100 transition-opacity z-10 cursor-pointer shadow-[0_4px_12px_rgba(0,0,0,0.5)]"
                      >
                        <ChevronLeft className="w-5 h-5 text-zinc-300 hover:text-white" />
                      </button>
                    )}

                    {/* Right Scroll Arrow */}
                    {canScrollRight && (
                      <button
                        onClick={() => scrollCarousel("right")}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-zinc-950/70 hover:bg-zinc-900 border border-zinc-800/80 h-10 w-10 rounded-full hidden md:flex items-center justify-center lg:opacity-0 group-hover:opacity-100 opacity-100 transition-opacity z-10 cursor-pointer shadow-[0_4px_12px_rgba(0,0,0,0.5)]"
                      >
                        <ChevronRight className="w-5 h-5 text-zinc-300 hover:text-white" />
                      </button>
                    )}

                    <div
                      ref={carouselRef}
                      className="flex overflow-x-auto snap-x snap-mandatory scrollbar-none antialiased WebkitOverflowScrolling-touch gap-4 pb-3"
                    >
                      {recommendations.map((rec) => {
                        const recPoster = rec.poster_path ? `https://image.tmdb.org/t/p/w200${rec.poster_path}` : null;
                        const recYear = rec.release_date ? rec.release_date.split("-")[0] : "";
                        return (
                          <div
                            key={rec.id}
                            onClick={() => handleSelectRecommendation(rec)}
                            className="w-[130px] shrink-0 relative group/card cursor-pointer snap-start"
                          >
                            <div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-zinc-900/60">
                              {recPoster ? (
                                <img
                                  src={recPoster}
                                  alt={rec.title}
                                  className="w-full h-full object-cover shadow-md group-hover/card:scale-105 transition-all duration-300"
                                />
                              ) : (
                                <div className="w-full h-full bg-gradient-to-br from-zinc-800/80 to-zinc-900/80 border border-zinc-700/50 flex flex-col items-center justify-center p-2 text-center group-hover/card:scale-105 transition-all duration-300">
                                  <Film className="w-8 h-8 text-zinc-600 mb-1" />
                                  <span className="text-[9px] text-zinc-500 font-semibold truncate w-full">{rec.title}</span>
                                </div>
                              )}
                            </div>
                            <h4 className="text-xs font-semibold text-zinc-300 mt-1.5 line-clamp-1 group-hover/card:text-purple-400 transition-colors">
                              {rec.title}
                            </h4>
                            {recYear && (
                              <span className="text-[10px] text-zinc-500 font-medium font-mono">{recYear}</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Delete / Actions Footer */}
              {onDelete && activeTmdbId === movie.tmdbId && (
                <div className="flex justify-end items-center mt-6 pt-4 border-t border-zinc-800/30">
                  <div className="relative">
                    {confirmDelete ? (
                      <div className="flex items-center gap-2 animate-fade-in">
                        <button
                          onClick={() => {
                            onDelete(movie.id);
                            onClose();
                          }}
                          className="px-2.5 py-1.5 md:px-3 md:py-1.5 rounded-lg bg-red-500/20 border border-red-500/35 text-red-400 text-[11px] md:text-xs font-semibold hover:bg-red-500/35 transition-all cursor-pointer"
                        >
                          {t.confirm}
                        </button>
                        <button
                          onClick={() => setConfirmDelete(false)}
                          className="px-2.5 py-1.5 md:px-3 md:py-1.5 rounded-lg bg-zinc-800 border border-zinc-700/50 text-zinc-400 text-[11px] md:text-xs font-semibold hover:bg-zinc-700/50 transition-all cursor-pointer"
                        >
                          {t.cancel}
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmDelete(true)}
                        className="flex items-center gap-1 md:gap-1.5 px-2.5 py-1.5 md:px-3 md:py-1.5 rounded-lg bg-red-500/5 border border-red-500/10 text-red-400/80 text-[11px] md:text-xs font-medium hover:bg-red-500/15 transition-all cursor-pointer"
                      >
                        <Trash className="w-3.5 h-3.5" />
                        {t.deleteMovie}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
      )}
    </AnimatePresence>
  );
}
