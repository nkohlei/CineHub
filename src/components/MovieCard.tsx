"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { MovieRecord } from "@/lib/types";
import { Star, Heart, ThumbsUp, Award, Film, EyeOff, Meh, Frown } from "lucide-react";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";

interface MovieCardProps {
  movie: MovieRecord;
  onSelect: (movie: MovieRecord) => void;
  index: number;
  showRatingAlways?: boolean;
}

export default function MovieCard({ 
  movie, 
  onSelect, 
  index, 
  showRatingAlways = false
}: MovieCardProps) {
  const [imgError, setImgError] = useState(false);
  const { t } = useLanguage();

  const displayTitle = movie.title.split("/")[0].trim();

  // Legacy Tag Config from Detail Modal
  const tagConfig: Record<string, { label: string; Icon: typeof Heart; cls: string }> = {
    green: { label: t.loved || "Loved", Icon: Heart, cls: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20" },
    blue: { label: t.great || "Great", Icon: ThumbsUp, cls: "bg-blue-500/15 text-blue-400 border-blue-500/20" },
    yellow: { label: t.good || "Good", Icon: Award, cls: "bg-amber-500/15 text-amber-400 border-amber-500/20" },
  };

  // Color-coded rating evaluations
  const tierConfig: Record<string, { label: string; Icon: typeof Award; cls: string }> = {
    exceptional: { label: t.exceptional, Icon: Award, cls: "bg-blue-500/15 text-blue-400 border-blue-500/20" },
    successful: { label: t.successful, Icon: ThumbsUp, cls: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20" },
    "not-bad": { label: t.notBad, Icon: Meh, cls: "bg-amber-500/15 text-amber-400 border-amber-500/20" },
    boring: { label: t.boring, Icon: EyeOff, cls: "bg-orange-500/15 text-orange-400 border-orange-500/20" },
    awful: { label: t.awful, Icon: Frown, cls: "bg-red-500/15 text-red-400 border-red-500/20" },
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short", day: "numeric", year: "numeric",
    });
  };

  const posterUrl = movie.posterPath && !imgError 
    ? 'https://image.tmdb.org/t/p/w500' + movie.posterPath 
    : null;

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;

  return (
    <motion.div
      initial={isMobile ? false : { opacity: 0, y: 24 }}
      animate={isMobile ? false : { opacity: 1, y: 0 }}
      transition={isMobile ? undefined : { duration: 0.45, delay: Math.min(index * 0.04, 0.8) }}
      onClick={() => onSelect(movie)}
      className="group relative cursor-pointer rounded-2xl overflow-hidden glass-card"
    >
      {/* Poster */}
      <div className="relative aspect-[2/3] overflow-hidden bg-zinc-900/80">
        {posterUrl ? (
          <Image
            src={posterUrl}
            alt={displayTitle}
            fill
            priority={index < 4}
            sizes="(max-width: 640px) 33vw, (max-width: 1024px) 25vw, 20vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-zinc-800/80 to-zinc-900/80">
            <Film className="w-10 h-10 text-zinc-600 mb-2" />
            <span className="text-xs text-zinc-500 text-center px-3 leading-tight">{displayTitle}</span>
          </div>
        )}

        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-400" />

        {/* IMDb Rating badge */}
        <div 
          className={`absolute top-2.5 right-2.5 flex items-center gap-1 bg-[#F5C518] text-black font-bold px-2 py-0.5 rounded-sm text-xs border border-[#F5C518] transition-all duration-300 ease-out z-10 ${
            showRatingAlways 
              ? "opacity-100 scale-100" 
              : "opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100"
          }`}
        >
          <span className="tracking-tighter">IMDb</span>
          <span>{movie.imdbRating || "..."}</span>
        </div>

        {/* Tag or Tier Evaluation Badge */}
        {movie.isWatched && (
          <div className="absolute top-2.5 left-2.5">
            {movie.ratingTier && tierConfig[movie.ratingTier] ? (
              <span className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border tracking-wide uppercase ${tierConfig[movie.ratingTier].cls}`}>
                {(() => { const TierIcon = tierConfig[movie.ratingTier].Icon; return <TierIcon className="w-2.5 h-2.5" />; })()}
                {tierConfig[movie.ratingTier].label}
              </span>
            ) : movie.tagColor && tagConfig[movie.tagColor] ? (
              <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${tagConfig[movie.tagColor].cls}`}>
                {(() => { const TagIcon = tagConfig[movie.tagColor].Icon; return <TagIcon className="w-2.5 h-2.5" />; })()}
                {tagConfig[movie.tagColor].label}
              </span>
            ) : null}
          </div>
        )}

        {/* Bottom title overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <h3 className="text-sm font-semibold text-white truncate drop-shadow-lg">{displayTitle}</h3>
          <div className="flex items-center justify-between mt-0.5">
            {movie.isWatched && movie.watchedAt && (
              <span className="text-[10px] text-zinc-500">{formatDate(movie.watchedAt)}</span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
