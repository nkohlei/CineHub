"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Play, Sparkles } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

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

export default function NotificationAlert() {
  const router = useRouter();
  const [activeMovie, setActiveMovie] = useState<ActiveCinemaMovie | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    async function checkActiveCinema() {
      try {
        const res = await fetch("/api/cinema/active");
        if (res.ok) {
          const data: ActiveCinemaMovie | null = await res.json();
          if (data) {
            // Check if dismissed in local storage using the unique ID of the publication record
            const dismissedId = localStorage.getItem("oxynema_dismissed_cinema_id");
            if (dismissedId !== data.id) {
              setActiveMovie(data);
              // Wait a little before showing for premium feel
              const timer = setTimeout(() => setIsOpen(true), 1500);
              return () => clearTimeout(timer);
            }
          }
        }
      } catch (err) {
        console.error("Failed to check active cinema for broadcast notification:", err);
      }
    }

    checkActiveCinema();
  }, []);

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeMovie) {
      localStorage.setItem("oxynema_dismissed_cinema_id", activeMovie.id);
    }
    setIsOpen(false);
  };

  const handleNavigate = () => {
    if (activeMovie) {
      localStorage.setItem("oxynema_dismissed_cinema_id", activeMovie.id);
    }
    setIsOpen(false);
    router.push("/cinema");
  };

  return (
    <AnimatePresence>
      {isOpen && activeMovie && (
        <motion.div
          initial={{ opacity: 0, y: -80, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ type: "spring", damping: 25, stiffness: 250 }}
          className="fixed top-4 left-4 right-4 sm:left-auto sm:right-6 sm:w-[380px] z-[999] cursor-pointer"
          onClick={handleNavigate}
        >
          <div className="relative overflow-hidden rounded-2xl border border-purple-500/30 bg-zinc-900/90 p-4 shadow-2xl backdrop-blur-xl hover:shadow-purple-500/10 hover:border-purple-500/50 transition-all group">
            {/* Ambient Background Glow */}
            <div className="absolute -inset-10 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 blur-xl opacity-50 pointer-events-none" />

            <div className="flex gap-4 relative z-10">
              {/* Poster Image */}
              <div className="relative w-16 h-24 rounded-lg overflow-hidden bg-zinc-800 border border-zinc-700/50 flex-shrink-0">
                <Image
                  src={activeMovie.poster}
                  alt={activeMovie.title}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </div>

              {/* Text Info */}
              <div className="flex-1 min-w-0 pr-4">
                <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded-full mb-1">
                  <Sparkles className="w-2.5 h-2.5 animate-pulse" />
                  Haftanın Filmi Yayında!
                </span>
                <h4 className="text-sm font-bold text-zinc-150 truncate leading-snug">
                  {activeMovie.title}
                </h4>
                <p className="text-[11px] text-zinc-400 line-clamp-2 mt-1 leading-normal">
                  {activeMovie.overview || "Haftanın seçilen özel filmini izlemek için hemen tıklayın."}
                </p>

                <div className="flex items-center gap-1 text-[11px] text-purple-400 font-bold mt-2.5 group-hover:text-purple-300 transition-colors">
                  <Play className="w-3.5 h-3.5 fill-purple-400 text-purple-400" />
                  <span>Şimdi İzle</span>
                </div>
              </div>
            </div>

            {/* Dismiss Cross Button */}
            <button
              onClick={handleDismiss}
              className="absolute top-2 right-2 p-1 rounded-full text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/60 transition-all border-none bg-transparent outline-none cursor-pointer"
              title="Kapat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
