import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Loader2, Clock } from 'lucide-react';
import { Task } from '@/types';
import { cn } from '@/lib/utils';

interface TaskCardProps {
  task: Task;
  isActive?: boolean;
  showResult?: boolean;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, isActive = false, showResult = false }) => {
  const getStatusIcon = () => {
    switch (task.status) {
      case 'completed':
        return <CheckCircle2 className="w-4 h-4 text-neon-green" />;
      case 'processing':
        return (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          >
            <Loader2 className="w-4 h-4 text-neon-cyan" />
          </motion.div>
        );
      default:
        return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = () => {
    switch (task.status) {
      case 'completed':
        return 'border-neon-green/30 bg-neon-green/5';
      case 'processing':
        return 'border-neon-cyan/50 bg-neon-cyan/10';
      default:
        return 'border-border bg-card/50';
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className={cn(
        'relative p-4 rounded-lg border transition-all duration-300',
        getStatusColor(),
        isActive && 'ring-2 ring-neon-cyan/50 shadow-lg shadow-neon-cyan/10'
      )}
    >
      {/* Active indicator */}
      {isActive && (
        <motion.div
          className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-8 rounded-full bg-neon-cyan"
          layoutId="activeIndicator"
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        />
      )}

      <div className="flex items-start gap-3">
        <div className="mt-0.5">{getStatusIcon()}</div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-muted-foreground">
              #{task.order + 1}
            </span>
            <span className={cn(
              'text-xs px-2 py-0.5 rounded-full font-medium',
              task.status === 'completed' && 'bg-neon-green/20 text-neon-green',
              task.status === 'processing' && 'bg-neon-cyan/20 text-neon-cyan',
              task.status === 'pending' && 'bg-muted text-muted-foreground'
            )}>
              {task.status}
            </span>
          </div>
          
          <h4 className="font-medium text-foreground truncate">
            {task.title}
          </h4>
          
          {showResult && task.result && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-2 text-sm text-muted-foreground"
            >
              {task.result}
            </motion.p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default TaskCard;
