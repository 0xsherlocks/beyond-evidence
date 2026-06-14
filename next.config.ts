import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },

  // Ensure Sanity Studio packages use the correct React version
  transpilePackages: ['sanity', 'next-sanity', '@sanity/vision'],

  webpack: (config, { isServer }) => {
    // Prevent duplicate React instances - ensure all packages use
    // the same React from node_modules
    if (!isServer) {
      const path = require('path');
      config.resolve.alias = {
        ...config.resolve.alias,
        // Force all react imports to resolve to the single copy
        react: path.resolve('./node_modules/react'),
        'react-dom': path.resolve('./node_modules/react-dom'),
      };
    }
    return config;
  },
};

export default nextConfig;
