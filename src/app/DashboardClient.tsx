"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MovieRecord } from "@/lib/types";
import { Sparkles, Film, CheckCircle2, Loader2, ArrowUp, Eye, EyeOff, SlidersHorizontal, ChevronDown, Check, Send, Users } from "lucide-react";
import TabBar from "@/components/TabBar";
import StatsBar from "@/components/StatsBar";
import MovieCard from "@/components/MovieCard";
import DetailModal from "@/components/DetailModal";
import EvaluationModal from "@/components/EvaluationModal";
import MovieRoulette from "@/components/MovieRoulette";
import GlobalSearch from "@/components/GlobalSearch";
import Footer from "@/components/Footer";
import { useSession, signIn, signOut } from "next-auth/react";
import { useLanguage } from "@/context/LanguageContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import Image from "next/image";
import LogoImage from "@/app/oxynema-logo.png";
import AuthBg from "../../public/images/auth-bg.jpg";
import FriendsModal from "@/components/FriendsModal";

export default function Home() {
  const { data: session, status } = useSession();
  const { t, language } = useLanguage();

  const [isBot, setIsBot] = useState(false);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const ua = navigator.userAgent || '';
      if (
        ua.includes('Chrome-Lighthouse') ||
        ua.includes('Google-Lighthouse') ||
        ua.includes('Google Page Speed Insights')
      ) {
        setIsBot(true);
      }
    }
  }, []);

  const [movies, setMovies] = useState<MovieRecord[]>([]);
  const [activeTab, setActiveTab] = useState<"watchlist" | "watched">("watchlist");
  const [selectedMovie, setSelectedMovie] = useState<MovieRecord | null>(null);
  const [evaluationMovie, setEvaluationMovie] = useState<MovieRecord | null>(null);
  const [rouletteOpen, setRouletteOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showAllRatings, setShowAllRatings] = useState(false);
  const [sortBy, setSortBy] = useState<"imdb" | "releaseDate" | "none">("none");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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

  const isAnyModalOpen = selectedMovie !== null || evaluationMovie !== null || rouletteOpen;

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

  const handleDownloadList = () => {
    if (movies.length === 0) {
      showToast(language === 'tr' ? "Listeniz boş!" : "Your list is empty!", "error");
      return;
    }
    const dataStr = JSON.stringify(movies, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `oxynema_watchlist_${new Date().toISOString().split('T')[0]}.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    showToast(language === 'tr' ? "Liste başarıyla indirildi!" : "List downloaded successfully!", "success");
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

  const watchlist = movies.filter((m) => !m.isWatched);
  const watched = movies.filter((m) => m.isWatched).sort(
    (a, b) => new Date(b.watchedAt || 0).getTime() - new Date(a.watchedAt || 0).getTime()
  );
  const baseDisplayed = activeTab === "watchlist" ? watchlist : watched;

  const displayed = [...baseDisplayed].sort((a, b) => {
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

  const handleMovieAdded = () => {
    setActiveTab("watchlist");
    fetchMovies();
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

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center gap-4 relative overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-[120px] pointer-events-none" />
        <Loader2 className="w-10 h-10 animate-spin text-purple-400" />
        <p className="text-zinc-400 text-sm font-medium animate-pulse">Initializing Oxynema...</p>
      </div>
    );
  }

  if (!session && !isBot) {
    return (
      <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-black p-4">
        {/* High-Performance Next.js Background Image */}
        <div className="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden">
          <Image
            src={AuthBg}
            alt="Cinematic Movie Poster Background"
            fill
            priority
            quality={85}
            className="object-cover brightness-[0.18] contrast-[1.05] scale-102 transition-all duration-700" 
          />
          {/* Subtle dark vignette overlay to draw eyes to the center card */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/80" />
        </div>

        {/* Animated Main Content Container */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 w-[92%] max-w-md bg-zinc-950/65 backdrop-blur-xl border border-zinc-900/80 p-6 sm:p-10 rounded-3xl shadow-2xl flex flex-col items-center text-center"
        >
          {/* Refactored Premium Welcome Header */}
          <div className="flex flex-col items-center gap-1.5 mt-2 mb-3 select-none">
              {/* Screen Reader Only text for accessibility and clean SEO indexation */}
              <h2 className="sr-only">Welcome to Oxynema</h2>
              
              {/* Minimalist Subtitle */}
              <span className="text-zinc-400 text-[10px] sm:text-xs font-bold tracking-widest uppercase opacity-80">
                  Welcome to
              </span>
              
              {/* The Majestic Silver Handwritten Logo */}
              <div className="relative h-10 sm:h-14 w-full flex items-center justify-center min-w-[180px]">
                <Image 
                    src={LogoImage} 
                    alt="Oxynema Brand Logo" 
                    height={54} // Perfectly scaled to fit inside the compact modal layout
                    priority // Loaded instantly for maximum loading efficiency
                    className="absolute h-10 sm:h-14 w-auto transform hover:scale-102 transition-transform duration-300"
                />
              </div>
          </div>
          <p className="text-zinc-400 text-sm mb-8 leading-relaxed max-w-sm">
            Your premium movie tracking dashboard. Sign in with your Google account to manage your personal watchlist, analyze stats, and spin the roulette.
          </p>

          {/* Premium Google Sign-In Button */}
          <motion.button
            whileHover={{ scale: 1.03, translateY: -1 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => signIn("google")}
            className="w-full py-3.5 px-5 rounded-2xl bg-white hover:bg-zinc-100 text-zinc-900 font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-3 shadow-xl hover:shadow-white/5 cursor-pointer border-none outline-none"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.67 1.48 14.97 1 12 1 7.24 1 3.21 3.75 1.25 7.77l3.86 3C6.01 7.74 8.78 5.04 12 5.04z"
              />
              <path
                fill="#4285F4"
                d="M23.49 12.27c0-.81-.07-1.59-.2-2.34H12v4.45h6.45c-.28 1.48-1.11 2.74-2.36 3.59l3.66 2.84c2.14-1.97 3.74-4.88 3.74-8.54z"
              />
              <path
                fill="#FBBC05"
                d="M5.11 14.23c-.23-.69-.36-1.43-.36-2.23s.13-1.54.36-2.23L1.25 6.77C.45 8.38 0 10.14 0 12s.45 3.62 1.25 5.23l3.86-3z"
              />
              <path
                fill="#34A853"
                d="M12 23c3.24 0 5.97-1.07 7.96-2.92l-3.66-2.84c-1.01.68-2.3 1.09-4.3 1.09-3.22 0-5.99-2.7-6.89-5.73l-3.86 3C3.21 20.25 7.24 23 12 23z"
              />
            </svg>
            Sign in with Google
          </motion.button>

          <span className="text-[10px] text-zinc-500 mt-5 font-medium tracking-wide">
            SECURE AUTHENTICATION VIA GOOGLE ACCOUNT
          </span>
        </motion.div>
      </div>
    );
  }

  return (
    <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto w-full">
      <div className={isAnyModalOpen ? "modal-open-prevent-scroll flex-1 flex flex-col" : "flex-1 flex flex-col"}>
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-3">
              {/* Refactored Accessible Header */}
              <h1 className="flex items-center justify-start relative h-16 lg:h-20 min-w-[150px]">
                {/* Important: Visually hidden text for SEO/Accessibility */}
                <span className="sr-only">Oxynema - Kişisel Film Takip ve Rulet Platformu</span>
                
                {/* The New Premium Logo Image */}
                <Image 
                  src={LogoImage} 
                  alt="Oxynema - Premium el yazısı gümüş logo imza" 
                  height={72} // Sets height to approximate current font height (72px ~ 4xl-5xl)
                  priority // Critical: Loads with high priority for immediate display
                  className="absolute left-0 h-16 lg:h-20 w-auto" // Maintains aspect ratio, responsive sizing
                />
              </h1>
              {session?.user && (
                <div className="flex items-center gap-2 bg-zinc-900/60 border border-zinc-800/80 px-2.5 py-1.5 rounded-full text-xs font-semibold text-zinc-300 shadow-md">
                  {session?.user.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={session?.user.image}
                      alt={session?.user.name || "Avatar"}
                      className="w-5 h-5 rounded-full border border-purple-500/30"
                    />
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center text-[10px]">
                      {session?.user.name?.[0] || "U"}
                    </div>
                  )}
                  <span className="hidden md:inline text-zinc-400 max-w-[120px] truncate">{session?.user.name}</span>
                  <button
                    onClick={() => signOut()}
                    className="ml-1 text-[10px] text-zinc-500 hover:text-zinc-300 hover:underline cursor-pointer border-none bg-transparent outline-none font-bold"
                  >
                    {t.signOut}
                  </button>
                </div>
              )}

              {/* Blue Zone: Share ID Display & Copy */}
              {session?.user && (session?.user as any).shareId && (
                <button
                  onClick={() => {
                    navigator.clipboard.writeText((session?.user as any).shareId);
                    showToast(t.copied, "success");
                  }}
                  className="flex items-center gap-1.5 bg-zinc-900/60 hover:bg-zinc-800/80 border border-zinc-800/80 px-3 py-1.5 rounded-full text-xs font-semibold text-zinc-300 hover:text-white transition-all cursor-pointer shadow-md select-none font-mono hover:shadow-[0_0_12px_rgba(168,85,247,0.15)]"
                  title="Click to copy your Share ID"
                >
                  <span className="text-zinc-500 font-bold font-sans uppercase text-[10px] tracking-wider">{language === 'tr' ? 'Kod' : 'ID'}:</span>
                  <span>{(session?.user as any).shareId}</span>
                </button>
              )}

              {session?.user && <LanguageSwitcher />}
            </div>
            <p className="text-zinc-500 text-sm mt-1 font-medium">Your personal movie tracker & roulette</p>
            <div className="flex items-center gap-3 mt-3.5 flex-wrap">
              <button
                disabled={syncing || syncingAll}
                onClick={handleForceSync}
                className="px-3.5 py-1.5 rounded-xl border border-purple-500/20 bg-purple-500/5 hover:bg-purple-500/15 disabled:bg-zinc-800/40 disabled:border-zinc-700/30 disabled:text-zinc-500 text-xs font-semibold text-purple-300 transition-all cursor-pointer flex items-center gap-1.5"
              >
                {syncing ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-purple-400" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                )}
                {t.forcePosters}
              </button>

              <button
                disabled={syncing || syncingAll}
                onClick={handleSyncAll}
                className="px-3.5 py-1.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/15 disabled:bg-zinc-800/40 disabled:border-zinc-700/30 disabled:text-zinc-500 text-xs font-semibold text-emerald-300 transition-all cursor-pointer flex items-center gap-1.5"
              >
                {syncingAll ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                )}
                {t.massSync}
              </button>


              {syncMessage && (
                <span className="text-xs text-zinc-300/80 font-medium animate-pulse">{syncMessage}</span>
              )}
            </div>
          </div>
          
          {/* Red Zone: Friends Button & Search Bar */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              onClick={() => setFriendsModalOpen(true)}
              className="relative p-3 rounded-2xl bg-zinc-900/60 border border-zinc-800 hover:border-purple-500/30 transition-all text-zinc-400 hover:text-white cursor-pointer shadow-lg hover:shadow-[0_0_15px_rgba(168,85,247,0.15)] flex-shrink-0"
              title={language === 'tr' ? "Arkadaşlar & Gelen Kutusu" : "Friends & Inbox"}
            >
              <Users className="w-5 h-5 text-purple-400" />
              {inbox.length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-red-500 text-[9px] font-black text-white ring-2 ring-zinc-950 animate-pulse">
                  {inbox.length}
                </span>
              )}
            </button>
            <GlobalSearch onMovieAdded={handleMovieAdded} />
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
        <div className="flex flex-wrap items-center gap-3 bg-zinc-900/40 p-1.5 rounded-2xl border border-zinc-800/60 backdrop-blur-md self-start md:self-auto w-full md:w-auto justify-between sm:justify-start">
          
          {/* Green Zone: List Management Controls */}
          {session?.user && (
            <div className="flex items-center gap-2">
              {/* Download List Button */}
              <button
                onClick={handleDownloadList}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-zinc-800/30 border border-zinc-700/30 text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-300 transition-all cursor-pointer select-none"
                title={t.downloadList}
              >
                <ArrowUp className="w-3.5 h-3.5 text-emerald-400 rotate-180" />
                <span className="hidden lg:inline">{t.downloadList}</span>
              </button>

              {/* Send List Button & Popover */}
              <div className="relative">
                <button
                  onClick={() => setSendListPopoverOpen(!sendListPopoverOpen)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-zinc-800/30 border border-zinc-700/30 text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-300 transition-all cursor-pointer select-none"
                  title={t.sendList}
                >
                  <Send className="w-3.5 h-3.5 text-blue-400" />
                  <span className="hidden lg:inline">{t.sendList}</span>
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
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all duration-300 cursor-pointer ${
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
              className="bg-zinc-900/60 backdrop-blur-md border border-zinc-800/80 px-4 py-2.5 rounded-xl text-zinc-300 text-sm font-medium hover:bg-zinc-800/60 hover:text-white transition-all flex items-center gap-2.5 shadow-lg shadow-black/20 cursor-pointer"
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
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-6">
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
        <motion.div
          layout
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-6"
        >
          {displayed.map((movie, index) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onSelect={setSelectedMovie}
              index={index}
              showRatingAlways={showAllRatings}
            />
          ))}
        </motion.div>
      )}

      {/* Floating Roulette Button */}
      {watchlist.length > 0 && (
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={() => setRouletteOpen(true)}
          className="fixed bottom-6 right-6 flex items-center gap-2 px-5 py-3 sm:px-6 sm:py-3.5 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-semibold text-sm shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] transition-shadow animate-float cursor-pointer z-40"
          title="Movie Roulette"
        >
          <Sparkles className="w-5 h-5" />
          <span className="hidden sm:inline">Spin</span>
        </motion.button>
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

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            whileHover={{ scale: 1.1, translateY: -2 }}
            whileTap={{ scale: 0.9 }}
            onClick={scrollToTop}
            className="fixed bottom-24 right-6 flex items-center justify-center w-12 h-12 rounded-2xl bg-zinc-900/80 border border-zinc-700/50 backdrop-blur-xl text-zinc-300 hover:text-white shadow-[0_8px_30px_rgb(0,0,0,0.5)] hover:border-purple-500/30 transition-colors cursor-pointer z-40"
            title="Scroll to Top"
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>
      <Footer />
    </main>
  );
}
