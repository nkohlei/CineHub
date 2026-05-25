import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.tmdb.org",
        pathname: "/t/p/**",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/movie/:id',
        has: [
          {
            type: 'header',
            key: 'user-agent',
            value: '.*(WhatsApp|WhatsApp\\/.*|TelegramBot|Twitterbot|facebookexternalhit).*',
          },
        ],
        destination: '/api/share-metadata?id=:id',
      },
      {
        source: '/movie/:id',
        destination: '/',
      },
    ];
  },
};

export default nextConfig;
