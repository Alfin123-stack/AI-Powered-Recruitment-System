"use client";

// LiveCountdown.tsx — Client Component
// CSR: pakai useEffect untuk update setiap 30 detik

import { useEffect, useState } from "react";
import { Timer } from "lucide-react";
import { getCountdown } from "./utils";

interface LiveCountdownProps {
  scheduledAt: string;
}

export default function LiveCountdown({ scheduledAt }: LiveCountdownProps) {
  const [text, setText] = useState(() => getCountdown(scheduledAt));

  useEffect(() => {
    const id = setInterval(() => setText(getCountdown(scheduledAt)), 30_000);
    return () => clearInterval(id);
  }, [scheduledAt]);

  const isUrgent =
    new Date(scheduledAt).getTime() - Date.now() < 3_600_000;

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
