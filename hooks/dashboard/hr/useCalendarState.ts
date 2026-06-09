import { Interview, ViewMode } from "@/types/calendar";

import { useState, useMemo } from "react";

export interface CalendarState {
  interviews: Interview[];
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
  selectedDate: Date | null;
  setSelectedDate: (date: Date | null) => void;
  selectedInterview: Interview | null;
  setSelectedInterview: (interview: Interview | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  today: Date;
  year: number;
  month: number;
}

export function useCalendarState(
  initialInterviews: Interview[],
): CalendarState {
  const [interviews] = useState<Interview[]>(initialInterviews);
  const [viewMode, setViewMode] = useState<ViewMode>("week");
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState<string>("");

  const today = useMemo(() => new Date(), []);
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  return {
    interviews,
    viewMode,
    setViewMode,
    currentDate,
    setCurrentDate,
    selectedDate,
    setSelectedDate,
    selectedInterview,
    setSelectedInterview,
    searchQuery,
    setSearchQuery,
    today,
    year,
    month,
  };
}
