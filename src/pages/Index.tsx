import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import InfiniteGrid from '@/components/InfiniteGrid';
import { Button } from '@/components/ui/button';
import { Layers, ArrowRight, GitCompare, Brain, Zap, Sparkles } from 'lucide-react';
import { fadeInUp, staggerContainer } from '@/lib/animations';

const Index: React.FC = () => {
  const features = [
    {
      icon: Layers,
      title: 'Interactive Playground',
      description: 'Watch prompts decompose into subtasks and process through the stack in real-time.',
      link: '/playground',
      color: 'bg-primary/10 text-primary',
    },
    {
      icon: GitCompare,
      title: 'Stack vs Queue',
      description: 'Side-by-side comparison proving why LIFO beats FIFO for reasoning tasks.',
      link: '/comparison',
      color: 'bg-emerald-500/10 text-emerald-600',
    },
    {
      icon: Brain,
      title: 'Chain of Thought',
      description: 'Explore nested stack frames and see how complex questions decompose.',
      link: '/chain-of-thought',
      color: 'bg-emerald-600/10 text-emerald-700',
    },
    {
      icon: Zap,
      title: 'Multi-Stack Race',
      description: 'Watch parallel reasoning paths compete, with weak branches getting pruned.',
      link: '/multi-stack',
      color: 'bg-emerald-700/10 text-emerald-800',
    },
  ];

  return (
    <InfiniteGrid>
      <Navigation />
      
      <div className="min-h-screen pt-16">
        {/* Hero Section */}
        <section className="relative py-24 md:py-32 px-4">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="max-w-5xl mx-auto text-center"
          >
            <motion.div variants={fadeInUp} className="mb-6">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                <Sparkles className="w-4 h-4" />
                Stack-Augmented LLM Decoding
              </span>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight"
            >
              See How AI
              <br />
              <span className="gradient-text">Thinks with Stacks</span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8"
            >
              Interactive visualization of how modern LLMs use stack-based reasoning
              for complex problem-solving. Watch LIFO in action as AI processes your prompts.
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link to="/playground">
                <Button size="lg" className="btn-primary-glow text-lg px-8">
                  Try Demo
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/comparison">
                <Button size="lg" variant="outline" className="text-lg px-8">
                  Why Stacks?
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Animated stack preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="max-w-3xl mx-auto mt-16 px-4"
          >
            <div className="glass-panel p-6 rounded-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-destructive/60" />
                  <div className="w-3 h-3 rounded-full bg-warning/60" />
                  <div className="w-3 h-3 rounded-full bg-primary/60" />
                </div>
                <span className="text-xs text-muted-foreground font-mono">stack-visualization.demo</span>
              </div>
              
              <div className="space-y-2">
                {['Analyze user intent', 'Break into subtasks', 'Process sequentially', 'Synthesize response'].map((task, index) => (
                  <motion.div
                    key={task}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + index * 0.15 }}
                    className={`
                      p-3 rounded-lg border flex items-center gap-3
                      ${index === 0 ? 'border-primary bg-accent' : 'border-border bg-card'}
                    `}
                  >
                    <div className={`
                      w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                      ${index === 0 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}
                    `}>
                      {4 - index}
                    </div>
                    <span className="text-sm text-foreground">{task}</span>
                    {index === 0 && (
                      <span className="ml-auto text-xs text-primary font-medium">Processing...</span>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </section>

        {/* Features Grid */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Explore Stack-Based Reasoning
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Four interactive visualizations that demonstrate how stacks power modern AI reasoning
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link to={feature.link}>
                    <div className="glass-panel-hover p-6 h-full group">
                      <div className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-4`}>
                        <feature.icon className="w-6 h-6" />
                      </div>
                      <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground">
                        {feature.description}
                      </p>
                      <div className="mt-4 flex items-center text-primary text-sm font-medium">
                        Explore
                        <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 px-4 bg-muted/30">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                How Stack-Augmented Decoding Works
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                A simple 4-step process that enables deeper, more thorough reasoning
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { step: 1, title: 'Decompose', desc: 'Break prompt into subtasks' },
                { step: 2, title: 'Push', desc: 'Add tasks to the stack' },
                { step: 3, title: 'Process', desc: 'LIFO execution order' },
                { step: 4, title: 'Synthesize', desc: 'Combine results' },
              ].map((item, index) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mx-auto mb-4">
                    {item.step}
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center glass-panel p-12 rounded-2xl"
          >
            <Layers className="w-16 h-16 text-primary mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Ready to See AI Think?
            </h2>
            <p className="text-muted-foreground mb-8">
              Enter your own prompts and watch the stack-augmented decoding process unfold in real-time.
            </p>
            <Link to="/playground">
              <Button size="lg" className="btn-primary-glow text-lg px-10">
                Start Exploring
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="py-8 px-4 border-t border-border">
          <div className="max-w-6xl mx-auto text-center text-sm text-muted-foreground">
            <p>StackViz — Stack-Augmented LLM Decoding Visualization</p>
          </div>
        </footer>
      </div>
    </InfiniteGrid>
  );
};

export default Index;
