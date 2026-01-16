'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Particle {
    left: string;
    top: string;
    animationDelay: string;
    animationDuration: string;
}

export default function NotFound() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [particles, setParticles] = useState<Particle[]>([]);

    useEffect(() => {
        // 生成随机粒子数据，只在客户端执行
        const generateParticles = () => {
            const newParticles: Particle[] = [];
            for (let i = 0; i < 20; i++) {
                newParticles.push({
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 3}s`,
                    animationDuration: `${2 + Math.random() * 3}s`,
                });
            }
            setParticles(newParticles);
        };

        generateParticles();

        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({
                x: (e.clientX / window.innerWidth - 0.5) * 20,
                y: (e.clientY / window.innerHeight - 0.5) * 20,
            });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
            {/* 动态背景效果 */}
            <div className="absolute inset-0 bg-linear-to-br from-blue-50 via-white to-blue-50">
                {/* 科技感网格背景 */}
                <div className="absolute inset-0 opacity-30">
                    <svg
                        className="w-full h-full"
                        viewBox="0 0 100 100"
                        preserveAspectRatio="none"
                    >
                        <defs>
                            <pattern
                                id="grid"
                                width="10"
                                height="10"
                                patternUnits="userSpaceOnUse"
                            >
                                <path
                                    d="M 10 0 L 0 0 0 10"
                                    fill="none"
                                    stroke="var(--accent-blue)"
                                    strokeWidth="0.5"
                                    opacity="0.3"
                                />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#grid)" />
                    </svg>
                </div>

                {/* 浮动粒子效果 */}
                <div className="absolute inset-0">
                    {particles.map((particle, i) => (
                        <div
                            key={i}
                            className="absolute w-1 h-1 bg-blue-400 rounded-full opacity-60 animate-pulse"
                            style={{
                                left: particle.left,
                                top: particle.top,
                                animationDelay: particle.animationDelay,
                                animationDuration: particle.animationDuration,
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* 主要内容 */}
            <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
                {/* 404数字显示 */}
                <div className="relative mb-8">
                    <h1
                        className="text-9xl sm:text-[12rem] lg:text-[16rem] font-light text-transparent bg-clip-text bg-linear-to-r from-blue-600 via-blue-500 to-blue-400 select-none"
                        style={{
                            transform: `translate(${mousePosition.x * 0.1}px, ${mousePosition.y * 0.1}px)`,
                            transition: 'transform 0.1s ease-out',
                        }}
                    >
                        404
                    </h1>

                    {/* 装饰性几何图形 */}
                    <div className="absolute -top-4 -right-4 w-16 h-16 border-2 border-blue-300 rounded-full animate-spin-slow opacity-60"></div>
                    <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-blue-200 rounded-lg rotate-45 animate-gentle-float"></div>
                </div>

                {/* 错误信息 */}
                <div className="space-y-6 animate-slide-up">
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light elegant-heading text-primary-charcoal">
                        页面未找到
                    </h2>

                    <p className="text-lg sm:text-xl elegant-body text-secondary-slate max-w-2xl mx-auto leading-relaxed">
                        抱歉，您访问的页面似乎不存在。这可能是一个错误的链接，或者页面已被移动。
                        <br />
                        <span className="text-accent-blue font-medium">
                            别担心，让我们一起探索更多精彩内容！
                        </span>
                    </p>

                    {/* 科技感描述 */}
                    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/80 shadow-lg max-w-lg mx-auto">
                        <p className="text-sm text-secondary-slate italic">
                            "在数字世界中，每一个404都是新的发现机会"
                        </p>
                        <div className="flex justify-center mt-4 space-x-2">
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                            <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                        </div>
                    </div>
                </div>

                {/* 操作按钮 */}
                <div className="mt-12 space-y-4 sm:space-y-0 sm:space-x-6 sm:flex sm:justify-center animate-gentle-fade-in">
                    <Link
                        href="/"
                        className="inline-flex items-center px-8 py-4 bg-linear-to-r from-blue-600 to-blue-500 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 group"
                    >
                        <svg
                            className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                            />
                        </svg>
                        返回主页
                    </Link>

                    <Link
                        href="/research"
                        className="inline-flex items-center px-8 py-4 border-2 border-blue-200 text-blue-700 font-medium rounded-xl hover:bg-blue-50 hover:border-blue-300 transform hover:-translate-y-1 transition-all duration-300 group"
                    >
                        <svg
                            className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                            />
                        </svg>
                        探索研究
                    </Link>
                </div>

                {/* 实验室特色提示 */}
                <div className="mt-16 text-center animate-gentle-fade-in">
                    <p className="text-sm text-secondary-slate mb-4">
                        或者，您可以：
                    </p>
                    <div className="flex flex-wrap justify-center gap-4 text-sm">
                        <Link
                            href="/team"
                            className="px-4 py-2 bg-white/40 backdrop-blur-sm rounded-lg border border-white/60 hover:bg-white/60 transition-all duration-300 text-secondary-slate hover:text-accent-blue"
                        >
                            👥 认识我们的团队
                        </Link>
                        <Link
                            href="/contact"
                            className="px-4 py-2 bg-white/40 backdrop-blur-sm rounded-lg border border-white/60 hover:bg-white/60 transition-all duration-300 text-secondary-slate hover:text-accent-blue"
                        >
                            📧 联系我们
                        </Link>
                        <Link
                            href="/teambuilding"
                            className="px-4 py-2 bg-white/40 backdrop-blur-sm rounded-lg border border-white/60 hover:bg-white/60 transition-all duration-300 text-secondary-slate hover:text-accent-blue"
                        >
                            🎉 查看团建活动
                        </Link>
                    </div>
                </div>
            </div>

            {/* 额外的装饰性元素 */}
            <div className="absolute top-1/4 left-1/4 w-32 h-32 border border-blue-200 rounded-full opacity-20 animate-gentle-float"></div>
            <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-blue-100 rounded-lg rotate-45 opacity-30 animate-subtle-scale"></div>
        </div>
    );
}
