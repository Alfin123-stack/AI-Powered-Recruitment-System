// types/notifications.ts
// ─────────────────────────────────────────────────────────────────────────────
// NavItem di sini (icon: LucideIcon) berbeda dari NavItem di dashboard.ts
// (icon: React.ComponentType). Keduanya dipertahankan dengan nama berbeda:
//   - NotifNavItem  → untuk navigasi di halaman notifikasi (LucideIcon)
//   - DashboardNavItem → di types/dashboard.ts (React.ComponentType)
// Alias NavItem tetap diekspor untuk backward-compat.
// ─────────────────────────────────────────────────────────────────────────────

import type { LucideIcon } from "lucide-react";

// ── Notification Types ─────────────────────────────────────────────────────────
export type NotifType = "status_update" | "interview" | "general";

export type Notif = {
  id: string;
  type: NotifType;
  title: string;
  message: string;
  created_at: string;
  read: boolean;
};

/** NavItem khusus notifikasi — icon adalah LucideIcon (bukan React.ComponentType). */
export type NotifNavItem = {
  href: string;
  icon: LucideIcon;
  label: string;
};

/** @deprecated Gunakan `NotifNavItem` agar tidak ambigu dengan NavItem di dashboard.ts */
export type NavItem = NotifNavItem;

export type StatDef = {
  label: string;
  getValue: (notifs: Notif[]) => number;
  color: string;
  bg: string;
  icon: LucideIcon;
};

export type UserMeta = {
  id?: string;
  email?: string;
  user_metadata?: {
    full_name?: string;
    role?: "hr" | "candidate";
    [key: string]: unknown;
  };
  app_metadata?: {
    role?: "hr" | "candidate";
    [key: string]: unknown;
  };
  full_name?: string;
};

export type FilterId = "all" | "unread" | NotifType;

export type GroupKey = "Hari ini" | "Kemarin" | "Minggu ini" | "Lebih lama";

export interface NotificationsPageProps {
  role: "hr" | "candidate";
  backHref: string;
  navItems: NotifNavItem[];
  stats?: StatDef[];
  subtitle?: (opts: { unreadCount: number; user?: UserMeta }) => string;
  token?: string;
  user?: UserMeta | null;
}

export interface NotificationsClientProps {
  initialNotifs: Notif[];
  stats?: StatDef[];
  subtitle?: (opts: { unreadCount: number; user?: UserMeta }) => string;
  token: string;
  user: UserMeta | null;
}
