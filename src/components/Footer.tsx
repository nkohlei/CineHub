"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="w-full py-6 mt-12 border-t border-zinc-900/60 bg-zinc-950/20 backdrop-blur-md text-center text-xs text-zinc-500 font-medium flex flex-col sm:flex-row items-center justify-center gap-2">
      <span>{t.footerText || "Designed & Built by nkohlei • Oxynema is a subsidiary of Oxypace"}</span>
    </footer>
  );
}
