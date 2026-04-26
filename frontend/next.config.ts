import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  // Silence any monorepo root detection warning
  outputFileTracingRoot: path.join(__dirname, '../'),

  // Remove X-Powered-By header for security reasons
  poweredByHeader: false,

  // Gzip compression
  compress: true,

  // Strict mode for React to catch potential issues early
  reactStrictMode: true,

  // Image optimisation — for LCP
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
  },

  // HTTP headers for security and caching
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
      {
        // Cache static assets aggressively
        source: '/(_next/static|favicon.ico|robots.txt|sitemap.xml)(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  // Redirect /admin to /admin/products
  async redirects() {
    return [
      {
        source: '/admin',
        destination: '/admin/products',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
