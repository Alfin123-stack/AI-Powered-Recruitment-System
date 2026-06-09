"use client";

import { motion } from "framer-motion";

interface SavedJobsFadeInProps {
  children: React.ReactNode;
  delay?: number;
}

export default function SavedJobsFadeIn({
  children,
  delay = 0,
}: SavedJobsFadeInProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}
