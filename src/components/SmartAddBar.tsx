"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus, CheckCircle2, Star, Film, Loader2 } from "lucide-react";
import Image from "next/image";

interface SearchResult {
  tmdbId: number;
  title: string;
  year: string;
  posterUrl: string | null;
  rating: number;
  posterPath?: string | null;
}

interface SmartAddBarProps {
  onAdd: (title: string, tmdbId: number, posterPath?: string | null, rating?: number | null) => void;
}

export default function SmartAddBar({ onAdd }: SmartAddBarProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState<string | null>(null);
  const debounceRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (query.length < 2) { setResults([]); setIsOpen(false); return; }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/tmdb/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        if (Array.isArray(data)) {
          setResults(data);
          setIsOpen(true);
        } else {
          setResults([]);
        }
      } catch { setResults([]); }
      setLoading(false);
    }, 300);

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSelect = async (result: SearchResult) => {
    onAdd(result.title, result.tmdbId, result.posterPath, result.rating);
    setAdded(result.title);
    setQuery("");
    setResults([]);
    setIsOpen(false);
    setTimeout(() => setAdded(null), 3000);
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search & add a movie..."
          className="w-full px-4 py-3 pl-10 pr-10 rounded-xl glass text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-purple-500/30 focus:ring-1 focus:ring-purple-500/15 transition-all"
        />
        {loading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Loader2 className="w-4 h-4 text-purple-400 animate-spin" />
          </div>
        )}
      </div>

      {/* Success toast */}
      <AnimatePresence>
        {added && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute -bottom-10 left-0 right-0 flex items-center justify-center gap-1.5 text-sm text-emerald-400"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Added &quot;{added}&quot;</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="absolute top-full mt-2 left-0 right-0 rounded-xl glass-heavy overflow-hidden z-30 max-h-80 overflow-y-auto"
          >
            {results.map((r) => (
              <button
                key={r.tmdbId}
                onClick={() => handleSelect(r)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-left cursor-pointer border-b border-zinc-800/30 last:border-0"
              >
                <div className="w-9 h-13 rounded-md overflow-hidden bg-zinc-800/60 flex-shrink-0 relative">
                  {r.posterUrl ? (
                    <Image src={r.posterUrl} alt={r.title} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Film className="w-4 h-4 text-zinc-600" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-zinc-100 truncate">{r.title}</p>
                  <div className="flex items-center gap-2 text-xs text-zinc-500">
                    {r.year && <span>{r.year}</span>}
                    {r.rating > 0 && (
                      <span className="flex items-center gap-0.5">
                        <Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
                        {r.rating.toFixed(1)}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs text-purple-400 font-medium flex-shrink-0">
                  <Plus className="w-3.5 h-3.5" />
                  Add
                </div>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
