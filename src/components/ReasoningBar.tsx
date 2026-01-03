import React from 'react';
import { motion } from 'framer-motion';
import { Brain } from 'lucide-react';

interface ReasoningBarProps {
  progress: number;
  currentThinking: string;
  isActive: boolean;
}

const ReasoningBar: React.FC<ReasoningBarProps> = ({ progress, currentThinking, isActive }) => {
  return (
    <div className="glass-panel p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <motion.div
            animate={isActive ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <Brain className="w-5 h-5 text-primary" />
          </motion.div>
          <span className="font-medium text-sm text-foreground">Reasoning Progress</span>
        </div>
        <span className="text-sm font-mono text-muted-foreground">
          {Math.round(progress)}%
        </span>
      </div>

      {/* Progress bar */}
      <div className="reasoning-bar">
        <motion.div
          className="reasoning-bar-fill"
          initial={{ width: '0%' }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>

      {/* Current thinking */}
      {currentThinking && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-2"
        >
          <motion.span
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="inline-block w-2 h-2 rounded-full bg-primary"
          />
          <span className="text-sm text-muted-foreground font-mono truncate">
            {currentThinking}
          </span>
        </motion.div>
      )}
    </div>
  );
};

export default ReasoningBar;
