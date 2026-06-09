// @/components/hr/calendar/CalendarSidebar.tsx
// Left sidebar: "Add Schedule" button, mini calendar, avatar stack, and refresh button

import Link from "next/link";
import { motion } from "framer-motion";
import { Plus, RefreshCw } from "lucide-react";

import { type Interview, type ViewMode } from "@/types/calendar";
import { Avatar } from "./CalendarEventCard";
import { MiniCalendar } from "./CalendarMiniCalendar";

interface CalendarSidebarProps {
  year: number;
  month: number;
  today: Date;
  selectedDate: Date | null;
  currentDate: Date;
  interviews: Interview[];
  viewMode: ViewMode;
  onSelectDate: (date: Date) => void;
  onChangeMonth: (dir: -1 | 1) => void;
}

export function CalendarSidebar({
  year,
  month,
  today,
  selectedDate,
  currentDate,
  interviews,
  viewMode,
  onSelectDate,
  onChangeMonth,
}: CalendarSidebarProps) {
  return (
    <div
      className="cal-scroll flex-shrink-0 flex flex-col overflow-y-auto overflow-x-hidden border-r border-emerald-500/10"
      style={{ width: 240 }}>
      {/* Add schedule button */}
      <div className="px-4 pt-6 pb-4">
        <Link href="/dashboard/hr/interviews">
          <motion.button
            whileHover={{ y: -1, transition: { duration: 0.15 } }}
            type="button"
            title="Add interview schedule"
            className="w-full flex items-center justify-center gap-[6px] rounded-[11px] font-semibold text-[12.5px] transition-all py-[9px] bg-emerald-500/10 border border-emerald-500/[0.28] text-emerald-500 hover:bg-emerald-500/20 cursor-pointer">
            <Plus size={14} />
            Add Schedule
          </motion.button>
        </Link>
      </div>

      {/* Mini calendar */}
      <div className="px-4 pb-4">
        <div className="rounded-[16px] p-4 bg-[#0f1612] border border-emerald-500/10">
          <MiniCalendar
            year={year}
            month={month}
            today={today}
            selectedDate={selectedDate}
            interviews={interviews}
            onSelectDate={(d: Date) => {
              onSelectDate(d);
            }}
            onChangeMonth={onChangeMonth}
          />
        </div>
      </div>

      {/* Bottom: avatar stack + refresh */}
      <AvatarFooter interviews={interviews} />
    </div>
  );
}

// ── Avatar footer sub-component ──────────────────────────────────────────────
function AvatarFooter({ interviews }: { interviews: Interview[] }) {
  return (
    <div className="mt-auto px-4 pb-5 flex items-center justify-between">
      <div className="flex items-center">
        {interviews.slice(0, 3).map((iv, i) => (
          <div
            key={(iv?.candidate_name ?? `avatar-${i}`) + i}
            style={{ marginLeft: i === 0 ? 0 : -8, zIndex: 3 - i }}>
            <Avatar
              name={iv?.candidate_name ?? ""}
              src={iv?.interviewer_avatar ?? undefined}
              size={30}
            />
          </div>
        ))}
        {interviews.length > 3 && (
          <div
            className="w-[30px] h-[30px] rounded-full flex items-center justify-center text-[9px] font-bold bg-emerald-500/[0.12] text-emerald-500 border border-emerald-500/[0.22]"
            style={{ marginLeft: -8, zIndex: 0 }}>
            +{interviews.length - 3}
          </div>
        )}
      </div>
      <button
        title="Refresh interviews"
        type="button"
        className="w-7 h-7 rounded-full flex items-center justify-center transition-colors border border-emerald-500/10 text-[#7a9585] bg-transparent hover:bg-emerald-500/[0.08] hover:text-emerald-500 cursor-pointer">
        <RefreshCw size={12} />
      </button>
    </div>
  );
}
