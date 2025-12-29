'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode } from 'react';

// 页面过渡变体
const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.98
  },
  in: {
    opacity: 1,
    y: 0,
    scale: 1
  },
  out: {
    opacity: 0,
    y: -20,
    scale: 1.02
  }
};

// 页面过渡配置
const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.6
};

// 淡入淡出过渡
const fadeVariants = {
  initial: { opacity: 0 },
  in: { opacity: 1 },
  out: { opacity: 0 }
};

const fadeTransition = {
  duration: 0.4,
  ease: [0.4, 0, 0.2, 1]
};

// 滑动过渡
const slideVariants = {
  initial: { x: '100%', opacity: 0 },
  in: { x: 0, opacity: 1 },
  out: { x: '-100%', opacity: 0 }
};

const slideTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.5
};

// 缩放过渡
const scaleVariants = {
  initial: { scale: 0.8, opacity: 0 },
  in: { scale: 1, opacity: 1 },
  out: { scale: 1.1, opacity: 0 }
};

const scaleTransition = {
  type: 'tween',
  ease: [0.34, 1.56, 0.64, 1],
  duration: 0.7
};

// 旋转过渡
const rotateVariants = {
  initial: { rotate: -5, opacity: 0, scale: 0.9 },
  in: { rotate: 0, opacity: 1, scale: 1 },
  out: { rotate: 5, opacity: 0, scale: 1.1 }
};

const rotateTransition = {
  type: 'spring',
  stiffness: 100,
  damping: 20
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

// 列表项交错动画
export function StaggerContainer({
  children,
  staggerDelay = 0.1,
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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 12
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

// 悬停效果组件
export function HoverEffect({
  children,
  scale = 1.05,
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
        transition: { type: 'spring', stiffness: 300, damping: 20 }
      }}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.div>
  );
}

// 滚动触发动画组件
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
    up: { y: 50 },
    down: { y: -50 },
    left: { x: 50 },
    right: { x: -50 }
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
      viewport={{ once: true, margin: '-100px' }}
      transition={{
        duration: 0.6,
        delay: delay,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
