import React from 'react';
import { motion } from 'motion/react';

interface AeroXLogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const AeroXLogo: React.FC<AeroXLogoProps> = ({ size = 'md', className = '' }) => {
  const sizeMap = {
    sm: { box: 'w-6 h-6 rounded-md', svg: 'w-3.5 h-3.5' },
    md: { box: 'w-7 h-7 rounded-lg', svg: 'w-4 h-4' },
    lg: { box: 'w-8 h-8 rounded-lg', svg: 'w-4.5 h-4.5' },
  }[size];

  return (
    <div
      className={`relative ${sizeMap.box} bg-zinc-900 border border-white/10 flex items-center justify-center flex-shrink-0 transition-colors group-hover:border-white/20 group-hover:bg-zinc-800/80 ${className}`}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${sizeMap.svg} text-white`}
      >
        {/* Left aerodynamic audio blade */}
        <path
          d="M 4 5.5 L 10.5 12 L 4 18.5"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Right aerodynamic audio blade */}
        <path
          d="M 20 5.5 L 13.5 12 L 20 18.5"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Minimal soundwave pulse at center */}
        <motion.line
          x1="12"
          y1="8"
          x2="12"
          y2="16"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          animate={{
            y1: [9.5, 7, 9.5],
            y2: [14.5, 17, 14.5],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </svg>
    </div>
  );
};
