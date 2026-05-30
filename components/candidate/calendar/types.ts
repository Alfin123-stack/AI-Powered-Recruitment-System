export type Interview = {
  id: string;
  application_id: string;
  scheduled_at: string;
  type: "online" | "onsite";
  location: string | null;
  notes: string | null;
  status: "scheduled" | "done" | "cancelled";
  job_title: string;
  company_name: string;
};

export const IV_STATUS_MAP: Record<
  string,
  { label: string; color: string; bg: string }
> = {
  scheduled: {
    label: "Terjadwal",
    color: "#06b6d4",
    bg: "rgba(6,182,212,0.08)",
  },
  done: {
    label: "Selesai",
    color: "#10b981",
    bg: "rgba(16,185,129,0.08)",
  },
  cancelled: {
    label: "Dibatalkan",
    color: "#ef4444",
    bg: "rgba(239,68,68,0.08)",
  },
};

export const MONTHS_ID = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

export const DAYS_ID = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

export const formatDateLong = (d: string) =>
  new Date(d).toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

export const formatTime = (d: string) =>
  new Date(d).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });

export const isToday = (d: string) =>
  new Date(d).toDateString() === new Date().toDateString();

export const isTomorrow = (d: string) => {
  const tom = new Date();
  tom.setDate(tom.getDate() + 1);
  return new Date(d).toDateString() === tom.toDateString();
};

export const getDayLabel = (d: string) => {
  if (isToday(d)) return "Hari Ini";
  if (isTomorrow(d)) return "Besok";
  return formatDateLong(d);
};
