import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 注意：移除了 output: "export" 以支持 API Routes
  // 如需静态导出部署，请使用 next start 或 Node.js 服务器模式
  images: { unoptimized: true },
};

export default nextConfig;
