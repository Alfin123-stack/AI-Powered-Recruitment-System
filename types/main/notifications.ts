import type { LucideIcon } from "lucide-react";

export type NotifType =
  | "status_update"
  | "interview"
  | "offer_letter"
  | "rejection"
  | "general";

export type OfferStatus = "pending" | "accepted" | "declined" | "expired";

export type NotifMetadata = {
  // offer_letter
  salary?: string;
  start_date?: string;
  notes?: string;
  expires_at?: string;
  offer_status?: OfferStatus;
  accept_url?: string;
  decline_url?: string;
  // rejection
  feedback?: string;
  // shared
  application_id?: string;
  offer_id?: string;
};

export type Notif = {
  id: string;
  type: NotifType;
  title: string;
  message: string;
  created_at: string;
  read: boolean;
  metadata?: NotifMetadata;
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