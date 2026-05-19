import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Oxynema — Kişisel Film Takip & Rulet Platformu",
  description: "Kişisel film arşivinizi oluşturun, izleme istatistiklerinizi analiz edin ve kararsız kaldığınız gecelerde film ruletinin sizin için en iyi seçimi yapmasına izin verin. Oxypace iştirakidir.",
  metadataBase: new URL("https://oxynema.vercel.app"),
  keywords: ["film", "sinema", "film ruleti", "watch list", "oxynema", "oxypace", "film takip"],
  authors: [{ name: "nkohlei" }],
  openGraph: {
    title: "Oxynema — Premium Film Günlüğü & Ruleti",
    description: "Kişisel film arşivinizi modern, cam efektli bir arayüzle takip edin ve film ruletiyle gecenin başyapıtını seçin.",
    url: "https://oxynema.vercel.app",
    siteName: "Oxynema",
    locale: "tr_TR",
    type: "website",
    images: [
      {
        url: "/images/og-preview.png", // High-performance static asset redirection
        width: 1200,
        height: 630,
        alt: "Oxynema — Premium Film Günlüğü & Ruleti",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Oxynema — Kişisel Film Takip & Rulet Platformu",
    description: "Sinema tutkunları için Oxypace çatısı altında geliştirilen modern film izleme günlüğü.",
    images: ["/images/og-preview.png"], // Mirroring static open graph delivery
  },
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
