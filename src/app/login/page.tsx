"use client";

import { useSession, signIn } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import LogoImage from "@/app/oxynema-logo.png";
import AuthBg from "../../../public/images/auth-bg.jpg";

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      const urlParams = new URLSearchParams(window.location.search);
      const redirectPath = urlParams.get('redirect');
      if (redirectPath) {
        router.push(redirectPath);
      } else {
        router.push("/");
      }
    }
  }, [status, router]);

  if (status === "loading" || status === "authenticated") {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center gap-4 relative overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="w-10 h-10 animate-spin border-4 border-purple-500 border-t-transparent rounded-full" />
        <p className="text-zinc-400 text-sm font-medium animate-pulse">Initializing Oxynema...</p>
      </div>
    );
  }

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
            <h2 className="sr-only">Welcome to Oxynema</h2>
            
            <span className="text-zinc-400 text-[10px] sm:text-xs font-bold tracking-widest uppercase opacity-80">
                Welcome to
            </span>
            
            <div className="relative h-10 sm:h-14 w-full flex items-center justify-center min-w-[180px]">
              <Image 
                  src={LogoImage} 
                  alt="Oxynema Brand Logo" 
                  height={54} 
                  priority 
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
