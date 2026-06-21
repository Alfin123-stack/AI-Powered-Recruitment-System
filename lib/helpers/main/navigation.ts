// @/components/hr/calendar/utils/navigation.ts
// Pure functions untuk navigasi periode dan kalkulasi header label
// Semua fungsi stateless — mudah di-unit test tanpa React

import { MONTHS_EN } from "@/constants/calendar";
import { ViewMode } from "@/types/calendar";
import { getWeekDays } from "../hr/calendar";

/**
 * Mengembalikan Date baru hasil navigasi prev/next
 * berdasarkan viewMode saat ini.
 */
export function navigateDate(
  currentDate: Date,
  viewMode: ViewMode,
  dir: -1 | 1,
): Date {
  const d = new Date(currentDate);

  if (viewMode === "month") {
    d.setMonth(d.getMonth() + dir);
  } else if (viewMode === "week") {
    d.setDate(d.getDate() + dir * 7);
  } else {
    d.setDate(d.getDate() + dir);
  }

  return d;
}

/**
 * Mengembalikan string label header toolbar
 * sesuai viewMode dan currentDate.
 *
 * Contoh output:
 *  - month → "June 2025"
 *  - week  → "June 2025"
 *  - day   → "June 7, 2025"
 */
export function getHeaderLabel(currentDate: Date, viewMode: ViewMode): string {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  if (viewMode === "month") {
    return `${MONTHS_EN[month]} ${year}`;
  }

  if (viewMode === "week") {
    const days = getWeekDays(currentDate);
    return `${MONTHS_EN[days[0].getMonth()]} ${year}`;
  }

  // day view
  return `${MONTHS_EN[month]} ${currentDate.getDate()}, ${year}`;
}
