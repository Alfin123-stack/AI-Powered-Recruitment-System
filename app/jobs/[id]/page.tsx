"use client";

import { useState, useEffect } from "react";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

import { Loader2 } from "lucide-react";

import { supabase } from "@/lib/supabase";
import { ApplyModal } from "./_components/ApplyModal";
import { getColor, parseRequirements } from "@/lib/utils";
import { statusConfig } from "@/lib/constants";
import JobDetailHero from "./_components/JobDetailHero";
import JobDetailContent from "./_components/JobDetailContent";
const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

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

// ── Page ──────────────────────────────────────────────────────────────────────
export default function JobDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [applied, setApplied] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState<string | null>(
    null,
  );
  const [checkingApplied, setCheckingApplied] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    const init = async () => {
      // 1. Fetch job detail
      try {
        const res = await fetch(`${API}/api/jobs/${id}`);
        if (res.status === 404) return setNotFound(true);
        if (!res.ok) throw new Error("Gagal fetch");
        setJob(await res.json());
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }

      // 2. Cek session user
      const {
        data: { session: s },
      } = await supabase.auth.getSession();
      setSession(s);

      // 3. Kalau sudah login, cek apakah sudah apply ke job ini via backend
      if (s?.access_token && id) {
        setCheckingApplied(true);
        try {
          const res = await fetch(`${API}/api/applications/check/${id}`, {
            headers: { Authorization: `Bearer ${s.access_token}` },
          });
          const { applied: isApplied, status } = await res.json();
          if (isApplied) {
            setApplied(true);
            setApplicationStatus(status);
          }
        } catch (err) {
          console.error("Gagal cek status lamaran:", err);
        } finally {
          setCheckingApplied(false);
        }
      }
    };

    init();
  }, [id]);

  const handleApplyClick = () => {
    if (!session) {
      router.push(`/login?redirect=/jobs/${id}`);
      return;
    }
    setShowApplyModal(true);
  };

  const handleApplySuccess = () => {
    setApplied(true);
    setApplicationStatus("applied");
    setShowApplyModal(false);
  };

  if (loading)
    return (
      <div className="min-h-screen bg-[#0a0f0d] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={28} className="text-emerald-400 animate-spin" />
          <span className="text-[#7a9585] text-[0.85rem]">
            Memuat detail lowongan...
          </span>
        </div>
      </div>
    );

  if (notFound || !job)
    return (
      <div className="min-h-screen bg-[#0a0f0d] flex items-center justify-center text-center px-6">
        <div>
          <div className="text-5xl mb-4 opacity-40">🔍</div>
          <div className="font-syne font-bold text-[1.2rem] mb-2">
            Lowongan tidak ditemukan
          </div>
          <p className="text-[#7a9585] text-[0.85rem] mb-6">
            Mungkin sudah ditutup atau tidak tersedia.
          </p>
          <Link
            href="/jobs"
            className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold px-6 py-3 rounded-[10px] no-underline text-[0.88rem]">
            ← Kembali ke Jobs
          </Link>
        </div>
      </div>
    );

  const color = getColor(Number(job.id));
  const requirements = parseRequirements(job.requirements);
  const status = applicationStatus ? statusConfig[applicationStatus] : null;

  return (
    <div className="min-h-screen bg-[#0a0f0d] text-[#e8f0ec]">
      {/* Apply Modal */}
      {showApplyModal && session && (
        <ApplyModal
          job={job}
          token={session.access_token}
          userId={session.user.id}
          onClose={() => setShowApplyModal(false)}
          onSuccess={handleApplySuccess}
        />
      )}

      <main className="pt-16">
        {/* HERO */}
        <JobDetailHero job={job} color={color} />

        {/* CONTENT */}
        <JobDetailContent
          job={job}
          requirements={requirements}
          applied={applied}
          checkingApplied={checkingApplied}
          color={color}
          status={status}
          handleApplyClick={handleApplyClick}
        />
      </main>
    </div>
  );
}
