"use client";

import { useState, useEffect, createContext, useContext } from "react";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { Loader2, Bell, Settings } from "lucide-react";
import CandidateSidebar from "./_components/Sidebar";

// ── Supabase langsung di sini — jangan import dari shared di layout ───────────
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
);

// ── Types ─────────────────────────────────────────────────────────────────────
export type CandidateUser = {
  id: string;
  email: string;
  full_name: string;
  role: string;
};

// ── Context ───────────────────────────────────────────────────────────────────
type ContextType = { user: CandidateUser | null; token: string };
export const CandidateContext = createContext<ContextType>({
  user: null,
  token: "",
});
export const useCandidate = () => useContext(CandidateContext);

const titleMap: Record<string, string> = {
  "/dashboard/candidate": "Dashboard",
  "/dashboard/candidate/applications": "Lamaranku",
  "/dashboard/candidate/matches": "Job Matches",
  "/dashboard/candidate/profile": "Profil Saya",
};

// ── Layout ────────────────────────────────────────────────────────────────────
export default function CandidateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<CandidateUser | null>(null);
  const [token, setToken] = useState("");
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

      setToken(session.access_token);
      setUser({
        id: session.user.id,
        email: session.user.email || "",
        full_name:
          session.user.user_metadata?.full_name ||
          session.user.email ||
          "Kandidat",
        role: session.user.user_metadata?.role || "candidate",
      });
      setLoading(false);
    };
    init();
  }, []);

  if (loading)
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

  const pageTitle = titleMap[pathname] ?? "Dashboard";

  return (
    <CandidateContext.Provider value={{ user, token }}>
      <div className="flex min-h-screen bg-[#0a0f0d] text-[#e8f0ec]">
        <CandidateSidebar user={user} />

        <div className="ml-[240px] flex-1">
          {/* Topbar — semua inline, tidak import komponen dari shared */}
          <div
            className="sticky top-0 z-40 border-b border-emerald-500/15 px-8 h-[60px] flex items-center justify-between"
            style={{
              background: "rgba(10,15,13,0.9)",
              backdropFilter: "blur(16px)",
            }}>
            <span className="font-bold text-[1rem]">{pageTitle}</span>
            <div className="flex items-center gap-2">
              <button className="w-[34px] h-[34px] rounded-[8px] bg-[#0f1612] border border-emerald-500/15 flex items-center justify-center text-[#7a9585] cursor-pointer transition-all hover:border-emerald-500/35 hover:text-[#e8f0ec]">
                <Bell size={15} />
              </button>
              <button className="w-[34px] h-[34px] rounded-[8px] bg-[#0f1612] border border-emerald-500/15 flex items-center justify-center text-[#7a9585] cursor-pointer transition-all hover:border-emerald-500/35 hover:text-[#e8f0ec]">
                <Settings size={15} />
              </button>
              <div className="w-8 h-8 rounded-[8px] bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center font-extrabold text-[0.78rem] text-emerald-400">
                {user?.full_name?.charAt(0).toUpperCase() || "K"}
              </div>
            </div>
          </div>

          <div className="px-8 pt-7 pb-[60px]">{children}</div>
        </div>
      </div>
    </CandidateContext.Provider>
  );
}
