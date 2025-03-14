import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env:{
    JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
    BACKEND_URL: process.env.BACKEND_URL,
    MAPY_API_KEY: process.env.MAPY_API_KEY,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
