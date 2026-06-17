"use client";

import { useEffect, useState } from "react";
import { Timer } from "lucide-react";
import { getCountdown } from "@/lib/helpers/candidate/applications";

interface LiveCountdownProps {
  scheduledAt: string;
} 

export default function ApplicationsLiveCountdown({
  scheduledAt,
}: LiveCountdownProps) {
  const [text, setText] = useState(() => getCountdown(scheduledAt));
  const [isUrgent, setIsUrgent] = useState(
    () => new Date(scheduledAt).getTime() - Date.now() < 3_600_000,
  );

  useEffect(() => {
    const update = () => {
      setText(getCountdown(scheduledAt));
      setIsUrgent(new Date(scheduledAt).getTime() - Date.now() < 3_600_000);
    };
    const id = setInterval(update, 30_000);
    return () => clearInterval(id);
  }, [scheduledAt]);

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
