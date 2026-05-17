"use client";

import { motion } from "framer-motion";
import { Film, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface TabBarProps {
  activeTab: "watchlist" | "watched";
  onTabChange: (tab: "watchlist" | "watched") => void;
  watchlistCount: number;
  watchedCount: number;
}

export default function TabBar({ activeTab, onTabChange, watchlistCount, watchedCount }: TabBarProps) {
  const { t } = useLanguage();
  const tabs = [
    { key: "watchlist" as const, label: t.watchlist, count: watchlistCount, Icon: Film },
    { key: "watched" as const, label: t.watched, count: watchedCount, Icon: CheckCircle2 },
  ];


  return (
    <div className="flex gap-1 p-1.5 rounded-2xl glass">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onTabChange(tab.key)}
          className={`relative flex items-center gap-2.5 px-6 py-3 rounded-xl text-sm font-medium transition-colors duration-200 cursor-pointer
            ${activeTab === tab.key ? "text-white" : "text-zinc-500 hover:text-zinc-300"}`}
        >
          {activeTab === tab.key && (
            <motion.div
              layoutId="activeTab"
              className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-500/15 via-purple-500/10 to-pink-500/10 border border-purple-500/20"
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          )}
          <tab.Icon className={`relative z-10 w-4 h-4 ${activeTab === tab.key ? "text-purple-400" : ""}`} />
          <span className="relative z-10">{tab.label}</span>
          <span
            className={`relative z-10 px-2 py-0.5 rounded-full text-xs font-semibold
              ${activeTab === tab.key
                ? "bg-purple-500/20 text-purple-300"
                : "bg-zinc-800/60 text-zinc-600"
              }`}
          >
            {tab.count}
          </span>
        </button>
      ))}
    </div>
  );
}
