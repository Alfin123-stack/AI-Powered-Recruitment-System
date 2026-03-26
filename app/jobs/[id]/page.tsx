"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import {
  MapPin,
  Clock,
  Briefcase,
  ChevronLeft,
  CheckCircle2,
  Building2,
  Share2,
  Bookmark,
  Upload,
  Loader2,
  X,
  AlertCircle,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
);

type Job = {
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

const COLORS = [
  "#10b981",
  "#06b6d4",
  "#8b5cf6",
  "#f59e0b",
  "#ef4444",
  "#ec4899",
];
const getColor = (str: string) => COLORS[str.charCodeAt(0) % COLORS.length];

const timeAgo = (dateStr: string) => {
  const days = Math.floor(
    (Date.now() - new Date(dateStr).getTime()) / 86400000,
  );
  if (days === 0) return "Hari ini";
  if (days === 1) return "1 hari lalu";
  if (days < 7) return `${days} hari lalu`;
  if (days < 30) return `${Math.floor(days / 7)} minggu lalu`;
  return `${Math.floor(days / 30)} bulan lalu`;
};

const formatDeadline = (d: string | null) =>
  d
    ? new Date(d).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "—";

const parseRequirements = (raw: string) =>
  raw
    ? raw
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

// Status badge config
const statusConfig: Record<
  string,
  { text: string; color: string; bg: string; border: string }
> = {
  applied: {
    text: "Lamaran Terkirim",
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.08)",
    border: "rgba(245,158,11,0.25)",
  },
  review: {
    text: "Sedang Direview",
    color: "#06b6d4",
    bg: "rgba(6,182,212,0.08)",
    border: "rgba(6,182,212,0.25)",
  },
  shortlisted: {
    text: "Kamu Shortlisted!",
    color: "#10b981",
    bg: "rgba(16,185,129,0.08)",
    border: "rgba(16,185,129,0.25)",
  },
  rejected: {
    text: "Tidak Lolos",
    color: "#ef4444",
    bg: "rgba(239,68,68,0.08)",
    border: "rgba(239,68,68,0.25)",
  },
};

function FadeIn({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}

function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`bg-[#0f1612] border border-emerald-500/15 rounded-[16px] p-7 mb-4 ${className}`}>
      {children}
    </div>
  );
}

function CardTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 mb-[18px] font-syne text-[1.05rem] font-bold">
      <span className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" />
      {children}
    </div>
  );
}

// ── Apply Modal ───────────────────────────────────────────────────────────────
function ApplyModal({
  job,
  token,
  userId,
  onClose,
  onSuccess,
}: {
  job: Job;
  token: string;
  userId: string;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [step, setStep] = useState<"upload" | "analyzing" | "done" | "error">(
    "upload",
  );
  const [errorMsg, setErrorMsg] = useState("");
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => {
    if (f.type !== "application/pdf" && !f.name.endsWith(".pdf")) {
      setErrorMsg("Hanya file PDF yang didukung");
      return;
    }
    if (f.size > 5 * 1024 * 1024) {
      setErrorMsg("Ukuran file maksimal 5MB");
      return;
    }
    setErrorMsg("");
    setFile(f);
  };

  const extractTextFromPDF = async (f: File): Promise<string> => {
    const pdfjsLib = await import("pdfjs-dist");
    pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
      "pdfjs-dist/build/pdf.worker.mjs",
      import.meta.url,
    ).toString();
    const pdf = await pdfjsLib.getDocument({ data: await f.arrayBuffer() })
      .promise;
    let text = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      text +=
        content.items
          .map((item: any) => ("str" in item ? item.str : ""))
          .join(" ") + "\n";
    }
    return text.trim();
  };

  const handleSubmit = async () => {
    if (!file) return setErrorMsg("Pilih file CV terlebih dahulu");
    setStep("analyzing");
    setErrorMsg("");

    try {
      // 1. Upload CV ke Supabase Storage
      const filePath = `${userId}/${Date.now()}_${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("cv_candidate")
        .upload(filePath, file);
      if (uploadError)
        throw new Error("Gagal upload CV: " + uploadError.message);

      // 2. Ambil public URL dari storage (bucket public)
      const { data: urlData } = supabase.storage
        .from("cv_candidate")
        .getPublicUrl(filePath);
      const cv_url = urlData.publicUrl;

      // 3. Ekstrak teks dari PDF
      const cvText = await extractTextFromPDF(file);

      // 4. Analisis CV vs job description pakai AI
      const aiRes = await fetch(`${API}/api/ai/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: cvText,
          jobDescription: `${job.title}\n${job.description}\n${job.requirements}`,
        }),
      });
      if (!aiRes.ok) throw new Error("Gagal analisis CV");
      const analysis = await aiRes.json();

      // 5. Submit application + public URL + hasil AI ke backend
      const applyRes = await fetch(`${API}/api/applications/apply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ job_id: job.id, cv_url, analysis }),
      });
      if (!applyRes.ok) {
        const err = await applyRes.json();
        throw new Error(err.error || "Gagal melamar");
      }

      setStep("done");
      onSuccess();
    } catch (err: any) {
      setErrorMsg(err.message);
      setStep("error");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-[#0f1612] border border-emerald-500/20 rounded-[20px] w-full max-w-[480px]">
        {/* Header */}
        <div className="flex items-center justify-between px-7 pt-6 pb-5 border-b border-emerald-500/15">
          <div>
            <h2 className="font-syne font-extrabold text-[1.1rem]">
              Apply Lowongan
            </h2>
            <p className="text-[#7a9585] text-[0.78rem] mt-[3px]">
              {job.title} · {job.companies.name}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-[8px] bg-[#141f19] border border-emerald-500/15 flex items-center justify-center text-[#7a9585] hover:text-[#e8f0ec] cursor-pointer transition-colors">
            <X size={14} />
          </button>
        </div>

        <div className="px-7 py-6">
          <AnimatePresence mode="wait">
            {/* Step: Upload */}
            {(step === "upload" || step === "error") && (
              <motion.div
                key="upload"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}>
                <p className="text-[#7a9585] text-[0.82rem] mb-4 leading-relaxed">
                  Upload CV kamu (PDF). AI akan menganalisis kecocokan CV dengan
                  posisi ini sebelum lamaran dikirim.
                </p>

                {/* Drop zone */}
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragging(true);
                  }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragging(false);
                    const f = e.dataTransfer.files[0];
                    if (f) handleFile(f);
                  }}
                  onClick={() => inputRef.current?.click()}
                  className={`border-2 border-dashed rounded-[12px] p-7 text-center cursor-pointer transition-all duration-200 mb-4
                    ${file ? "border-emerald-500/40 bg-emerald-500/[0.04]" : dragging ? "border-emerald-500/60 bg-emerald-500/[0.06]" : "border-emerald-500/15 hover:border-emerald-500/30 hover:bg-emerald-500/[0.02]"}`}>
                  <input
                    ref={inputRef}
                    type="file"
                    accept=".pdf"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) handleFile(f);
                    }}
                  />

                  {file ? (
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-10 h-10 rounded-[9px] bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                        <FileText size={18} />
                      </div>
                      <div className="text-left">
                        <div className="text-[0.85rem] font-semibold text-emerald-400">
                          {file.name}
                        </div>
                        <div className="text-[0.72rem] text-[#7a9585]">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setFile(null);
                        }}
                        className="ml-auto text-[#7a9585] hover:text-red-400 transition-colors">
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="w-10 h-10 rounded-[10px] bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mx-auto mb-3">
                        <Upload size={18} />
                      </div>
                      <div className="text-[0.85rem] font-semibold mb-1">
                        Upload CV kamu
                      </div>
                      <div className="text-[#7a9585] text-[0.75rem]">
                        Drag & drop atau klik · PDF · Maks 5MB
                      </div>
                    </>
                  )}
                </div>

                {errorMsg && (
                  <div className="flex items-center gap-2 text-red-400 text-[0.8rem] bg-red-500/10 border border-red-500/20 rounded-[8px] px-3 py-2 mb-4">
                    <AlertCircle size={13} /> {errorMsg}
                  </div>
                )}

                <div className="flex gap-3">
                  <Button
                    onClick={onClose}
                    variant="outline"
                    className="flex-1 border-emerald-500/15 text-[#7a9585] hover:border-emerald-500/35 hover:text-[#e8f0ec] bg-transparent rounded-[10px]">
                    Batal
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={!file}
                    className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-[10px]">
                    Kirim Lamaran →
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step: Analyzing */}
            {step === "analyzing" && (
              <motion.div
                key="analyzing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-6">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                  <Loader2
                    size={28}
                    className="text-emerald-400 animate-spin"
                  />
                </div>
                <div className="font-syne font-bold text-[1rem] mb-2">
                  Menganalisis CV...
                </div>
                <p className="text-[#7a9585] text-[0.82rem] leading-relaxed">
                  AI sedang mengevaluasi kecocokan CV kamu dengan posisi{" "}
                  {job.title}. Mohon tunggu sebentar.
                </p>
              </motion.div>
            )}

            {/* Step: Done */}
            {step === "done" && (
              <motion.div
                key="done"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-6">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 size={28} className="text-emerald-400" />
                </div>
                <div className="font-syne font-bold text-[1rem] mb-2">
                  Lamaran Terkirim! 🎉
                </div>
                <p className="text-[#7a9585] text-[0.82rem] leading-relaxed mb-6">
                  CV kamu sudah dianalisis AI dan lamaran telah dikirim ke{" "}
                  {job.companies.name}. Pantau status di dashboard kamu.
                </p>
                <div className="flex gap-3">
                  <Button
                    onClick={onClose}
                    variant="outline"
                    className="flex-1 border-emerald-500/15 text-[#7a9585] hover:border-emerald-500/35 hover:text-[#e8f0ec] bg-transparent rounded-[10px]">
                    Tutup
                  </Button>
                  <Link
                    href="/dashboard/candidate/applications"
                    className="flex-1 flex items-center justify-center bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-[10px] py-[10px] text-[0.88rem] no-underline transition-all">
                    Lihat Lamaran →
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function JobDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [saved, setSaved] = useState(false);
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

  const color = getColor(job.id);
  const requirements = parseRequirements(job.requirements);
  const st = applicationStatus ? statusConfig[applicationStatus] : null;

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

      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[rgba(10,15,13,0.85)] backdrop-blur-[16px] border-b border-emerald-500/15">
        <div className="max-w-[1100px] mx-auto px-6 flex items-center justify-between h-16">
          <Link
            href="/jobs"
            className="flex items-center gap-[6px] text-[#7a9585] text-[0.85rem] no-underline hover:text-emerald-400 transition-colors">
            <ChevronLeft size={16} /> Kembali ke Jobs
          </Link>
          <Link
            href="/"
            className="flex items-center gap-2 font-syne font-extrabold text-[1.1rem] text-[#e8f0ec] no-underline">
            <span className="text-emerald-400">✦</span> Recruit
            <em className="not-italic text-emerald-400">AI</em>
          </Link>
          <div className="flex items-center gap-[10px]">
            <button className="w-9 h-9 rounded-[8px] bg-[#0f1612] border border-emerald-500/15 flex items-center justify-center text-[#7a9585] hover:border-emerald-500/35 hover:text-[#e8f0ec] transition-all cursor-pointer">
              <Share2 size={15} />
            </button>
            <button
              onClick={() => setSaved(!saved)}
              className={`w-9 h-9 rounded-[8px] flex items-center justify-center cursor-pointer border transition-all
                ${saved ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" : "bg-[#0f1612] border-emerald-500/15 text-[#7a9585] hover:border-emerald-500/35 hover:text-[#e8f0ec]"}`}>
              <Bookmark size={15} fill={saved ? "currentColor" : "none"} />
            </button>
          </div>
        </div>
      </nav>

      <main className="pt-16">
        {/* HERO */}
        <section
          className="pt-[100px] pb-14 relative overflow-hidden"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(16,185,129,0.07) 0%, transparent 65%), #0a0f0d",
          }}>
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(rgba(16,185,129,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.035) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />
          <FadeIn>
            <div className="max-w-[1100px] mx-auto px-6">
              <div className="inline-flex items-center gap-[6px] bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-[14px] py-[5px] rounded-full text-[0.7rem] font-semibold tracking-[0.1em] uppercase mb-5">
                Job Details
              </div>
              <div className="flex items-start gap-5 mb-6">
                <div
                  className="w-16 h-16 rounded-[14px] flex items-center justify-center flex-shrink-0 border border-white/[0.08]"
                  style={{ background: `${color}18`, color }}>
                  {job.companies?.logo_url ? (
                    <img
                      src={job.companies.logo_url}
                      alt={job.companies.name}
                      className="w-full h-full object-cover rounded-[14px]"
                    />
                  ) : (
                    <Building2 size={28} />
                  )}
                </div>
                <div>
                  <h1
                    className="font-syne font-extrabold leading-[1.1] tracking-tight mb-2"
                    style={{ fontSize: "clamp(1.9rem,4vw,2.8rem)" }}>
                    {job.title}
                  </h1>
                  <div className="text-[#7a9585] text-[0.95rem] mb-4">
                    {job.companies?.name} · {job.location}
                  </div>
                  <div className="flex flex-wrap gap-[14px] mb-5">
                    {[
                      { Icon: MapPin, text: job.location },
                      { Icon: Briefcase, text: job.type },
                      {
                        Icon: Clock,
                        text: `Diposting ${timeAgo(job.created_at)}`,
                      },
                    ]
                      .filter((m) => m.text)
                      .map(({ Icon, text }) => (
                        <span
                          key={text}
                          className="flex items-center gap-[6px] text-[#7a9585] text-[0.82rem]">
                          <Icon size={13} /> {text}
                        </span>
                      ))}
                    {job.salary && (
                      <span
                        className="flex items-center gap-[6px] text-[0.82rem] font-semibold"
                        style={{ color }}>
                        💰 {job.salary}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-[7px]">
                    {(job.skills || []).map((s) => (
                      <span
                        key={s}
                        className="bg-white/[0.04] border border-white/[0.09] text-[#e8f0ec] px-3 py-[5px] rounded-[7px] text-[0.78rem] font-medium font-mono hover:border-emerald-500/35 hover:text-emerald-400 transition-all cursor-default">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </section>

        {/* CONTENT */}
        <div
          className="max-w-[1100px] mx-auto px-6 pt-10 pb-20 grid gap-6"
          style={{ gridTemplateColumns: "1fr 320px" }}>
          {/* LEFT */}
          <div>
            <FadeIn delay={0.05}>
              <Card>
                <CardTitle>Deskripsi Pekerjaan</CardTitle>
                <p className="text-[#7a9585] text-[0.9rem] leading-[1.75] whitespace-pre-line">
                  {job.description}
                </p>
              </Card>
            </FadeIn>

            {requirements.length > 0 && (
              <FadeIn delay={0.1}>
                <Card>
                  <CardTitle>Kualifikasi & Persyaratan</CardTitle>
                  <div className="flex flex-col gap-[10px]">
                    {requirements.map((item, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-[10px] text-[#7a9585] text-[0.88rem] leading-[1.55]">
                        <CheckCircle2
                          size={16}
                          className="flex-shrink-0 mt-[1px] text-cyan-400"
                        />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </FadeIn>
            )}

            {(job.benefits || []).length > 0 && (
              <FadeIn delay={0.15}>
                <Card>
                  <CardTitle>Benefit & Fasilitas</CardTitle>
                  <div className="grid grid-cols-2 gap-2">
                    {job.benefits.map((b, i) => (
                      <div
                        key={i}
                        className="bg-emerald-500/[0.06] border border-emerald-500/15 rounded-[9px] px-[14px] py-[10px] text-[0.8rem] text-[#e8f0ec] flex items-center gap-[7px]">
                        <span className="text-emerald-400">✦</span> {b}
                      </div>
                    ))}
                  </div>
                </Card>
              </FadeIn>
            )}

            {job.companies && (
              <FadeIn delay={0.2}>
                <Card>
                  <CardTitle>Tentang Perusahaan</CardTitle>
                  <div className="flex gap-[14px] items-start mb-[14px]">
                    <div
                      className="w-12 h-12 rounded-[11px] flex items-center justify-center flex-shrink-0 border border-white/[0.08]"
                      style={{ background: `${color}18`, color }}>
                      <Building2 size={20} />
                    </div>
                    <div>
                      <div className="font-syne font-bold mb-1">
                        {job.companies.name}
                      </div>
                      {job.companies.company_size && (
                        <div className="text-[0.78rem] text-[#7a9585]">
                          👥 {job.companies.company_size}
                        </div>
                      )}
                    </div>
                  </div>
                  {job.companies.description && (
                    <p className="text-[#7a9585] text-[0.9rem] leading-[1.75]">
                      {job.companies.description}
                    </p>
                  )}
                </Card>
              </FadeIn>
            )}
          </div>

          {/* SIDEBAR */}
          <FadeIn delay={0.1}>
            <div className="sticky top-20">
              <div className="bg-[#0f1612] border border-emerald-500/15 rounded-[16px] p-6 mb-4">
                {/* ── Apply Button Area ── */}
                {checkingApplied ? (
                  // Loading saat cek status lamaran
                  <div className="w-full py-[14px] rounded-[11px] bg-[#141f19] border border-emerald-500/15 flex items-center justify-center gap-2 mb-[10px]">
                    <Loader2
                      size={14}
                      className="text-emerald-400 animate-spin"
                    />
                    <span className="text-[#7a9585] text-[0.85rem]">
                      Mengecek status...
                    </span>
                  </div>
                ) : applied && st ? (
                  // Sudah apply — tampilkan status dengan warna sesuai
                  <div className="mb-[10px]">
                    <div
                      className="w-full py-[13px] rounded-[11px] border flex items-center justify-center gap-2 mb-2"
                      style={{ background: st.bg, borderColor: st.border }}>
                      <CheckCircle2 size={15} style={{ color: st.color }} />
                      <span
                        className="font-bold text-[0.9rem]"
                        style={{ color: st.color }}>
                        {st.text}
                      </span>
                    </div>
                    <Link
                      href="/dashboard/candidate/applications"
                      className="flex items-center justify-center gap-1 text-[0.75rem] text-emerald-400 hover:text-emerald-300 no-underline transition-colors">
                      Lihat detail lamaran →
                    </Link>
                  </div>
                ) : (
                  // Belum apply
                  <Button
                    onClick={handleApplyClick}
                    className="w-full py-[14px] bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-[11px] text-[0.95rem] hover:shadow-[0_6px_24px_rgba(16,185,129,0.3)] hover:-translate-y-[1px] mb-[10px]">
                    <Upload size={15} /> Apply Sekarang
                  </Button>
                )}

                <Button
                  variant="outline"
                  onClick={() => setSaved(!saved)}
                  className={`w-full py-3 rounded-[11px] text-[0.88rem] border transition-all
                    ${saved ? "bg-emerald-500/[0.07] text-emerald-400 border-emerald-500/30" : "bg-[#141f19] border-emerald-500/15 text-[#e8f0ec] hover:border-emerald-500/35 hover:bg-emerald-500/[0.04]"}`}>
                  <Bookmark size={14} fill={saved ? "currentColor" : "none"} />
                  {saved ? "Tersimpan" : "Simpan Lowongan"}
                </Button>

                <Separator className="my-5 bg-emerald-500/15" />

                <div className="mb-5">
                  {[
                    { label: "Tipe Pekerjaan", value: job.type },
                    { label: "Gaji", value: job.salary || "—" },
                    { label: "Lokasi", value: job.location },
                    { label: "Deadline", value: formatDeadline(job.deadline) },
                  ].map((row, i, arr) => (
                    <div
                      key={i}
                      className={`flex justify-between items-center py-[9px] ${i < arr.length - 1 ? "border-b border-emerald-500/15" : ""}`}>
                      <span className="text-[0.75rem] text-[#7a9585]">
                        {row.label}
                      </span>
                      <span className="text-[0.82rem] font-semibold">
                        {row.value}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="bg-emerald-500/[0.06] border border-emerald-500/20 rounded-[12px] p-4">
                  <div className="text-[0.75rem] font-bold text-emerald-400 tracking-[0.07em] uppercase mb-2">
                    ✦ AI Match Score
                  </div>
                  <p className="text-[0.82rem] text-[#7a9585] leading-relaxed mb-[10px]">
                    Upload CV Anda untuk mengetahui tingkat kecocokan dengan
                    posisi ini.
                  </p>
                  <Link
                    href="/analyze"
                    className="flex items-center justify-center gap-2 w-full py-[9px] rounded-[9px] bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-[0.8rem] font-bold no-underline hover:bg-emerald-500/20 transition-all">
                    Analisis CV Saya →
                  </Link>
                </div>
              </div>

              <div className="bg-[#0f1612] border border-emerald-500/15 rounded-[16px] px-[22px] py-[18px]">
                <div className="text-[0.78rem] text-[#7a9585] mb-3">
                  Bagikan lowongan ini
                </div>
                <div className="flex gap-2">
                  {["LinkedIn", "WhatsApp", "Twitter"].map((p) => (
                    <button
                      key={p}
                      className="flex-1 bg-[#141f19] border border-emerald-500/15 rounded-[8px] py-2 px-[6px] text-[#7a9585] text-[0.72rem] font-semibold hover:border-emerald-500/35 hover:text-[#e8f0ec] transition-all cursor-pointer">
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </FadeIn>
        </div>

        <footer className="bg-[#0f1612] border-t border-emerald-500/15 py-9 px-6 text-center">
          <div className="flex items-center justify-center gap-[6px] font-syne font-extrabold text-base mb-[6px]">
            <span className="text-emerald-400">✦</span> RecruitAI
          </div>
          <p className="text-[#7a9585] text-[0.78rem]">
            Built with Next.js · Supabase · Gemini AI
          </p>
        </footer>
      </main>
    </div>
  );
}
