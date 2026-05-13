"use client";

import { useState, useEffect, createContext, useContext } from "react";
import { usePathname } from "next/navigation";

import { Loader2 } from "lucide-react";
import {
  LayoutDashboard,
  Briefcase,
  Bookmark,
  Target,
  User,
  FileText,
  BarChart3,
  Users,
  TrendingUp,
  Calendar,
  Settings,
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import { supabase } from "@/lib/supabase";

// ── Types ─────────────────────────────────────────────────────────────────────
export type DashboardUser = {
  id: string;
  email: string;
  full_name: string;
  role: "candidate" | "hr";
};

type DashboardContextType = {
  user: DashboardUser | null;
  token: string;
  company: any | null;
  setCompany: (c: any) => void;
};

// ── Context ───────────────────────────────────────────────────────────────────
export const DashboardContext = createContext<DashboardContextType>({
  user: null,
  token: "",
  company: null,
  setCompany: () => {},
});

export const useDashboard = () => useContext(DashboardContext);

// ── Nav sections ──────────────────────────────────────────────────────────────
const CANDIDATE_SECTIONS = [
  {
    heading: "Menu",
    items: [
      {
        href: "/dashboard/candidate",
        icon: LayoutDashboard,
        label: "Dashboard",
      },
      {
        href: "/dashboard/candidate/applications",
        icon: Briefcase,
        label: "Lamaranku",
        matchPrefix: true,
      },
      {
        href: "/dashboard/candidate/saved",
        icon: Bookmark,
        label: "Tersimpan",
        matchPrefix: true,
      },
      {
        href: "/dashboard/candidate/matches",
        icon: Target,
        label: "Job Matches",
        matchPrefix: true,
      },
      {
        href: "/dashboard/candidate/profile",
        icon: User,
        label: "Profil",
        matchPrefix: true,
      },
    ],
  },
  {
    heading: "Lainnya",
    items: [
      { href: "/jobs", icon: Briefcase, label: "Cari Lowongan" },
      { href: "/analyze", icon: FileText, label: "Analisis CV" },
    ],
  },
];

const HR_SECTIONS = [
  {
    heading: "Menu",
    items: [
      {
        href: "/dashboard/hr/overview",
        icon: BarChart3,
        label: "Dashboard",
        matchPrefix: true,
      },
      {
        href: "/dashboard/hr/jobs",
        icon: Briefcase,
        label: "Jobs",
        matchPrefix: true,
      },
      {
        href: "/dashboard/hr/candidates",
        icon: Users,
        label: "Candidates",
        matchPrefix: true,
      },
      {
        href: "/dashboard/hr/analytics",
        icon: TrendingUp,
        label: "Analytics",
        matchPrefix: true,
      },
      {
        href: "/dashboard/hr/interviews",
        icon: Calendar,
        label: "Interviews",
        matchPrefix: true,
      },
    ],
  },
  {
    heading: "Sistem",
    items: [
      { href: "/dashboard/hr/settings", icon: Settings, label: "Pengaturan" },
    ],
  },
];

// ── Title maps ────────────────────────────────────────────────────────────────
const CANDIDATE_TITLES: Record<string, string> = {
  "/dashboard/candidate": "Dashboard",
  "/dashboard/candidate/applications": "Lamaranku",
  "/dashboard/candidate/saved": "Tersimpan",
  "/dashboard/candidate/matches": "Job Matches",
  "/dashboard/candidate/profile": "Profil",
};

const HR_TITLES: Record<string, string> = {
  "/dashboard/hr/overview": "HR Dashboard",
  "/dashboard/hr/jobs": "Kelola Lowongan",
  "/dashboard/hr/candidates": "Candidates",
  "/dashboard/hr/analytics": "Analytics",
  "/dashboard/hr/interviews": "Interviews",
  "/dashboard/hr/settings": "Pengaturan",
};

// ── Layout ────────────────────────────────────────────────────────────────────
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const [user, setUser] = useState<DashboardUser | null>(null);
  const [token, setToken] = useState("");
  const [company, setCompany] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      // Tidak perlu redirect manual — middleware sudah handle
      // Kalau sampai sini tanpa session, middleware pasti sudah redirect
      if (!session) return;

      const rawRole = session.user.user_metadata?.role;
      const role: "candidate" | "hr" = rawRole === "hr" ? "hr" : "candidate"; // fallback aman

      setToken(session.access_token);
      setUser({
        id: session.user.id,
        email: session.user.email ?? "",
        full_name:
          session.user.user_metadata?.full_name ?? session.user.email ?? "User",
        role,
      });

      // Fetch company hanya untuk HR
      if (role === "hr") {
        try {
          const res = await fetch("/api/companies/me", {
            headers: { Authorization: `Bearer ${session.access_token}` },
          });
          if (res.ok) setCompany(await res.json());
        } catch {
          // Belum ada company → CompanySetupModal handle di page-nya
        }
      }

      setLoading(false);
    };

    init();
  }, []);

  // ── Loading state ───────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0f0d] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={28} className="text-emerald-400 animate-spin" />
          <span className="text-[#7a9585] text-[0.85rem]">
            Memuat dashboard...
          </span>
        </div>
      </div>
    );
  }

  // ── Derive UI from role ─────────────────────────────────────────────────────
  // Middleware sudah pastikan role sesuai URL, jadi tidak perlu guard lagi
  const isHR = user?.role === "hr";
  const sections = isHR ? HR_SECTIONS : CANDIDATE_SECTIONS;
  const titleMap = isHR ? HR_TITLES : CANDIDATE_TITLES;
  const roleLabel = isHR ? "HR Manager" : "Kandidat";

  // Support dynamic routes (misal /dashboard/hr/jobs/[id])
  const pageTitle =
    titleMap[pathname] ??
    Object.entries(titleMap).find(([key]) => pathname.startsWith(key))?.[1] ??
    "Dashboard";

  return (
    <DashboardContext.Provider value={{ user, token, company, setCompany }}>
      <div className="flex min-h-screen bg-[#0a0f0d] text-[#e8f0ec]">
        <Sidebar
          role={isHR ? "hr" : "candidate"}
          sections={sections}
          user={user}
          company={company ?? undefined}
          token={token}
          displayName={user?.full_name}
          roleLabel={roleLabel}
        />

        <div className="ml-[240px] flex-1 min-h-screen">
          <Topbar
            token={token}
            title={pageTitle}
            company={company}
            user={user}
            isHR={isHR}
            pathname={pathname}
          />

          <div className="px-8 pt-7 pb-[60px]">{children}</div>
        </div>
      </div>
    </DashboardContext.Provider>
  );
}
