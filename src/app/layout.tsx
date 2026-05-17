import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "CineHub — Personal Movie Tracker",
  description: "Track your movie watchlist, discover new films with TMDB integration, and let the Movie Roulette pick your next watch.",
  keywords: ["movie tracker", "watchlist", "TMDB", "movie roulette", "cinema"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="relative min-h-full flex flex-col font-sans">
        <Providers>
          <div className="relative z-10 flex-1 flex flex-col">{children}</div>
        </Providers>
      </body>
    </html>
  );
}
