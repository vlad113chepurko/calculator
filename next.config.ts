const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/auth/:path*",
        destination: "http://localhost:3001/api/auth/:path*",
      },
      {
        source: "/api/calc/:path*",
        destination: "http://localhost:3002/api/calc/:path*",
      },
    ];
  },
};

export default nextConfig;
