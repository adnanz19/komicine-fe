import type { NextConfig } from "next";

const nextConfig: NextConfig = {
 images: {
     remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.myanimelist.net',
        port: '',
        pathname: '/images/**',
      },
      {
      protocol: 'https',
      hostname: 'image.tmdb.org',
    },
    ],
    
  },
};

export default nextConfig;
