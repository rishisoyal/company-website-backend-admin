import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
};

module.exports = {
  images: {
    remotePatterns: [new URL("https://cmxooxkrqznpbsvcfenc.supabase.co/**")],
  },
  experimental: {
    serverActions: {
      allowedOrigins: ["http://localhost:3000", "https://company-website-backend-admin.vercel.app"],
    },
  },
};
export default nextConfig;
