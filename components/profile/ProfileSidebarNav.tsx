"use client";

import { ChevronRight, LogOut } from "lucide-react";
import { ProfileTab, TabDefinition } from "@/types/profile";

interface ProfileSidebarNavProps {
  tabs: TabDefinition[];
  activeTab: ProfileTab;
  onTabChange: (tab: ProfileTab) => void;
  onLogout: () => void;
}

export function ProfileSidebarNav({
  tabs,
  activeTab,
  onTabChange,
  onLogout,
}: ProfileSidebarNavProps) {
  return (
    <div className="rounded-[16px] border border-emerald-500/15 p-2 flex flex-col gap-1 bg-[#0f1612]">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
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
        onClick={onLogout}
        className="flex items-center gap-2 px-3 py-2.5 rounded-[10px] text-[0.85rem] font-medium text-[#7a9585] hover:text-red-400 hover:bg-red-500/[0.06] border border-transparent transition-all duration-200 w-full cursor-pointer">
        <LogOut size={15} />
        Log Out
      </button>
    </div>
  );
}
