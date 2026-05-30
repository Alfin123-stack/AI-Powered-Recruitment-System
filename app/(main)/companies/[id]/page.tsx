// SERVER Component — tidak ada directive "use client".
// Next.js 15: params adalah Promise, wajib di-await.

import { Suspense } from "react";
import { Building2 } from "lucide-react";
import Link from "next/link";
import type { Company, Job } from "@/components/company-detail/types";
import CompanyDetailHeader from "@/components/company-detail/CompanyDetailHeader";
import CompanyDetailTabs from "@/components/company-detail/CompanyDetailTabs";
import CompanyDetailSkeleton from "@/components/company-detail/CompanyDetailSkeleton";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

async function fetchCompanyDetail(
  id: string,
): Promise<{ company: Company; jobs: Job[] } | null> {
  const url = `${API}/api/companies/${id}`;

  // Log URL yang di-fetch — cek di terminal Next.js server
  console.log("[CompanyDetail] Fetching:", url);

  try {
    const res = await fetch(url, {
      cache: "no-store", // sementara matikan cache untuk debug
    });

    // Log status HTTP dari API
    console.log("[CompanyDetail] Status:", res.status, res.statusText);

    if (!res.ok) {
      const text = await res.text();
      console.error("[CompanyDetail] Error body:", text);
      return null;
    }

    const data = await res.json();

    // Log struktur response — pastikan ada { company, jobs }
    console.log("[CompanyDetail] Keys:", Object.keys(data));
    console.log(
      "[CompanyDetail] company:",
      data?.company?.id,
      data?.company?.name,
    );
    console.log("[CompanyDetail] jobs count:", data?.jobs?.length);

    if (!data?.company) {
      console.error(
        "[CompanyDetail] Response tidak punya field 'company':",
        data,
      );
      return null;
    }

    return data;
  } catch (err) {
    console.error("[CompanyDetail] Fetch exception:", err);
    return null;
  }
}

async function CompanyDetailContent({ id }: { id: string }) {
  // Log id yang diterima — pastikan bukan "undefined"
  console.log("[CompanyDetail] Rendering id:", id, typeof id);

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
