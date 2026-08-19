import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Send, Paperclip, Languages, X } from 'lucide-react';

interface VoiceDockProps {
  onSendMessage: (msg: string) => void;
  onVoiceToggle: () => void;
  isListening: boolean;
}

export const VoiceDock: React.FC<VoiceDockProps> = ({ onSendMessage, onVoiceToggle, isListening }) => {
  const [inputValue, setInputValue] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSendMessage(inputValue);
      setInputValue('');
      setIsExpanded(false);
    }
  };

  return (
    <motion.div
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-end justify-center"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", damping: 20, stiffness: 100 }}
    >
      <motion.div
        className="bg-black/40 backdrop-blur-3xl border border-white/10 rounded-full p-2 flex items-center gap-2 shadow-[0_0_40px_rgba(0,0,0,0.5)] overflow-hidden"
        animate={{
          width: isExpanded ? 400 : 'auto',
          borderRadius: isExpanded ? '24px' : '9999px',
        }}
        transition={{ type: "spring", bounce: 0.2 }}
      >
        {/* Language & Actions (Hidden when expanded on mobile, visible on desktop or when expanded) */}
        <AnimatePresence>
          {!isExpanded && (
            <motion.button
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 'auto', opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/70 transition-colors shrink-0"
              title="Change Language"
            >
              <Languages className="w-5 h-5" />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Text Input Expansion Trigger */}
        <AnimatePresence>
          {!isExpanded && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 120, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="px-4 text-white/50 text-sm cursor-text shrink-0"
              onClick={() => setIsExpanded(true)}
            >
              Type a message...
            </motion.div>
          )}
        </AnimatePresence>

        {/* Expanded Form */}
        <AnimatePresence>
          {isExpanded && (
            <motion.form
              initial={{ opacity: 0, flex: 0 }}
              animate={{ opacity: 1, flex: 1 }}
              exit={{ opacity: 0, flex: 0 }}
              onSubmit={handleSubmit}
              className="flex items-center gap-2 px-2 overflow-hidden w-full"
            >
              <button type="button" className="text-white/50 hover:text-white/90">
                <Paperclip className="w-5 h-5" />
              </button>
              <input
                autoFocus
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask SathiX..."
                className="bg-transparent border-none outline-none text-white text-sm w-full placeholder-white/40"
              />
              <button 
                type="submit"
                disabled={!inputValue.trim()}
                className="w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center text-black disabled:opacity-50 disabled:bg-white/20 shrink-0"
              >
                <Send className="w-4 h-4 ml-0.5" />
              </button>
              <button
                type="button"
                onClick={() => setIsExpanded(false)}
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/70 shrink-0 ml-1"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Primary Voice Button */}
        <motion.button
          onClick={() => {
            setIsExpanded(false);
            onVoiceToggle();
          }}
          className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-colors ${
            isListening
              ? 'bg-purple-500 text-white shadow-[0_0_20px_rgba(168,85,247,0.5)]'
              : 'bg-white/10 hover:bg-white/20 text-white'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Mic className="w-5 h-5" />
        </motion.button>
      </motion.div>
    </motion.div>
  );
};
