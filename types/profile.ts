// types/profileShell.types.ts

import { User, Shield, Building2 } from "lucide-react";

export type UserRole = "candidate" | "hr";

export interface ProfileUser {
  id: string;
  email: string; // tetap string — parent wajib fallback ke "" sebelum pass ke sini
  created_at: string;
  user_metadata: UserMetadata;
}

export interface CompanyData {
  name: string;
  description: string | null;
  company_size: string | null;
}

export interface CandidateStats {
  applicationCount: number;
  savedCount: number;
}

export interface ServerProfileData extends CandidateStats {
  user: ProfileUser;
  token: string;
  role: UserRole;
  company: CompanyData | null;
}

export type Tab = "profile" | "company" | "security";

export interface TabDefinition {
  id: Tab;
  label: string;
  icon: typeof User | typeof Shield | typeof Building2;
}

export interface ProfileShellProps {
  data: ServerProfileData;
}

export interface SidebarNavProps {
  tabs: TabDefinition[];
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  onLogout: () => void;
}

export interface PageHeaderProps {
  role: string;
}

export interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
}

export type ProfileTab = "profile" | "company" | "security";

export interface Company {
  id: string;
  name: string;
  industry?: string;
  size?: string;
  website?: string;
  logo_url?: string;
  description?: string;
}

// ✅ Tambah "info" — cocok dengan types/profile.ts
export type ToastType = "success" | "error" | "info";
export type Toast = { id: number; type: ToastType; message: string };

// ✅ Fix: (type, message) — konsisten dengan semua tab
export type AddToastFn = (type: ToastType, message: string) => void;

type UserMetadata = {
  full_name?: string;
  phone?: string;
  location?: string;
  job_title?: string;
  bio?: string;
  [key: string]: string | undefined;
};

export type ProfileForm = {
  full_name: string;
  phone: string;
  location: string;
  job_title: string;
  bio: string;
};

export type TabProfileProps = {
  user: {
    id: string;
    email: string;
    user_metadata: UserMetadata;
  };
  token: string;
  addToast: (type: ToastType, message: string) => void;
};

export interface TabHRProfileProps {
  user: {
    id: string;
    email: string;
    user_metadata: {
      full_name?: string;
      [key: string]: string | undefined;
    };
  };
  addToast: (type: ToastType, message: string) => void;
}
