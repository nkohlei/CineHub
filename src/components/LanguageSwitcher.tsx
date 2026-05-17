"use client";

import { useLanguage } from "@/context/LanguageContext";
import { Globe } from "lucide-react";

export default function LanguageSwitcher() {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      className="bg-zinc-950/40 backdrop-blur-md border border-zinc-800/80 hover:bg-zinc-900/60 transition-all text-xs font-semibold px-3 py-1.5 rounded-lg text-zinc-300 flex items-center gap-1.5 cursor-pointer shadow-lg active:scale-95 transition-all duration-150 border-none outline-none"
      title={language === "en" ? "Türkçe diline geç" : "Switch to English"}
    >
      <Globe className="w-3.5 h-3.5 text-purple-400" />
      <span className="tracking-wider">{language === "en" ? "TR" : "EN"}</span>
    </button>
  );
}
