'use client';

import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
  className?: string;
}

export default function LoadingSpinner({
  size = 'md',
  color = '#2563eb',
  className = ''
}: LoadingSpinnerProps) {
  const sizeMap = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <motion.div
        className={`${sizeMap[size]} border-4 border-transparent rounded-full`}
        style={{
          borderTopColor: color,
          borderRightColor: color
        }}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: 'linear'
        }}
      />
    </div>
  );
}

// 脉冲加载器
export function PulseLoader({ color = '#2563eb', className = '' }: { color?: string; className?: string }) {
  return (
    <div className={`flex space-x-2 ${className}`}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: color }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [1, 0.5, 1]
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: i * 0.2
          }}
        />
      ))}
    </div>
  );
}

// 波浪加载器
export function WaveLoader({ color = '#2563eb', className = '' }: { color?: string; className?: string }) {
  return (
    <div className={`flex items-end space-x-1 ${className}`}>
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.div
          key={i}
          className="w-1 rounded-full"
          style={{ backgroundColor: color }}
          animate={{
            height: ['8px', '24px', '8px']
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: i * 0.1
          }}
        />
      ))}
    </div>
  );
}

// 环形进度加载器
export function CircularProgress({
  progress = 0,
  size = 60,
  strokeWidth = 4,
  color = '#2563eb',
  className = ''
}: {
  progress?: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  className?: string;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = `${circumference} ${circumference}`;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className={`relative ${className}`}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* 背景圆环 */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(0, 0, 0, 0.1)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* 进度圆环 */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={strokeDasharray}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-medium">{Math.round(progress)}%</span>
      </div>
    </div>
  );
}

// 全屏加载遮罩
export function LoadingOverlay({
  isLoading = true,
  children,
  spinnerSize = 'lg',
  message = '加载中...'
}: {
  isLoading?: boolean;
  children?: React.ReactNode;
  spinnerSize?: 'sm' | 'md' | 'lg' | 'xl';
  message?: string;
}) {
  if (!isLoading) return <>{children}</>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl p-8 shadow-2xl text-center"
      >
        <LoadingSpinner size={spinnerSize} className="mb-4" />
        <p className="text-gray-600 font-medium">{message}</p>
      </motion.div>
    </motion.div>
  );
}
