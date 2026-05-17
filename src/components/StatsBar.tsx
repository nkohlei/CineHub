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
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8 p-4 rounded-2xl glass">
      <div className="flex gap-8">
        {stats.map((stat) => (
          <div key={stat.label} className="flex items-center gap-3">
            <div className={`p-2 rounded-lg bg-zinc-800/40 ${stat.iconColor}`}>
              <stat.Icon className="w-4 h-4" />
            </div>
            <div>
              <div className={`text-xl font-bold tabular-nums ${stat.color}`}>
                <AnimatedNumber value={stat.value} />
              </div>
              <div className="text-[11px] text-zinc-500 font-medium">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="flex-1 max-w-xs">
        <div className="flex justify-between text-[11px] text-zinc-500 mb-1.5 font-medium">
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
