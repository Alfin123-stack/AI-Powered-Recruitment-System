// @/components/hr/calendar/CalendarHeader.tsx
// Displays page header: icon, title, and schedule description

import { Calendar } from "lucide-react";

interface CalendarHeaderProps {
  totalInterviews: number;
}

export function CalendarHeader({ totalInterviews }: CalendarHeaderProps) {
  return (
    <div className="mb-4">
      <div className="flex items-center gap-3 mb-1">
        <div className="w-8 h-8 rounded-[9px] flex items-center justify-center bg-emerald-500/15 text-emerald-500">
          <Calendar size={15} />
        </div>
        <h1 className="text-[1.35rem] font-black tracking-tight text-[#e8f5ee]">
          Calendar
        </h1>
      </div>
      <p className="text-[0.75rem] ml-11 text-[#7a9585]">
        Interview schedule — {totalInterviews} schedules registered
      </p>
    </div>
  );
}
