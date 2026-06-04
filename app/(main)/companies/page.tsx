import { Suspense } from "react";

import CompanyHero from "@/components/companies/CompanyHero";
import CompanyListClient from "@/components/companies/CompanyListClient";
import CompanyGridSkeleton from "@/components/companies/CompanyGridSkeleton";
import { fetchCompanies } from "@/lib/fetchers/companies";

async function CompanySection() {
  const companies = await fetchCompanies();
  const totalJobs = companies.reduce((a, c) => a + (c.openJobs || 0), 0);

  return (
    <>
      <CompanyHero companyCount={companies.length} totalJobs={totalJobs} />
      <CompanyListClient companies={companies} />
    </>
  );
}

export default function CompanyPage() {
  return (
    <div className="min-h-screen bg-[#0a0f0d] text-[#e8f0ec]">
      <main className="pt-16">
        <Suspense
          fallback={
            <div>
              <div className="pt-[108px] pb-[56px] text-center">
                <div className="max-w-[680px] mx-auto px-6 flex flex-col items-center gap-4 animate-pulse">
                  <div className="h-[22px] w-[160px] rounded-full bg-white/[0.05]" />
                  <div className="h-[44px] w-[80%] rounded-[8px] bg-white/[0.05]" />
                  <div className="h-[16px] w-[60%] rounded-[6px] bg-white/[0.04]" />
                  <div className="h-[38px] w-[340px] rounded-full bg-white/[0.04]" />
                </div>
              </div>
              <section className="pt-5 py-7 pb-20">
                <div className="max-w-[1160px] mx-auto px-6">
                  <CompanyGridSkeleton />
                </div>
              </section>
            </div>
          }>
          <CompanySection />
        </Suspense>
      </main>
    </div>
  );
}
