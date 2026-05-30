"use client";

// components/blog/blog-components.tsx
// Shared client utilities.
// FadeIn menggunakan framer-motion (tetap client).
// SkeletonCard dipertahankan untuk backward compat tapi DevToSkeleton lebih dianjurkan.

import { ReactNode } from "react";
import { motion } from "framer-motion";

export function FadeIn({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}>
      {children}
    </motion.div>
  );
}

// Legacy skeleton — gunakan DevToSkeleton untuk Suspense fallback
export function SkeletonCard() {
  return (
    <div className="bg-[#080d0b] border border-emerald-500/10 rounded-[16px] overflow-hidden">
      <div className="h-[140px] bg-emerald-500/[0.05] animate-pulse" />
      <div className="p-5 flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-emerald-500/10 animate-pulse" />
          <div className="h-2 w-24 bg-emerald-500/10 rounded animate-pulse" />
        </div>
        <div className="h-4 w-full bg-emerald-500/[0.07] rounded animate-pulse" />
        <div className="h-4 w-4/5 bg-emerald-500/[0.07] rounded animate-pulse" />
        <div className="h-3 w-3/5 bg-emerald-500/[0.05] rounded animate-pulse mt-1" />
        <div className="flex gap-1 mt-1">
          <div className="h-4 w-12 bg-emerald-500/[0.04] rounded-full animate-pulse" />
          <div className="h-4 w-16 bg-emerald-500/[0.04] rounded-full animate-pulse" />
        </div>
        <div className="h-[1px] bg-emerald-500/[0.07] mt-1" />
        <div className="flex justify-between">
          <div className="h-3 w-20 bg-emerald-500/[0.05] rounded animate-pulse" />
          <div className="h-3 w-12 bg-emerald-500/[0.05] rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
}
