"use client";

import { useState } from "react";
import type { Interview } from "@/types/calendar";

function toDateKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function useCalendar(interviews: Interview[]) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const todayKey = toDateKey(today);

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  const interviewMap = new Map<string, Interview[]>();
  interviews.forEach((iv) => {
    const key = toDateKey(new Date(iv.scheduled_at));
    if (!interviewMap.has(key)) interviewMap.set(key, []);
    interviewMap.get(key)!.push(iv);
  });

  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const selectedIvs = selectedDate
    ? (interviewMap.get(selectedDate) ?? [])
    : [];

  const monthInterviewCount = Array.from(interviewMap.entries())
    .filter(([key]) =>
      key.startsWith(`${year}-${String(month + 1).padStart(2, "0")}`),
    )
    .reduce((acc, [, ivs]) => acc + ivs.length, 0);

  const upcomingInterviews = interviews
    .filter(
      (iv) =>
        iv.status === "scheduled" && new Date(iv.scheduled_at) > new Date(),
    )
    .sort(
      (a, b) =>
        new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime(),
    )
    .slice(0, 4);

  const prevMonth = () => {
    setSelectedDate(null);
    if (month === 0) {
      setMonth(11);
      setYear((y) => y - 1);
    } else setMonth((m) => m - 1);
  };

  const nextMonth = () => {
    setSelectedDate(null);
    if (month === 11) {
      setMonth(0);
      setYear((y) => y + 1);
    } else setMonth((m) => m + 1);
  };

  const goToToday = () => {
    setMonth(today.getMonth());
    setYear(today.getFullYear());
    setSelectedDate(todayKey);
  };

  const goToDate = (dateStr: string) => {
    const d = new Date(dateStr);
    setMonth(d.getMonth());
    setYear(d.getFullYear());
    setSelectedDate(toDateKey(d));
  };

  return {
    year,
    month,
    selectedDate,
    setSelectedDate,
    todayKey,
    cells,
    interviewMap,
    selectedIvs,
    monthInterviewCount,
    upcomingInterviews,
    prevMonth,
    nextMonth,
    goToToday,
    goToDate,
  };
}
