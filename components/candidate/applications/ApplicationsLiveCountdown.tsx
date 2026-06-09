"use client";

// ApplicationsLiveCountdown.tsx — Client Component
// CSR: uses useEffect to update every 30 seconds

import { useEffect, useState } from "react";
import { Timer } from "lucide-react";
import { getCountdown } from "../../../lib/helpers/candidate/applications";

interface LiveCountdownProps {
  scheduledAt: string;
}

export default function ApplicationsLiveCountdown({ scheduledAt }: LiveCountdownProps) {
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
