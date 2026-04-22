"use client";

import { useState, useEffect, createContext, useContext } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import Sidebar from "./_components/Sidebar";
import Topbar from "./_components/Topbar";
import CompanySetupModal from "./_components/CompanySetupModal";
import { supabase, apiFetch, Company } from "./_components/shared";

// ── Context ───────────────────────────────────────────────────────────────────
type DashboardContextType = {
  user: any;
  token: string;
  company: Company | null;
  setCompany: (c: Company) => void;
};

export const DashboardContext = createContext<DashboardContextType>({
  user: null,
  token: "",
  company: null,
  setCompany: () => {},
});

export const useDashboard = () => useContext(DashboardContext);

// ── Layout ────────────────────────────────────────────────────────────────────
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState("");
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
        return;
      }

      setUser(session.user);
      setToken(session.access_token);

      try {
        const comp = await apiFetch("/api/companies/me", session.access_token);
        if (comp) setCompany(comp);
      } catch {
        // belum punya company → modal setup muncul
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

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

  return (
    <DashboardContext.Provider value={{ user, token, company, setCompany }}>
      <div className="flex min-h-screen bg-[#0a0f0d] text-[#e8f0ec]">
        {/* Company setup modal */}
        {!company && token && (
          <CompanySetupModal
            token={token}
            onDone={(newCompany) => setCompany(newCompany)}
          />
        )}

        <Sidebar user={user} company={company} token={token} />

        <div className="ml-[240px] flex-1 min-h-screen">
          <Topbar company={company} />
          <div className="px-8 pt-7 pb-[60px]">{children}</div>
        </div>
      </div>
    </DashboardContext.Provider>
  );
}
