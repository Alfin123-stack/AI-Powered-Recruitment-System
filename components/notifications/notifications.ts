// ─── Notification Types ───────────────────────────────────────────────────────

export type NotifType = "status_update" | "interview" | "general";

export type Notif = {
  id: string;
  type: NotifType;
  title: string;
  message: string;
  created_at: string;
  read: boolean;
};

export type NavItem = {
  href: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
};

export type StatDef = {
  label: string;
  getValue: (notifs: Notif[]) => number;
  color: string;
  bg: string;
  icon: React.ReactNode;
};

export interface NotificationsPageProps {
  role: "hr" | "candidate";
  backHref: string;
  navItems: NavItem[];
  stats?: StatDef[];
  subtitle?: (opts: { unreadCount: number; user?: UserMeta }) => string;
  token?: string;
  user?: UserMeta | null;
}

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
