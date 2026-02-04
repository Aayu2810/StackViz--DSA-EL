import React from 'react';
import { motion } from 'framer-motion';
import { Calculator, FlaskConical, Code, MapPin, Sparkles } from 'lucide-react';

interface CategoryChipsProps {
  onSelect: (prompt: string) => void;
  disabled?: boolean;
}

const categories = [
  {
    icon: Calculator,
    label: 'Math',
    prompt: 'Solve the Fibonacci sequence for n=10 step by step, explaining each calculation',
    color: 'hover:border-primary hover:bg-accent',
  },
  {
    icon: FlaskConical,
    label: 'Science',
    prompt: 'Explain photosynthesis step by step, from light absorption to glucose production',
    color: 'hover:border-primary hover:bg-accent',
  },
  {
    icon: Code,
    label: 'Tech',
    prompt: 'How does React rendering work? Explain the virtual DOM and reconciliation process',
    color: 'hover:border-primary hover:bg-accent',
  },
  {
    icon: MapPin,
    label: 'Planning',
    prompt: 'Plan a weekend trip to Paris including flights, hotels, and must-see attractions',
    color: 'hover:border-primary hover:bg-accent',
  },
  {
    icon: Sparkles,
    label: 'Creative',
    prompt: 'Write a short story about an AI that learns to paint, exploring themes of creativity',
    color: 'hover:border-primary hover:bg-accent',
  },
];

const CategoryChips: React.FC<CategoryChipsProps> = ({ onSelect, disabled }) => {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {categories.map((category, index) => (
        <motion.button
          key={category.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          onClick={() => onSelect(category.prompt)}
          disabled={disabled}
          className={`
            chip flex items-center gap-2 
            ${category.color}
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-all duration-200
          `}
        >
          <category.icon className="w-4 h-4" />
          <span>{category.label}</span>
        </motion.button>
      ))}
    </div>
  );
};

export default CategoryChips;
