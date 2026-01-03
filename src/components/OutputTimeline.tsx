import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Task } from '@/types';
import TaskCard from './TaskCard';
import { staggerContainer } from '@/lib/animations';

interface OutputTimelineProps {
  completedTasks: Task[];
}

const OutputTimeline: React.FC<OutputTimelineProps> = ({ completedTasks }) => {
  if (completedTasks.length === 0) {
    return (
      <div className="glass-panel p-6 text-center">
        <p className="text-muted-foreground text-sm">
          Completed tasks will appear here...
        </p>
      </div>
    );
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="space-y-3"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground">Completed Tasks</h3>
        <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-1 rounded">
          {completedTasks.length} done
        </span>
      </div>

      <div className="space-y-2 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
        <AnimatePresence mode="popLayout">
          {completedTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              showResult
            />
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default OutputTimeline;
