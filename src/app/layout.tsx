import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GoldNine 台球门户 - AI动作分析，让训练更智能",
  description: "GoldNine是中国领先的台球智能服务平台，提供AI动作分析、球房预订、赛事报名、助教预约等专业服务",
  keywords: "台球,斯诺克,美式台球,中式台球,AI动作分析,球房预订,赛事报名,台球教练",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
