// lib/jobs.ts
// ✅ Data fetching layer — dipanggil dari Server Component
// Type Job didefinisikan di sini agar bisa diimport oleh semua komponen

export type Job = {
  id: string;
  title: string;
  description: string;
  requirements: string;
  salary: string;
  location: string;
  type: string;
  skills: string[];
  benefits: string[];
  deadline: string | null;
  created_at: string;
  is_active: boolean;
  companies: {
    id: string;
    name: string;
    description: string;
    company_size: string;
    logo_url: string | null;
  };
};

/**
 * Fetch semua jobs dari Supabase (atau API lain).
 * Dipanggil di Server Component — tidak perlu useEffect, tidak perlu useState.
 *
 * Untuk ISR: set `revalidate` di page.tsx (sudah diset 60s).
 * Untuk SSG penuh: tambahkan `export const dynamic = "force-static"` di page.tsx.
 */
export async function getJobs(): Promise<Job[]> {
  // Ganti URL ini dengan endpoint Supabase / API kamu
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/jobs?select=*,companies(name,logo_url,company_size)&order=created_at.desc`,
    {
      headers: {
        apikey: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ?? "",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ?? ""}`,
      },
      // ISR: revalidate setiap 60 detik (Next.js 13+ fetch cache)
      next: { revalidate: 60 },
    },
  );

  if (!res.ok) {
    // Jangan crash app — return array kosong dan log error
    console.error("Failed to fetch jobs:", res.status, res.statusText);
    return [];
  }

  const data: Job[] = await res.json();
  return data ?? [];
}

/**
 * Fetch satu job by ID — untuk halaman detail /jobs/[id]
 * Bisa dipakai dengan generateStaticParams untuk SSG.
 */
export async function getJobById(id: string): Promise<Job | null> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/jobs?id=eq.${id}&select=*,companies(name,logo_url,company_size)`,
    {
      headers: {
        apikey: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ?? "",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ?? ""}`,
      },
      next: { revalidate: 60 },
    },
  );

  if (!res.ok) return null;

  const data: Job[] = await res.json();
  return data?.[0] ?? null;
}

/**
 * Untuk generateStaticParams di /jobs/[id]/page.tsx
 * Menghasilkan semua job ID saat build time (SSG)
 */
export async function getAllJobIds(): Promise<string[]> {
  const jobs = await getJobs();
  return jobs.map((j) => j.id);
}
