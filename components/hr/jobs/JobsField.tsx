"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle } from "lucide-react";

interface JobsFieldProps {
  label: string;
  children: React.ReactNode;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
}

export function JobsField({
  label,
  children,
  error,
  hint,
  icon,
}: JobsFieldProps) {
  return (
    <div className="flex flex-col gap-[5px]">
      <label className="flex items-center gap-[6px] text-[0.7rem] font-semibold text-[#5a8070] tracking-[0.08em] uppercase">
        {icon && <span className="opacity-60">{icon}</span>}
        {label}
      </label>
      <div className="relative">{children}</div>
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -4, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -4, height: 0 }}
            transition={{ duration: 0.15 }}
            className="flex items-center gap-[5px] text-[0.72rem] text-red-400">
            <AlertCircle size={10} />
            {error}
          </motion.div>
        )}
      </AnimatePresence>
      {!error && hint && <p className="text-[0.7rem] text-[#3d5c49]">{hint}</p>}
    </div>
  );
}
