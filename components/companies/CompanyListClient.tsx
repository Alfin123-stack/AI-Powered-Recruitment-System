// @/components/company/CompanyListClient.tsx
// CSR orchestrator — wiring useCompanyFilter ke CompanyToolbar + CompanyGrid
// Tidak ada logika filtering atau UI langsung di sini

"use client";

import type { Company } from "@/types/company";
import { useCompanyFilter } from "@/hooks/main/useCompanyFilter";
import CompanyToolbar from "./CompanyToolbar";
import { CompanyGrid } from "./CompanyGrid";

type CompanyListClientProps = {
  companies: Company[];
};

export default function CompanyListClient({
  companies,
}: CompanyListClientProps) {
  const { search, setSearch, filter, setFilter, filtered } =
    useCompanyFilter(companies);

  return (
    <>
      <CompanyToolbar
        search={search}
        onSearchChange={setSearch}
        filter={filter}
        onFilterChange={setFilter}
        resultCount={filtered.length}
      />
      <CompanyGrid companies={filtered} allCompanies={companies} />
    </>
  );
}
