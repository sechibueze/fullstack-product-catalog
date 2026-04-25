import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Silence monorepo root detection warning
  outputFileTracingRoot: require('path').join(__dirname, '../'),

  // SEO  performance
  poweredByHeader: false, // remove X-Powered-By header
  compress: true, // gzip compression

  images: {
    formats: ['image/avif', 'image/webp'],
  },

  // Strict mode catches bugs early
  reactStrictMode: true,
};

export default nextConfig;
