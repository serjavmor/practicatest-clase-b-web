import React from 'react';
import { motion } from 'framer-motion';
import { PackageOpen, Package } from 'lucide-react';

export default function AnimatedChest({ size = 40, color = "#ff9600", isOpen = false }) {
  if (isOpen) {
    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1, y: [0, -10, 0] }}
        transition={{ duration: 0.5, type: "spring" }}
        style={{ display: 'inline-block', color }}
      >
        <PackageOpen size={size} strokeWidth={2.5} />
      </motion.div>
    );
  }

  return (
    <motion.div
      animate={{ 
        y: [0, -5, 0],
        rotate: [0, -5, 5, -5, 0]
      }}
      transition={{ 
        duration: 1.5, 
        repeat: Infinity, 
        ease: "easeInOut",
        repeatDelay: 1
      }}
      style={{ display: 'inline-block', color }}
    >
      <Package size={size} strokeWidth={2.5} />
    </motion.div>
  );
}
