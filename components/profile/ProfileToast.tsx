// components/profile/ProfileToast.tsx
"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, Info, X } from "lucide-react";
import { Toast, ToastType } from "@/types/profile";

let toastCounter = 0;

export function useProfileToast() {
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

const toastConfig: Record<
  ToastType,
  { containerCls: string; iconCls: string; Icon: React.ElementType }
> = {
  success: {
    containerCls: "bg-[#0f1a14] border-emerald-500/30 text-emerald-300",
    iconCls: "text-emerald-400",
    Icon: CheckCircle2,
  },
  error: {
    containerCls: "bg-[#1a0f0f] border-red-500/30 text-red-300",
    iconCls: "text-red-400",
    Icon: XCircle,
  },
  info: {
    containerCls: "bg-[#0f1318] border-blue-500/30 text-blue-300",
    iconCls: "text-blue-400",
    Icon: Info,
  },
};

export function ProfileToastContainer({
  toasts,
  onRemove,
}: {
  toasts: Toast[];
  onRemove: (id: number) => void;
}) {
  return (
    <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((t) => {
          const { containerCls, iconCls, Icon } = toastConfig[t.type];
          return (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 48, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 48, scale: 0.95 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-[12px] shadow-xl border text-[0.84rem] font-medium min-w-[260px] max-w-[340px] ${containerCls}`}>
              <Icon size={16} className={`${iconCls} flex-shrink-0`} />
              <span className="flex-1">{t.message}</span>
              <button
                title="Close"
                onClick={() => onRemove(t.id)}
                className="text-current opacity-40 hover:opacity-80 transition-opacity cursor-pointer flex-shrink-0">
                <X size={13} />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
