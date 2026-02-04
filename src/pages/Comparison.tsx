import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navigation from '@/components/Navigation';
import InfiniteGrid from '@/components/InfiniteGrid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AnimatedCounter from '@/components/AnimatedCounter';
import { 
  Play, 
  RotateCcw, 
  Layers, 
  ArrowDown, 
  ArrowRight,
  Clock,
  Target,
  Brain,
  Check,
  Trophy,
  AlertTriangle
} from 'lucide-react';

interface SimTask {
  id: string;
  title: string;
  status: 'pending' | 'processing' | 'completed';
}

const ComparisonPage: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [stackTasks, setStackTasks] = useState<SimTask[]>([]);
  const [queueTasks, setQueueTasks] = useState<SimTask[]>([]);
  const [stackCompleted, setStackCompleted] = useState(0);
  const [queueCompleted, setQueueCompleted] = useState(0);
  const [stackTime, setStackTime] = useState(0);
  const [queueTime, setQueueTime] = useState(0);
  const [winner, setWinner] = useState<'stack' | 'queue' | null>(null);
  const [showEducation, setShowEducation] = useState<number>(0);

  const sampleTasks = [
    'Parse input data',
    'Validate structure',
    'Extract key concepts',
    'Analyze dependencies',
    'Generate sub-solutions',
    'Combine results',
    'Verify output',
    'Format response',
  ];

  const resetSimulation = useCallback(() => {
    setIsRunning(false);
    setStackTasks([]);
    setQueueTasks([]);
    setStackCompleted(0);
    setQueueCompleted(0);
    setStackTime(0);
    setQueueTime(0);
    setWinner(null);
    setShowEducation(0);
  }, []);

  const runComparison = async () => {
    if (!prompt.trim()) {
      setPrompt('Explain the theory of relativity step by step');
    }
    
    resetSimulation();
    setIsRunning(true);

    // Initialize tasks
    const initialTasks: SimTask[] = sampleTasks.map((title, i) => ({
      id: `task-${i}`,
      title,
      status: 'pending' as const,
    }));

    setStackTasks([...initialTasks]);
    setQueueTasks([...initialTasks]);

    // Process Stack (LIFO - processes deeply, faster completion)
    const stackProcess = async () => {
      const tasks = [...initialTasks];
      let time = 0;
      
      // Stack processes from end (LIFO)
      for (let i = tasks.length - 1; i >= 0; i--) {
        await new Promise(resolve => setTimeout(resolve, 300));
        time += 1;
        
        // Mark processing
        setStackTasks(prev => prev.map((t, idx) => 
          idx === i ? { ...t, status: 'processing' } : t
        ));
        
        await new Promise(resolve => setTimeout(resolve, 400));
        time += 1;
        
        // Mark completed
        setStackTasks(prev => prev.map((t, idx) => 
          idx === i ? { ...t, status: 'completed' } : t
        ));
        setStackCompleted(prev => prev + 1);
        setStackTime(time);
      }
      
      return time;
    };

    // Process Queue (FIFO - processes broadly, slower)
    const queueProcess = async () => {
      const tasks = [...initialTasks];
      let time = 0;
      
      // Queue has overhead due to breadth-first approach
      // First pass - touch all tasks
      for (let i = 0; i < tasks.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 200));
        time += 0.5;
        
        setQueueTasks(prev => prev.map((t, idx) => 
          idx === i ? { ...t, status: 'processing' } : t
        ));
        
        await new Promise(resolve => setTimeout(resolve, 100));
        
        setQueueTasks(prev => prev.map((t, idx) => 
          idx === i ? { ...t, status: 'pending' } : t
        ));
      }
      
      // Second pass - actually complete
      for (let i = 0; i < tasks.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 350));
        time += 1.2;
        
        setQueueTasks(prev => prev.map((t, idx) => 
          idx === i ? { ...t, status: 'processing' } : t
        ));
        
        await new Promise(resolve => setTimeout(resolve, 400));
        time += 1;
        
        setQueueTasks(prev => prev.map((t, idx) => 
          idx === i ? { ...t, status: 'completed' } : t
        ));
        setQueueCompleted(prev => prev + 1);
        setQueueTime(time);
      }
      
      return time;
    };

    // Educational callouts timing
    setTimeout(() => setShowEducation(1), 2000);
    setTimeout(() => setShowEducation(2), 5000);
    setTimeout(() => setShowEducation(3), 8000);

    // Run both simultaneously
    const [stackFinalTime] = await Promise.all([stackProcess(), queueProcess()]);
    
    setWinner('stack');
    setIsRunning(false);
  };

  return (
    <InfiniteGrid>
      <Navigation />
      
      <div className="min-h-screen pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Why Stacks for LLM Reasoning?
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Same Prompt, Different Data Structures. Watch how LIFO (Stack) outperforms FIFO (Queue) for reasoning tasks.
            </p>
          </motion.div>

          {/* Input & Controls */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel p-6 mb-8"
          >
            <div className="flex flex-col md:flex-row gap-4">
              <Input
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Enter a prompt to compare... (e.g., Explain the theory of relativity)"
                className="flex-1"
                disabled={isRunning}
              />
              <div className="flex gap-2">
                <Button 
                  onClick={runComparison}
                  disabled={isRunning}
                  className="btn-primary-glow"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Run Comparison
                </Button>
                <Button 
                  onClick={resetSimulation}
                  variant="outline"
                  disabled={isRunning}
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Comparison Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Stack Column */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              className={`glass-panel p-6 ${winner === 'stack' ? 'comparison-winner animate-winner-glow' : ''}`}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-xl bg-primary/10">
                  <Layers className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                    Stack (LIFO)
                    {winner === 'stack' && <Trophy className="w-5 h-5 text-primary" />}
                  </h2>
                  <p className="text-sm text-muted-foreground">Depth-First Processing</p>
                </div>
              </div>

              {/* Stack visualization */}
              <div className="space-y-2 mb-6 min-h-[320px]">
                <AnimatePresence>
                  {stackTasks.map((task, index) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ 
                        opacity: 1, 
                        y: 0,
                        scale: task.status === 'processing' ? 1.02 : 1,
                      }}
                      className={`
                        p-3 rounded-lg border-2 flex items-center gap-3 transition-all
                        ${task.status === 'completed' ? 'border-primary/50 bg-accent' : 
                          task.status === 'processing' ? 'border-primary bg-accent accent-glow' : 
                          'border-border bg-card'}
                      `}
                    >
                      <ArrowDown className={`w-4 h-4 ${task.status === 'completed' ? 'text-primary' : 'text-muted-foreground'}`} />
                      <span className={`flex-1 text-sm ${task.status === 'completed' ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {task.title}
                      </span>
                      {task.status === 'completed' && <Check className="w-4 h-4 text-primary" />}
                      {task.status === 'processing' && (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity }}
                          className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full"
                        />
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Stack metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <Clock className="w-5 h-5 mx-auto mb-1 text-primary" />
                  <AnimatedCounter value={stackTime} className="text-2xl font-bold font-mono" />
                  <p className="text-xs text-muted-foreground">Time Units</p>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <Check className="w-5 h-5 mx-auto mb-1 text-primary" />
                  <AnimatedCounter value={stackCompleted} className="text-2xl font-bold font-mono" />
                  <p className="text-xs text-muted-foreground">Completed</p>
                </div>
              </div>
            </motion.div>

            {/* Queue Column */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              className={`glass-panel p-6 ${winner === 'queue' ? 'comparison-winner' : winner === 'stack' ? 'comparison-loser' : ''}`}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-xl bg-warning/10">
                  <ArrowRight className="w-6 h-6 text-warning" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                    Queue (FIFO)
                    {winner === 'stack' && <AlertTriangle className="w-5 h-5 text-warning" />}
                  </h2>
                  <p className="text-sm text-muted-foreground">Breadth-First Processing</p>
                </div>
              </div>

              {/* Queue visualization */}
              <div className="space-y-2 mb-6 min-h-[320px]">
                <AnimatePresence>
                  {queueTasks.map((task, index) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ 
                        opacity: 1, 
                        x: 0,
                        scale: task.status === 'processing' ? 1.02 : 1,
                      }}
                      className={`
                        p-3 rounded-lg border-2 flex items-center gap-3 transition-all
                        ${task.status === 'completed' ? 'border-warning/50 bg-warning/5' : 
                          task.status === 'processing' ? 'border-warning bg-warning/10' : 
                          'border-border bg-card'}
                      `}
                    >
                      <ArrowRight className={`w-4 h-4 ${task.status === 'completed' ? 'text-warning' : 'text-muted-foreground'}`} />
                      <span className={`flex-1 text-sm ${task.status === 'completed' ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {task.title}
                      </span>
                      {task.status === 'completed' && <Check className="w-4 h-4 text-warning" />}
                      {task.status === 'processing' && (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity }}
                          className="w-4 h-4 border-2 border-warning border-t-transparent rounded-full"
                        />
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Queue metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <Clock className="w-5 h-5 mx-auto mb-1 text-warning" />
                  <AnimatedCounter value={queueTime} className="text-2xl font-bold font-mono" />
                  <p className="text-xs text-muted-foreground">Time Units</p>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <Check className="w-5 h-5 mx-auto mb-1 text-warning" />
                  <AnimatedCounter value={queueCompleted} className="text-2xl font-bold font-mono" />
                  <p className="text-xs text-muted-foreground">Completed</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Educational callouts */}
          <div className="mt-8 space-y-4">
            <AnimatePresence>
              {showEducation >= 1 && (
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  className="glass-panel p-4 border-l-4 border-primary"
                >
                  <div className="flex items-start gap-3">
                    <Brain className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-foreground">Stack explores deeply before moving on</h4>
                      <p className="text-sm text-muted-foreground">LIFO ensures each reasoning step is fully resolved before proceeding, maintaining context integrity.</p>
                    </div>
                  </div>
                </motion.div>
              )}
              
              {showEducation >= 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  className="glass-panel p-4 border-l-4 border-warning"
                >
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-warning mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-foreground">Queue spreads attention too thin</h4>
                      <p className="text-sm text-muted-foreground">FIFO processes tasks superficially first, requiring multiple passes and losing context between steps.</p>
                    </div>
                  </div>
                </motion.div>
              )}
              
              {showEducation >= 3 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="glass-panel p-4 border-l-4 border-primary"
                >
                  <div className="flex items-start gap-3">
                    <Target className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-foreground">LLMs need context - stacks preserve it!</h4>
                      <p className="text-sm text-muted-foreground">Stack-based decoding mirrors how humans reason: solve sub-problems completely before combining results.</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Winner announcement */}
          <AnimatePresence>
            {winner === 'stack' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-8 glass-panel p-8 text-center border-2 border-primary"
              >
                <Trophy className="w-16 h-16 mx-auto mb-4 text-primary" />
                <h2 className="text-2xl font-bold text-foreground mb-2">Stack Wins!</h2>
                <p className="text-muted-foreground max-w-lg mx-auto">
                  The Stack completed <strong className="text-primary">{Math.round((queueTime - stackTime) / stackTime * 100)}% faster</strong> with better reasoning depth. 
                  This demonstrates why modern LLMs use stack-based approaches for complex reasoning tasks.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </InfiniteGrid>
  );
};

export default ComparisonPage;
