"use client";

import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { useState, useEffect, useCallback, useRef } from "react";
import { MovieRecord } from "@/lib/types";
import { Sparkles, RotateCw, X, Film } from "lucide-react";
import ConfettiEffect from "./ConfettiEffect";
import { useLanguage } from "@/context/LanguageContext";

interface MovieRouletteProps {
  movies: MovieRecord[];
  isOpen: boolean;
  onClose: () => void;
  onSelectMovie: (movie: MovieRecord) => void;
}

export default function MovieRoulette({ movies, isOpen, onClose, onSelectMovie }: MovieRouletteProps) {
  const { t } = useLanguage();
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState<MovieRecord | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [animationState, setAnimationState] = useState<"idle" | "spinning" | "winner">("idle");
  const controls = useAnimation();
  
  const selectedMovieRef = useRef<MovieRecord | null>(null);

  // Track viewport height is exactly 380px.
  const itemHeight = 380;

  // Track loop setup - repeat movies array to make a long scrolling track.
  const repeats = 10;
  const reelMovies = Array(repeats).fill(movies).flat();

  // 1. Diagnostics console logging on every render pass
  const rouletteState = animationState === "winner" ? "winner_declared" : (spinning ? "spinning" : "idle");
  const winnerMovie = winner;
  console.log("ROULETTE STATE DEBUG:", { 
    rouletteState, 
    winnerMovie, 
    poster: (winnerMovie as any)?.poster || (winnerMovie as any)?.posterPath || (winnerMovie as any)?.poster_path 
  });

  const spin = useCallback(async () => {
    if (spinning || movies.length === 0) return;
    
    setSpinning(true);
    setWinner(null);
    setAnimationState("spinning");
    setShowConfetti(false);

    // Pick winner index and selected movie
    const winnerIndex = Math.floor(Math.random() * movies.length);
    const selectedMovie = movies[winnerIndex];
    selectedMovieRef.current = selectedMovie;

    // Target stop position exactly centered in the track
    const targetIndex = (repeats - 2) * movies.length + winnerIndex;
    const targetY = -(targetIndex * itemHeight);

    // Reset scroll track position to top instantly
    await controls.set({ y: 0 });

    // Animate vertically with smooth Ease-out cubic curve (Hardware accelerated)
    controls.start({
      y: targetY,
      transition: { duration: 4.8, ease: [0.1, 0.8, 0.1, 1] }
    });
  }, [spinning, movies, controls]);

  // Handle escape key to close safely when not active
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape" && !spinning) onClose();
  }, [onClose, spinning]);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Clean state resets on mount / toggle
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setWinner(null);
      selectedMovieRef.current = null;
      setShowConfetti(false);
      setSpinning(false);
      setAnimationState("idle");
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Bulletproof poster URL resolver with multi-property fallbacks
  const getPosterUrl = (movie: MovieRecord | null, size: "w342" | "w500" = "w500"): string | null => {
    if (!movie) return null;
    const rawPoster = 
      (movie as any).poster ||
      movie.posterPath ||
      (movie as any).poster_path ||
      (movie as any).posterUrl ||
      (movie as any).imageUrl ||
      null;

    if (!rawPoster) return null;
    return rawPoster.startsWith("http")
      ? rawPoster
      : `https://image.tmdb.org/t/p/${size}${rawPoster}`;
  };

  return (
    <>
      <ConfettiEffect trigger={showConfetti} />
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex flex-col items-center justify-center p-4 modal-overlay"
            onClick={() => !spinning && onClose()}
          >
            <div className="absolute inset-0 bg-black/95 backdrop-blur-xl" />
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="relative z-10 flex flex-col items-center gap-6 max-w-sm w-full"
            >
              {/* Title Header */}
              <div className="flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-purple-400 animate-pulse" />
                <motion.h2
                  className="text-2xl sm:text-3xl font-bold gradient-text"
                  animate={spinning ? { scale: [1, 1.03, 1] } : {}}
                  transition={{ repeat: Infinity, duration: 1 }}
                >
                  {t.rouletteTitle}
                </motion.h2>
                <Sparkles className="w-6 h-6 text-indigo-400 animate-pulse" />
              </div>

              <p className="text-zinc-400 text-sm font-medium text-center h-5">
                {spinning
                  ? t.spinningStatus
                  : winner
                  ? `${t.winnerPrefix}: ${winner.title.split("/")[0].trim()}!`
                  : t.rouletteSub}
              </p>

              {/* Viewport Box Container with Explicit dimensions & overflow hidden */}
              <div className="relative h-[380px] w-[260px] overflow-hidden border border-zinc-800 rounded-2xl bg-zinc-950/80 backdrop-blur-md shadow-2xl flex items-center justify-center">
                {movies.length === 0 ? (
                  <div className="text-center p-6 text-zinc-500 text-sm">
                    {t.emptyWatchlistRoulette}
                  </div>
                ) : (
                  <>
                    {/* Glowing Selection Frame & Shadows (Only visible while idle/spinning) */}
                    {rouletteState !== "winner_declared" && (
                      <>
                        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-zinc-950 via-zinc-950/40 to-transparent z-10 pointer-events-none" />
                        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent z-10 pointer-events-none" />
                        <div className="absolute inset-0 border-2 border-purple-500/40 rounded-2xl z-20 pointer-events-none glow-accent" />
                      </>
                    )}

                    {/* Content Layer */}
                    <div className="w-full h-full">
                      {rouletteState === "winner_declared" && winnerMovie ? (
                        // Centered Spotlight Winner View (Bypassing Next.js image optimizer constraints completely)
                        <div className="flex items-center justify-center h-full w-full flex-col gap-4 animate-fade-in p-4">
                          {(() => {
                            const rawSrc = (winnerMovie as any).poster || winnerMovie.posterPath || (winnerMovie as any).poster_path || (winnerMovie as any).posterUrl || (winnerMovie as any).imageUrl;
                            const imgSrc = rawSrc 
                              ? (rawSrc.startsWith("http") ? rawSrc : `https://image.tmdb.org/t/p/w500${rawSrc}`)
                              : "";
                            
                            if (imgSrc) {
                              return (
                                <div className="h-[280px] w-[190px] rounded-xl overflow-hidden bg-zinc-800/60 shadow-2xl relative border-2 border-purple-500/80 glow-winner">
                                  <img 
                                    src={imgSrc} 
                                    alt={winnerMovie.title} 
                                    className="h-full w-full object-cover animate-fade-in"
                                    onError={(e) => {
                                      // If the image fails to load via network, turn it into a visible error card instead of a black void
                                      e.currentTarget.style.display = 'none';
                                      const parent = e.currentTarget.parentElement;
                                      if (parent) {
                                        const errDiv = document.createElement('div');
                                        errDiv.className = "flex flex-col items-center justify-center h-full w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-center text-zinc-500 text-xs italic";
                                        errDiv.innerText = "Network Poster Load Failed";
                                        parent.appendChild(errDiv);
                                      }
                                    }}
                                  />
                                </div>
                              );
                            }
                            
                            // Fallback element if no string field is found at all in the object
                            return (
                              <div className="flex flex-col items-center justify-center h-[280px] w-[190px] bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-center overflow-hidden">
                                <span className="text-zinc-500 text-[10px] font-semibold">No Image String Found</span>
                                <div className="w-full mt-2 bg-black/40 rounded p-1.5 border border-zinc-800 text-[8px] font-mono text-zinc-500 text-left break-all overflow-y-auto max-h-[140px] select-text scrollbar-thin">
                                  Keys: {Object.keys(winnerMovie).join(', ')}
                                </div>
                              </div>
                            );
                          })()}
                          <p className="text-base font-bold text-white tracking-wide text-center px-2 truncate w-full drop-shadow-[0_2px_8px_rgba(168,85,247,0.5)]">
                            {winnerMovie.title.split("/")[0].trim()}
                          </p>
                        </div>
                      ) : (
                        // Hardware accelerated vertical sliding track using lightweight un-failable img tags
                        <motion.div
                          animate={controls}
                          className="flex flex-col w-full"
                          onAnimationComplete={() => {
                            if (spinning && selectedMovieRef.current) {
                              setWinner(selectedMovieRef.current);
                              setAnimationState("winner");
                              setSpinning(false);
                              setShowConfetti(true);

                              // Keep the celebration winner open for 3 seconds, then complete choice and exit
                              setTimeout(() => {
                                if (selectedMovieRef.current) {
                                  onSelectMovie(selectedMovieRef.current);
                                }
                                onClose();
                                setShowConfetti(false);
                              }, 3000);
                            }
                          }}
                        >
                          {reelMovies.map((movie, i) => {
                            const posterUrl = getPosterUrl(movie, "w342");
                            return (
                              <div
                                key={`${movie.id}-${i}`}
                                className="flex-shrink-0 flex items-center justify-center"
                                style={{ height: itemHeight }}
                              >
                                {posterUrl ? (
                                  <div className="w-[190px] h-[280px] rounded-xl overflow-hidden bg-zinc-900/60 shadow-lg relative border border-zinc-800/60">
                                    <img
                                      src={posterUrl}
                                      alt={movie.title}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                ) : (
                                  <div className="w-[190px] h-[280px] rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-800 flex flex-col items-center justify-center p-3 text-center">
                                    <Film className="w-8 h-8 text-zinc-700 mb-1.5" />
                                    <span className="text-[10px] text-zinc-500 font-semibold truncate w-full">
                                      {movie.title.split("/")[0].trim()}
                                    </span>
                                    <span className="text-[8px] text-zinc-600 font-mono break-all line-clamp-3 mt-1 leading-tight">
                                      No poster field found
                                    </span>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </motion.div>
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* Controls */}
              <div className="flex flex-col items-center gap-3 w-full">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={spin}
                  disabled={spinning || movies.length === 0}
                  className={`w-full flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl font-bold text-base transition-all cursor-pointer ${
                    spinning || movies.length === 0
                      ? "bg-zinc-800/60 text-zinc-500 cursor-not-allowed border border-zinc-700/20"
                      : "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white glow-roulette hover:from-indigo-400 hover:via-purple-400 hover:to-pink-400"
                  }`}
                >
                  {spinning ? (
                    <>
                      <RotateCw className="w-5 h-5 animate-spin" />
                      <span>{t.spinningButton}</span>
                    </>
                  ) : winner ? (
                    <>
                      <Sparkles className="w-5 h-5" />
                      <span>{t.spinAgain}</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      <span>{t.spinButton}</span>
                    </>
                  )}
                </motion.button>

                {!spinning && (
                  <button
                    onClick={onClose}
                    className="flex items-center gap-1.5 text-zinc-500 hover:text-zinc-300 text-sm transition-colors cursor-pointer py-1"
                  >
                    <X className="w-4 h-4" />
                    <span>{t.close}</span>
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
