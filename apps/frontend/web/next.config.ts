import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env:{
    JWT_SECRET_KEY: process.env.JWT_SECRET_KEY
  }
};

export default nextConfig;
