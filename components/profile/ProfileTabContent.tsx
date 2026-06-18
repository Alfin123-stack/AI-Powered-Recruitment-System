// components/profile/ProfileTabContent.tsx
"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ProfileTabProfile } from "@/components/profile/ProfileTabProfile";
import { ProfileTabHRProfile } from "@/components/profile/ProfileTabHRProfile";
import { ProfileTabCompany } from "@/components/profile/ProfileTabCompany";
import { ProfileTabSecurity } from "@/components/profile/ProfileTabSecurity";
import type {
  ProfileTab,
  AddToastFn,
  ServerProfileData,
} from "@/types/main/profile";

interface ProfileTabContentProps {
  activeTab: ProfileTab;
  role: string;
  data: ServerProfileData;
  addToast: AddToastFn;
}

export function ProfileTabContent({
  activeTab,
  role,
  data,
  addToast,
}: ProfileTabContentProps) {
  const { user, token, company } = data;

  return (
    <div className="rounded-[16px] border border-emerald-500/15 p-6 lg:p-8 bg-[#0f1612] min-h-[500px]">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}>
          {activeTab === "profile" && role === "candidate" && (
            <ProfileTabProfile user={user} token={token} addToast={addToast} />
          )}
          {activeTab === "profile" && role === "hr" && (
            <ProfileTabHRProfile user={user} addToast={addToast} />
          )}
          {activeTab === "company" && role === "hr" && (
            <ProfileTabCompany
              token={token}
              initialCompany={company ?? null}
              addToast={addToast}
            />
          )}
          {activeTab === "security" && (
            <ProfileTabSecurity addToast={addToast} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
