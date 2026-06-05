import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Required for Cloudflare Pages via OpenNext
  output: "standalone",
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  // Tell Next.js NOT to bundle @libsql packages — they must stay as runtime imports
  // This works for both Node.js (dev) and edge/workerd (Cloudflare) targets
  serverExternalPackages: ["@libsql/client", "@libsql/client/web"],
};

export default nextConfig;
