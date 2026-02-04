import React, { useState, useEffect } from 'react';
import SimpleNestedStackVisualizer from './SimpleNestedStackVisualizer';

interface NestedTask {
  id: string;
  title: string;
  depth: number;
  children: NestedTask[];
  status: 'pending' | 'processing' | 'completed';
}

const SimpleNestedStackDemo: React.FC = () => {
  const [currentDepth, setCurrentDepth] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [tasks, setTasks] = useState<NestedTask[]>([]);

  const sampleTasks: NestedTask = {
    id: '1',
    title: 'Main Problem: Calculate Factorial',
    depth: 0,
    status: 'completed',
    children: [
      {
        id: '2',
        title: 'Step 1: Validate Input',
        depth: 1,
        status: 'completed',
        children: [
          {
            id: '3',
            title: 'Check if number is non-negative',
            depth: 2,
            status: 'completed',
            children: []
          },
          {
            id: '4',
            title: 'Check if number is integer',
            depth: 2,
            status: 'completed',
            children: []
          }
        ]
      },
      {
        id: '5',
        title: 'Step 2: Handle Base Case',
        depth: 1,
        status: 'completed',
        children: [
          {
            id: '6',
            title: 'Return 1 if n <= 1',
            depth: 2,
            status: 'completed',
            children: []
          }
        ]
      },
      {
        id: '7',
        title: 'Step 3: Recursive Calculation',
        depth: 1,
        status: 'processing',
        children: [
          {
            id: '8',
            title: 'Calculate factorial(n-1)',
            depth: 2,
            status: 'pending',
            children: []
          },
          {
            id: '9',
            title: 'Multiply by n',
            depth: 2,
            status: 'pending',
            children: []
          }
        ]
      }
    ]
  };

  useEffect(() => {
    setTasks([sampleTasks]);
  }, []);

  const simulateProcessing = () => {
    setIsProcessing(true);
    setCurrentDepth(0);
    
    const depths = [0, 1, 2, 1, 2, 1, 2, 1];
    let index = 0;
    
    const interval = setInterval(() => {
      if (index < depths.length) {
        setCurrentDepth(depths[index]);
        index++;
      } else {
        setIsProcessing(false);
        clearInterval(interval);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Simple Nested Stack Visualizer Demo
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            A clean, simple visualization of nested task execution with depth tracking.
          </p>
          
          <div className="flex gap-4 mb-6">
            <button
              onClick={simulateProcessing}
              disabled={isProcessing}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {isProcessing ? 'Processing...' : 'Start Simulation'}
            </button>
            
            <button
              onClick={() => {
                setCurrentDepth(0);
                setIsProcessing(false);
              }}
              className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Reset
            </button>
          </div>
        </div>

        <SimpleNestedStackVisualizer
          tasks={tasks}
          currentDepth={currentDepth}
          isProcessing={isProcessing}
        />
      </div>
    </div>
  );
};

export default SimpleNestedStackDemo;
