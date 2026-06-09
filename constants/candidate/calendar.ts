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
