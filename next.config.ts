import type { NextConfig } from "next";

// Kept server-side only (no NEXT_PUBLIC_ prefix) so it's never bundled
// into client JS. The browser only ever talks to this same origin at
// "/api/*". Next.js's own server forwards those requests to the real
// backend below, so the backend's actual host/port is never exposed.
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8000";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${BACKEND_URL}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
