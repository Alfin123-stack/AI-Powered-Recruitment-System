import { useState, useMemo } from "react";
import type { Interview } from "@/types/hr/dashboard";
import { isToday } from "@/lib/utils";

type CalendarCell = number | null;

export function useMiniCalendar(interviews: Interview[]) {
  const [current, setCurrent] = useState(new Date());
  const today = new Date();
  const year = current.getFullYear();
  const month = current.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const interviewDays = useMemo(() => {
    const days = new Set<number>();
    interviews.forEach((iv) => {
      const d = new Date(iv.scheduled_at);
      if (d.getMonth() === month && d.getFullYear() === year)
        days.add(d.getDate());
    });
    return days;
  }, [interviews, month, year]);

  const prevMonth = (): void => setCurrent(new Date(year, month - 1, 1));
  const nextMonth = (): void => setCurrent(new Date(year, month + 1, 1));

  const cells = useMemo((): CalendarCell[] => {
    const result: CalendarCell[] = [];
    for (let i = 0; i < firstDay; i++) result.push(null);
    for (let d = 1; d <= daysInMonth; d++) result.push(d);
    while (result.length % 7 !== 0) result.push(null);
    return result;
  }, [firstDay, daysInMonth]);

  const todayInterviews = useMemo(
    () =>
      interviews.filter(
        (iv) => isToday(iv.scheduled_at) && iv.status === "scheduled",
      ),
    [interviews],
  );

  return {
    today,
    year,
    month,
    interviewDays,
    prevMonth,
    nextMonth,
    cells,
    todayInterviews,
  };
}
