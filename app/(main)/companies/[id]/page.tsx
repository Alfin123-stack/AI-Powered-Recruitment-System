import { Suspense } from "react";
import { Building2 } from "lucide-react";
import Link from "next/link";

import CompanyDetailHeader from "@/components/company-detail/CompanyDetailHeader";
import CompanyDetailTabs from "@/components/company-detail/CompanyDetailTabs";
import CompanyDetailSkeleton from "@/components/company-detail/CompanyDetailSkeleton";
import { fetchCompanyDetail } from "@/lib/fetchers/companies";

async function CompanyDetailContent({ id }: { id: string }) {
  const data = await fetchCompanyDetail(id);

  if (!data) {
    return (
      <div className="min-h-screen bg-[#0a0f0d] flex items-center justify-center text-center">
        <div>
          <Building2 size={40} className="mx-auto mb-4 text-[#3a5444]" />
          <h2 className="text-[#e8f0ec] font-semibold mb-2">
            Perusahaan tidak ditemukan
          </h2>
          <p className="text-[#5d7a6a] text-[0.8rem] mb-4">
            Perusahaan ini mungkin sudah tidak aktif atau ID tidak valid.
          </p>
          <Link
            href="/companies"
            className="text-emerald-400 text-sm hover:underline">
            ← Kembali ke direktori
          </Link>
        </div>
      </div>
    );
  }

  const { company, jobs } = data;
  const accent = company.color || "#10b981";

  return (
    <>
      <CompanyDetailHeader
        company={company}
        jobCount={jobs.length}
        accent={accent}
      />
      <CompanyDetailTabs company={company} jobs={jobs} accent={accent} />
    </>
  );
}

// Next.js 15: params adalah Promise
type CompanyDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function CompanyDetailPage({
  params,
}: CompanyDetailPageProps) {
  const { id } = await params;

  // Log id hasil await — pastikan bukan undefined
  console.log("[CompanyDetailPage] id dari params:", id);

  return (
    <div className="min-h-screen bg-[#0a0f0d] text-[#e8f0ec]">
      <main className="pt-16">
        <Suspense fallback={<CompanyDetailSkeleton />}>
          <CompanyDetailContent id={id} />
        </Suspense>
      </main>
    </div>
  );
}
