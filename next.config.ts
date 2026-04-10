import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Força novo build ID a cada deploy — invalida cache de chunks no Vercel
  generateBuildId: async () => {
    return `build-${Date.now()}`;
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
    ],
  },
};

export default nextConfig;
