import type { LucideIcon } from "lucide-react";

export type NotifType = "status_update" | "interview" | "general";

export type Notif = {
  id: string;
  type: NotifType;
  title: string;
  message: string;
  created_at: string;
  read: boolean;
};

export type NotifRaw = Omit<Notif, "created_at"> & {
  created_at?: string;
  time?: string;
};

export type NotifNavItem = {
  href: string;
  icon: LucideIcon;
  label: string;
};

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

export type GroupKey = "Today" | "Yesterday" | "This week" | "Older";

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