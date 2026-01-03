import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, FileText, Sparkles } from 'lucide-react';

interface FinalResponseProps {
  response: string;
  onReset: () => void;
}

const FinalResponse: React.FC<FinalResponseProps> = ({ response, onReset }) => {
  // Simple markdown-ish parsing for display
  const formatResponse = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, index) => {
      if (line.startsWith('## ')) {
        return (
          <h2 key={index} className="text-xl font-bold text-foreground mt-4 mb-2 gradient-text-purple-cyan">
            {line.replace('## ', '')}
          </h2>
        );
      }
      if (line.startsWith('### ')) {
        return (
          <h3 key={index} className="text-lg font-semibold text-foreground mt-3 mb-1">
            {line.replace('### ', '')}
          </h3>
        );
      }
      if (line.startsWith('**') && line.endsWith('**')) {
        return (
          <p key={index} className="font-semibold text-foreground my-2">
            {line.replace(/\*\*/g, '')}
          </p>
        );
      }
      if (line.startsWith('- ')) {
        return (
          <li key={index} className="text-muted-foreground ml-4 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-neon-green mt-0.5 flex-shrink-0" />
            <span>{line.replace('- ', '')}</span>
          </li>
        );
      }
      if (line.match(/^\d+\./)) {
        return (
          <p key={index} className="text-muted-foreground font-mono text-sm my-1">
            {line}
          </p>
        );
      }
      if (line.startsWith('*') && line.endsWith('*')) {
        return (
          <p key={index} className="text-sm text-primary italic mt-4">
            {line.replace(/\*/g, '')}
          </p>
        );
      }
      if (line.trim() === '') {
        return <br key={index} />;
      }
      return (
        <p key={index} className="text-muted-foreground">
          {line}
        </p>
      );
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      className="glass-panel p-6 space-y-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-neon-green/20">
            <Sparkles className="w-5 h-5 text-neon-green" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Processing Complete</h3>
            <p className="text-sm text-muted-foreground">Stack successfully processed</p>
          </div>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onReset}
          className="px-4 py-2 rounded-lg text-sm font-medium glass-panel-hover"
        >
          Try Another
        </motion.button>
      </div>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      {/* Response content */}
      <div className="space-y-1">
        {formatResponse(response)}
      </div>

      {/* Success particles effect */}
      <div className="relative h-8 overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-neon-green"
            initial={{ 
              x: '50%', 
              y: 0, 
              scale: 0,
              opacity: 1 
            }}
            animate={{
              x: `${50 + (Math.random() - 0.5) * 100}%`,
              y: -60,
              scale: [0, 1, 0],
              opacity: [1, 1, 0],
            }}
            transition={{
              duration: 1.5,
              delay: i * 0.15,
              repeat: Infinity,
              repeatDelay: 2,
            }}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default FinalResponse;
