// Reusable Framer Motion animation variants

import { Variants, Transition } from 'framer-motion';

// Spring transitions
export const springTransition: Transition = {
  type: 'spring',
  stiffness: 400,
  damping: 25,
};

export const bouncySpring: Transition = {
  type: 'spring',
  stiffness: 300,
  damping: 15,
};

export const smoothSpring: Transition = {
  type: 'spring',
  stiffness: 200,
  damping: 30,
};

// Fade animations
export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export const fadeInUp: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export const fadeInDown: Variants = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
};

export const fadeInLeft: Variants = {
  initial: { opacity: 0, x: -30 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 30 },
};

export const fadeInRight: Variants = {
  initial: { opacity: 0, x: 30 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -30 },
};

// Scale animations
export const scaleIn: Variants = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.8 },
};

export const scaleInBounce: Variants = {
  initial: { opacity: 0, scale: 0.5 },
  animate: { 
    opacity: 1, 
    scale: 1,
    transition: bouncySpring,
  },
  exit: { opacity: 0, scale: 0.5 },
};

// Stack animations
export const stackPush: Variants = {
  initial: { 
    opacity: 0, 
    y: -50, 
    scale: 0.8,
    rotateX: -15,
  },
  animate: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    rotateX: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 20,
    },
  },
  exit: { 
    opacity: 0, 
    y: -30, 
    scale: 0.9,
    transition: { duration: 0.2 },
  },
};

export const stackPop: Variants = {
  initial: { opacity: 1, y: 0, scale: 1 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { 
    opacity: 0, 
    y: 50, 
    scale: 0.8,
    rotateX: 15,
    transition: {
      type: 'spring',
      stiffness: 200,
      damping: 25,
    },
  },
};

// Stagger container
export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
  exit: {
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
};

export const staggerContainerFast: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.05,
    },
  },
};

// Hero section animations
export const heroTitle: Variants = {
  initial: { opacity: 0, y: 30 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

export const heroSubtitle: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6,
      delay: 0.2,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

export const heroCTA: Variants = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { 
    opacity: 1, 
    scale: 1,
    transition: {
      duration: 0.5,
      delay: 0.4,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

// Card hover effects
export const cardHover = {
  rest: { 
    scale: 1,
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
  },
  hover: { 
    scale: 1.02,
    boxShadow: '0 8px 40px rgba(139, 92, 246, 0.2)',
    transition: springTransition,
  },
  tap: { 
    scale: 0.98,
    transition: { duration: 0.1 },
  },
};

// Button hover effects
export const buttonHover = {
  rest: { scale: 1 },
  hover: { 
    scale: 1.05,
    transition: springTransition,
  },
  tap: { 
    scale: 0.95,
    transition: { duration: 0.1 },
  },
};

// Pulse glow animation
export const pulseGlow: Variants = {
  initial: { boxShadow: '0 0 20px rgba(139, 92, 246, 0.3)' },
  animate: {
    boxShadow: [
      '0 0 20px rgba(139, 92, 246, 0.3)',
      '0 0 40px rgba(139, 92, 246, 0.6)',
      '0 0 20px rgba(139, 92, 246, 0.3)',
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

// Typing effect helper
export const typewriter = (text: string, duration: number = 2): Variants => ({
  initial: { width: '0%' },
  animate: {
    width: '100%',
    transition: {
      duration,
      ease: 'linear',
    },
  },
});

// Progress bar
export const progressBar = (progress: number): Variants => ({
  initial: { width: '0%' },
  animate: {
    width: `${progress}%`,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
});

// Particle burst (for completion effects)
export const particleBurst: Variants = {
  initial: { scale: 0, opacity: 1 },
  animate: {
    scale: [0, 1.5, 2],
    opacity: [1, 0.5, 0],
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};

// Shimmer effect
export const shimmer: Variants = {
  initial: { backgroundPosition: '-200% 0' },
  animate: {
    backgroundPosition: ['200% 0'],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'linear',
    },
  },
};

// Floating animation
export const floating: Variants = {
  initial: { y: 0 },
  animate: {
    y: [-10, 10, -10],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};
