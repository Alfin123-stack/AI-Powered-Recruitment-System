import { Suspense } from "react";

import CompanyHero from "@/components/companies/CompanyHero";
import CompanyListClient from "@/components/companies/CompanyListClient";
import CompanySkeleton from "@/components/companies/CompanySkeleton";
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
        <Suspense fallback={<CompanySkeleton />}>
          <CompanySection />
        </Suspense>
      </main>
    </div>
  );
}