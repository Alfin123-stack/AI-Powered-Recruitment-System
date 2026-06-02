"use client";

import { useState, useEffect, createContext, useContext } from "react";
import { usePathname } from "next/navigation";

import { Loader2 } from "lucide-react";
import {
  LayoutDashboard,
  Briefcase,
  Bookmark,
  Target,
  FileText,
  BarChart3,
  Users,
  TrendingUp,
  Calendar,
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import { supabase } from "@/lib/supabase";
import CompanySetupModal from "./dashboard/hr/_components/CompanySetupModal";

// ── Types ─────────────────────────────────────────────────────────────────────
export type DashboardUser = {
  id: string;
  email: string;
  full_name: string;
  role: "candidate" | "hr";
};

export type Company = {
  id: string;
  name: string;
  logo_url?: string | null;
  industry?: string | null;
  location?: string | null;
  website?: string | null;
  description?: string | null;
};

type NavItem = {
  href: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  matchPrefix?: boolean;
};

type NavSection = {
  heading: string;
  items: NavItem[];
};

type DashboardContextType = {
  user: DashboardUser | null;
  token: string;
  company: Company | null;
  setCompany: (c: Company) => void;
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
const CANDIDATE_SECTIONS: NavSection[] = [
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
        href: "/dashboard/candidate/calendar",
        icon: Calendar,
        label: "Calendar",
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

const HR_SECTIONS: NavSection[] = [
  {
    heading: "Menu",
    items: [
      {
        href: "/dashboard/hr",
        icon: BarChart3,
        label: "Dashboard",
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
        icon: BarChart3,
        label: "Interviews",
        matchPrefix: true,
      },
      {
        href: "/dashboard/hr/calendar",
        icon: Calendar,
        label: "Calendar",
        matchPrefix: true,
      },
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
  "/dashboard/hr": "HR Dashboard",
  "/dashboard/hr/jobs": "Kelola Lowongan",
  "/dashboard/hr/candidates": "Candidates",
  "/dashboard/hr/analytics": "Analytics",
  "/dashboard/hr/interviews": "Interviews",
  "/dashboard/hr/calendar": "Calendar",
};

// ── Layout ────────────────────────────────────────────────────────────────────
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const [user, setUser] = useState<DashboardUser | null>(null);
  const [token, setToken] = useState<string>("");
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  // null = belum dicek | false = tidak punya company | true = punya company
  const [hasCompany, setHasCompany] = useState<boolean | null>(null);

  useEffect(() => {
    const init = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) return;

      // ── 1. Ambil role & full_name dari tabel users ──────────────────────────
      const { data: userData } = await supabase
        .from("users")
        .select("role, full_name")
        .eq("id", session.user.id)
        .single<{ role: string; full_name: string }>();

      const role: "candidate" | "hr" =
        userData?.role === "hr" ? "hr" : "candidate";

      const accessToken = session.access_token;
      setToken(accessToken);
      setUser({
        id: session.user.id,
        email: session.user.email ?? "",
        full_name:
          userData?.full_name ??
          (session.user.user_metadata?.full_name as string | undefined) ??
          session.user.email ??
          "User",
        role,
      });

      // ── 2. Untuk HR: cek company via API /api/companies/me ─────────────────
      if (role === "hr") {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/companies/me`,
            {
              headers: { Authorization: `Bearer ${accessToken}` },
            },
          );

          if (res.ok) {
            const companyData: Company | null =
              (await res.json()) as Company | null;
            if (companyData) {
              setCompany(companyData);
              setHasCompany(true);
            } else {
              setHasCompany(false);
            }
          } else {
            setHasCompany(false);
          }
        } catch {
          setHasCompany(false);
        }
      } else {
        setHasCompany(true);
      }

      setLoading(false);
    };

    void init();
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
  const isHR = user?.role === "hr";
  const sections: NavSection[] = isHR ? HR_SECTIONS : CANDIDATE_SECTIONS;
  const titleMap: Record<string, string> = isHR ? HR_TITLES : CANDIDATE_TITLES;
  const roleLabel = isHR ? "HR Manager" : "Kandidat";

  const pageTitle =
    titleMap[pathname] ??
    Object.entries(titleMap).find(([key]) => pathname.startsWith(key))?.[1] ??
    "Dashboard";

  return (
    <DashboardContext.Provider value={{ user, token, company, setCompany }}>
      {/* ── Modal setup company untuk HR yang belum punya company ── */}
      {isHR && hasCompany === false && (
        <CompanySetupModal
          token={token}
          onDone={(c: Company) => {
            setCompany(c);
            setHasCompany(true);
          }}
        />
      )}

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
