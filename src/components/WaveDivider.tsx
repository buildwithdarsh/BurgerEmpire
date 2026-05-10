'use client';

import { motion } from 'framer-motion';

interface WaveDividerProps {
  flip?: boolean;
  variant?: 'wave' | 'curve' | 'tilt';
  topColor: string;
  bottomColor: string;
  className?: string;
}

// Each variant has two similar path shapes to animate between
const PATH_PAIRS: Record<string, [string, string]> = {
  wave: [
    'M0,80 C320,140 680,20 1440,80 L1440,160 L0,160 Z',
    'M0,72 C320,132 680,28 1440,72 L1440,160 L0,160 Z',
  ],
  curve: [
    'M0,100 Q720,10 1440,100 L1440,160 L0,160 Z',
    'M0,92 Q720,18 1440,92 L1440,160 L0,160 Z',
  ],
  tilt: [
    'M0,120 C480,50 960,130 1440,60 L1440,160 L0,160 Z',
    'M0,112 C480,58 960,122 1440,68 L1440,160 L0,160 Z',
  ],
};

export default function WaveDivider({ flip = false, variant = 'wave', topColor, bottomColor, className = '' }: WaveDividerProps) {
  const [path1, path2] = PATH_PAIRS[variant];
  const fillColor = flip ? topColor : bottomColor;

  return (
    <div
      className={`w-full overflow-hidden leading-[0] -my-px ${className}`}
      style={{
        transform: flip ? 'rotate(180deg)' : undefined,
        backgroundColor: flip ? bottomColor : topColor,
      }}
    >
      <svg
        viewBox="0 0 1440 160"
        preserveAspectRatio="none"
        className="w-full h-[28px] md:h-[40px] block"
      >
        <motion.path
          d={path1}
          fill={fillColor}
          animate={{ d: [path1, path2, path1] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        />
      </svg>
    </div>
  );
}
