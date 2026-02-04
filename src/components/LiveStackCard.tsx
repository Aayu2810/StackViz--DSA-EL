import React from 'react';
import { motion } from 'framer-motion';
import { Check, Loader2, Clock } from 'lucide-react';
import { Task } from '@/types';

interface LiveStackCardProps {
  task: Task;
  index: number;
  isActive: boolean;
  isTopOfStack: boolean;
}

const LiveStackCard: React.FC<LiveStackCardProps> = ({ 
  task, 
  index, 
  isActive,
  isTopOfStack 
}) => {
  const getStatusIcon = () => {
    switch (task.status) {
      case 'completed':
        return <Check className="w-4 h-4 text-primary" />;
      case 'processing':
        return <Loader2 className="w-4 h-4 text-primary animate-spin" />;
      default:
        return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = () => {
    switch (task.status) {
      case 'completed':
        return 'border-primary/50 bg-accent';
      case 'processing':
        return 'border-primary bg-accent shadow-lg';
      default:
        return 'border-border bg-card';
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -50, scale: 0.9 }}
      animate={{ 
        opacity: 1, 
        x: 0, 
        scale: 1,
        y: isActive ? -4 : 0,
      }}
      exit={{ opacity: 0, x: 100, scale: 0.9 }}
      transition={{ 
        type: 'spring', 
        stiffness: 300, 
        damping: 25,
        delay: index * 0.05
      }}
      className={`
        relative p-4 rounded-xl border-2 transition-all duration-300
        ${getStatusColor()}
        ${isActive ? 'accent-glow' : ''}
      `}
    >
      {/* Step number badge */}
      <div className={`
        absolute -left-3 top-1/2 -translate-y-1/2 
        w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
        ${task.status === 'completed' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}
      `}>
        {index + 1}
      </div>

      <div className="flex items-start gap-3 ml-2">
        <div className="mt-1">
          {getStatusIcon()}
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-foreground text-sm line-clamp-1">
            {task.title}
          </h4>
          {task.description && (
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
              {task.description}
            </p>
          )}
        </div>

        {/* Status indicator */}
        <div className={`
          flex-shrink-0 text-xs font-medium px-2 py-1 rounded-full
          ${task.status === 'completed' ? 'bg-primary/10 text-primary' : 
            task.status === 'processing' ? 'bg-primary/20 text-primary' : 
            'bg-muted text-muted-foreground'}
        `}>
          {task.status === 'completed' ? '✓ Done' : 
           task.status === 'processing' ? 'Processing...' : 
           'Pending'}
        </div>
      </div>

      {/* Active indicator line */}
      {isActive && (
        <motion.div
          layoutId="activeIndicator"
          className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-l-xl"
        />
      )}
    </motion.div>
  );
};

export default LiveStackCard;
