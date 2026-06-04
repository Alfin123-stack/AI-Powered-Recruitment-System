"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, X } from "lucide-react";

export type ToastType = "success" | "error";
export type Toast = { id: number; type: ToastType; message: string };

let toastCounter = 0;

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback(
    (type: ToastType, message: string, duration = 3500) => {
      const id = ++toastCounter;
      setToasts((prev) => [...prev, { id, type, message }]);
      setTimeout(
        () => setToasts((prev) => prev.filter((t) => t.id !== id)),
        duration,
      );
    },
    [],
  );

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { toasts, addToast, removeToast };
}

// ── UI Component ──────────────────────────────────────────────────────────────

export function ToastContainer({
  toasts,
  onRemove,
}: {
  toasts: Toast[];
  onRemove: (id: number) => void;
}) {
  return (
    <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, x: 48, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 48, scale: 0.95 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-[12px] shadow-xl border text-[0.84rem] font-medium min-w-[260px] max-w-[340px]
              ${
                t.type === "success"
                  ? "bg-[#0f1a14] border-emerald-500/30 text-emerald-300"
                  : "bg-[#1a0f0f] border-red-500/30 text-red-300"
              }`}>
            {t.type === "success" ? (
              <CheckCircle2
                size={16}
                className="text-emerald-400 flex-shrink-0"
              />
            ) : (
              <XCircle size={16} className="text-red-400 flex-shrink-0" />
            )}
            <span className="flex-1">{t.message}</span>
            <button
              title="Tutup"
              onClick={() => onRemove(t.id)}
              className="text-current opacity-40 hover:opacity-80 transition-opacity cursor-pointer flex-shrink-0">
              <X size={13} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
