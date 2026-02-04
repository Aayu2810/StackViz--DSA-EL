import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navigation from '@/components/Navigation';
import InfiniteGrid from '@/components/InfiniteGrid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AnimatedCounter from '@/components/AnimatedCounter';
import { 
  Play, 
  RotateCcw, 
  Zap,
  Trophy,
  X,
  Gauge,
  GitBranch,
  Sparkles
} from 'lucide-react';

interface ReasoningBranch {
  id: string;
  name: string;
  strategy: string;
  confidence: number;
  status: 'active' | 'pruned' | 'winner';
  tasks: string[];
  progress: number;
}

const MultiStackRacePage: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [isRacing, setIsRacing] = useState(false);
  const [phase, setPhase] = useState<'idle' | 'divergence' | 'evaluation' | 'pruning' | 'winner'>('idle');
  const [branches, setBranches] = useState<ReasoningBranch[]>([]);
  const [activeBranches, setActiveBranches] = useState(0);
  const [prunedBranches, setPrunedBranches] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  const initialBranches: ReasoningBranch[] = [
    {
      id: 'analytical',
      name: 'Analytical',
      strategy: 'Break down into logical components',
      confidence: 0,
      status: 'active',
      tasks: ['Identify variables', 'Define constraints', 'Apply rules', 'Derive solution'],
      progress: 0,
    },
    {
      id: 'creative',
      name: 'Creative',
      strategy: 'Explore unconventional connections',
      confidence: 0,
      status: 'active',
      tasks: ['Brainstorm ideas', 'Find patterns', 'Make analogies', 'Synthesize'],
      progress: 0,
    },
    {
      id: 'stepwise',
      name: 'Step-by-Step',
      strategy: 'Methodical sequential reasoning',
      confidence: 0,
      status: 'active',
      tasks: ['Step 1', 'Step 2', 'Step 3', 'Verify'],
      progress: 0,
    },
    {
      id: 'analogical',
      name: 'Analogical',
      strategy: 'Draw from similar problems',
      confidence: 0,
      status: 'active',
      tasks: ['Find similar cases', 'Map relationships', 'Transfer solution', 'Adapt'],
      progress: 0,
    },
  ];

  const runRace = useCallback(async () => {
    if (!prompt.trim()) {
      setPrompt('What is the best approach to solve climate change?');
    }

    setIsRacing(true);
    setBranches(initialBranches);
    setActiveBranches(4);
    setPrunedBranches(0);
    setShowConfetti(false);

    // Phase 1: Divergence (0-3s)
    setPhase('divergence');
    
    for (let i = 0; i <= 100; i += 5) {
      await new Promise(resolve => setTimeout(resolve, 100));
      setBranches(prev => prev.map(branch => ({
        ...branch,
        progress: Math.min(i + Math.random() * 10, 100),
        confidence: Math.min(i * 0.7 + Math.random() * 20, 100),
      })));
    }

    // Phase 2: Evaluation (3-6s)
    setPhase('evaluation');
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Set final confidence scores
    const confidences = [85, 45, 92, 38];
    setBranches(prev => prev.map((branch, i) => ({
      ...branch,
      confidence: confidences[i],
    })));

    await new Promise(resolve => setTimeout(resolve, 1000));

    // Phase 3: Pruning (6-8s)
    setPhase('pruning');
    
    // Prune weakest branches one by one
    const prunedOrder = ['analogical', 'creative'];
    for (const branchId of prunedOrder) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setBranches(prev => prev.map(branch => 
        branch.id === branchId ? { ...branch, status: 'pruned' } : branch
      ));
      setPrunedBranches(prev => prev + 1);
      setActiveBranches(prev => prev - 1);
    }

    await new Promise(resolve => setTimeout(resolve, 1000));

    // Phase 4: Winner (8-10s)
    setPhase('winner');
    setBranches(prev => prev.map(branch => 
      branch.id === 'stepwise' ? { ...branch, status: 'winner', confidence: 98 } : branch
    ));
    setActiveBranches(1);
    setShowConfetti(true);

    setIsRacing(false);
  }, [prompt]);

  const reset = () => {
    setIsRacing(false);
    setPhase('idle');
    setBranches([]);
    setActiveBranches(0);
    setPrunedBranches(0);
    setShowConfetti(false);
  };

  const getBranchColor = (branch: ReasoningBranch) => {
    if (branch.status === 'winner') return 'border-primary bg-accent';
    if (branch.status === 'pruned') return 'border-destructive/50 bg-destructive/5 opacity-50';
    return 'border-border bg-card';
  };

  return (
    <InfiniteGrid>
      <Navigation />
      
      <div className="min-h-screen pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Confetti Effect */}
          <AnimatePresence>
            {showConfetti && (
              <div className="fixed inset-0 pointer-events-none z-50">
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ 
                      x: Math.random() * window.innerWidth, 
                      y: window.innerHeight + 20,
                      rotate: 0 
                    }}
                    animate={{ 
                      y: -100,
                      rotate: Math.random() * 720 - 360,
                    }}
                    transition={{ 
                      duration: 2 + Math.random(),
                      ease: 'easeOut',
                    }}
                    className="absolute w-3 h-3 rounded-sm"
                    style={{ 
                      backgroundColor: ['#10B981', '#34D399', '#6EE7B7', '#A7F3D0'][Math.floor(Math.random() * 4)],
                    }}
                  />
                ))}
              </div>
            )}
          </AnimatePresence>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              When LLMs Think in Parallel
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Multiple Reasoning Paths, One Winner. Watch the LLM explore different approaches simultaneously.
            </p>
          </motion.div>

          {/* Phase Indicator */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center mb-8"
          >
            <div className="glass-panel p-2 inline-flex gap-1">
              {['divergence', 'evaluation', 'pruning', 'winner'].map((p, i) => (
                <div
                  key={p}
                  className={`
                    px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize
                    ${phase === p 
                      ? 'bg-primary text-primary-foreground' 
                      : phase === 'idle' || ['divergence', 'evaluation', 'pruning', 'winner'].indexOf(phase) < i
                        ? 'text-muted-foreground'
                        : 'text-foreground bg-muted'}
                  `}
                >
                  {p}
                </div>
              ))}
            </div>
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
                placeholder="Enter a complex prompt... (e.g., What is the best approach to solve climate change?)"
                className="flex-1"
                disabled={isRacing}
              />
              <div className="flex gap-2">
                <Button 
                  onClick={runRace}
                  disabled={isRacing}
                  className="btn-primary-glow"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Start Race
                </Button>
                <Button 
                  onClick={reset}
                  variant="outline"
                  disabled={isRacing}
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Real-time Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="glass-panel p-4 text-center">
              <GitBranch className="w-6 h-6 mx-auto mb-2 text-primary" />
              <AnimatedCounter value={activeBranches} className="text-3xl font-bold font-mono" />
              <p className="text-sm text-muted-foreground">Active Branches</p>
            </div>
            <div className="glass-panel p-4 text-center">
              <X className="w-6 h-6 mx-auto mb-2 text-destructive" />
              <AnimatedCounter value={prunedBranches} className="text-3xl font-bold font-mono" />
              <p className="text-sm text-muted-foreground">Pruned</p>
            </div>
            <div className="glass-panel p-4 text-center">
              <Gauge className="w-6 h-6 mx-auto mb-2 text-primary" />
              <span className="text-3xl font-bold font-mono">
                {branches.find(b => b.status === 'winner')?.confidence || 
                 Math.max(...branches.map(b => b.confidence), 0).toFixed(0)}%
              </span>
              <p className="text-sm text-muted-foreground">Top Confidence</p>
            </div>
            <div className="glass-panel p-4 text-center">
              <Zap className="w-6 h-6 mx-auto mb-2 text-primary" />
              <span className="text-3xl font-bold font-mono capitalize">
                {phase}
              </span>
              <p className="text-sm text-muted-foreground">Current Phase</p>
            </div>
          </div>

          {/* Arena View - Racing Stacks */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <AnimatePresence mode="popLayout">
              {branches.map((branch, index) => (
                <motion.div
                  key={branch.id}
                  layout
                  initial={{ opacity: 0, y: 50, scale: 0.9 }}
                  animate={{ 
                    opacity: branch.status === 'pruned' ? 0.4 : 1, 
                    y: 0, 
                    scale: branch.status === 'winner' ? 1.05 : 1,
                  }}
                  exit={{ opacity: 0, scale: 0.5, rotate: 10 }}
                  transition={{ type: 'spring', damping: 20 }}
                  className={`
                    glass-panel p-6 border-2 transition-all
                    ${getBranchColor(branch)}
                    ${branch.status === 'winner' ? 'animate-winner-glow' : ''}
                  `}
                >
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-foreground flex items-center gap-2">
                      {branch.status === 'winner' && <Trophy className="w-5 h-5 text-primary" />}
                      {branch.status === 'pruned' && <X className="w-5 h-5 text-destructive" />}
                      {branch.name}
                    </h3>
                    <span className={`
                      text-xs font-mono px-2 py-1 rounded
                      ${branch.status === 'winner' ? 'bg-primary text-primary-foreground' :
                        branch.status === 'pruned' ? 'bg-destructive/20 text-destructive' :
                        'bg-muted text-muted-foreground'}
                    `}>
                      {branch.confidence.toFixed(0)}%
                    </span>
                  </div>

                  {/* Strategy */}
                  <p className="text-sm text-muted-foreground mb-4">{branch.strategy}</p>

                  {/* Stack Visualization */}
                  <div className="space-y-2 mb-4">
                    {branch.tasks.map((task, taskIndex) => {
                      const isCompleted = (branch.progress / 100) * branch.tasks.length > taskIndex;
                      const isActive = Math.floor((branch.progress / 100) * branch.tasks.length) === taskIndex;
                      
                      return (
                        <motion.div
                          key={taskIndex}
                          animate={{
                            scale: isActive && branch.status === 'active' ? 1.02 : 1,
                            x: branch.status === 'pruned' ? [0, -5, 5, 0] : 0,
                          }}
                          transition={{
                            x: { duration: 0.5 },
                          }}
                          className={`
                            p-2 rounded text-xs transition-all
                            ${branch.status === 'pruned' ? 'bg-destructive/10 text-muted-foreground line-through' :
                              isCompleted ? 'bg-primary/20 text-foreground' :
                              isActive ? 'bg-primary/10 text-foreground border border-primary' :
                              'bg-muted text-muted-foreground'}
                          `}
                        >
                          {task}
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Progress bar */}
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${
                        branch.status === 'winner' ? 'bg-primary' :
                        branch.status === 'pruned' ? 'bg-destructive' :
                        'bg-primary/70'
                      }`}
                      initial={{ width: 0 }}
                      animate={{ width: `${branch.progress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>

                  {/* Winner badge */}
                  {branch.status === 'winner' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 text-center"
                    >
                      <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-full text-sm font-bold">
                        <Sparkles className="w-4 h-4" />
                        OPTIMAL PATH
                      </span>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Educational Footer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass-panel p-6 border-2 border-primary"
          >
            <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Why This Matters
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="font-medium text-foreground mb-1">LLMs explore multiple paths in parallel</p>
                <p className="text-muted-foreground">Each branch is a different reasoning strategy</p>
              </div>
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="font-medium text-foreground mb-1">Weak reasoning chains get pruned early</p>
                <p className="text-muted-foreground">Saves computation and focuses on promising paths</p>
              </div>
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="font-medium text-foreground mb-1">Stack with best intermediate results wins</p>
                <p className="text-muted-foreground">Confidence scores guide the selection</p>
              </div>
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="font-medium text-foreground mb-1">This is how beam search works</p>
                <p className="text-muted-foreground">A fundamental technique in transformer decoding</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </InfiniteGrid>
  );
};

export default MultiStackRacePage;
