'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode } from 'react';

// 页面过渡变体 - 更微妙的动画
const pageVariants = {
  initial: {
    opacity: 0,
    y: 6,    // 减少移动距离
    scale: 0.995  // 减少缩放变化
  },
  in: {
    opacity: 1,
    y: 0,
    scale: 1
  },
  out: {
    opacity: 0,
    y: -6,   // 减少移动距离
    scale: 1.005  // 减少缩放变化
  }
};

// 页面过渡配置 - 稍微延长以获得更丝滑的效果
const pageTransition = {
  type: 'tween' as const,
  ease: [0.4, 0, 0.2, 1] as const,
  duration: 0.5  // 缩短持续时间
};

// 淡入淡出过渡
const fadeVariants = {
  initial: { opacity: 0 },
  in: { opacity: 1 },
  out: { opacity: 0 }
};

const fadeTransition = {
  duration: 0.4,
  ease: [0.4, 0, 0.2, 1] as const
} as const;

// 滑动过渡 - 更微妙
const slideVariants = {
  initial: { x: 20, opacity: 0 },  // 使用固定值而不是百分比
  in: { x: 0, opacity: 1 },
  out: { x: -20, opacity: 0 }
};

const slideTransition = {
  type: 'tween' as const,
  ease: [0.4, 0, 0.2, 1] as const,
  duration: 0.4  // 缩短持续时间
};

// 缩放过渡 - 更微妙
const scaleVariants = {
  initial: { scale: 0.98, opacity: 0 },  // 减少缩放幅度
  in: { scale: 1, opacity: 1 },
  out: { scale: 1.02, opacity: 0 }
};

const scaleTransition = {
  type: 'tween' as const,
  ease: [0.25, 0.46, 0.45, 0.94] as const,  // 更平滑的缓动
  duration: 0.6
};

// 旋转过渡 - 更微妙
const rotateVariants = {
  initial: { rotate: -1, opacity: 0, scale: 0.99 },  // 减少旋转角度
  in: { rotate: 0, opacity: 1, scale: 1 },
  out: { rotate: 1, opacity: 0, scale: 1.01 }
};

const rotateTransition = {
  type: 'spring' as const,
  stiffness: 80,  // 降低刚度
  damping: 18    // 调整阻尼
};

interface PageTransitionProps {
  children: ReactNode;
  mode?: 'fade' | 'slide' | 'scale' | 'rotate' | 'default';
  className?: string;
}

export default function PageTransition({
  children,
  mode = 'default',
  className = ''
}: PageTransitionProps) {
  let variants;
  let transition;

  switch (mode) {
    case 'fade':
      variants = fadeVariants;
      transition = fadeTransition;
      break;
    case 'slide':
      variants = slideVariants;
      transition = slideTransition;
      break;
    case 'scale':
      variants = scaleVariants;
      transition = scaleTransition;
      break;
    case 'rotate':
      variants = rotateVariants;
      transition = rotateTransition;
      break;
    default:
      variants = pageVariants;
      transition = pageTransition;
  }

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={variants}
      transition={transition}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// 布局过渡组件
export function LayoutTransition({
  children,
  mode = 'fade'
}: {
  children: ReactNode;
  mode?: 'fade' | 'slide' | 'scale' | 'rotate';
}) {
  return (
    <AnimatePresence mode="wait">
      <PageTransition mode={mode}>
        {children}
      </PageTransition>
    </AnimatePresence>
  );
}

// 内容过渡组件（用于页面内部内容）
export function ContentTransition({
  children,
  delay = 0,
  direction = 'up'
}: {
  children: ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
}) {
  const directionVariants = {
    up: { y: 30 },
    down: { y: -30 },
    left: { x: 30 },
    right: { x: -30 }
  };

  return (
    <motion.div
      initial={{
        opacity: 0,
        ...directionVariants[direction]
      }}
      animate={{
        opacity: 1,
        x: 0,
        y: 0
      }}
      transition={{
        duration: 0.6,
        delay: delay,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
    >
      {children}
    </motion.div>
  );
}

// 列表项交错动画 - 更微妙的版本
export function StaggerContainer({
  children,
  staggerDelay = 0.08,  // 稍微减少延迟
  className = ''
}: {
  children: ReactNode;
  staggerDelay?: number;
  className?: string;
}) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 6 },  // 减少移动距离
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring' as const,
        stiffness: 80,   // 降低刚度
        damping: 15     // 调整阻尼
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={className}
    >
      {Array.isArray(children)
        ? children.map((child, index) => (
            <motion.div key={index} variants={itemVariants}>
              {child}
            </motion.div>
          ))
        : children
      }
    </motion.div>
  );
}

// 悬停效果组件 - 简约版
export function HoverEffect({
  children,
  scale = 1.01,
  className = ''
}: {
  children: ReactNode;
  scale?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      whileHover={{
        scale: scale,
        transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
      }}
    >
      {children}
    </motion.div>
  );
}

// 微妙滚动动画组件 - 提供稳定的视觉反馈
export function SubtleScrollAnimation({
  children,
  className = '',
  intensity = 'low'
}: {
  children: ReactNode;
  className?: string;
  intensity?: 'low' | 'medium' | 'high';
}) {
  const intensitySettings = {
    low: { scale: 1.005, rotate: 0.2 },
    medium: { scale: 1.01, rotate: 0.5 },
    high: { scale: 1.02, rotate: 1 }
  };

  const settings = intensitySettings[intensity];

  return (
    <motion.div
      className={`scroll-reveal-subtle ${className}`}
      initial={{ opacity: 0, y: 8 }}
      whileInView={{
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.5,
          ease: [0.25, 0.46, 0.45, 0.94]
        }
      }}
      whileHover={{
        scale: settings.scale,
        rotate: settings.rotate,
        transition: { duration: 0.3 }
      }}
      viewport={{ once: true, margin: '-20px' }}
    >
      {children}
    </motion.div>
  );
}

// 平稳变换组件 - 用于背景元素
export function SteadyTransform({
  children,
  className = '',
  transformType = 'float'
}: {
  children: ReactNode;
  className?: string;
  transformType?: 'float' | 'pulse' | 'glow';
}) {
  const animations = {
    float: {
      y: [0, -2, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: 'easeInOut' as const
      }
    },
    pulse: {
      scale: [1, 1.02, 1],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut' as const
      }
    },
    glow: {
      boxShadow: [
        '0 0 0 rgba(37, 99, 235, 0)',
        '0 0 8px rgba(37, 99, 235, 0.1)',
        '0 0 0 rgba(37, 99, 235, 0)'
      ],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut' as const
      }
    }
  };

  return (
    <motion.div
      className={className}
      animate={animations[transformType]}
    >
      {children}
    </motion.div>
  );
}

// 滚动触发动画组件 - 更微妙的版本
export function ScrollReveal({
  children,
  direction = 'up',
  delay = 0,
  className = ''
}: {
  children: ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right';
  delay?: number;
  className?: string;
}) {
  const directionVariants = {
    up: { y: 12 },    // 减少移动距离
    down: { y: -12 },
    left: { x: 12 },
    right: { x: -12 }
  };

  return (
    <motion.div
      initial={{
        opacity: 0,
        ...directionVariants[direction]
      }}
      whileInView={{
        opacity: 1,
        x: 0,
        y: 0
      }}
      viewport={{ once: true, margin: '-30px' }}  // 减少视口边距
      transition={{
        duration: 0.6,  // 缩短持续时间
        delay: delay,
        ease: [0.25, 0.46, 0.45, 0.94]  // 更平滑的缓动
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
