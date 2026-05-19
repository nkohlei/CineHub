"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Film, Eye, Clock } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface StatsBarProps {
  total: number;
  watched: number;
}

function AnimatedNumber({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const duration = 800;
    const startTime = Date.now();
    const tick = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * value));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [value]);

  return <span>{display}</span>;
}

export default function StatsBar({ total, watched }: StatsBarProps) {
  const { t } = useLanguage();
  const remaining = total - watched;
  const progress = total > 0 ? (watched / total) * 100 : 0;

  const stats = [
    { label: t.totalFilms, value: total, Icon: Film, color: "text-zinc-100", iconColor: "text-purple-400" },
    { label: t.watched, value: watched, Icon: Eye, color: "text-emerald-400", iconColor: "text-emerald-500" },
    { label: t.remaining, value: remaining, Icon: Clock, color: "text-blue-400", iconColor: "text-blue-500" },
  ];


  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-6 p-3 md:p-6 rounded-2xl glass items-stretch">
      {stats.map((stat) => (
        <div key={stat.label} className="flex items-center gap-3 bg-zinc-900/25 p-3 rounded-xl border border-zinc-800/40">
          <div className={`p-2 rounded-lg bg-zinc-800/40 ${stat.iconColor} shrink-0`}>
            <stat.Icon className="w-4.5 h-4.5" />
          </div>
          <div className="min-w-0">
            <div className={`text-xl md:text-4xl font-bold tabular-nums truncate ${stat.color}`}>
              <AnimatedNumber value={stat.value} />
            </div>
            <div className="text-[10px] md:text-sm text-zinc-500 font-medium truncate">{stat.label}</div>
          </div>
        </div>
      ))}

      {/* Progress bar */}
      <div className="col-span-2 md:col-span-1 bg-zinc-900/25 p-3 rounded-xl border border-zinc-800/40 flex flex-col justify-center min-h-[56px]">
        <div className="flex justify-between text-[10px] md:text-sm text-zinc-500 mt-3 mb-1 md:mt-6 md:mb-2 font-medium">
          <span>Progress</span>
          <span className="text-purple-400">{Math.round(progress)}%</span>
        </div>
        <div className="h-1.5 bg-zinc-800/60 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
        </div>
      </div>
    </div>
  );
}
