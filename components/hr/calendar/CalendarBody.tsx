// @/components/hr/calendar/CalendarBody.tsx
// Animated view switcher: renders CalendarWeekView, CalendarMonthView, or CalendarDayView
// based on the active viewMode, with fade transition via AnimatePresence

import { motion, AnimatePresence } from "framer-motion";

import { WeekView } from "./CalendarWeekView";
import { MonthView } from "./CalendarMonthView";
import { DayView } from "./CalendarDayView";
import { Interview, ViewMode } from "@/types/calendar";

interface CalendarBodyProps {
  viewMode: ViewMode;
  currentDate: Date;
  today: Date;
  year: number;
  month: number;
  interviews: Interview[];
  selectedDate: Date | null;
  onSelectDate: (date: Date) => void;
  onSelectInterview: (interview: Interview) => void;
}

const FADE = { duration: 0.15 };

export function CalendarBody({
  viewMode,
  currentDate,
  today,
  year,
  month,
  interviews,
  selectedDate,
  onSelectDate,
  onSelectInterview,
}: CalendarBodyProps) {
  return (
    <div className="flex-1 min-h-0 overflow-hidden">
      <AnimatePresence mode="wait">
        {viewMode === "week" && (
          <motion.div
            key="week"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={FADE}
            className="h-full">
            <WeekView
              currentDate={currentDate}
              today={today}
              interviews={interviews}
              onSelectInterview={onSelectInterview}
            />
          </motion.div>
        )}

        {viewMode === "month" && (
          <motion.div
            key="month"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={FADE}
            className="h-full">
            <MonthView
              year={year}
              month={month}
              today={today}
              interviews={interviews}
              selectedDate={selectedDate}
              onSelectDate={(d: Date) => {
                onSelectDate(d);
              }}
              onSelectInterview={onSelectInterview}
            />
          </motion.div>
        )}

        {viewMode === "day" && (
          <motion.div
            key="day"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={FADE}
            className="h-full">
            <DayView
              currentDate={currentDate}
              today={today}
              interviews={interviews}
              onSelectInterview={onSelectInterview}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
