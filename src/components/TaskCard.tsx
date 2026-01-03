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
        return <CheckCircle2 className="w-4 h-4 text-primary" />;
      case 'processing':
        return (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          >
            <Loader2 className="w-4 h-4 text-foreground" />
          </motion.div>
        );
      default:
        return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = () => {
    switch (task.status) {
      case 'completed':
        return 'border-primary/30 bg-accent';
      case 'processing':
        return 'border-foreground/30 bg-secondary';
      default:
        return 'border-border bg-card';
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
        isActive && 'ring-2 ring-primary shadow-md'
      )}
    >
      {isActive && (
        <motion.div
          className="absolute -left-1 top-1/2 -translate-y-1/2 w-1 h-8 rounded-full bg-primary"
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
              task.status === 'completed' && 'bg-primary/20 text-primary',
              task.status === 'processing' && 'bg-foreground/10 text-foreground',
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
