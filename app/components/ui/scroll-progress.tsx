'use client';

import { motion, useScroll, useSpring } from 'framer-motion';

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 60,  // 降低刚度，使动画更柔和
    damping: 25,    // 调整阻尼，减少振荡
    restDelta: 0.001
  });

  return (
    <motion.div
  className="fixed top-0 left-0 right-0 h-1 bg-linear-to-r from-blue-500 via-blue-500 to-green-500 z-50 origin-left"
      style={{ scaleX }}
    />
  );
}

// 圆形进度指示器
export function CircularScrollProgress() {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 60,  // 降低刚度
    damping: 25,    // 调整阻尼
    restDelta: 0.001
  });

  return (
    <motion.div
      className="fixed bottom-8 right-8 z-40"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1 }}
    >
      <div className="relative w-16 h-16">
        {/* 背景圆环 */}
        <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="8"
            fill="none"
          />
          <motion.circle
            cx="50"
            cy="50"
            r="45"
            stroke="url(#gradient)"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            style={{
              pathLength: progress
            }}
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2563eb" />
              <stop offset="50%" stopColor="#7c3aed" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
          </defs>
        </svg>

        {/* 进度文本 */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span
            className="text-xs font-bold text-white"
            style={{
              opacity: progress
            }}
          >
            {Math.round(progress.get() * 100)}%
          </motion.span>
        </div>
      </div>
    </motion.div>
  );
}

// 回到顶部按钮
export function BackToTopButton() {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 60,  // 降低刚度
    damping: 25,    // 调整阻尼
    restDelta: 0.001
  });

  const scrollToTop = () => {
    // 使用更平滑和稳定的滚动动画
    const scrollDuration = 800; // 稍微缩短滚动时间
    const scrollStep = -window.scrollY / (scrollDuration / 16); // 更小的步长
    let startTime: number | null = null;

    const smoothScroll = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / scrollDuration, 1);

      // 使用缓动函数使动画更自然
      const easeInOutCubic = (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      const easedProgress = easeInOutCubic(progress);

      window.scrollTo(0, window.scrollY * (1 - easedProgress));

      if (progress < 1) {
        requestAnimationFrame(smoothScroll);
      }
    };

    requestAnimationFrame(smoothScroll);
  };

  return (
    <motion.button
      className="fixed bottom-8 left-8 z-40 w-12 h-12 bg-linear-to-br from-blue-500 to-blue-600 rounded-full shadow-lg flex items-center justify-center text-white hover:shadow-xl transition-shadow"
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: progress.get() > 0.1 ? 1 : 0,
        scale: progress.get() > 0.1 ? 1 : 0
      }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={scrollToTop}
    >
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 10l7-7m0 0l7 7m-7-7v18"
        />
      </svg>
    </motion.button>
  );
}
