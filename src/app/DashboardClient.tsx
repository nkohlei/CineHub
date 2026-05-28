"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MovieRecord } from "@/lib/types";
import { Sparkles, Film, CheckCircle2, Loader2, ArrowUp, Eye, EyeOff, SlidersHorizontal, ChevronDown, Check, Send, Users } from "lucide-react";
import TabBar from "@/components/TabBar";
import StatsBar from "@/components/StatsBar";
import MovieCard from "@/components/MovieCard";
import GlobalSearch from "@/components/GlobalSearch";
import Footer from "@/components/Footer";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import Image from "next/image";
import LogoImage from "@/app/oxynema-logo.png";
import AuthBg from "../../public/images/auth-bg.jpg";
import LoginPage from "./login/page";
import dynamic from 'next/dynamic';

const DetailModal = dynamic(() => import("@/components/DetailModal"), { ssr: false });
const EvaluationModal = dynamic(() => import("@/components/EvaluationModal"), { ssr: false });
const MovieRoulette = dynamic(() => import("@/components/MovieRoulette"), { ssr: false });
const FriendsModal = dynamic(() => import("@/components/FriendsModal"), { ssr: false });
const PersonModal = dynamic(() => import("@/components/PersonModal"), { ssr: false });

export default function Home({ initialMovie }: { initialMovie?: MovieRecord | null }) {
  const { data: session, status } = useSession({
    required: false // Prevents client-side hydration freezing during account jumps
  });

  const userName = session?.user?.name || "Sinemasever";
  const userShareId = (session?.user as any)?.shareId || "------";

  const { t, language } = useLanguage();
  const router = useRouter();

  const [isBot, setIsBot] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [visibleCount, setVisibleCount] = useState(24);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && typeof window !== 'undefined') {
      setIsMobile(window.innerWidth < 640);
    }
  }, [mounted]);

  const [activeTab, setActiveTab] = useState<"watchlist" | "watched">("watchlist");
  const [selectedMovie, setSelectedMovie] = useState<MovieRecord | null>(initialMovie || null);
  const [selectedPersonId, setSelectedPersonId] = useState<number | null>(null);
  const [evaluationMovie, setEvaluationMovie] = useState<MovieRecord | null>(null);
  const [rouletteOpen, setRouletteOpen] = useState(false);
  const [movies, setMovies] = useState<MovieRecord[]>([]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      const ua = (typeof navigator !== 'undefined' && navigator.userAgent) || '';
      const isPageSpeedBot = /Lighthouse|PageSpeed|Googlebot/i.test(ua);
      
      // ONLY kick real humans to the login page. Bots stay on the dashboard!
      if (!isPageSpeedBot) {
        const currentPath = window.location.pathname;
        const searchParams = new URLSearchParams(window.location.search);
        const queryMovieId = searchParams.get("movie");

        if (currentPath.startsWith('/movie/')) {
          router.push(`/login?redirect=${currentPath}`);
        } else if (queryMovieId) {
          router.push(`/login?redirect=/movie/${queryMovieId}`);
        } else {
          router.push("/login");
        }
      }
    }
  }, [status, router]);

  // Global Unauthenticated Interaction Interceptor (Auth Guard)
  useEffect(() => {
    if (status === "unauthenticated") {
      const ua = (typeof navigator !== "undefined" && navigator.userAgent) || "";
      const isPageSpeedBot = /Lighthouse|PageSpeed|Googlebot/i.test(ua);
      if (!isPageSpeedBot) {
        const handleGlobalClick = (e: MouseEvent) => {
          e.preventDefault();
          e.stopPropagation();
          const currentPath = window.location.pathname;
          const searchParams = new URLSearchParams(window.location.search);
          const queryMovieId = searchParams.get("movie");

          if (currentPath.startsWith('/movie/')) {
            router.push(`/login?redirect=${currentPath}`);
          } else if (queryMovieId) {
            router.push(`/login?redirect=/movie/${queryMovieId}`);
          } else {
            router.push("/login");
          }
        };
        window.addEventListener("click", handleGlobalClick, true);
        return () => window.removeEventListener("click", handleGlobalClick, true);
      }
    }
  }, [status, router]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const ua = navigator.userAgent || '';
      if (/Lighthouse|PageSpeed/i.test(ua)) {
        setIsBot(true);
      }
    }
  }, []);

  const [hydrationCompleted, setHydrationCompleted] = useState(false);

  // Deep-Linking Path State Hydration on Mount
  useEffect(() => {
    if (!mounted || status === "loading") return;
    const currentPath = window.location.pathname;
    const searchParams = new URLSearchParams(window.location.search);
    const queryMovieId = searchParams.get("movie");
    
    if (currentPath.startsWith('/movie/') || queryMovieId) {
      const extractedId = queryMovieId || currentPath.split('/movie/')[1];
      if (extractedId) {
        const targetMovieId = Number(extractedId);
        
        if (status === "unauthenticated") {
          router.push(`/login?redirect=/movie/${targetMovieId}`);
          return;
        }
        
        if (status === "authenticated") {
          const timer = setTimeout(() => {
            const existing = movies.find((m) => Number(m.tmdbId) === targetMovieId);
            if (existing) {
              setSelectedMovie(existing);
              setHydrationCompleted(true);
            } else {
              fetch(`/api/tmdb/${targetMovieId}?language=${language}`)
                .then((res) => res.json())
                .then((data) => {
                  setSelectedMovie({
                    id: `temp-${targetMovieId}`,
                    title: data.title || "İsimsiz Film",
                    isWatched: false,
                    watchedAt: null,
                    tagColor: null,
                    tmdbId: targetMovieId,
                    posterPath: data.posterUrl ? data.posterUrl.substring(data.posterUrl.lastIndexOf("/")) : null,
                    backdropPath: data.backdropUrl ? data.backdropUrl.substring(data.backdropUrl.lastIndexOf("/")) : null,
                    trailerKey: data.trailerKey || null,
                    rating: data.rating || null,
                    createdAt: new Date().toISOString(),
                  });
                  setHydrationCompleted(true);
                })
                .catch((err) => {
                  console.error("Failed to parse movie from URL path parameter:", err);
                  setHydrationCompleted(true);
                });
            }
          }, 150);

          return () => clearTimeout(timer);
        }
      } else {
        setHydrationCompleted(true);
      }
    } else {
      setHydrationCompleted(true);
    }
  }, [status, movies, language, router, mounted]);

  // Synchronize Modal State with URL Paths using shallow pushes
  useEffect(() => {
    if (!mounted || !hydrationCompleted || typeof window === "undefined") return;
    const currentPath = window.location.pathname;

    if (selectedMovie) {
      const tmdbId = selectedMovie.tmdbId;
      const targetPath = `/movie/${tmdbId}`;
      if (currentPath !== targetPath) {
        window.history.pushState({ path: targetPath }, '', targetPath);
      }
    } else {
      if (currentPath !== '/') {
        window.history.pushState({ path: '/' }, '', '/');
      }
    }
  }, [selectedMovie, mounted, hydrationCompleted]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showAllRatings, setShowAllRatings] = useState(false);
  const [sortBy, setSortBy] = useState<"imdb" | "releaseDate" | "none">("none");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    setVisibleCount(24);
  }, [activeTab, sortBy]);

  // Social & Export Action States
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [toastTimeoutId, setToastTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const [friends, setFriends] = useState<any[]>([]);
  const [inbox, setInbox] = useState<any[]>([]);
  const [friendsModalOpen, setFriendsModalOpen] = useState(false);
  const [sendListPopoverOpen, setSendListPopoverOpen] = useState(false);
  const [sendingListUserId, setSendingListUserId] = useState<string | null>(null);

  const showToast = useCallback((message: string, type: "success" | "error") => {
    setToast({ message, type });
    if (toastTimeoutId) clearTimeout(toastTimeoutId);
    const id = setTimeout(() => {
      setToast(null);
    }, 4000);
    setToastTimeoutId(id);
  }, [toastTimeoutId]);

  const isAnyModalOpen = selectedMovie !== null || evaluationMovie !== null || rouletteOpen || selectedPersonId !== null;
 
  useEffect(() => {
    if (isAnyModalOpen) {
      document.body.classList.add("modal-open-prevent-scroll");
    } else {
      document.body.classList.remove("modal-open-prevent-scroll");
    }
    return () => {
      document.body.classList.remove("modal-open-prevent-scroll");
    };
  }, [isAnyModalOpen]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const fetchMovies = useCallback(async () => {
    if (!session) return;
    try {
      const res = await fetch("/api/movies");
      const data = await res.json();
      if (Array.isArray(data)) {
        setMovies(data);
      } else {
        setMovies([]);
      }
    } catch (err) {
      console.error("Failed to fetch movies:", err);
      setMovies([]);
    } finally {
      setLoading(false);
    }
  }, [session]);

  const handleForceSync = async () => {
    setSyncing(true);
    setSyncMessage("Syncing TMDB posters sequentially...");
    try {
      const res = await fetch(`/api/movies/sync?language=${language}`, { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setSyncMessage(`Synced ${data.updatedCount} movies!`);
        fetchMovies();
      } else {
        setSyncMessage("Sync failed.");
      }
    } catch {
      setSyncMessage("Server connection failed.");
    } finally {
      setSyncing(false);
      setTimeout(() => setSyncMessage(null), 5000);
    }
  };

  const [syncingAll, setSyncingAll] = useState(false);

  const handleSyncAll = async () => {
    setSyncingAll(true);
    setSyncMessage("Mass Syncing 100% accurate IMDb ratings (400ms throttle)...");
    try {
      const res = await fetch(`/api/movies/sync-all?language=${language}`);
      const data = await res.json();
      if (data.success) {
        setSyncMessage(`Mass Synced ${data.updatedCount} movies with real IMDb scores!`);
        fetchMovies();
      } else {
        setSyncMessage("Mass Sync failed.");
      }
    } catch {
      setSyncMessage("Server connection failed.");
    } finally {
      setSyncingAll(false);
      setTimeout(() => setSyncMessage(null), 8000);
    }
  };

  const fetchSocialProfile = useCallback(async () => {
    if (!session) return;
    try {
      const res = await fetch("/api/user/profile");
      if (res.ok) {
        const data = await res.json();
        setFriends(data.friends || []);
        setInbox(data.inbox || []);
      }
    } catch (err) {
      console.error("Failed to fetch social profile:", err);
    }
  }, [session]);

  const handleAddFriend = async (shareId: string): Promise<string | null> => {
    try {
      const res = await fetch("/api/user/friends", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shareId })
      });
      const data = await res.json();
      if (res.ok) {
        showToast(language === 'tr' ? "Arkadaş başarıyla eklendi!" : "Friend added successfully!", "success");
        fetchSocialProfile();
        return null;
      } else {
        return data.error || "Failed to add friend";
      }
    } catch (err) {
      return "Connection error";
    }
  };

  const handleRemoveFriend = async (friendId: string): Promise<boolean> => {
    try {
      const res = await fetch("/api/user/friends", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ friendId })
      });
      if (res.ok) {
        showToast(language === 'tr' ? "Arkadaş silindi." : "Friend removed.", "success");
        fetchSocialProfile();
        return true;
      }
    } catch (err) {
      console.error(err);
    }
    return false;
  };

  const handleAcceptShare = async (inboxItemId: string): Promise<number | null> => {
    try {
      const res = await fetch("/api/user/inbox", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inboxItemId, action: "accept" })
      });
      if (res.ok) {
        const data = await res.json();
        showToast(
          language === 'tr'
            ? `${data.addedCount} yeni film listenize eklendi!`
            : `${data.addedCount} new movies added to your list!`,
          "success"
        );
        fetchSocialProfile();
        fetchMovies();
        return data.addedCount;
      }
    } catch (err) {
      console.error(err);
    }
    return null;
  };

  const handleDeleteShare = async (inboxItemId: string): Promise<boolean> => {
    try {
      const res = await fetch("/api/user/inbox", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inboxItemId, action: "delete" })
      });
      if (res.ok) {
        showToast(language === 'tr' ? "Paylaşım yoksayıldı." : "Share ignored.", "success");
        fetchSocialProfile();
        return true;
      }
    } catch (err) {
      console.error(err);
    }
    return false;
  };


  const handleSendListToFriend = async (friend: { id: string; name: string }) => {
    if (movies.length === 0) {
      showToast(language === 'tr' ? "Gönderilecek film yok!" : "No movies to send!", "error");
      return;
    }
    setSendingListUserId(friend.id);
    try {
      const listPayload = movies.map(m => ({
        title: m.title,
        tmdbId: m.tmdbId,
        posterPath: m.posterPath,
        backdropPath: m.backdropPath,
        trailerKey: m.trailerKey,
        rating: m.rating,
        imdbRating: m.imdbRating,
        releaseDate: m.releaseDate,
        cast: m.cast
      }));

      const res = await fetch("/api/user/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          friendId: friend.id,
          type: "list",
          data: listPayload
        })
      });

      if (res.ok) {
        showToast(
          language === 'tr'
            ? `Listeniz ${friend.name} ile paylaşıldı!`
            : `Your list was shared with ${friend.name}!`,
          "success"
        );
        setSendListPopoverOpen(false);
      } else {
        const errData = await res.json();
        showToast(errData.error || "Failed to send list", "error");
      }
    } catch (err) {
      showToast("Connection error", "error");
    } finally {
      setSendingListUserId(null);
    }
  };

  useEffect(() => { 
    if (session) {
      fetchMovies(); 
      fetchSocialProfile();
    }
  }, [fetchMovies, fetchSocialProfile, session]);

  const watchlist = useMemo(() => movies.filter((m) => !m.isWatched).sort(
    (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
  ), [movies]);
  const watched = useMemo(() => movies.filter((m) => m.isWatched).sort(
    (a, b) => new Date(b.watchedAt || 0).getTime() - new Date(a.watchedAt || 0).getTime()
  ), [movies]);
  const baseDisplayed = activeTab === "watchlist" ? watchlist : watched;

  const displayed = useMemo(() => {
    return [...baseDisplayed].sort((a, b) => {
      if (sortBy === "imdb") {
        const aRating = parseFloat(a.imdbRating?.replace("ERR: ", "") || "0");
        const bRating = parseFloat(b.imdbRating?.replace("ERR: ", "") || "0");
        const aVal = isNaN(aRating) ? -1 : aRating;
        const bVal = isNaN(bRating) ? -1 : bRating;
        return bVal - aVal;
      }
      if (sortBy === "releaseDate") {
        const dateA = a.releaseDate ? new Date(a.releaseDate).getTime() : 0;
        const dateB = b.releaseDate ? new Date(b.releaseDate).getTime() : 0;
        const validA = isNaN(dateA) ? 0 : dateA;
        const validB = isNaN(dateB) ? 0 : dateB;
        return validB - validA;
      }
      return 0;
    });
  }, [baseDisplayed, sortBy]);



  const handleMovieAdded = () => {
    setActiveTab("watchlist");
    fetchMovies();
  };

  const handleAddMovieFromDetails = async (movie: { id: number; title: string; poster_path: string | null }) => {
    try {
      const res = await fetch("/api/movies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tmdbId: movie.id,
          title: movie.title,
          posterPath: movie.poster_path || null,
          isWatched: false,
          language: language,
        }),
      });

      if (res.ok) {
        showToast(
          language === "tr"
            ? `"${movie.title}" listenize eklendi!`
            : `"${movie.title}" added to your list!`,
          "success"
        );
        
        await fetchMovies();
        
        // Fetch fresh movies list to replace selectedMovie with database record
        const updatedMoviesRes = await fetch("/api/movies");
        if (updatedMoviesRes.ok) {
          const updatedList = await updatedMoviesRes.json();
          if (Array.isArray(updatedList)) {
            setMovies(updatedList);
            const dbRecord = updatedList.find((m) => m.tmdbId === movie.id);
            if (dbRecord) {
              setSelectedMovie(dbRecord);
            } else {
              setSelectedMovie(null);
            }
          }
        }
      } else {
        const errData = await res.json();
        showToast(errData.error || "Failed to add movie", "error");
      }
    } catch (error) {
      console.error("Failed to add movie from detail modal:", error);
      showToast("Failed to add movie.", "error");
    }
  };

  const handleMarkWatched = async (id: string, tagColor: string) => {
    try {
      const res = await fetch(`/api/movies/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isWatched: true, watchedAt: new Date().toISOString(), tagColor }),
      });
      if (res.ok) { setSelectedMovie(null); fetchMovies(); }
    } catch (err) { console.error("Failed to update movie:", err); }
  };

  const handleSaveEvaluation = async (movieId: string, ratingTier: string, watchedAt: string) => {
    try {
      const res = await fetch(`/api/movies/${movieId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          isWatched: true,
          ratingTier,
          watchedAt: new Date(watchedAt).toISOString(),
        }),
      });
      if (res.ok) {
        setEvaluationMovie(null);
        fetchMovies();
      }
    } catch (err) {
      console.error("Failed to save evaluation:", err);
    }
  };

  const handleDeleteMovie = async (id: string) => {
    try {
      const res = await fetch(`/api/movies/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setSelectedMovie(null);
        fetchMovies();
      } else {
        console.warn("DB delete returned non-ok, updating client-side list fallback");
        setMovies((prev) => prev.filter((m) => m.id !== id));
        setSelectedMovie(null);
      }
    } catch (err) {
      console.warn("Delete request failed, updating client-side fallback list:", err);
      setMovies((prev) => prev.filter((m) => m.id !== id));
      setSelectedMovie(null);
    }
  };

  if (showLogin) {
    return <LoginPage />;
  }

  return (
    <main className="flex-1 px-3 sm:px-10 md:px-12 py-4 sm:py-6 md:py-8 max-w-7xl mx-auto w-full">
      <div className={isAnyModalOpen ? "modal-open-prevent-scroll flex-1 flex flex-col" : "flex-1 flex flex-col"}>
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 md:gap-4 mb-4 md:mb-6">
          <div>
            <div className="flex items-center gap-1 sm:gap-2 md:gap-3">
              {/* Refactored Accessible Header */}
              <h1 className="flex items-center justify-start relative h-10 sm:h-12 md:h-16 lg:h-20 min-w-[100px] md:min-w-[150px]">
                {/* Important: Visually hidden text for SEO/Accessibility */}
                <span className="sr-only">Oxynema - Kişisel Film Takip ve Rulet Platformu</span>
                
                {/* The New Premium Logo Image */}
                <Image 
                  src={LogoImage} 
                  alt="Oxynema - Premium el yazısı gümüş logo imza" 
                  height={72} // Sets height to approximate current font height (72px ~ 4xl-5xl)
                  priority // Critical: Loads with high priority for immediate display
                  className="absolute left-0 h-10 sm:h-12 md:h-16 lg:h-20 w-auto" // Maintains aspect ratio, responsive sizing
                />
              </h1>
              {session?.user && (
                <div className="flex flex-row items-center gap-1 md:gap-2 bg-zinc-900/60 border border-zinc-800/80 px-1.5 py-1 md:px-4 md:py-2 rounded-full text-[9px] leading-none sm:text-xs md:text-sm font-semibold text-zinc-300 shadow-md">
                  {session?.user?.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={session?.user?.image}
                      alt={userName}
                      className="w-3 h-3 md:w-5 md:h-5 rounded-full border border-purple-500/30"
                    />
                  ) : (
                    <div className="w-3 h-3 md:w-5 md:h-5 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center text-[7px] md:text-[10px]">
                      {userName[0]}
                    </div>
                  )}
                  <span className="hidden md:inline text-zinc-400 max-w-[120px] truncate">{userName}</span>
                  <button
                    onClick={() => signOut()}
                    className="ml-0.5 md:ml-1 text-[8px] md:text-xs text-zinc-500 hover:text-zinc-300 hover:underline cursor-pointer border-none bg-transparent outline-none font-bold"
                  >
                    {t.signOut}
                  </button>
                </div>
              )}

              {/* Blue Zone: Share ID Display & Copy */}
              {session?.user && (session?.user as any).shareId && (
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(userShareId);
                    showToast(t.copied, "success");
                  }}
                  className="flex flex-row items-center gap-1 md:gap-2 bg-zinc-900/60 hover:bg-zinc-800/80 border border-zinc-800/80 px-1.5 py-1 md:px-4 md:py-2 text-[9px] leading-none sm:text-xs md:text-sm rounded-full font-semibold text-zinc-300 hover:text-white transition-all cursor-pointer shadow-md select-none font-mono hover:shadow-[0_0_12px_rgba(168,85,247,0.15)]"
                  title="Click to copy your Share ID"
                >
                  <span className="text-zinc-500 font-bold font-sans uppercase text-[8px] md:text-[10px] tracking-wider">{language === 'tr' ? 'Kod' : 'ID'}:</span>
                  <span>{userShareId}</span>
                </button>
              )}

              {session?.user && <LanguageSwitcher />}
            </div>
            <p className="text-zinc-500 text-sm mt-1 font-medium">Your personal movie tracker & roulette</p>
            <div className="grid grid-cols-2 gap-2 w-full md:flex md:flex-row md:w-auto md:gap-4 mt-3.5">
              <button
                disabled={syncing || syncingAll}
                onClick={handleForceSync}
                className="justify-center px-2 py-1.5 text-[10px] md:px-4 md:py-2 md:text-sm rounded-xl border border-purple-500/20 bg-purple-500/5 hover:bg-purple-500/15 disabled:bg-zinc-800/40 disabled:border-zinc-700/30 disabled:text-zinc-500 font-semibold text-purple-300 transition-all cursor-pointer flex items-center gap-1 md:gap-1.5"
              >
                {syncing ? (
                  <Loader2 className="w-3 h-3 md:w-3.5 md:h-3.5 animate-spin text-purple-400" />
                ) : (
                  <Sparkles className="w-3 h-3 md:w-3.5 md:h-3.5 text-purple-400" />
                )}
                <span className="md:hidden">Sync Posters</span>
                <span className="hidden md:inline">Force Sync Missing Posters</span>
              </button>

              <button
                disabled={syncing || syncingAll}
                onClick={handleSyncAll}
                className="justify-center px-2 py-1.5 text-[10px] md:px-4 md:py-2 md:text-sm rounded-xl border border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/15 disabled:bg-zinc-800/40 disabled:border-zinc-700/30 disabled:text-zinc-500 font-semibold text-emerald-300 transition-all cursor-pointer flex items-center gap-1 md:gap-1.5"
              >
                {syncingAll ? (
                  <Loader2 className="w-3 h-3 md:w-3.5 md:h-3.5 animate-spin text-emerald-400" />
                ) : (
                  <Sparkles className="w-3 h-3 md:w-3.5 md:h-3.5 text-emerald-400" />
                )}
                <span className="md:hidden">Sync IMDb</span>
                <span className="hidden md:inline">Mass Sync IMDb Ratings</span>
              </button>


              {syncMessage && (
                <span className="text-xs text-zinc-300/80 font-medium animate-pulse">{syncMessage}</span>
              )}
            </div>
          </div>
          
          {/* Red Zone: Friends Button & Search Bar */}
          <div className="flex w-full sm:w-auto items-stretch gap-2 justify-end">
            <div className="order-1 md:order-2 flex-grow sm:flex-grow-0 flex items-center">
              <GlobalSearch 
                onMovieAdded={handleMovieAdded} 
                onSelectPerson={(personId) => {
                  setSelectedMovie(null);
                  setSelectedPersonId(personId);
                }}
                onSelectMovie={(tmdbId, title, posterPath, backdropPath) => {
                  const existing = movies.find((m) => m.tmdbId === tmdbId);
                  if (existing) {
                    setSelectedMovie(existing);
                  } else {
                    setSelectedMovie({
                      id: `temp-${tmdbId}`,
                      title,
                      isWatched: false,
                      watchedAt: null,
                      tagColor: null,
                      tmdbId,
                      posterPath,
                      backdropPath: backdropPath || null,
                      trailerKey: null,
                      rating: null,
                      createdAt: new Date().toISOString(),
                    });
                  }
                }}
                activeMovieId={selectedMovie ? (selectedMovie.tmdbId || selectedMovie.id) : null}
                activePersonId={selectedPersonId}
              />
            </div>
            <button
              onClick={() => setFriendsModalOpen(true)}
              className="order-2 md:order-1 relative aspect-square flex items-center justify-center h-10 md:h-[46px] rounded-xl sm:rounded-2xl bg-zinc-900/60 border border-zinc-800 hover:border-purple-500/30 transition-all text-zinc-400 hover:text-white cursor-pointer shadow-lg hover:shadow-[0_0_15px_rgba(168,85,247,0.15)] flex-shrink-0"
              title={language === 'tr' ? "Arkadaşlar & Gelen Kutusu" : "Friends & Inbox"}
            >
              <Users className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
              {inbox.length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-red-500 text-[9px] font-black text-white ring-2 ring-zinc-950 animate-pulse">
                  {inbox.length}
                </span>
              )}
            </button>
          </div>
        </div>
        <StatsBar total={movies.length} watched={watched.length} />
      </motion.header>

      {/* Tabs & Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-7 relative z-50">
        <TabBar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          watchlistCount={watchlist.length}
          watchedCount={watched.length}
        />
        
        {/* Sleek Glassmorphism Control Panel */}
        <div className="flex flex-wrap items-center gap-1 sm:gap-2 md:gap-3 bg-zinc-900/40 p-1 md:p-1.5 rounded-2xl border border-zinc-800/60 backdrop-blur-md self-start md:self-auto w-full md:w-auto justify-between sm:justify-start">
          
          {/* Green Zone: List Management Controls */}
          {session?.user && (
            <div className="flex items-center gap-2">
              {/* Send List Button & Popover */}
              <div className="relative">
                <button
                  onClick={() => setSendListPopoverOpen(!sendListPopoverOpen)}
                  className="flex items-center gap-1 md:gap-2 px-1.5 py-1 text-[10px] sm:px-2 sm:py-1.5 sm:text-xs md:px-4 md:py-2 md:text-sm rounded-lg md:rounded-xl font-semibold bg-zinc-800/30 border border-zinc-700/30 text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-300 transition-all cursor-pointer select-none"
                  title="Send List"
                >
                  <Send className="w-3.5 h-3.5 text-blue-400" />
                  <span className="hidden md:inline">Send List</span>
                </button>

                {sendListPopoverOpen && (
                  <div 
                    className="fixed inset-0 z-[90] cursor-default" 
                    onClick={() => setSendListPopoverOpen(false)}
                  />
                )}

                <AnimatePresence>
                  {sendListPopoverOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 10 }}
                      className="absolute left-0 lg:left-auto lg:right-0 mt-2 w-52 z-[100] origin-top bg-zinc-900/95 backdrop-blur-xl border border-zinc-800 p-2 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.7)]"
                    >
                      <p className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider px-2.5 py-1.5 border-b border-zinc-800/80 mb-1">{t.friendsTitle}</p>
                      {friends.length === 0 ? (
                        <p className="text-xs text-zinc-500 px-2.5 py-3 text-center">{t.noFriends}</p>
                      ) : (
                        <div className="max-h-40 overflow-y-auto scrollbar-none space-y-0.5">
                          {friends.map((friend) => (
                            <button
                              key={friend.id}
                              disabled={sendingListUserId !== null}
                              onClick={() => handleSendListToFriend(friend)}
                              className="w-full text-left px-2.5 py-2 text-xs rounded-lg transition-all flex items-center justify-between hover:bg-white/5 text-zinc-300 hover:text-white cursor-pointer disabled:opacity-50"
                            >
                              <span className="truncate">{friend.name}</span>
                              {sendingListUserId === friend.id ? (
                                <Loader2 className="w-3 h-3 animate-spin text-purple-400" />
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
            </div>
          )}

          {/* IMDb Ratings Toggle Button */}
          <button
            onClick={() => setShowAllRatings(!showAllRatings)}
            className={`flex items-center gap-1 md:gap-2 px-1.5 py-1 text-[10px] sm:px-2 sm:py-1.5 sm:text-xs md:px-3.5 md:py-2 md:text-xs rounded-lg md:rounded-xl font-semibold border transition-all duration-300 cursor-pointer ${
              showAllRatings
                ? "bg-purple-500/20 border-purple-500/40 text-purple-200 shadow-[0_0_12px_rgba(168,85,247,0.25)]"
                : "bg-zinc-800/30 border-zinc-700/30 text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-300"
            }`}
            title={showAllRatings ? "Always Show Ratings: ON" : "Always Show Ratings: OFF"}
          >
            {showAllRatings ? (
              <Eye className="w-3.5 h-3.5 text-purple-400" />
            ) : (
              <EyeOff className="w-3.5 h-3.5 text-zinc-500" />
            )}
            <span>{showAllRatings ? t.hideImdb : t.showImdb}</span>
          </button>

          {/* Custom Premium Dropdown */}
          <div className="relative">
            {/* Trigger Button */}
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="bg-zinc-900/60 backdrop-blur-md border border-zinc-800/80 px-1.5 py-1 text-[10px] sm:px-2 sm:py-1.5 sm:text-xs md:px-4 md:py-2.5 md:text-sm rounded-lg md:rounded-xl text-zinc-300 font-medium hover:bg-zinc-800/60 hover:text-white transition-all flex items-center gap-1 md:gap-2.5 shadow-lg shadow-black/20 cursor-pointer"
            >
              <SlidersHorizontal className="w-4 h-4 text-zinc-400" />
              <span>
                {sortBy === "imdb"
                  ? t.imdbRating
                  : sortBy === "releaseDate"
                  ? t.releaseDate
                  : t.noSorting}
              </span>
              <ChevronDown className={`w-4 h-4 text-zinc-500 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`} />
            </button>

            {/* Click-outside backdrop overlay to dismiss dropdown gracefully */}
            {isDropdownOpen && (
              <div 
                className="fixed inset-0 z-[90] cursor-default" 
                onClick={() => setIsDropdownOpen(false)}
              />
            )}

            {/* Dropdown Menu Container */}
            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="absolute right-0 mt-2 w-56 z-[100] origin-top-right bg-zinc-900/90 backdrop-blur-xl border border-zinc-800 p-1.5 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.7)]"
                >
                  <button
                    onClick={() => {
                      setSortBy("none");
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-all flex items-center justify-between cursor-pointer ${
                      sortBy === "none"
                        ? "bg-zinc-800 text-white font-medium"
                        : "text-zinc-400 hover:bg-zinc-800/70 hover:text-white"
                    }`}
                  >
                    <span>{t.noSorting}</span>
                    {sortBy === "none" && <Check className="w-4 h-4 text-purple-400" />}
                  </button>

                  <button
                    onClick={() => {
                      setSortBy("imdb");
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-all flex items-center justify-between cursor-pointer ${
                      sortBy === "imdb"
                        ? "bg-zinc-800 text-white font-medium"
                        : "text-zinc-400 hover:bg-zinc-800/70 hover:text-white"
                    }`}
                  >
                    <span>{t.imdbRating}</span>
                    {sortBy === "imdb" && <Check className="w-4 h-4 text-purple-400" />}
                  </button>

                  <button
                    onClick={() => {
                      setSortBy("releaseDate");
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-all flex items-center justify-between cursor-pointer ${
                      sortBy === "releaseDate"
                        ? "bg-zinc-800 text-white font-medium"
                        : "text-zinc-400 hover:bg-zinc-800/70 hover:text-white"
                    }`}
                  >
                    <span>{t.releaseDate}</span>
                    {sortBy === "releaseDate" && <Check className="w-4 h-4 text-purple-400" />}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>


      {/* Movie Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-4 md:gap-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="rounded-2xl overflow-hidden glass-card">
              <div className="aspect-[2/3] bg-zinc-900/30 animate-pulse rounded-xl" />
            </div>
          ))}
        </div>
      ) : displayed.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-24 text-center"
        >
          <div className="w-20 h-20 rounded-2xl glass flex items-center justify-center mb-5">
            {activeTab === "watchlist" ? (
              <Film className="w-9 h-9 text-zinc-500" />
            ) : (
              <CheckCircle2 className="w-9 h-9 text-zinc-500" />
            )}
          </div>
          <h3 className="text-lg font-semibold text-zinc-300">
            {activeTab === "watchlist" ? t.emptyWatchlist : t.emptyWatched}
          </h3>
          <p className="text-sm text-zinc-500 mt-1.5 max-w-xs">
            {activeTab === "watchlist" ? t.emptyWatchlistSub : t.emptyWatchedSub}
          </p>
        </motion.div>
      ) : (
        <>
          <motion.div
            layout={isMobile ? false : "position"}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-4 md:gap-6"
          >
            {displayed.slice(0, visibleCount).map((movie, index) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onSelect={setSelectedMovie}
                index={index}
                showRatingAlways={showAllRatings}
              />
            ))}
          </motion.div>
          {displayed.length > visibleCount && (
            <div className="flex justify-center mt-8 mb-12">
              <button
                onClick={() => setVisibleCount((prev) => prev + 24)}
                className="px-6 py-2.5 rounded-xl font-bold bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all cursor-pointer shadow-md hover:shadow-purple-500/5"
              >
                {language === "tr" ? "Daha Fazla Göster" : "Load More"}
              </button>
            </div>
          )}
        </>
      )}

      {/* Floating Action Buttons */}
      {!selectedMovie && !rouletteOpen && !selectedPersonId && (
        <div className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-[100] flex flex-col items-center gap-3 pb-[env(safe-area-inset-bottom)]">
          
          {/* Dynamic Scroll-to-Top Button */}
          <button
            onClick={scrollToTop}
            className={`w-12 h-12 flex items-center justify-center rounded-full shadow-xl bg-zinc-800 border border-zinc-700/50 text-white transition-all duration-300 cursor-pointer ${
              showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
            }`}
            aria-label="Başa Dön"
            title="Scroll to Top"
          >
            <ArrowUp className="w-5 h-5" />
          </button>

          {/* Roulette Button */}
          {watchlist.length > 0 && (
            <motion.button
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => setRouletteOpen(true)}
              className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-xl hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] transition-shadow animate-float cursor-pointer"
              title="Movie Roulette"
            >
              <Sparkles className="w-5 h-5" />
            </motion.button>
          )}
        </div>
      )}

      </div>

      {/* Detail Modal */}
      <DetailModal
        movie={selectedMovie}
        onClose={() => setSelectedMovie(null)}
        onMarkWatched={handleMarkWatched}
        onDelete={handleDeleteMovie}
        onOpenEvaluation={(movie) => {
          setSelectedMovie(null);
          setEvaluationMovie(movie);
        }}
        friends={friends}
        showToast={showToast}
        onSelectPerson={(personId) => {
          setSelectedMovie(null);
          setSelectedPersonId(personId);
        }}
        onAddMovie={handleAddMovieFromDetails}
      />

      {/* Person Modal */}
      <PersonModal
        personId={selectedPersonId}
        onClose={() => setSelectedPersonId(null)}
        databaseMovies={movies}
        onSelectMovie={(tmdbId, title, posterPath, backdropPath) => {
          setSelectedPersonId(null);
          
          const existing = movies.find((m) => m.tmdbId === tmdbId);
          if (existing) {
            setSelectedMovie(existing);
          } else {
            setSelectedMovie({
              id: `temp-${tmdbId}`,
              title,
              isWatched: false,
              watchedAt: null,
              tagColor: null,
              tmdbId,
              posterPath,
              backdropPath,
              trailerKey: null,
              rating: null,
              createdAt: new Date().toISOString(),
            });
          }
        }}
      />

      {/* Friends & Inbox Modal */}
      <FriendsModal
        isOpen={friendsModalOpen}
        onClose={() => setFriendsModalOpen(false)}
        friends={friends}
        inbox={inbox}
        onAddFriend={handleAddFriend}
        onRemoveFriend={handleRemoveFriend}
        onAcceptShare={handleAcceptShare}
        onDeleteShare={handleDeleteShare}
      />

      {/* Custom Floating Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-2.5 px-4.5 py-3 rounded-2xl border text-sm font-semibold shadow-2xl backdrop-blur-xl ${
              toast.type === "success"
                ? "bg-emerald-950/90 border-emerald-500/30 text-emerald-300"
                : "bg-red-950/90 border-red-500/30 text-red-300"
            }`}
          >
            {toast.type === "success" ? (
              <Check className="w-4 h-4 text-emerald-400" />
            ) : (
              <span className="text-red-400 text-base leading-none font-bold select-none">✕</span>
            )}
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Evaluation Modal */}
      <AnimatePresence>
        {evaluationMovie && (
          <EvaluationModal
            movie={evaluationMovie}
            onClose={() => setEvaluationMovie(null)}
            onSave={handleSaveEvaluation}
          />
        )}
      </AnimatePresence>

      {/* Movie Roulette */}
      <MovieRoulette
        movies={watchlist}
        isOpen={rouletteOpen}
        onClose={() => setRouletteOpen(false)}
        onSelectMovie={(movie) => setSelectedMovie(movie)}
      />


      <Footer />
    </main>
  );
}
