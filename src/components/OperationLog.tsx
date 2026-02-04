import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDown, ArrowUp, Check } from 'lucide-react';
import { ProcessingStep } from '@/types';

interface OperationLogProps {
  history: ProcessingStep[];
  className?: string;
}

const OperationLog: React.FC<OperationLogProps> = ({ history, className = '' }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  const getOperationIcon = (type: string) => {
    switch (type) {
      case 'push':
        return <ArrowDown className="w-3 h-3 text-primary" />;
      case 'pop':
        return <ArrowUp className="w-3 h-3 text-warning" />;
      case 'complete':
        return <Check className="w-3 h-3 text-primary" />;
      default:
        return null;
    }
  };

  const getOperationColor = (type: string) => {
    switch (type) {
      case 'push':
        return 'text-primary';
      case 'pop':
        return 'text-warning';
      case 'complete':
        return 'text-primary font-semibold';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <div className={`glass-panel ${className}`}>
      <div className="p-3 border-b border-border">
        <h4 className="font-medium text-sm text-foreground flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          Real-time Log
        </h4>
      </div>
      
      <div 
        ref={scrollRef}
        className="console-log p-3 max-h-48 overflow-y-auto custom-scrollbar font-mono text-xs"
      >
        <AnimatePresence>
          {history.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className={`console-entry py-1.5 flex items-start gap-2 ${getOperationColor(step.type)}`}
            >
              <span className="text-muted-foreground opacity-60 flex-shrink-0">
                [{formatTime(step.timestamp)}]
              </span>
              <span className="flex-shrink-0">
                {getOperationIcon(step.type)}
              </span>
              <span className="uppercase font-semibold flex-shrink-0 w-16">
                {step.type}:
              </span>
              <span className="truncate">
                {step.task?.title || (step.type === 'complete' ? 'All tasks completed' : 'Processing...')}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {history.length === 0 && (
          <div className="text-muted-foreground text-center py-4">
            Waiting for operations...
          </div>
        )}
      </div>
    </div>
  );
};

export default OperationLog;
