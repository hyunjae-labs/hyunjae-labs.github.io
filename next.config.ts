import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  // GitHub Pages repository name을 basePath로 설정 (repository name이 username.github.io가 아닌 경우)
  // basePath: '/repository-name',
  
  // Optional: static file serving을 위한 설정
  assetPrefix: process.env.NODE_ENV === 'production' ? undefined : undefined,
};

export default nextConfig;
