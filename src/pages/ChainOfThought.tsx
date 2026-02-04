import React, { useState, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navigation from '@/components/Navigation';
import InfiniteGrid from '@/components/InfiniteGrid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import OperationLog from '@/components/OperationLog';
import { 
  Brain, 
  Network, 
  Play, 
  RotateCcw,
  Layers,
  GitBranch,
  ArrowRight
} from 'lucide-react';

// Lazy load 3D components
const NestedStackVisualizer = React.lazy(() => import('@/components/NestedStackVisualizer'));
const NeuralNetworkVisualizer = React.lazy(() => import('@/components/NeuralNetworkVisualizer'));

interface NestedTask {
  id: string;
  title: string;
  depth: number;
  children: NestedTask[];
  status: 'pending' | 'processing' | 'completed';
}

const ChainOfThoughtPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'reasoning' | 'architecture'>('reasoning');
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [nestedTasks, setNestedTasks] = useState<NestedTask[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [currentDepth, setCurrentDepth] = useState(0);

  const sampleDecomposition: NestedTask = {
    id: '1',
    title: 'Answer the main question',
    depth: 0,
    status: 'pending',
    children: [
      {
        id: '1.1',
        title: 'Understand core concepts',
        depth: 1,
        status: 'pending',
        children: [
          { id: '1.1.1', title: 'Define key terms', depth: 2, status: 'pending', children: [] },
          { id: '1.1.2', title: 'Identify relationships', depth: 2, status: 'pending', children: [] },
        ],
      },
      {
        id: '1.2',
        title: 'Analyze components',
        depth: 1,
        status: 'pending',
        children: [
          { id: '1.2.1', title: 'Break down structure', depth: 2, status: 'pending', children: [] },
          { id: '1.2.2', title: 'Evaluate each part', depth: 2, status: 'pending', children: [] },
        ],
      },
      {
        id: '1.3',
        title: 'Synthesize answer',
        depth: 1,
        status: 'pending',
        children: [
          { id: '1.3.1', title: 'Combine insights', depth: 2, status: 'pending', children: [] },
          { id: '1.3.2', title: 'Verify consistency', depth: 2, status: 'pending', children: [] },
        ],
      },
    ],
  };

  const runChainOfThought = async () => {
    if (!prompt.trim()) {
      setPrompt('How do I become a software engineer?');
    }
    
    setIsProcessing(true);
    setNestedTasks([sampleDecomposition]);
    setHistory([]);

    // Simulate processing with nested stack operations
    const processTask = async (task: NestedTask, parentPath: string = '') => {
      const taskPath = parentPath ? `${parentPath} → ${task.title}` : task.title;
      
      // Push
      setHistory(prev => [...prev, {
        type: 'push',
        task: { title: task.title, id: task.id },
        timestamp: Date.now(),
      }]);
      setCurrentDepth(task.depth);
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Process children first (depth-first)
      for (const child of task.children) {
        await processTask(child, taskPath);
      }
      
      // Mark as completed
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Pop
      setHistory(prev => [...prev, {
        type: 'pop',
        task: { title: task.title, id: task.id },
        timestamp: Date.now(),
      }]);
    };

    await processTask(sampleDecomposition);
    
    setHistory(prev => [...prev, {
      type: 'complete',
      timestamp: Date.now(),
    }]);
    
    setIsProcessing(false);
  };

  const reset = () => {
    setIsProcessing(false);
    setNestedTasks([]);
    setHistory([]);
    setCurrentDepth(0);
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
              Inside the LLM's Mind
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Chain-of-Thought reasoning with nested stack frames. See how complex questions decompose into sub-questions.
            </p>
          </motion.div>

          {/* View Toggle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center mb-8"
          >
            <div className="glass-panel p-1 inline-flex gap-1">
              <button
                onClick={() => setViewMode('reasoning')}
                className={`
                  px-6 py-2 rounded-lg font-medium transition-all flex items-center gap-2
                  ${viewMode === 'reasoning' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'text-muted-foreground hover:text-foreground'}
                `}
              >
                <GitBranch className="w-4 h-4" />
                Reasoning View
              </button>
              <button
                onClick={() => setViewMode('architecture')}
                className={`
                  px-6 py-2 rounded-lg font-medium transition-all flex items-center gap-2
                  ${viewMode === 'architecture' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'text-muted-foreground hover:text-foreground'}
                `}
              >
                <Network className="w-4 h-4" />
                Architecture View
              </button>
            </div>
          </motion.div>

          {/* Input Controls */}
          {viewMode === 'reasoning' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-panel p-6 mb-8"
            >
              <div className="flex flex-col md:flex-row gap-4">
                <Input
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Ask a complex question... (e.g., How do I become a software engineer?)"
                  className="flex-1"
                  disabled={isProcessing}
                />
                <div className="flex gap-2">
                  <Button 
                    onClick={runChainOfThought}
                    disabled={isProcessing}
                    className="btn-primary-glow"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Decompose
                  </Button>
                  <Button 
                    onClick={reset}
                    variant="outline"
                    disabled={isProcessing}
                  >
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            {viewMode === 'reasoning' ? (
              <motion.div
                key="reasoning"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-6"
              >
                {/* Left - Dependency Graph */}
                <div className="lg:col-span-3">
                  <div className="glass-panel p-4">
                    <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                      <GitBranch className="w-4 h-4 text-primary" />
                      Dependency Graph
                    </h3>
                    
                    {nestedTasks.length > 0 ? (
                      <div className="space-y-2">
                        <DependencyTree task={sampleDecomposition} />
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <GitBranch className="w-12 h-12 mx-auto mb-2 opacity-30" />
                        <p className="text-sm">Start decomposition to see graph</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Center - 3D Visualization */}
                <div className="lg:col-span-6">
                  <div className="glass-panel overflow-hidden" style={{ height: '500px' }}>
                    <Suspense fallback={
                      <div className="w-full h-full flex items-center justify-center bg-muted/50">
                        <div className="text-muted-foreground">Loading 3D visualization...</div>
                      </div>
                    }>
                      <NestedStackVisualizer 
                        tasks={nestedTasks}
                        currentDepth={currentDepth}
                        isProcessing={isProcessing}
                      />
                    </Suspense>
                  </div>

                  {/* Depth indicator */}
                  <div className="mt-4 glass-panel p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Current Depth</span>
                      <span className="font-mono font-bold text-foreground">{currentDepth}</span>
                    </div>
                    <div className="flex gap-1">
                      {[0, 1, 2].map((depth) => (
                        <div
                          key={depth}
                          className={`
                            flex-1 h-2 rounded-full transition-all
                            ${depth <= currentDepth ? 'bg-primary' : 'bg-muted'}
                          `}
                          style={{
                            opacity: depth <= currentDepth ? 1 - (depth * 0.2) : 0.3,
                          }}
                        />
                      ))}
                    </div>
                    <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                      <span>Main</span>
                      <span>Sub</span>
                      <span>Deep</span>
                    </div>
                  </div>
                </div>

                {/* Right - Log */}
                <div className="lg:col-span-3">
                  <OperationLog history={history} className="h-full" />
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="architecture"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-6"
              >
                {/* Left - Neural Network 3D */}
                <div className="lg:col-span-8">
                  <div className="glass-panel overflow-hidden" style={{ height: '500px' }}>
                    <Suspense fallback={
                      <div className="w-full h-full flex items-center justify-center bg-muted/50">
                        <div className="text-muted-foreground">Loading neural network visualization...</div>
                      </div>
                    }>
                      <NeuralNetworkVisualizer />
                    </Suspense>
                  </div>
                </div>

                {/* Right - Model Evolution Timeline */}
                <div className="lg:col-span-4">
                  <div className="glass-panel p-6">
                    <h3 className="font-semibold text-foreground mb-6 flex items-center gap-2">
                      <Layers className="w-4 h-4 text-primary" />
                      Model Evolution
                    </h3>
                    
                    <ModelTimeline />
                  </div>

                  {/* Educational callouts */}
                  <div className="mt-4 space-y-3">
                    <EducationalNote 
                      text="Each transformer layer = one stack frame"
                      delay={0}
                    />
                    <EducationalNote 
                      text="Deeper stacks = more parameters = better reasoning"
                      delay={0.1}
                    />
                    <EducationalNote 
                      text="LIFO: Output layer processes last, outputs first"
                      delay={0.2}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Educational footer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8 glass-panel p-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <Brain className="w-8 h-8 mx-auto mb-2 text-primary" />
                <h4 className="font-semibold text-foreground">Each stack frame represents a reasoning step</h4>
              </div>
              <div>
                <Layers className="w-8 h-8 mx-auto mb-2 text-primary" />
                <h4 className="font-semibold text-foreground">Deeper stacks = more thorough reasoning</h4>
              </div>
              <div>
                <ArrowRight className="w-8 h-8 mx-auto mb-2 text-primary" />
                <h4 className="font-semibold text-foreground">Sub-questions resolve before moving forward</h4>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </InfiniteGrid>
  );
};

// Dependency Tree Component
const DependencyTree: React.FC<{ task: NestedTask; depth?: number }> = ({ task, depth = 0 }) => {
  const colors = ['bg-primary', 'bg-emerald-400', 'bg-emerald-300'];
  
  return (
    <div className="relative">
      <div 
        className={`flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50 transition-colors`}
        style={{ marginLeft: depth * 16 }}
      >
        <div className={`w-3 h-3 rounded-full ${colors[Math.min(depth, 2)]}`} />
        <span className="text-sm text-foreground truncate">{task.title}</span>
      </div>
      {task.children.map(child => (
        <DependencyTree key={child.id} task={child} depth={depth + 1} />
      ))}
    </div>
  );
};

// Model Timeline Component
const ModelTimeline: React.FC = () => {
  const models = [
    { name: 'BERT Large', year: 2018, params: '345M' },
    { name: 'GPT-2', year: 2019, params: '1.5B' },
    { name: 'GPT-3', year: 2020, params: '175B' },
    { name: 'Turing NLG', year: 2021, params: '530B' },
    { name: 'GPT-4', year: 2023, params: '1.4T' },
  ];

  return (
    <div className="relative">
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary to-emerald-300" />
      
      <div className="space-y-4">
        {models.map((model, index) => (
          <motion.div
            key={model.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative pl-10"
          >
            <div className="absolute left-2.5 w-3 h-3 rounded-full bg-primary border-2 border-background" />
            <div className="glass-panel p-3">
              <div className="flex justify-between items-center">
                <span className="font-medium text-foreground">{model.name}</span>
                <span className="text-xs text-muted-foreground">{model.year}</span>
              </div>
              <div className="mt-1 flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((index + 1) * 20, 100)}%` }}
                    transition={{ delay: 0.5 + index * 0.2, duration: 0.5 }}
                    className="h-full bg-gradient-to-r from-primary to-emerald-400 rounded-full"
                  />
                </div>
                <span className="text-xs font-mono text-primary">{model.params}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// Educational Note Component
const EducationalNote: React.FC<{ text: string; delay: number }> = ({ text, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="glass-panel p-3 border-l-4 border-primary"
  >
    <p className="text-sm text-foreground">{text}</p>
  </motion.div>
);

export default ChainOfThoughtPage;
