import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import InfiniteGrid from '@/components/InfiniteGrid';
import { fadeInUp, staggerContainer, springTransition } from '@/lib/animations';
import { 
  Layers, 
  ArrowRight, 
  SplitSquareVertical, 
  Layers3, 
  Brain, 
  Merge,
  Code,
  FileText,
  Zap
} from 'lucide-react';

const HowItWorks: React.FC = () => {
  const steps = [
    {
      icon: FileText,
      title: 'Prompt Input',
      description: 'User enters a complex prompt requiring multi-step reasoning',
      detail: 'The system receives natural language input that may contain nested sub-problems.',
    },
    {
      icon: SplitSquareVertical,
      title: 'Decomposition',
      description: 'AI breaks down the prompt into atomic subtasks',
      detail: 'Using semantic analysis, the prompt is split into independent, executable units.',
    },
    {
      icon: Layers3,
      title: 'Stack Building',
      description: 'Subtasks are pushed onto a LIFO stack structure',
      detail: 'Tasks are ordered by dependency, with foundational tasks pushed first.',
    },
    {
      icon: Brain,
      title: 'LIFO Processing',
      description: 'Stack is processed top-down, last-in-first-out',
      detail: 'Each task is popped, processed by the LLM, and its result cached for dependent tasks.',
    },
    {
      icon: Merge,
      title: 'Result Synthesis',
      description: 'Completed task results are merged into final output',
      detail: 'Results are combined respecting the original task dependencies and order.',
    },
  ];

  const benefits = [
    {
      title: 'Transparent Reasoning',
      description: 'Every step of the thinking process is visible and traceable.',
    },
    {
      title: 'Dependency Management',
      description: 'Complex tasks are automatically ordered for correct execution.',
    },
    {
      title: 'Memory Efficient',
      description: 'Stack-based processing uses constant auxiliary memory.',
    },
    {
      title: 'Debuggable',
      description: 'Errors can be traced to specific subtasks for easy debugging.',
    },
  ];

  return (
    <InfiniteGrid>
      <Navigation />
      
      <div className="min-h-screen pt-24 pb-16 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="text-center mb-16"
          >
            <motion.div variants={fadeInUp} className="flex items-center justify-center gap-3 mb-4">
              <Code className="w-8 h-8 text-primary" />
              <h1 className="text-3xl md:text-5xl font-bold">
                <span className="gradient-text">How It Works</span>
              </h1>
            </motion.div>
            <motion.p variants={fadeInUp} className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Stack-Augmented Decoding transforms complex prompts into a transparent, 
              step-by-step reasoning process using classic data structure principles.
            </motion.p>
          </motion.div>

          {/* Process steps */}
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="relative"
          >
            {/* Connecting line */}
            <div className="absolute left-8 top-0 bottom-0 w-px bg-border hidden md:block" />

            <div className="space-y-8">
              {steps.map((step, index) => (
                <motion.div
                  key={step.title}
                  variants={fadeInUp}
                  className="relative"
                >
                  <div className="flex gap-6 items-start">
                    {/* Step number and icon */}
                    <div className="relative">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="w-16 h-16 rounded-xl flex items-center justify-center glass-panel border-2 border-primary/30"
                      >
                        <step.icon className="w-7 h-7 text-primary" />
                      </motion.div>
                      <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                        {index + 1}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 glass-panel-hover p-6">
                      <h3 className="text-xl font-semibold text-foreground mb-2">
                        {step.title}
                      </h3>
                      <p className="text-muted-foreground mb-3">
                        {step.description}
                      </p>
                      <p className="text-sm text-muted-foreground/70 font-mono">
                        {step.detail}
                      </p>
                    </div>
                  </div>

                  {index < steps.length - 1 && (
                    <div className="hidden md:flex justify-center my-4 ml-8">
                      <ArrowRight className="w-5 h-5 text-muted-foreground rotate-90" />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Benefits section */}
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="mt-20"
          >
            <motion.h2 
              variants={fadeInUp}
              className="text-2xl md:text-3xl font-bold text-center mb-8"
            >
              <span className="gradient-text">Key Benefits</span>
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {benefits.map((benefit) => (
                <motion.div
                  key={benefit.title}
                  variants={fadeInUp}
                  whileHover={{ y: -4 }}
                  className="glass-panel-hover p-6"
                >
                  <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    {benefit.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {benefit.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 text-center"
          >
            <Link to="/demo">
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={springTransition}
                className="group inline-flex items-center gap-3 px-8 py-4 rounded-xl font-semibold text-lg
                         bg-primary text-primary-foreground shadow-lg
                         hover:bg-primary/90 transition-colors"
              >
                <Zap className="w-5 h-5" />
                Try It Yourself
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </div>
    </InfiniteGrid>
  );
};

export default HowItWorks;
