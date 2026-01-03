import React from 'react';
import { motion, useMotionValue, useMotionTemplate, useAnimationFrame } from 'framer-motion';

interface GridPatternProps {
  offsetX: any;
  offsetY: any;
  size: number;
}

const GridPattern: React.FC<GridPatternProps> = ({ offsetX, offsetY, size }) => {
  return (
    <svg className="w-full h-full">
      <defs>
        <motion.pattern
          id="grid-pattern"
          width={size}
          height={size}
          patternUnits="userSpaceOnUse"
          x={offsetX}
          y={offsetY}
        >
          <path
            d={`M ${size} 0 L 0 0 0 ${size}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            className="text-muted-foreground"
          />
        </motion.pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid-pattern)" />
    </svg>
  );
};

interface InfiniteGridProps {
  children: React.ReactNode;
  gridSize?: number;
}

const InfiniteGrid: React.FC<InfiniteGridProps> = ({ children, gridSize = 40 }) => {
  const containerRef = React.useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top } = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - left);
    mouseY.set(e.clientY - top);
  };

  const gridOffsetX = useMotionValue(0);
  const gridOffsetY = useMotionValue(0);

  const speedX = 0.3;
  const speedY = 0.3;

  useAnimationFrame(() => {
    const currentX = gridOffsetX.get();
    const currentY = gridOffsetY.get();
    gridOffsetX.set((currentX + speedX) % gridSize);
    gridOffsetY.set((currentY + speedY) % gridSize);
  });

  const maskImage = useMotionTemplate`radial-gradient(400px circle at ${mouseX}px ${mouseY}px, black, transparent)`;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative w-full min-h-screen flex flex-col overflow-hidden bg-background"
    >
      {/* Layer 1: Subtle background grid */}
      <div className="absolute inset-0 z-0 opacity-[0.03]">
        <GridPattern offsetX={gridOffsetX} offsetY={gridOffsetY} size={gridSize} />
      </div>

      {/* Layer 2: Highlighted grid (revealed by mouse) */}
      <motion.div
        className="absolute inset-0 z-0 opacity-30"
        style={{ maskImage, WebkitMaskImage: maskImage }}
      >
        <GridPattern offsetX={gridOffsetX} offsetY={gridOffsetY} size={gridSize} />
      </motion.div>

      {/* Decorative blur spheres */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute right-[-15%] top-[-15%] w-[35%] h-[35%] rounded-full bg-neon-orange/20 blur-[120px]" />
        <div className="absolute right-[15%] top-[5%] w-[20%] h-[20%] rounded-full bg-primary/25 blur-[100px]" />
        <div className="absolute left-[-10%] bottom-[-15%] w-[35%] h-[35%] rounded-full bg-neon-cyan/15 blur-[120px]" />
        <div className="absolute left-[30%] bottom-[20%] w-[15%] h-[15%] rounded-full bg-neon-purple/20 blur-[80px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1">
        {children}
      </div>
    </div>
  );
};

export default InfiniteGrid;
