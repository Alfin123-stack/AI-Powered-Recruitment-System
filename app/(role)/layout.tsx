"use client";

import { Loader2 } from "lucide-react";
import { usePathname } from "next/navigation";

import Sidebar from "@/components/Sidebar";
import { DashboardContext } from "@/context/DashboardContext";
import { useDashboardInit } from "@/hooks/dashboard/useDashboardInit";
import {
  CANDIDATE_SECTIONS,
  HR_SECTIONS,
  CANDIDATE_TITLES,
  HR_TITLES,
} from "@/constants/dashboardNav";
import type { Company } from "@/types/main/company";
import CompanySetupModal from "../../components/hr/dashboard/DashboardCompanySetupModal";
import { Topbar } from "@/components/topbar/Topbar";
import { ChatbotWidget } from "@/components/ChatbotWidget";
import DashboardTour from "@/components/DashboardTour";
import { useDashboardTour } from "@/hooks/dashboard/candidate/useDashboardTour";
import { useDashboardTourHR } from "@/hooks/dashboard/hr/useDashboardTourHR";


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const {
    user,
    token,
    company,
    setCompany,
    loading,
    hasCompany,
    setHasCompany,
  } = useDashboardInit();

  const isHR = user?.role === "hr";

  // Pick the tour matching the current role. Both hooks read/write their own
  // localStorage key, so a candidate seeing the candidate tour and later
  // becoming HR (or vice versa) will still see the relevant tour once.
  const candidateTour = useDashboardTour();
  const hrTour = useDashboardTourHR();
  const tour = isHR ? hrTour : candidateTour;

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

  const sections = isHR ? HR_SECTIONS : CANDIDATE_SECTIONS;
  const titleMap = isHR ? HR_TITLES : CANDIDATE_TITLES;
  const roleLabel = isHR ? "HR Manager" : "Kandidat";

  const pageTitle =
    titleMap[pathname] ??
    Object.entries(titleMap).find(([key]) => pathname.startsWith(key))?.[1] ??
    "Dashboard";

  const handleCompanySetupDone = (c: Company) => {
    setCompany(c);
    setHasCompany(true);
    if (user?.id) {
      localStorage.setItem(`company_setup_done_${user.id}`, "1");
    }
  };

  return (
    <DashboardContext.Provider value={{ user, token, company, setCompany }}>
      {isHR && hasCompany === false && (
        <CompanySetupModal token={token} onDone={handleCompanySetupDone} />
      )}

      <div className="flex min-h-screen bg-[#0a0f0d] text-[#e8f0ec]">
        <Sidebar
          role={isHR ? "hr" : "candidate"}
          sections={sections}
          user={user ?? undefined}
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

      {/* Floating chatbot — muncul di semua halaman dashboard */}
      <ChatbotWidget />

      {/* Onboarding tour — otomatis pakai step set sesuai role (HR/candidate).
          Hanya tampil sekali per role per browser (localStorage), dan tidak
          dirender saat CompanySetupModal HR sedang terbuka supaya tidak
          tumpang tindih dengan modal wajib tersebut. */}
      {!(isHR && hasCompany === false) && (
        <DashboardTour
          isActive={tour.isActive}
          currentStep={tour.currentStep}
          stepIndex={tour.stepIndex}
          totalSteps={tour.totalSteps}
          onNext={tour.next}
          onPrev={tour.prev}
          onSkip={tour.skip}
        />
      )}
    </DashboardContext.Provider>
  );
}