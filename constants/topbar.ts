import { NotifType } from "@/types/main/notifications";

export const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const POPUP_LIMIT = 4;

export const PROFILE_HREF = "/profile";

export const NOTIF_TYPE_CFG: Record<
  NotifType,
  {
    bg: string;
    border: string;
    dotColor: string;
    emoji: string;
    label: string;
    labelColor: string;
  }
> = {
  status_update: {
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    dotColor: "#34d399",
    emoji: "📋",
    label: "Status",
    labelColor: "text-emerald-400",
  },
  interview: {
    bg: "bg-sky-500/10",
    border: "border-sky-500/20",
    dotColor: "#38bdf8",
    emoji: "📅",
    label: "Interview",
    labelColor: "text-sky-400",
  },
  offer_letter: {
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    dotColor: "#fbbf24",
    emoji: "📨",
    label: "Offer",
    labelColor: "text-amber-400",
  },
  rejection: {
    bg: "bg-rose-500/10",
    border: "border-rose-500/20",
    dotColor: "#fb7185",
    emoji: "❌",
    label: "Rejected",
    labelColor: "text-rose-400",
  },
  general: {
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
    dotColor: "#c4b5fd",
    emoji: "🔔",
    label: "Info",
    labelColor: "text-violet-400",
  },
};