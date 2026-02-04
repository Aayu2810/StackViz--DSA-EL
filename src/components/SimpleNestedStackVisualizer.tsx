import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface NestedTask {
  id: string;
  title: string;
  depth: number;
  children: NestedTask[];
  status: 'pending' | 'processing' | 'completed';
}

interface SimpleNestedStackVisualizerProps {
  tasks: NestedTask[];
  currentDepth: number;
  isProcessing: boolean;
}

const SimpleNestedStackVisualizer: React.FC<SimpleNestedStackVisualizerProps> = ({
  tasks,
  currentDepth,
  isProcessing
}) => {
  const getStatusColor = (status: NestedTask['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'processing':
        return 'bg-blue-500';
      default:
        return 'bg-gray-400';
    }
  };

  const getDepthColor = (depth: number) => {
    const colors = [
      'border-emerald-500',
      'border-blue-500', 
      'border-purple-500',
      'border-pink-500',
      'border-orange-500'
    ];
    return colors[depth % colors.length];
  };

  const renderTask = (task: NestedTask, depth: number = 0) => {
    const isActive = depth === currentDepth && isProcessing;
    const marginLeft = depth * 24;
    
    return (
      <div key={task.id} className="relative">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ 
            opacity: 1, 
            x: 0,
            scale: isActive ? 1.02 : 1
          }}
          transition={{ duration: 0.3, delay: depth * 0.1 }}
          className={`
            relative flex items-center gap-3 p-4 mb-2 rounded-lg border-2
            ${getDepthColor(depth)}
            ${isActive ? 'shadow-lg shadow-blue-500/25' : 'shadow-md'}
            bg-white dark:bg-gray-800
            transition-all duration-300
          `}
          style={{ marginLeft }}
        >
          {/* Status indicator */}
          <div className={`
            w-3 h-3 rounded-full
            ${getStatusColor(task.status)}
            ${task.status === 'processing' ? 'animate-pulse' : ''}
         `} />
          
          {/* Task title */}
          <div className="flex-1">
            <h3 className="font-medium text-gray-900 dark:text-white">
              {task.title}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Depth: {depth}
            </p>
          </div>

          {/* Active indicator */}
          {isActive && (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full"
            />
          )}
        </motion.div>

        {/* Render children */}
        <AnimatePresence>
          {task.children.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              {task.children.map(child => renderTask(child, depth + 1))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Nested Stack Visualizer
        </h2>
        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-400 rounded-full" />
            <span>Pending</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
            <span>Processing</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full" />
            <span>Completed</span>
          </div>
        </div>
      </div>

      <div className="relative">
        {/* Connection lines */}
        <div className="absolute left-0 top-0 bottom-0 w-px bg-gray-300 dark:bg-gray-600" />
        
        {/* Stack visualization */}
        <div className="space-y-2">
          {tasks.map(task => renderTask(task))}
        </div>
      </div>

      {/* Current depth indicator */}
      <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Current Depth: <span className="font-bold">{currentDepth}</span>
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Status: <span className="font-bold">{isProcessing ? 'Processing' : 'Idle'}</span>
        </p>
      </div>
    </div>
  );
};

export default SimpleNestedStackVisualizer;
