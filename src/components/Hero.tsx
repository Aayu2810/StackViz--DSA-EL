import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Layers, Sparkles, Zap, Eye } from 'lucide-react';
import InfiniteGrid from '@/components/InfiniteGrid';
import Navigation from '@/components/Navigation';
import { heroTitle, heroSubtitle, heroCTA, staggerContainer, fadeInUp, springTransition } from '@/lib/animations';

const Hero: React.FC = () => {
  return (
    <InfiniteGrid>
      <Navigation />
      
      <div className="min-h-screen flex flex-col items-center justify-center px-4 pt-20">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="text-center max-w-4xl mx-auto space-y-8"
        >
          {/* Badge */}
          <motion.div
            variants={fadeInUp}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel text-sm"
          >
            <Sparkles className="w-4 h-4 text-neon-cyan" />
            <span className="text-muted-foreground">Stack-Based LLM Reasoning</span>
          </motion.div>

          {/* Main headline */}
          <motion.h1
            variants={heroTitle}
            className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight"
          >
            <span className="text-foreground">See How AI</span>
            <br />
            <span className="gradient-text">Thinks with Stacks</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={heroSubtitle}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            Watch complex prompts decompose into subtasks, build a 3D stack, 
            and process through <span className="text-neon-cyan font-medium">LIFO reasoning</span> in real-time.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={heroCTA}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/demo">
              <motion.button
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.98 }}
                transition={springTransition}
                className="group flex items-center gap-3 px-8 py-4 rounded-xl font-semibold text-lg
                         bg-primary text-primary-foreground neon-glow-purple
                         hover:bg-primary/90 transition-colors"
              >
                <Zap className="w-5 h-5" />
                Try Demo
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>
            
            <Link to="/how-it-works">
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={springTransition}
                className="flex items-center gap-2 px-6 py-4 rounded-xl font-medium
                         glass-panel-hover text-foreground"
              >
                <Eye className="w-5 h-5" />
                How It Works
              </motion.button>
            </Link>
          </motion.div>

          {/* Feature highlights */}
          <motion.div
            variants={fadeInUp}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-12 max-w-3xl mx-auto"
          >
            {[
              { icon: Layers, label: '3D Stack Viz', desc: 'Watch LIFO in action' },
              { icon: Sparkles, label: 'Live Processing', desc: 'Real-time reasoning bars' },
              { icon: Eye, label: 'Full Transparency', desc: 'Explainable AI thinking' },
            ].map((feature, index) => (
              <motion.div
                key={feature.label}
                variants={fadeInUp}
                whileHover={{ y: -4 }}
                className="glass-panel-hover p-4 text-center"
              >
                <feature.icon className="w-8 h-8 mx-auto mb-3 text-primary" />
                <h3 className="font-semibold text-foreground mb-1">{feature.label}</h3>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Animated preview - simplified 2D stack */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="mt-16 mb-8"
        >
          <PreviewAnimation />
        </motion.div>
      </div>
    </InfiniteGrid>
  );
};

// Animated preview showing stack operations
const PreviewAnimation: React.FC = () => {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const blocks = ['Analyze', 'Process', 'Verify', 'Output'];

  React.useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % (blocks.length + 1));
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative">
      {/* Decorative glow */}
      <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
      
      <div className="relative glass-panel p-6 min-w-[280px]">
        <div className="text-xs font-mono text-muted-foreground mb-4 text-center">
          LIFO Stack Demo
        </div>
        
        <div className="flex flex-col-reverse gap-2">
          {blocks.map((block, index) => {
            const isVisible = index < activeIndex;
            const isActive = index === activeIndex - 1;
            
            return (
              <motion.div
                key={block}
                initial={{ opacity: 0, scale: 0.8, y: -20 }}
                animate={{
                  opacity: isVisible ? 1 : 0,
                  scale: isVisible ? 1 : 0.8,
                  y: isVisible ? 0 : -20,
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className={`
                  px-4 py-3 rounded-lg text-center font-medium text-sm
                  ${isActive 
                    ? 'stack-block-active text-foreground' 
                    : 'stack-block text-muted-foreground'
                  }
                `}
              >
                {block}
              </motion.div>
            );
          })}
        </div>
        
        {/* Base */}
        <div className="mt-4 pt-4 border-t border-border/50">
          <div className="h-2 rounded-full bg-gradient-to-r from-neon-purple/50 to-neon-cyan/50" />
        </div>
      </div>
    </div>
  );
};

export default Hero;
