import { getPaletteColor } from "@/constants/main/blogs";
import { Company } from "@/types/main/company";
import { Job } from "@/types/jobs";

import { API } from "@/lib/api";

export async function fetchCompanies(): Promise<Company[]> {
  try {
    const res = await fetch(`${API}/api/companies`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data: Company[] = await res.json();
    // Assign warna accent per index — tidak disimpan di DB
    return data.map((c, i) => ({ ...c, color: getPaletteColor(i) }));
  } catch (err) {
    console.error("[fetchCompanies] Gagal fetch:", err);
    return [];
  }
}

export async function fetchCompanyDetail(
  id: string,
): Promise<{ company: Company; jobs: Job[] } | null> {
  const url = `${API}/api/companies/${id}`;

  try {
    const res = await fetch(url, {
      cache: "no-store",
    });

    if (!res.ok) {
      console.error(
        `[fetchCompanyDetail] HTTP ${res.status} untuk id=${id}:`,
        await res.text(),
      );
      return null;
    }

    const data = await res.json();

    if (!data?.company) {
      console.error(
        "[fetchCompanyDetail] Response tidak punya field 'company':",
        data,
      );
      return null;
    }

    return data as { company: Company; jobs: Job[] };
  } catch (err) {
    console.error(`[fetchCompanyDetail] Fetch error untuk id=${id}:`, err);
    return null;
  }
}
