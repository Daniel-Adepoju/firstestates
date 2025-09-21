import type { NextConfig } from "next";

const nextConfig: NextConfig = {
     eslint: {
    ignoreDuringBuilds: true,
  }, 
  images: {
    // domains: ['placehold.co'],
      remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // allow ALL https domains
      },
      {
        protocol: 'http',
        hostname: '**', // allow ALL http domains
      },
    ],
  },
};

export default nextConfig;
