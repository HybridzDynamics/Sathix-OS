import React from 'react';
import { motion } from 'framer-motion';
import { JourneyState } from '../types';

interface AIOrbProps {
  state: JourneyState;
}

export const AIOrb: React.FC<AIOrbProps> = ({ state }) => {
  // Define variants for the Orb based on the journey state
  const orbVariants = {
    idle: {
      scale: [1, 1.05, 1],
      rotate: 0,
      borderRadius: ["50%", "45%", "50%"],
      boxShadow: "0px 0px 40px rgba(6, 182, 212, 0.4)",
      transition: { duration: 4, repeat: Infinity, ease: "easeInOut" }
    },
    listening: {
      scale: [1, 1.2, 1.1, 1.25, 1],
      rotate: 0,
      borderRadius: ["50%", "40%", "50%", "35%", "50%"],
      boxShadow: "0px 0px 80px rgba(168, 85, 247, 0.7)",
      transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
    },
    thinking: {
      scale: 0.9,
      rotate: 360,
      borderRadius: ["50%", "30%", "50%"],
      boxShadow: "0px 0px 60px rgba(59, 130, 246, 0.6)",
      transition: { duration: 2, repeat: Infinity, ease: "linear" }
    },
    interview: {
      scale: 0.8,
      y: -150, // Move up to make space for canvas
      boxShadow: "0px 0px 30px rgba(6, 182, 212, 0.3)",
      transition: { duration: 1, type: "spring", bounce: 0.4 }
    },
    roadmap: {
      scale: 0.6,
      y: -300,
      opacity: 0.5,
      boxShadow: "0px 0px 20px rgba(16, 185, 129, 0.3)",
      transition: { duration: 1.2, type: "spring", bounce: 0.3 }
    }
  };

  const coreGlowVariants = {
    idle: { background: "radial-gradient(circle, #22d3ee 0%, #0369a1 100%)" },
    listening: { background: "radial-gradient(circle, #e879f9 0%, #7e22ce 100%)" },
    thinking: { background: "radial-gradient(circle, #60a5fa 0%, #1e3a8a 100%)" },
    interview: { background: "radial-gradient(circle, #22d3ee 0%, #0369a1 100%)" },
    roadmap: { background: "radial-gradient(circle, #34d399 0%, #065f46 100%)" },
  };

  return (
    <motion.div
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center z-10"
      initial="idle"
      animate={state}
      variants={orbVariants}
    >
      {/* Outer Glow Ring */}
      <motion.div
        className="absolute w-48 h-48 rounded-full border border-white/10"
        animate={{
          rotate: state === 'thinking' ? -360 : 180,
          scale: state === 'listening' ? [1, 1.3, 1] : 1,
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
      />
      
      {/* Secondary Ring */}
      <motion.div
        className="absolute w-32 h-32 rounded-full border-2 border-dashed border-cyan-500/30"
        animate={{
          rotate: state === 'thinking' ? 360 : -90,
          opacity: state === 'idle' ? 0.3 : 0.8,
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      />

      {/* Core Orb */}
      <motion.div
        className="w-24 h-24 rounded-full flex items-center justify-center overflow-hidden relative backdrop-blur-xl"
        variants={coreGlowVariants}
      >
        {/* Dynamic Inner Highlight */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-transparent via-white/40 to-transparent mix-blend-overlay"></div>
        <div className="absolute -top-4 -left-4 w-12 h-12 bg-white/60 blur-xl rounded-full"></div>
      </motion.div>
    </motion.div>
  );
};
