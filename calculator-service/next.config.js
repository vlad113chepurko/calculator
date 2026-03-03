import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: __dirname,
  },
  async rewrites() {
    return [
      {
        source: "/api/auth/:path*",
        destination: "http://auth-service:3000/api/auth/:path*",
      },
      {
        source: "/api/calc/:path*",
        destination: "http://calculator-service:3001/api/calc/:path*",
      },
    ];
  },
};

export default nextConfig;
