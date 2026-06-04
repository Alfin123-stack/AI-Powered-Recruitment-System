"use client";

// components/profile/ProfileShell.tsx
// ─────────────────────────────────────────────
// RENDERING STRATEGY: CSR (Client-Side Rendering)
//
// Ini adalah "boundary" antara server dan client.
// - Menerima data dari Server Component (page.tsx) via props
// - Semua interaksi (tab switch, form, toast) terjadi di client
// - Tidak ada useEffect untuk fetch initial data — sudah dapat dari server
//
// Pattern: "Server fetches, Client interacts"
// ─────────────────────────────────────────────

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { User, Shield, Building2, LogOut, ChevronRight } from "lucide-react";
import { supabase } from "@/lib/supabase";

import { AvatarCard } from "@/components/profile/AvatarCard";
import { TabProfile } from "@/components/profile/TabProfile";
import { TabHRProfile } from "@/components/profile/TabHRProfile";
import { TabCompany } from "@/components/profile/TabCompany";
import { TabSecurity } from "@/components/profile/TabSecurity";
import { ToastContainer, useToast } from "@/components/profile/Toast";
import { ServerProfileData } from "@/types/profile";

type Tab = "profile" | "company" | "security";

function FadeIn({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}

export function ProfileShell({ data }: { data: ServerProfileData }) {
  const router = useRouter();
  const { toasts, addToast, removeToast } = useToast();

  const { user, token, role } = data;

  // Tab state — client only
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const displayName: string =
    (user.user_metadata?.full_name as string | undefined) ??
    user.email.split("@")[0] ??
    "User";

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/");
  };

  // Tab definitions per role
  const candidateTabs = [
    { id: "profile" as Tab, label: "Profil", icon: User },
    { id: "security" as Tab, label: "Keamanan", icon: Shield },
  ];

  const hrTabs = [
    { id: "profile" as Tab, label: "Profil Akun", icon: User },
    { id: "company" as Tab, label: "Profil Perusahaan", icon: Building2 },
    { id: "security" as Tab, label: "Keamanan", icon: Shield },
  ];

  const tabs = role === "hr" ? hrTabs : candidateTabs;

  return (
    <div className="min-h-screen bg-[#0a0f0d] pt-24 pb-16 px-4">
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[10%] w-[600px] h-[600px] rounded-full opacity-[0.04] bg-[radial-gradient(circle,#10b981_0%,transparent_70%)]" />
        <div className="absolute bottom-[-10%] right-[5%] w-[400px] h-[400px] rounded-full opacity-[0.03] bg-[radial-gradient(circle,#06b6d4_0%,transparent_70%)]" />
      </div>

      <div className="relative z-10 max-w-[920px] mx-auto">
        {/* Page header */}
        <FadeIn>
          <div className="mb-8">
            <p className="text-[#4d6b5a] text-[0.78rem] font-semibold uppercase tracking-[0.14em] mb-1">
              {role === "hr" ? "HR · Pengaturan" : "Kandidat · Akun"}
            </p>
            <h1 className="text-[1.8rem] font-extrabold text-[#e8f0ec] tracking-[-0.02em]">
              Pengaturan
            </h1>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
          {/* LEFT SIDEBAR */}
          <FadeIn delay={0.04}>
            <div className="flex flex-col gap-4">
              {/* Avatar card — sub-component tersendiri */}
              <AvatarCard
                user={user}
                role={role}
                displayName={displayName}
                applicationCount={data.applicationCount}
                savedCount={data.savedCount}
                company={data.company}
                token={token}
                addToast={addToast}
              />

              {/* Tab navigation */}
              <div className="rounded-[16px] border border-emerald-500/15 p-2 flex flex-col gap-1 bg-[#0f1612]">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-[10px] text-[0.85rem] font-medium w-full text-left transition-all duration-200 cursor-pointer
                      ${
                        activeTab === tab.id
                          ? "text-emerald-400 bg-emerald-500/[0.08] border border-emerald-500/20"
                          : "text-[#7a9585] border border-transparent hover:text-[#e8f0ec] hover:bg-white/[0.04]"
                      }`}>
                    <span className="flex items-center gap-2">
                      <tab.icon size={15} />
                      {tab.label}
                    </span>
                    <ChevronRight size={13} className="opacity-40" />
                  </button>
                ))}

                <div className="h-px bg-emerald-500/8 my-1" />

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-[10px] text-[0.85rem] font-medium text-[#7a9585] hover:text-red-400 hover:bg-red-500/[0.06] border border-transparent transition-all duration-200 w-full cursor-pointer">
                  <LogOut size={15} />
                  Keluar
                </button>
              </div>
            </div>
          </FadeIn>

          {/* RIGHT CONTENT */}
          <FadeIn delay={0.08}>
            <div className="rounded-[16px] border border-emerald-500/15 p-6 lg:p-8 bg-[#0f1612] min-h-[500px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}>
                  {/* Tab: Profile Kandidat */}
                  {activeTab === "profile" && role === "candidate" && (
                    <TabProfile user={user} token={token} addToast={addToast} />
                  )}

                  {/* Tab: Profile HR */}
                  {activeTab === "profile" && role === "hr" && (
                    <TabHRProfile user={user} addToast={addToast} />
                  )}

                  {/* Tab: Company (HR only) */}
                  {activeTab === "company" && role === "hr" && (
                    <TabCompany
                      token={token}
                      initialCompany={data.company}
                      addToast={addToast}
                    />
                  )}

                  {/* Tab: Security (shared) */}
                  {activeTab === "security" && (
                    <TabSecurity addToast={addToast} />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </FadeIn>
        </div>
      </div>
    </div>
  );
}
