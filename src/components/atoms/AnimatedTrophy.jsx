import React from 'react';
import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';

export default function AnimatedTrophy({ size = 40, color = "#ffb300" }) {
  return (
    <motion.div
      initial={{ scale: 0.8, rotate: -10 }}
      animate={{ 
        scale: [1, 1.2, 1],
        rotate: [-10, 10, -10],
      }}
      transition={{ 
        duration: 2, 
        repeat: Infinity, 
        ease: "easeInOut" 
      }}
      style={{ display: 'inline-block', color }}
    >
      <Trophy size={size} strokeWidth={2.5} />
    </motion.div>
  );
}
