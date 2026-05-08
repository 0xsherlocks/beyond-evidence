import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    // This allows Next.js to use the src/ directory
  },
  typescript: {
    ignoreBuildErrors: true,
  }
};

export default nextConfig;
