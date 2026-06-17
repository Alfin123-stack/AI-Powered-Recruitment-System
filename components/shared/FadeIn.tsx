"use client";

// shared/components/ui/FadeIn.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Wrapper animasi fade-in + slide-up menggunakan Framer Motion.
// Dipakai di candidate & HR dashboard.
// ─────────────────────────────────────────────────────────────────────────────

import { motion } from "framer-motion";

interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  y?: number;
}

export function FadeIn({ children, delay = 0, y = 18 }: FadeInProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}
