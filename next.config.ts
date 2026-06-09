import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Vercel handles deployment natively — no static export needed
  // output: 'export' would disable ISR and API routes
  images: {
    unoptimized: false,
  },
  // Compress responses
  compress: true,
};

export default nextConfig;
