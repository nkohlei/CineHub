"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Award, ThumbsUp, Meh, EyeOff, Frown } from "lucide-react";
import { MovieRecord } from "@/lib/types";
import { useLanguage } from "@/context/LanguageContext";

interface EvaluationModalProps {
  movie: MovieRecord;
  onClose: () => void;
  onSave: (movieId: string, ratingTier: string, watchedAt: string) => Promise<void>;
}

export default function EvaluationModal({ movie, onClose, onSave }: EvaluationModalProps) {
  const { t } = useLanguage();
  
  // Format today's date safely in YYYY-MM-DD
  const getTodayString = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  const [watchDate, setWatchDate] = useState(getTodayString());
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const displayTitle = movie.title.split("/")[0].trim();

  // Color-coded tier configs
  const tiers = [
    {
      id: "exceptional",
      label: t.exceptional,
      Icon: Award,
      activeCls: "bg-blue-600/30 text-blue-400 border-blue-500/60 ring-2 ring-blue-500/30",
      inactiveCls: "bg-blue-600/10 text-blue-400/70 border-blue-500/20 hover:bg-blue-600/20 hover:text-blue-400"
    },
    {
      id: "successful",
      label: t.successful,
      Icon: ThumbsUp,
      activeCls: "bg-emerald-600/30 text-emerald-400 border-emerald-500/60 ring-2 ring-emerald-500/30",
      inactiveCls: "bg-emerald-600/10 text-emerald-400/70 border-emerald-500/20 hover:bg-emerald-600/20 hover:text-emerald-400"
    },
    {
      id: "not-bad",
      label: t.notBad,
      Icon: Meh,
      activeCls: "bg-amber-500/30 text-amber-400 border-amber-500/60 ring-2 ring-amber-500/30",
      inactiveCls: "bg-amber-500/10 text-amber-400/70 border-amber-500/20 hover:bg-amber-500/20 hover:text-amber-400"
    },
    {
      id: "boring",
      label: t.boring,
      Icon: EyeOff,
      activeCls: "bg-orange-500/30 text-orange-400 border-orange-500/60 ring-2 ring-orange-500/30",
      inactiveCls: "bg-orange-500/10 text-orange-400/70 border-orange-500/20 hover:bg-orange-500/20 hover:text-orange-400"
    },
    {
      id: "awful",
      label: t.awful,
      Icon: Frown,
      activeCls: "bg-red-600/30 text-red-400 border-red-500/60 ring-2 ring-red-500/30",
      inactiveCls: "bg-red-600/10 text-red-400/70 border-red-500/20 hover:bg-red-600/20 hover:text-red-400"
    }
  ];

  const handleSubmit = async () => {
    if (!selectedTier) return;
    setSubmitting(true);
    try {
      await onSave(movie.id, selectedTier, watchDate);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center px-4 modal-overlay">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
      />

      {/* Dialog box */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 15 }}
        transition={{ type: "spring", damping: 25, stiffness: 350 }}
        className="relative w-full max-w-md rounded-2xl glass-heavy p-6 border border-zinc-800/40 shadow-2xl overflow-hidden"
      >
        {/* Glow Effects */}
        <div className="absolute -top-12 -left-12 w-40 h-40 bg-purple-500/10 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-40 h-40 bg-pink-500/10 rounded-full blur-[80px] pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800/40 pb-4 mb-5">
          <h2 className="text-lg font-bold text-white truncate max-w-[80%]">
            {displayTitle}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/5 text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Watch Date Section */}
        <div className="mb-6">
          <label className="block text-xs font-semibold text-zinc-400 mb-2 uppercase tracking-wider flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-purple-400" />
            {t.watchDate}
          </label>
          <input
            type="date"
            value={watchDate}
            onChange={(e) => setWatchDate(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-zinc-950/80 border border-zinc-800 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-purple-500/30 focus:ring-1 focus:ring-purple-500/15 transition-all cursor-pointer"
          />
        </div>

        {/* Rating Tiers Section */}
        <div className="mb-8">
          <label className="block text-xs font-semibold text-zinc-400 mb-3 uppercase tracking-wider">
            {t.markAsWatched}
          </label>
          <div className="flex flex-col gap-2.5">
            {tiers.map((tier) => {
              const TierIcon = tier.Icon;
              const isSelected = selectedTier === tier.id;
              
              return (
                <button
                  key={tier.id}
                  onClick={() => setSelectedTier(tier.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-semibold transition-all cursor-pointer ${
                    isSelected ? tier.activeCls : tier.inactiveCls
                  }`}
                >
                  <TierIcon className="w-4 h-4" />
                  <span>{tier.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 text-sm font-semibold bg-white/5 border border-white/5 hover:bg-white/10 text-zinc-300 hover:text-white rounded-xl transition-all cursor-pointer text-center"
          >
            {t.cancel}
          </button>
          <button
            onClick={handleSubmit}
            disabled={!selectedTier || submitting}
            className="flex-1 py-3 text-sm font-semibold rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white disabled:from-zinc-800 disabled:to-zinc-800 disabled:text-zinc-600 disabled:border-zinc-800/40 border border-purple-500/20 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(168,85,247,0.2)] transition-all cursor-pointer text-center flex items-center justify-center gap-1"
          >
            <span>{t.saveEvaluation}</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
