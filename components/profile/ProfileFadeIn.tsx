// @/components/profile/shell/ProfileFadeIn.tsx
// Lightweight animation wrapper using framer-motion.
// Used in ProfileShell to stagger the entrance of each section.

"use client";

import { motion } from "framer-motion";

interface ProfileFadeInProps {
  children: React.ReactNode;
  delay?: number;
}

export function ProfileFadeIn({ children, delay = 0 }: ProfileFadeInProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}
