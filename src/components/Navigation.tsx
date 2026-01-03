import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Layers, Play, BookOpen, Github } from 'lucide-react';
import { cn } from '@/lib/utils';

const Navigation: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home', icon: Layers },
    { path: '/demo', label: 'Try Demo', icon: Play },
    { path: '/how-it-works', label: 'How It Works', icon: BookOpen },
  ];

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mt-4 flex items-center justify-between glass-panel px-6 py-3">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/50 blur-lg group-hover:blur-xl transition-all duration-300" />
              <Layers className="relative w-8 h-8 text-primary" />
            </div>
            <span className="font-semibold text-lg gradient-text-purple-cyan hidden sm:block">
              StackViz
            </span>
          </Link>

          {/* Nav links */}
          <div className="flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    'relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'text-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute inset-0 bg-primary/10 rounded-lg border border-primary/20"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <Icon className="relative w-4 h-4" />
                  <span className="relative hidden sm:block">{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* GitHub link */}
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <Github className="w-4 h-4" />
            <span className="hidden sm:block">GitHub</span>
          </a>
        </div>
      </nav>
    </motion.header>
  );
};

export default Navigation;
