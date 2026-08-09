import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatMessage } from '../types';
import { Bot, User } from 'lucide-react';

interface ConversationCanvasProps {
  messages: ChatMessage[];
}

export const ConversationCanvas: React.FC<ConversationCanvasProps> = ({ messages }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <motion.div 
      className="fixed inset-0 z-20 flex flex-col justify-end pointer-events-none pb-32 pt-24"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div 
        ref={scrollRef}
        className="max-w-3xl w-full mx-auto px-4 overflow-y-auto no-scrollbar flex flex-col gap-6 pointer-events-auto mask-image-fade"
        style={{
          WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 15%, black 90%, transparent)'
        }}
      >
        <AnimatePresence initial={false}>
          {messages.map((msg, idx) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 20, scale: 0.95, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
              transition={{ type: "spring", bounce: 0.3, duration: 0.6, delay: msg.sender === 'ai' ? 0.2 : 0 }}
              className={`flex w-full ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex gap-3 max-w-[85%] ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                
                {/* Avatar */}
                <div className="shrink-0 mt-1">
                  {msg.sender === 'ai' ? (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.5)]">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center">
                      <User className="w-4 h-4 text-white/70" />
                    </div>
                  )}
                </div>

                {/* Message Bubble */}
                <div 
                  className={`px-5 py-4 rounded-3xl text-[15px] leading-relaxed shadow-xl backdrop-blur-2xl ${
                    msg.sender === 'user'
                      ? 'bg-white/10 text-white border border-white/10 rounded-tr-sm'
                      : 'bg-black/40 text-white/90 border border-cyan-500/20 rounded-tl-sm shadow-[0_4px_30px_rgba(0,0,0,0.5)]'
                  }`}
                >
                  {/* Parsing markdown-like bold syntax crudely for demo purposes */}
                  {msg.text.split('**').map((part, i) => (
                    i % 2 === 1 ? <strong key={i} className={msg.sender === 'ai' ? 'text-cyan-300 font-semibold' : 'font-semibold'}>{part}</strong> : part
                  ))}
                  
                  {msg.isStreaming && (
                    <motion.span
                      animate={{ opacity: [0, 1, 0] }}
                      transition={{ duration: 0.8, repeat: Infinity }}
                      className="inline-block w-1.5 h-4 ml-1 bg-cyan-400 translate-y-0.5"
                    />
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {/* Extra spacing at bottom to not hit the dock exactly */}
        <div className="h-4 w-full shrink-0"></div>
      </div>
    </motion.div>
  );
};
