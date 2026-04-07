import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GoldNine Kiro - 500 pro 1000 2000 10000",
  description: "批发 零售  欢迎咨询",
  keywords: "token Goldnine kiro",
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
