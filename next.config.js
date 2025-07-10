/** @type {import('next').NextConfig} */
const dotenv = require("dotenv");
const fs = require("fs");

// Docker 환경이면 .env.production 사용
const envFile = fs.existsSync(".env.production") ? ".env.production" : ".env";
dotenv.config({ path: envFile });

const nextConfig = {
  output: "standalone",
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL,
    NEXT_PUBLIC_RECAPTCHA_SITE_KEY: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
  },
  images: {
    domains: ["res.cloudinary.com"],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*", // 프론트에서 이 경로로 요청하면
        destination: "https://meetudy-backend.fly.dev/api/:path*", // 실제 백엔드로 전달됨
      },
    ];
  },
};

module.exports = nextConfig;
