"use client";

// components/profile/ProfileShell.tsx

import { ProfileAvatarCard } from "@/components/profile/ProfileAvatarCard";
import { ProfileToastContainer, useProfileToast } from "@/components/profile/ProfileToast";
import { ProfileFadeIn } from "@/components/profile/ProfileFadeIn";
import { ProfileAmbientBackground } from "@/components/profile/ProfileAmbientBackground";
import { ProfilePageHeader } from "@/components/profile/ProfilePageHeader";
import { ProfileSidebarNav } from "@/components/profile/ProfileSidebarNav";
import { ProfileTabContent } from "@/components/profile/ProfileTabContent";
import { ServerProfileData } from "@/types/profile";
import { useProfileShell } from "@/hooks/main/useProfileShell";

export function ProfileShell({ data }: { data: ServerProfileData }) {
  const { user, token, role } = data;

  const { toasts, addToast, removeToast } = useProfileToast();
  const { displayName, tabs, activeTab, setActiveTab, handleLogout } =
    useProfileShell(data);

  return (
    <div className="min-h-screen bg-[#0a0f0d] pt-24 pb-16 px-4">
      <ProfileToastContainer toasts={toasts} onRemove={removeToast} />
      <ProfileAmbientBackground />

      <div className="relative z-10 max-w-[920px] mx-auto">
        <ProfileFadeIn>
          <ProfilePageHeader role={role} />
        </ProfileFadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
          <ProfileFadeIn delay={0.04}>
            <div className="flex flex-col gap-4">
              <ProfileAvatarCard
                user={user}
                role={role}
                displayName={displayName}
                applicationCount={data.applicationCount}
                savedCount={data.savedCount}
                company={data.company}
                token={token}
                addToast={addToast}
              />
              <ProfileSidebarNav
                tabs={tabs}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                onLogout={handleLogout}
              />
            </div>
          </ProfileFadeIn>

          <ProfileFadeIn delay={0.08}>
            <ProfileTabContent
              activeTab={activeTab}
              role={role}
              data={data}
              addToast={addToast}
            />
          </ProfileFadeIn>
        </div>
      </div>
    </div>
  );
}
