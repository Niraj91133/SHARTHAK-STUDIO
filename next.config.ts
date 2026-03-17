import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fix for Turbopack root as suggested by Next.js warning
  // @ts-ignore
  turbopack: {
    root: "/Users/Niraj/Desktop/sharthak-studio-next",
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "source.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "crpynlbypmvalvunxwkt.supabase.co",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "100mb",
    },
  },
};

export default nextConfig;
