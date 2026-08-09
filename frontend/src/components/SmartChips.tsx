import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface SmartChipsProps {
  options: string[];
  onSelect: (option: string) => void;
}

export const SmartChips: React.FC<SmartChipsProps> = ({ options, onSelect }) => {
  return (
    <motion.div 
      className="flex flex-wrap gap-2 mt-4 pointer-events-auto relative z-20"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, staggerChildren: 0.1 }}
    >
      {options.map((opt, idx) => (
        <motion.button
          key={idx}
          onClick={() => onSelect(opt)}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05, backgroundColor: 'rgba(6, 182, 212, 0.15)' }}
          whileTap={{ scale: 0.95 }}
          className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/80 text-sm flex items-center gap-2 backdrop-blur-md transition-colors hover:text-cyan-300 hover:border-cyan-500/30 shadow-lg"
        >
          <Sparkles className="w-3.5 h-3.5 opacity-50" />
          <span>{opt}</span>
        </motion.button>
      ))}
    </motion.div>
  );
};
