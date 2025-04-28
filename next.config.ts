// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // 기타 설정들...
  webpackDevMiddleware: (config) => {
    config.watchOptions = {
      poll: 1000, // 1초마다 파일 변경 확인
      aggregateTimeout: 300,
    };
    return config;
  },
};

module.exports = nextConfig;
