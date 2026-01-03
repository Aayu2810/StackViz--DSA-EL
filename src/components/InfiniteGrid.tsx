import React from 'react';
import { motion } from 'framer-motion';

interface GridPatternProps {
  size: number;
}

const GridPattern: React.FC<GridPatternProps> = ({ size }) => {
  return (
    <svg className="w-full h-full">
      <defs>
        <pattern
          id="grid-pattern"
          width={size}
          height={size}
          patternUnits="userSpaceOnUse"
        >
          <path
            d={`M ${size} 0 L 0 0 0 ${size}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            className="text-border"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid-pattern)" />
    </svg>
  );
};

interface InfiniteGridProps {
  children: React.ReactNode;
  gridSize?: number;
}

const InfiniteGrid: React.FC<InfiniteGridProps> = ({ children, gridSize = 50 }) => {
  return (
    <div className="relative w-full min-h-screen flex flex-col overflow-hidden bg-background">
      {/* Subtle grid background */}
      <div className="absolute inset-0 z-0 opacity-40">
        <GridPattern size={gridSize} />
      </div>

      {/* Decorative subtle gradients */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute right-[-10%] top-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[100px]" />
        <div className="absolute left-[-10%] bottom-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[100px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1">
        {children}
      </div>
    </div>
  );
};

export default InfiniteGrid;
