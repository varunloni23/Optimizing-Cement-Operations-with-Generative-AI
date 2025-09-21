/** @type {import('next').NextConfig} */
const nextConfig = {
  // Removed static export to enable server-side rendering and WebSocket support
  // output: 'export', // COMMENTED OUT - prevents WebSocket connections
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  env: {
    NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL || 'https://backend2-0-lrcn.onrender.com',
    NEXT_PUBLIC_WS_URL: process.env.NEXT_PUBLIC_WS_URL || 'wss://backend2-0-lrcn.onrender.com',
  },
  eslint: {
    // Allow production builds to complete even with ESLint warnings
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Allow production builds to complete even with TypeScript errors
    ignoreBuildErrors: true,
  }
}

module.exports = nextConfig