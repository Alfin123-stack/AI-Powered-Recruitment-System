import { Suspense } from "react";
import type { Metadata } from "next";
import { CalendarServer } from "@/components/hr/calendar/CalendarServer";
import { CalendarPageSkeleton } from "@/components/hr/calendar/CalendarSkeleton";

// ─── SSG: Metadata statis ─────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: "Calendar | HR Dashboard",
  description:
    "Jadwal interview dan agenda HR dalam tampilan kalender interaktif",
};

export const revalidate = 60;

// ─── PAGE ─────────────────────────────────────────────────────────────────────
export default function CalendarPage() {
  return (
    <Suspense fallback={<CalendarPageSkeleton />}>
      <CalendarServer />
    </Suspense>
  );
}
