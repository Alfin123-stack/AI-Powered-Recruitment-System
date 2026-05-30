"use client";

import { useState, useEffect } from "react";
import { Timer } from "lucide-react";

const getCountdown = (targetDate: string): string => {
  const diff = new Date(targetDate).getTime() - Date.now();
  if (diff <= 0) return "Sudah dimulai";
  const h = Math.floor(diff / 3_600_000);
  const m = Math.floor((diff % 3_600_000) / 60_000);
  if (h >= 24) return `${Math.floor(h / 24)} hari lagi`;
  if (h > 0) return `${h} jam ${m} menit lagi`;
  return `${m} menit lagi`;
};

interface LiveCountdownProps {
  scheduledAt: string;
}

export default function LiveCountdown({ scheduledAt }: LiveCountdownProps) {
  const [text, setText] = useState(() => getCountdown(scheduledAt));

  useEffect(() => {
    const id = setInterval(() => setText(getCountdown(scheduledAt)), 30_000);
    return () => clearInterval(id);
  }, [scheduledAt]);

  const isUrgent = new Date(scheduledAt).getTime() - Date.now() < 3_600_000;

  return (
    <span
      className={`flex items-center gap-1 text-[0.72rem] font-bold tabular-nums ${
        isUrgent ? "text-amber-400 animate-pulse" : "text-cyan-400"
      }`}>
      <Timer size={11} />
      {text}
    </span>
  );
}
