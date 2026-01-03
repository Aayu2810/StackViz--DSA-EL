import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, Calculator, Leaf, Code, Target, PenTool, BarChart3 } from 'lucide-react';
import { examplePrompts } from '@/lib/mock-llm';
import { fadeInUp, staggerContainer, springTransition } from '@/lib/animations';

interface PromptInputProps {
  onSubmit: (prompt: string) => void;
  isProcessing: boolean;
}

const iconMap: Record<string, React.FC<{ className?: string }>> = {
  calculator: Calculator,
  leaf: Leaf,
  code: Code,
  target: Target,
  sparkles: Sparkles,
  chart: BarChart3,
};

const PromptInput: React.FC<PromptInputProps> = ({ onSubmit, isProcessing }) => {
  const [prompt, setPrompt] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isProcessing) {
      onSubmit(prompt);
    }
  };

  const handleExampleClick = (text: string) => {
    setPrompt(text);
  };

  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="w-full max-w-3xl mx-auto space-y-6"
    >
      {/* Input form */}
      <motion.form
        variants={fadeInUp}
        onSubmit={handleSubmit}
        className="relative"
      >
        <div
          className={`
            relative glass-panel overflow-hidden transition-all duration-300
            ${isFocused ? 'ring-2 ring-primary/50' : ''}
            ${isProcessing ? 'opacity-75' : ''}
          `}
        >
          {/* Animated border gradient */}
          <AnimatePresence>
            {isFocused && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 gradient-border rounded-xl pointer-events-none"
              />
            )}
          </AnimatePresence>

          <div className="relative p-4">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Enter your prompt... (e.g., 'Explain quantum computing')"
              disabled={isProcessing}
              rows={3}
              className="w-full bg-transparent text-foreground placeholder:text-muted-foreground resize-none focus:outline-none text-lg"
            />
            
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
              <span className="text-xs text-muted-foreground">
                {prompt.length} characters
              </span>
              
              <motion.button
                type="submit"
                disabled={!prompt.trim() || isProcessing}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={springTransition}
                className={`
                  flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium text-sm
                  transition-all duration-300
                  ${prompt.trim() && !isProcessing
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90 neon-glow-purple'
                    : 'bg-muted text-muted-foreground cursor-not-allowed'
                  }
                `}
              >
                {isProcessing ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    >
                      <Sparkles className="w-4 h-4" />
                    </motion.div>
                    Processing...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Decompose & Process
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.form>

      {/* Example prompts */}
      <motion.div variants={fadeInUp} className="space-y-3">
        <p className="text-sm text-muted-foreground text-center">
          Try an example:
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {examplePrompts.map((example, index) => {
            const Icon = iconMap[example.icon] || Sparkles;
            return (
              <motion.button
                key={index}
                onClick={() => handleExampleClick(example.text)}
                disabled={isProcessing}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={springTransition}
                className="chip group"
              >
                <Icon className="w-3.5 h-3.5 mr-1.5 text-primary group-hover:text-neon-cyan transition-colors" />
                {example.category}
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PromptInput;
