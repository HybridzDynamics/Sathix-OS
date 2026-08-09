import React from 'react';
import { motion } from 'framer-motion';
import { JourneyStep } from '../types';
import { Check, ArrowRight, UploadCloud, MapPin, Award } from 'lucide-react';

interface AnimatedRoadmapProps {
  steps: JourneyStep[];
}

export const AnimatedRoadmap: React.FC<AnimatedRoadmapProps> = ({ steps }) => {
  
  const getIconForStep = (title: string) => {
    if (title.toLowerCase().includes('document') || title.toLowerCase().includes('upload')) return <UploadCloud className="w-4 h-4" />;
    if (title.toLowerCase().includes('verification') || title.toLowerCase().includes('inspection')) return <MapPin className="w-4 h-4" />;
    if (title.toLowerCase().includes('disbursal') || title.toLowerCase().includes('benefit')) return <Award className="w-4 h-4" />;
    return <Check className="w-4 h-4" />;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.3, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20, filter: 'blur(5px)' },
    visible: { opacity: 1, x: 0, filter: 'blur(0px)', transition: { type: "spring", bounce: 0.4 } }
  };

  return (
    <motion.div 
      className="w-full max-w-2xl mx-auto mt-8 relative z-20 pointer-events-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="bg-black/30 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-2xl">
        <h3 className="text-white/90 font-semibold mb-6 text-lg tracking-tight">Your Personalized Journey</h3>
        
        <div className="relative pl-4 border-l border-white/10 space-y-8">
          {steps.map((step, idx) => (
            <motion.div key={step.id} variants={itemVariants} className="relative pl-6">
              
              {/* Connector Dot */}
              <div className={`absolute -left-[25px] top-1 w-6 h-6 rounded-full border-2 flex items-center justify-center shadow-lg ${
                step.status === 'completed'
                  ? 'bg-cyan-500 border-cyan-400 text-black'
                  : step.status === 'active'
                  ? 'bg-black border-cyan-400 text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.5)]'
                  : 'bg-black border-white/20 text-white/30'
              }`}>
                {step.status === 'completed' ? <Check className="w-3.5 h-3.5" /> : getIconForStep(step.title)}
              </div>

              {/* Content */}
              <div>
                <h4 className={`text-base font-semibold ${step.status === 'pending' ? 'text-white/50' : 'text-white'}`}>
                  {step.title}
                </h4>
                <p className={`text-sm mt-1 leading-relaxed ${step.status === 'pending' ? 'text-white/30' : 'text-white/70'}`}>
                  {step.description}
                </p>

                {/* Call to Action for Active Step */}
                {step.status === 'active' && step.actionLabel && (
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mt-4 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-sm flex items-center gap-2 transition-colors shadow-[0_0_20px_rgba(6,182,212,0.3)]"
                  >
                    <span>{step.actionLabel}</span>
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
