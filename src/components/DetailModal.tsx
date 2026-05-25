"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useCallback, useRef } from "react";
import { MovieRecord, CastMember } from "@/lib/types";
import { X, Star, Play, Clock, Heart, ThumbsUp, Award, User, Trash, Eye, Film, ChevronLeft, ChevronRight, Send, Loader2, ExternalLink, Plus, Link, Share2 } from "lucide-react";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";

const YouTubeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.108C19.524 3.545 12 3.545 12 3.545s-7.525 0-9.388.51a3.003 3.003 0 0 0-2.11 2.108C0 8.029 0 12 0 12s0 3.97.502 5.837a3.003 3.003 0 0 0 2.11 2.108c1.863.51 9.388.51 9.388.51s7.524 0 9.388-.51a3.003 3.003 0 0 0 2.11-2.108C24 15.97 24 12 24 12s0-3.971-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

interface DetailModalProps {
  movie: MovieRecord | null;
  onClose: () => void;
  onMarkWatched?: (id: string, tagColor: string) => void;
  onDelete?: (id: string) => void;
  onOpenEvaluation?: (movie: MovieRecord) => void;
  friends?: { id: string; name: string; shareId: string; image?: string }[];
  showToast?: (message: string, type: "success" | "error") => void;
  onSelectPerson?: (id: number) => void;
  onAddMovie?: (movie: any) => void;
}

interface FullDetails {
  posterUrl: string | null;
  backdropUrl: string | null;
  overview: string;
  rating: number;
  trailerKey: string | null;
  videos: { key: string; name: string; type?: string; official?: boolean; site?: string; iso_639_1?: string; isFallback?: boolean }[];
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

export default function DetailModal({ movie, onClose, onMarkWatched, onDelete, onOpenEvaluation, friends = [], showToast, onSelectPerson, onAddMovie }: DetailModalProps) {
  const { t, language } = useLanguage();
  const isTempMovie = movie?.id?.startsWith("temp-");
  const [details, setDetails] = useState<FullDetails | null>(null);
  const [rating, setRating] = useState<string>("...");
  const [loading, setLoading] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [activeVideoKey, setActiveVideoKey] = useState<string | null>(null);
  const [videos, setVideos] = useState<{ key: string; name: string; type?: string; official?: boolean; site?: string; iso_639_1?: string; isFallback?: boolean }[]>([]);

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

  const getShareText = () => {
    if (!movie) return "";
    const movieYear = details?.year || movie.releaseDate?.split("-")[0] || "";
    const movieRating = rating !== "..." ? rating : (details?.rating || movie.rating || "N/A");
    const movieOverview = details?.overview || "";
    const shortOverview = movieOverview.length > 100 ? `${movieOverview.substring(0, 100)}...` : movieOverview;
    const movieId = activeTmdbId || movie.tmdbId;

    // Dynamically extract the active origin or guarantee it points to the correct serving base
    const originUrl = typeof window !== 'undefined' ? window.location.origin : 'https://oxynema.netlify.app';
    // Ensure the forward slash is explicitly forced before the question mark
    const shareLink = `${originUrl.replace(/\/$/, '')}/?movie=${movieId}`;

    return `🍿 Oxynema'da Harika Bir Film Keşfettim: *${activeTitle}* ${movieYear ? `(${movieYear})` : ""}\n\n⭐ IMDb: ${movieRating}/10\n📝 ${shortOverview}\n\n👉 Filmin detaylarını incelemek, fragmanını izlemek ve bana katılmak için tıkla:\n${shareLink}\n\n🎬 Sen de Oxynema'ya gel, kendi sinema listeni oluştur ve sinema dünyasını bizimle keşfet!`;
  };

  const handleCopyExternalLink = async () => {
    const text = getShareText();
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(text);
        if (showToast) {
          showToast(language === "tr" ? "Bağlantı panoya kopyalandı!" : "Link copied to clipboard!", "success");
        }
      }
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
    setSharePopoverOpen(false);
  };

  const handleShareWhatsApp = () => {
    const text = getShareText();
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener,noreferrer");
    setSharePopoverOpen(false);
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
      // Set initial rating from the movie record if present, otherwise fallback to local rating cache
      let initialRating = movie.imdbRating || (movie.rating ? Number(movie.rating).toFixed(1) : null);
      if (!initialRating && movie.tmdbId && typeof window !== "undefined") {
        try {
          const cached = localStorage.getItem("oxynema_rating_cache");
          if (cached) {
            const parsed = JSON.parse(cached);
            if (parsed[movie.tmdbId]) {
              initialRating = parsed[movie.tmdbId];
            }
          }
        } catch (e) {
          console.error(e);
        }
      }
      setRating(initialRating || "...");
    } else {
      setActiveTmdbId(null);
      setActiveTitle("");
      setRating("...");
    }
  }, [movie]);

  useEffect(() => {
    if (activeTmdbId) {
      setLoading(true);
      setShowTrailer(false);
      setDetails(null); // Wipe old details instantly to prevent stale UI data
      if (activeTmdbId !== movie?.tmdbId) {
        let cachedRating = "...";
        if (typeof window !== "undefined") {
          try {
            const cached = localStorage.getItem("oxynema_rating_cache");
            if (cached) {
              const parsed = JSON.parse(cached);
              if (parsed[activeTmdbId]) {
                cachedRating = parsed[activeTmdbId];
              }
            }
          } catch (e) {
            console.error(e);
          }
        }
        setRating(cachedRating);
      }
      setActiveVideoKey(null);
      setVideos([]);
      fetch(`/api/tmdb/${activeTmdbId}?language=${language}`)
        .then((res) => res.json())
        .then((data) => { 
          setDetails(data); 
          setLoading(false); 

          // Stabilize rating hydration using database properties or TMDB fallback
          const movieRating = (activeTmdbId === movie?.tmdbId ? movie?.imdbRating : null) || data?.imdbRating || data?.vote_average || data?.rating;
          const resolvedRating = movieRating ? Number(movieRating).toFixed(1) : "N/A";
          setRating(resolvedRating);

          // Synchronize ratings by caching the fresh value in localStorage
          if (typeof window !== "undefined" && activeTmdbId) {
            try {
              const cachedRatingsStr = localStorage.getItem("oxynema_rating_cache") || "{}";
              const cachedRatings = JSON.parse(cachedRatingsStr);
              cachedRatings[activeTmdbId] = resolvedRating;
              localStorage.setItem("oxynema_rating_cache", JSON.stringify(cachedRatings));

              // Broadcast custom event so that active PersonModal can sync in real-time
              window.dispatchEvent(
                new CustomEvent("oxynema_rating_cache_update", {
                  detail: { id: activeTmdbId, rating: resolvedRating },
                })
              );
            } catch (e) {
              console.error("Failed to update rating cache", e);
            }
          }

          const rawVideos = data?.videos || [];

          // 2. HARD FILTER: Only YouTube. Do NOT filter out official === false anymore!
          const youtubeVideos = rawVideos.filter((v: any) => v.site === 'YouTube');

          // 3. SMART SCORE ENGINE: Rank videos by dynamic metadata priority
          const scoredVideos = youtubeVideos.map((v: any) => {
            let score = 0;
            
            // Prioritize type (Trailer > Teaser > Clip)
            if (v.type === 'Trailer') score += 100;
            else if (v.type === 'Teaser') score += 50;
            else if (v.type === 'Clip') score += 10;

            // Bonus for Official (but not mandatory)
            if (v.official) score += 30; 

            // Bonus for Region/Language (Prioritize TR, then EN)
            if (v.iso_639_1 === 'tr') score += 20;
            else if (v.iso_639_1 === 'en') score += 10;

            return { ...v, score };
          });

          // Sort from highest score to lowest
          const sortedVideos = scoredVideos.sort((a: any, b: any) => b.score - a.score);

          // Filter out duplicate YouTube keys
          const uniqueVideos: any[] = [];
          const seenKeys = new Set();
          for (const video of sortedVideos) {
            if (!seenKeys.has(video.key)) {
              seenKeys.add(video.key);
              uniqueVideos.push(video);
            }
          }

          // 4. ABSOLUTE MANDATORY 2 SLOTS ENFORCEMENT
          let finalVideos: any[] = [];

          if (uniqueVideos.length >= 2) {
            // Scenario A: We have at least 2 videos (official or not). Take the top 2.
            finalVideos = uniqueVideos.slice(0, 2);
          } else if (uniqueVideos.length === 1) {
            // Scenario B: TMDB only has exactly 1 video. 
            // Fulfill the mandatory 2-button rule by adding a direct Search fallback as the 2nd option.
            finalVideos = [
              uniqueVideos[0], 
              { key: 'SEARCH_ALT', name: 'Alternatif Ara (YouTube)', isFallback: true }
            ];
          } else {
            // Scenario C: Absolute zero videos found. Create 2 clean fallback search states.
            finalVideos = [
              { key: 'SEARCH_TR', name: 'Fragman Ara (TR)', isFallback: true },
              { key: 'SEARCH_EN', name: 'Trailer Search (EN)', isFallback: true }
            ];
          }

          // Update component states
          setVideos(finalVideos);
          if (finalVideos[0]?.isFallback) {
            setActiveVideoKey(null); // No iframe, show fallback UI
          } else {
            setActiveVideoKey(finalVideos[0]?.key);
          }
        })
        .catch(() => {
          setLoading(false);
          setRating("N/A");
        });
    } else {
      setDetails(null);
      setActiveVideoKey(null);
      setVideos([]);
    }
  }, [activeTmdbId, language, movie]);

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

  const isTurkishSearch = !activeVideoKey 
    || activeVideoKey === 'SEARCH_TR' 
    || (activeVideoKey === 'SEARCH_ALT' && language === 'tr');

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
            {/* NEW: Thin Header Area for Close Button */}
            <div className="absolute top-0 left-0 w-full h-12 bg-zinc-900/90 z-50 flex justify-end items-center px-4">
              <button 
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-zinc-800 hover:bg-zinc-700 text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Inner scrollable container: Added pt-12 to push content below the new header */}
            <div
              ref={modalScrollRef}
              className="flex-1 w-full overflow-y-auto scrollbar-none rounded-none md:rounded-2xl relative pt-12"
            >
            {/* Backdrop image */}
            {(details?.backdropUrl || movie.backdropPath) && !showTrailer && (
              <div className="relative h-48 sm:h-56 md:h-72 overflow-hidden rounded-none md:rounded-t-2xl">
                <Image src={details?.backdropUrl || ('https://image.tmdb.org/t/p/original' + movie.backdropPath)} alt={activeTitle} fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#08080e] via-[#08080e]/60 to-transparent" />
                {(activeVideoKey || details?.trailerKey || movie.trailerKey) && (
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
              {showTrailer && videos.length > 0 && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                  <div className="relative w-full aspect-video rounded-t-lg border-b border-zinc-800">
                    {/* Render iframe if current video is a real key, otherwise render fallback search card */}
                    {(!activeVideoKey || videos.find(v => v.key === activeVideoKey)?.isFallback) ? (
                      <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-zinc-950/90 p-6 text-center">
                        <YouTubeIcon className="w-16 h-16 text-red-500 mb-3 animate-pulse" />
                        <h4 className="text-white font-semibold text-sm mb-2">
                          {language === "tr" ? "Resmi Fragman Bulunamadı" : "Official Trailer Not Found"}
                        </h4>
                        <p className="text-xs text-zinc-400 max-w-md mb-4">
                          {language === "tr" 
                            ? "Bu film için resmi bir YouTube fragmanı bulunamadı. YouTube üzerinde arama yapabilirsiniz." 
                            : "We couldn't find an official YouTube trailer for this movie. You can search for it on YouTube."}
                        </p>
                        <a 
                          href={`https://www.youtube.com/results?search_query=${encodeURIComponent(
                            activeTitle + ' ' + (isTurkishSearch ? 'resmi fragman' : 'official trailer')
                          )}`}
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg transition-all cursor-pointer shadow-lg hover:scale-105 active:scale-95"
                        >
                          <YouTubeIcon className="w-4 h-4 text-white" />
                          <span>
                            {isTurkishSearch
                              ? (language === 'tr' ? "YouTube'da Ara (Türkçe)" : "Search YouTube (Turkish)")
                              : (language === 'tr' ? "YouTube'da Ara (İngilizce)" : "Search YouTube (English)")}
                          </span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    ) : (
                      <iframe
                        src={`https://www.youtube.com/embed/${activeVideoKey}?autoplay=1&rel=0`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="absolute inset-0 w-full h-full"
                      />
                    )}
                  </div>
                  {/* Alternative Videos & Fallback Button Container */}
                  <div className="px-4 py-3 bg-zinc-950/60 border-b border-zinc-800/80 flex flex-col gap-2.5">
                    {/* Alternative video list pills */}
                    {videos.length > 1 && (
                      <div className="flex flex-wrap gap-1.5 items-center">
                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mr-1">
                          {language === "tr" ? "Fragman Seçenekleri:" : "Trailer Options:"}
                        </span>
                        {videos.map((vid) => {
                          const isActive = activeVideoKey === vid.key || (activeVideoKey === null && videos[0]?.key === vid.key);
                          return (
                            <button
                              key={vid.key}
                              onClick={() => {
                                setActiveVideoKey(vid.key);
                              }}
                              className={`px-2.5 py-1 text-xs rounded-full border transition-all cursor-pointer ${
                                isActive
                                  ? "bg-purple-600 border-purple-500 text-white font-semibold"
                                  : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
                              }`}
                            >
                              {vid.name.length > 30 ? `${vid.name.substring(0, 30)}...` : vid.name}
                              {vid.type ? ` (${vid.type})` : ""}
                            </button>
                          );
                        })}
                      </div>
                    )}
                    
                    {/* External Escape Hatch */}
                    <div className="flex justify-between items-center flex-wrap gap-2">
                      <a 
                        href={`https://www.youtube.com/results?search_query=${encodeURIComponent(activeTitle + ' trailer')}`}
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-zinc-900 hover:bg-red-600/20 border border-zinc-800 hover:border-red-500/30 text-zinc-300 hover:text-red-400 text-xs rounded-lg transition-all cursor-pointer font-medium"
                      >
                        <YouTubeIcon className="w-4 h-4 text-red-500" />
                        <span>{language === "tr" ? "Fragman Açılmıyorsa YouTube'da Ara" : "Search YouTube if Video Doesn't Play"}</span>
                        <ExternalLink className="w-3.5 h-3.5 text-zinc-500" />
                      </a>
                    </div>
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
                      IMDb {rating}
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
                  {/* Add to Watchlist Button for temp movies */}
                  {isTempMovie && onAddMovie && (
                    <button
                      onClick={() => {
                        if (movie && onAddMovie) {
                          onAddMovie({
                            id: movie.tmdbId,
                            title: activeTitle,
                            poster_path: movie.posterPath || (details?.posterUrl ? details.posterUrl.substring(details.posterUrl.indexOf("/t/p/")) : null)
                          });
                        }
                      }}
                      className="flex items-center gap-1.5 bg-purple-600 hover:bg-purple-750 border border-purple-500/20 text-white px-3 py-2 rounded-xl text-xs font-semibold shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer"
                    >
                      <Plus className="w-4 h-4 text-white" />
                      <span>{language === "tr" ? "Listeye Ekle" : "Add to Watchlist"}</span>
                    </button>
                  )}

                  {/* Watched Shortcut Button */}
                  {!movie?.isWatched && activeTmdbId === movie?.tmdbId && onOpenEvaluation && !isTempMovie && (
                    <button
                      onClick={() => onOpenEvaluation(movie)}
                      className="flex items-center gap-1 md:gap-1.5 bg-zinc-900/60 hover:bg-zinc-800/80 border border-zinc-800 text-zinc-300 px-2.5 py-1.5 md:px-4 md:py-2 rounded-xl text-[11px] md:text-sm font-medium transition-all hover:shadow-[0_0_15px_rgba(168,85,247,0.2)] hover:border-purple-500/20 cursor-pointer"
                    >
                      <Eye className="w-4 h-4 text-purple-400" />
                      <span>{t.watchedShortcut}</span>
                    </button>
                  )}
 
                  {/* Share Button (always visible if movie exists) */}
                  {movie && !isTempMovie && (
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
                            <div className="flex flex-col gap-0.5">
                              {/* External Sharing */}
                              <button
                                onClick={handleCopyExternalLink}
                                className="w-full text-left px-2.5 py-2 text-xs rounded-lg transition-all flex items-center gap-2 hover:bg-white/5 text-zinc-300 hover:text-white cursor-pointer"
                              >
                                <Link className="w-3.5 h-3.5 text-blue-400" />
                                <span>{language === "tr" ? "Bağlantıyı Kopyala" : "Copy Share Link"}</span>
                              </button>

                              <button
                                onClick={handleShareWhatsApp}
                                className="w-full text-left px-2.5 py-2 text-xs rounded-lg transition-all flex items-center gap-2 hover:bg-white/5 text-zinc-300 hover:text-white cursor-pointer"
                              >
                                <Share2 className="w-3.5 h-3.5 text-emerald-400" />
                                <span>{language === "tr" ? "WhatsApp'ta Paylaş" : "Share on WhatsApp"}</span>
                              </button>

                              <div className="h-px bg-zinc-800/80 my-1" />

                              {/* Internal Friends Sharing */}
                              <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider px-2.5 py-1 mb-1">
                                {language === "tr" ? "Oxynema Arkadaşına Gönder" : "Send to Friend"}
                              </p>
                              
                              {friends.length === 0 ? (
                                <p className="text-xs text-zinc-500 px-2.5 py-2 text-center">{t.noFriends}</p>
                              ) : (
                                <div className="max-h-36 overflow-y-auto scrollbar-none space-y-0.5">
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
                            </div>
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
                        <button
                          key={member.id}
                          onClick={() => {
                            if (onSelectPerson) {
                              onSelectPerson(member.id);
                            }
                          }}
                          className="text-center hover:scale-105 transition-transform cursor-pointer outline-none group border-0 bg-transparent p-0 w-full"
                        >
                          <div className="relative w-12 h-12 mx-auto rounded-full overflow-hidden bg-zinc-800/60 border border-zinc-700/30 mb-1.5 group-hover:border-purple-500/55 transition-colors">
                            {member.profileUrl ? (
                              <Image src={member.profileUrl} alt={member.name} fill className="object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <User className="w-5 h-5 text-zinc-600" />
                              </div>
                            )}
                          </div>
                          <p className="text-[11px] font-medium text-zinc-200 truncate group-hover:text-purple-400 transition-colors">{member.name}</p>
                          <p className="text-[10px] text-zinc-500 truncate">{member.character}</p>
                        </button>
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
              {onDelete && activeTmdbId === movie.tmdbId && !isTempMovie && (
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
