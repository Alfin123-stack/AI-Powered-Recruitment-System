"use client";

// hooks/useProfileShell.ts
// ─────────────────────────────────────────────
// Single hook untuk semua logika ProfileShell:
// - display name resolution
// - tab state + tab list per role
// - logout handler
// ─────────────────────────────────────────────

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Tab, TabDefinition } from "@/types/main/profile";
import { CANDIDATE_TABS, HR_TABS } from "@/constants/main/profile";
import { ServerProfileData } from "@/types/main/profile";

interface UseProfileShellReturn {
  displayName: string;
  tabs: TabDefinition[];
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  handleLogout: () => Promise<void>;
}

export function useProfileShell(
  data: ServerProfileData,
): UseProfileShellReturn {
  const router = useRouter();
  const { user, role } = data;

  const [activeTab, setActiveTab] = useState<Tab>("profile");

  const displayName: string =
    (user.user_metadata?.full_name as string | undefined) ??
    user.email?.split("@")[0] ??
    "User";

  const tabs: TabDefinition[] = role === "hr" ? HR_TABS : CANDIDATE_TABS;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/");
  };

  return { displayName, tabs, activeTab, setActiveTab, handleLogout };
}
