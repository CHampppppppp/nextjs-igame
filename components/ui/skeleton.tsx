'use client';

import { motion } from 'framer-motion';

interface SkeletonProps {
  className?: string;
  animate?: boolean;
}

// 基础骨架屏组件
export function Skeleton({ className = '', animate = true }: SkeletonProps) {
  return (
    <div
      className={`bg-gray-200 rounded-md ${animate ? 'animate-pulse' : ''} ${className}`}
    />
  );
}

// 带动画的骨架屏
export function AnimatedSkeleton({ className = '' }: { className?: string }) {
  return (
    <motion.div
      className={`bg-gray-200 rounded-md ${className}`}
      animate={{
        opacity: [0.5, 1, 0.5],
        scale: [0.98, 1, 0.98]
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut'
      }}
    />
  );
}

// 卡片骨架屏
export function CardSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 space-y-4">
      {/* 图片占位 */}
      <AnimatedSkeleton className="aspect-square w-full rounded-xl" />

      {/* 标题占位 */}
      <div className="space-y-2">
        <AnimatedSkeleton className="h-6 w-3/4" />
        <AnimatedSkeleton className="h-4 w-1/2" />
      </div>

      {/* 内容占位 */}
      <div className="space-y-2">
        <AnimatedSkeleton className="h-4 w-full" />
        <AnimatedSkeleton className="h-4 w-5/6" />
        <AnimatedSkeleton className="h-4 w-4/6" />
      </div>

      {/* 按钮占位 */}
      <AnimatedSkeleton className="h-10 w-full rounded-lg" />
    </div>
  );
}

// 列表项骨架屏
export function ListItemSkeleton() {
  return (
    <div className="flex items-center space-x-4 py-4">
      {/* 头像占位 */}
      <AnimatedSkeleton className="w-12 h-12 rounded-full" />

      {/* 内容占位 */}
      <div className="flex-1 space-y-2">
        <AnimatedSkeleton className="h-4 w-1/4" />
        <AnimatedSkeleton className="h-4 w-3/4" />
      </div>

      {/* 右侧元素占位 */}
      <AnimatedSkeleton className="w-16 h-6 rounded-full" />
    </div>
  );
}

// 文本骨架屏
export function TextSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }, (_, i) => (
        <AnimatedSkeleton
          key={i}
          className={`h-4 ${i === lines - 1 ? 'w-3/4' : 'w-full'}`}
        />
      ))}
    </div>
  );
}

// 表格骨架屏
export function TableSkeleton({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div className="space-y-4">
      {/* 表头 */}
      <div className="flex space-x-4">
        {Array.from({ length: columns }, (_, i) => (
          <AnimatedSkeleton key={i} className="h-6 flex-1" />
        ))}
      </div>

      {/* 表格行 */}
      {Array.from({ length: rows }, (_, rowIndex) => (
        <div key={rowIndex} className="flex space-x-4">
          {Array.from({ length: columns }, (_, colIndex) => (
            <AnimatedSkeleton
              key={colIndex}
              className={`h-4 ${colIndex === 0 ? 'w-1/3' : 'flex-1'}`}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

// 页面骨架屏
export function PageSkeleton() {
  return (
    <div className="space-y-8">
      {/* 页面标题 */}
      <div className="text-center space-y-4">
        <AnimatedSkeleton className="h-12 w-1/3 mx-auto" />
        <AnimatedSkeleton className="h-6 w-1/2 mx-auto" />
      </div>

      {/* 主要内容 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }, (_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>

      {/* 次要内容 */}
      <div className="space-y-4">
        <AnimatedSkeleton className="h-8 w-1/4" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            {Array.from({ length: 4 }, (_, i) => (
              <ListItemSkeleton key={i} />
            ))}
          </div>
          <div className="space-y-4">
            {Array.from({ length: 4 }, (_, i) => (
              <ListItemSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// 自定义骨架屏生成器
export function SkeletonGenerator({
  template,
  count = 1,
  className = ''
}: {
  template: React.ComponentType;
  count?: number;
  className?: string;
}) {
  return (
    <div className={className}>
      {Array.from({ length: count }, (_, i) => (
        <div key={i}>
          {React.createElement(template)}
        </div>
      ))}
    </div>
  );
}

// 渐变骨架屏
export function GradientSkeleton({ className = '' }: { className?: string }) {
  return (
    <motion.div
      className={`bg-linear-to-r from-gray-200 via-gray-100 to-gray-200 rounded-md ${className}`}
      animate={{
        backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: 'linear'
      }}
      style={{
        backgroundSize: '200% 100%'
      }}
    />
  );
}
