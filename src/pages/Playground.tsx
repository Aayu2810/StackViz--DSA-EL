import React, { Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navigation from '@/components/Navigation';
import InfiniteGrid from '@/components/InfiniteGrid';
import PromptInput from '@/components/PromptInput';
import CategoryChips from '@/components/CategoryChips';
import LiveStackCard from '@/components/LiveStackCard';
import ReasoningBar from '@/components/ReasoningBar';
import OperationLog from '@/components/OperationLog';
import AnimatedCounter from '@/components/AnimatedCounter';
import TypewriterText from '@/components/TypewriterText';
import FinalResponse from '@/components/FinalResponse';
import { useStackStore } from '@/lib/store';
import { fadeInUp, staggerContainer } from '@/lib/animations';
import { Layers, ArrowDownToLine, ArrowUpFromLine, Zap, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Lazy load the 3D visualizer
const StackVisualizer = React.lazy(() => import('@/components/StackVisualizer'));

const PlaygroundPage: React.FC = () => {
  const {
    tasks,
    currentTask,
    completedTasks,
    isProcessing,
    isDecomposing,
    stackHeight,
    processingProgress,
    currentThinking,
    finalResponse,
    history,
    prompt,
    setPrompt,
    startProcessing,
    reset,
  } = useStackStore();

  const handleSubmit = async (promptText: string) => {
    setPrompt(promptText);
    await startProcessing();
  };

  const handleCategorySelect = (categoryPrompt: string) => {
    handleSubmit(categoryPrompt);
  };

  const hasStarted = isProcessing || completedTasks.length > 0 || finalResponse;

  return (
    <InfiniteGrid>
      <Navigation />
      
      <div className="min-h-screen pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="text-center mb-8"
          >
            <motion.div variants={fadeInUp} className="flex items-center justify-center gap-3 mb-4">
              <div className="p-2 rounded-xl bg-primary/10">
                <Layers className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                Live Stack Reasoning
              </h1>
            </motion.div>
            <motion.p variants={fadeInUp} className="text-muted-foreground max-w-xl mx-auto">
              Enter a prompt and watch the stack-augmented decoding process in real-time
            </motion.p>
          </motion.div>

          {/* Input section */}
          <motion.div 
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            className="mb-6"
          >
            <PromptInput onSubmit={handleSubmit} isProcessing={isProcessing} />
          </motion.div>

          {/* Category chips */}
          {!hasStarted && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <p className="text-center text-sm text-muted-foreground mb-3">
                Or try an example:
              </p>
              <CategoryChips onSelect={handleCategorySelect} disabled={isProcessing} />
            </motion.div>
          )}

          {/* Processing section - 3 column layout */}
          <AnimatePresence mode="wait">
            {hasStarted && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-6"
              >
                {/* LEFT COLUMN - Stack Visualization (40%) */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="glass-panel p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-foreground flex items-center gap-2">
                        <Layers className="w-4 h-4 text-primary" />
                        Task Stack
                      </h3>
                      <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-1 rounded">
                        LIFO Order
                      </span>
                    </div>
                    
                    {/* Stack cards */}
                    <div className="space-y-2 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                      <AnimatePresence mode="popLayout">
                        {[...tasks].reverse().map((task, index) => (
                          <LiveStackCard
                            key={task.id}
                            task={task}
                            index={tasks.length - 1 - index}
                            isActive={currentTask?.id === task.id}
                            isTopOfStack={index === 0}
                          />
                        ))}
                      </AnimatePresence>
                      
                      {tasks.length === 0 && !isDecomposing && completedTasks.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-center py-8 text-muted-foreground"
                        >
                          <Layers className="w-12 h-12 mx-auto mb-2 opacity-30" />
                          <p className="text-sm">Stack is empty</p>
                        </motion.div>
                      )}
                    </div>
                  </div>

                  {/* 3D Visualization */}
                  <motion.div
                    variants={fadeInUp}
                    className="glass-panel overflow-hidden"
                    style={{ height: '300px' }}
                  >
                    <Suspense fallback={
                      <div className="w-full h-full flex items-center justify-center bg-muted/50">
                        <div className="text-muted-foreground">Loading 3D visualization...</div>
                      </div>
                    }>
                      <StackVisualizer tasks={tasks} currentTask={currentTask} />
                    </Suspense>
                  </motion.div>
                </div>

                {/* CENTER COLUMN - Metrics & Connection (20%) */}
                <div className="lg:col-span-2 space-y-4">
                  {/* Stack Height */}
                  <div className="glass-panel p-4 text-center">
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-2">
                      <ArrowDownToLine className="w-4 h-4 text-primary" />
                      Stack Height
                    </div>
                    <AnimatedCounter 
                      value={stackHeight} 
                      className="text-4xl font-bold text-foreground font-mono"
                    />
                  </div>

                  {/* Completed Tasks */}
                  <div className="glass-panel p-4 text-center">
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-2">
                      <ArrowUpFromLine className="w-4 h-4 text-primary" />
                      Completed
                    </div>
                    <AnimatedCounter 
                      value={completedTasks.length} 
                      className="text-4xl font-bold text-foreground font-mono"
                    />
                  </div>

                  {/* Current Operation */}
                  <div className="glass-panel p-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <Zap className="w-4 h-4 text-primary" />
                      Current Op
                    </div>
                    <p className="text-sm font-medium text-foreground truncate">
                      {currentThinking || 'Waiting...'}
                    </p>
                  </div>

                  {/* Progress */}
                  <div className="glass-panel p-4">
                    <div className="text-sm text-muted-foreground mb-2">Progress</div>
                    <ReasoningBar
                      progress={processingProgress}
                      currentThinking=""
                      isActive={isProcessing}
                    />
                    <div className="text-right text-xs text-muted-foreground mt-1 font-mono">
                      {Math.round(processingProgress)}%
                    </div>
                  </div>

                  {/* Reset Button */}
                  {finalResponse && (
                    <Button 
                      onClick={reset}
                      variant="outline"
                      className="w-full"
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Try Another
                    </Button>
                  )}
                </div>

                {/* RIGHT COLUMN - Output & Log (40%) */}
                <div className="lg:col-span-5 space-y-4">
                  {/* Decomposing indicator */}
                  {isDecomposing && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="glass-panel p-6 text-center"
                    >
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                        className="w-12 h-12 mx-auto mb-4 border-2 border-primary border-t-transparent rounded-full"
                      />
                      <p className="text-muted-foreground">Decomposing prompt into subtasks...</p>
                    </motion.div>
                  )}

                  {/* Live Output */}
                  {(isProcessing || completedTasks.length > 0) && !finalResponse && (
                    <div className="glass-panel p-4">
                      <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                        Live Reasoning Output
                      </h3>
                      <div className="space-y-2 max-h-[200px] overflow-y-auto custom-scrollbar">
                        {completedTasks.map((task, index) => (
                          <motion.div
                            key={task.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-start gap-2 p-2 rounded-lg bg-accent/50"
                          >
                            <span className="text-primary font-bold">✓</span>
                            <span className="text-sm text-foreground">{task.result || task.title}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Operation Log */}
                  <OperationLog history={history} />

                  {/* Final response */}
                  {finalResponse && (
                    <FinalResponse response={finalResponse} onReset={reset} />
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Empty state */}
          {!hasStarted && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="glass-panel inline-block p-8 max-w-md">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Layers className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Ready to Visualize
                </h3>
                <p className="text-muted-foreground">
                  Enter a prompt above to see the stack-augmented decoding process in action
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </InfiniteGrid>
  );
};

export default PlaygroundPage;
