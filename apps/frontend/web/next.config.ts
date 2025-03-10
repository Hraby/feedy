import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env:{
    JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
    BACKEND_URL: process.env.BACKEND_URL,
  }
};

export default nextConfig;
