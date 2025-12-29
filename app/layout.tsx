'use client';

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import ParticleBackground from "../components/effects/particle-background";
import PhysicsPlayground from "../components/effects/physics-playground";
import { LayoutTransition } from "../components/layout/page-transition";
import ScrollProgress, { BackToTopButton } from "../components/ui/scroll-progress";
import ChatWidget from "../components/ai/chat-widget";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col relative overflow-x-hidden`}
      >
        {/* 全局3D粒子背景 */}
        <ParticleBackground />

        {/* 物理交互效果（可选择性启用） */}
        {/* <PhysicsPlayground isActive={false} /> */}

        {/* 滚动进度条 */}
        <ScrollProgress />

        {/* 导航栏 */}
        <Navigation />

        {/* 主要内容区域 - 添加页面过渡 */}
        <main className="flex-1 relative z-10">
          <LayoutTransition>
            {children}
          </LayoutTransition>
        </main>

        {/* 页脚 */}
        <Footer />

        {/* 回到顶部按钮 */}
        <BackToTopButton />

        {/* AI聊天助手 */}
        <ChatWidget />
      </body>
    </html>
  );
}
