// @/hooks/profile/useProfileTab.ts
// Mengelola active tab state untuk ProfileShell.
// Dipisah agar mudah di-extend (misal: sync ke URL query param).

import { useState } from "react";
import { ProfileTab } from "@/types/main/profile";

export function useProfileTab(initial: ProfileTab = "profile") {
  const [activeTab, setActiveTab] = useState<ProfileTab>(initial);
  return { activeTab, setActiveTab };
}
