import React, { Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navigation from '@/components/Navigation';
import InfiniteGrid from '@/components/InfiniteGrid';
import PromptInput from '@/components/PromptInput';
import ReasoningBar from '@/components/ReasoningBar';
import TaskCard from '@/components/TaskCard';
import StackGraph from '@/components/StackGraph';
import OutputTimeline from '@/components/OutputTimeline';
import FinalResponse from '@/components/FinalResponse';
import { useStackStore } from '@/lib/store';
import { fadeInUp, staggerContainer } from '@/lib/animations';
import { Layers, ArrowDown, ArrowUp } from 'lucide-react';

// Lazy load the 3D visualizer
const StackVisualizer = React.lazy(() => import('@/components/StackVisualizer'));

const DemoPage: React.FC = () => {
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
    setPrompt,
    startProcessing,
    reset,
  } = useStackStore();

  const handleSubmit = async (prompt: string) => {
    setPrompt(prompt);
    await startProcessing();
  };

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
              <Layers className="w-8 h-8 text-primary" />
              <h1 className="text-3xl md:text-4xl font-bold">
                <span className="gradient-text">Interactive Demo</span>
              </h1>
            </motion.div>
            <motion.p variants={fadeInUp} className="text-muted-foreground max-w-xl mx-auto">
              Enter a prompt and watch the stack-augmented decoding process in real-time
            </motion.p>
          </motion.div>

          {/* Input section */}
          <div className="mb-8">
            <PromptInput onSubmit={handleSubmit} isProcessing={isProcessing} />
          </div>

          {/* Processing section */}
          <AnimatePresence mode="wait">
            {(isProcessing || completedTasks.length > 0 || finalResponse) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-6"
              >
                {/* Left column - Stack visualization */}
                <div className="space-y-4">
                  {/* 3D Stack */}
                  <motion.div
                    variants={fadeInUp}
                    className="glass-panel overflow-hidden"
                    style={{ height: '400px' }}
                  >
                    <Suspense fallback={
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="text-muted-foreground">Loading 3D visualization...</div>
                      </div>
                    }>
                      <StackVisualizer tasks={tasks} currentTask={currentTask} />
                    </Suspense>
                  </motion.div>

                  {/* Stack info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="glass-panel p-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                        <ArrowDown className="w-4 h-4 text-neon-cyan" />
                        Stack Height
                      </div>
                      <div className="text-3xl font-bold text-foreground font-mono">
                        {stackHeight}
                      </div>
                    </div>
                    <div className="glass-panel p-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                        <ArrowUp className="w-4 h-4 text-neon-green" />
                        Completed
                      </div>
                      <div className="text-3xl font-bold text-foreground font-mono">
                        {completedTasks.length}
                      </div>
                    </div>
                  </div>

                  {/* Reasoning bar */}
                  <ReasoningBar
                    progress={processingProgress}
                    currentThinking={currentThinking}
                    isActive={isProcessing}
                  />

                  {/* Stack graph */}
                  {history.length > 0 && (
                    <StackGraph history={history} currentHeight={stackHeight} />
                  )}
                </div>

                {/* Right column - Tasks and output */}
                <div className="space-y-4">
                  {/* Current stack tasks */}
                  {tasks.length > 0 && (
                    <motion.div
                      variants={fadeInUp}
                      className="glass-panel p-4"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-foreground">Current Stack</h3>
                        <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-1 rounded">
                          LIFO Order
                        </span>
                      </div>
                      <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                        <AnimatePresence mode="popLayout">
                          {[...tasks].reverse().map((task) => (
                            <TaskCard
                              key={task.id}
                              task={task}
                              isActive={currentTask?.id === task.id}
                            />
                          ))}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  )}

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

                  {/* Completed tasks */}
                  {completedTasks.length > 0 && !finalResponse && (
                    <OutputTimeline completedTasks={completedTasks} />
                  )}

                  {/* Final response */}
                  {finalResponse && (
                    <FinalResponse response={finalResponse} onReset={reset} />
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Empty state */}
          {!isProcessing && tasks.length === 0 && completedTasks.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="glass-panel inline-block p-8 max-w-md">
                <Layers className="w-16 h-16 mx-auto mb-4 text-primary/50" />
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

export default DemoPage;
