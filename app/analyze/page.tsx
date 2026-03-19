"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Upload,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Eye,
  Zap,
  FileText,
  TrendingUp,
  Star,
  X,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// ── Types ─────────────────────────────────────────────────────────────────────
type AnalysisData = {
  resumeScore: number;
  matchingScore: number;
  atsScore: number;
  overallScore: number;
  skills: { name: string; level: number }[];
  categories: { label: string; score: number }[];
  strengths: string[];
  improvements: string[];
  fileName?: string;
};

// ── Static Demo Data ──────────────────────────────────────────────────────────
const demoAnalysis: AnalysisData = {
  resumeScore: 84,
  matchingScore: 78,
  atsScore: 74,
  overallScore: 81,
  skills: [
    { name: "React", level: 92 },
    { name: "Next.js", level: 88 },
    { name: "JavaScript", level: 95 },
    { name: "TailwindCSS", level: 85 },
    { name: "TypeScript", level: 70 },
    { name: "Git", level: 80 },
  ],
  categories: [
    { label: "Struktur CV", score: 90 },
    { label: "Relevansi Skill", score: 85 },
    { label: "Pengalaman Kerja", score: 78 },
    { label: "Pendidikan", score: 82 },
    { label: "ATS Compatibility", score: 74 },
  ],
  strengths: [
    "CV memiliki struktur yang jelas dan mudah dibaca ATS",
    "Pengalaman kerja relevan dengan posisi frontend developer",
    "Skill modern (React, Next.js) sesuai permintaan industri",
    "Section summary yang menggambarkan value proposition dengan baik",
  ],
  improvements: [
    "Tambahkan portfolio project dengan link yang dapat diklik",
    "Perjelas dampak kuantitatif dari pengalaman kerja (misal: meningkatkan performa 40%)",
    "Tambahkan section achievements/penghargaan",
    "Sertifikasi cloud atau AWS akan meningkatkan daya saing",
  ],
};

const catColors = ["#10b981", "#06b6d4", "#8b5cf6", "#f59e0b", "#ef4444"];

// ── Counter ───────────────────────────────────────────────────────────────────
function Counter({
  to,
  suffix = "",
  duration = 1600,
}: {
  to: number;
  suffix?: string;
  duration?: number;
}) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        let cur = 0;
        const step = to / (duration / 16);
        const t = setInterval(() => {
          cur += step;
          if (cur >= to) {
            setVal(to);
            clearInterval(t);
          } else setVal(Math.floor(cur));
        }, 16);
      }
    });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [to, duration]);

  return (
    <span ref={ref}>
      {val}
      {suffix}
    </span>
  );
}

// ── ScoreRing ─────────────────────────────────────────────────────────────────
function ScoreRing({
  score,
  color = "#10b981",
  size = 120,
}: {
  score: number;
  color?: string;
  size?: number;
}) {
  const r = size / 2 - 10;
  const circ = 2 * Math.PI * r;
  const dash = circ * (score / 100);

  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth={8}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={8}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circ}`}
          style={{
            transition: "stroke-dasharray 1.4s cubic-bezier(0.22,1,0.36,1)",
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="font-syne font-extrabold leading-none"
          style={{ fontSize: "1.9rem", color }}>
          {score}
        </span>
      </div>
    </div>
  );
}

// ── FadeIn ────────────────────────────────────────────────────────────────────
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
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}

// ── Card ──────────────────────────────────────────────────────────────────────
function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`bg-[#0f1612] border border-emerald-500/15 rounded-[16px] p-[26px] ${className}`}>
      {children}
    </div>
  );
}

function CardTitle({
  children,
  color = "#e8f0ec",
}: {
  children: React.ReactNode;
  color?: string;
}) {
  const dotColor = color === "#e8f0ec" ? "#10b981" : color;
  return (
    <div
      className="flex items-center gap-2 mb-5 font-syne font-bold text-[1rem]"
      style={{ color }}>
      <span
        className="w-[7px] h-[7px] rounded-full flex-shrink-0"
        style={{ background: dotColor }}
      />
      {children}
    </div>
  );
}

// ── Upload Zone ───────────────────────────────────────────────────────────────
function UploadZone({
  onFileSelect,
  isLoading,
}: {
  onFileSelect: (file: File) => void;
  isLoading: boolean;
}) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (
      file &&
      (file.type === "application/pdf" || file.name.endsWith(".docx"))
    ) {
      onFileSelect(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileSelect(file);
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => !isLoading && inputRef.current?.click()}
      className={`border-2 border-dashed rounded-[14px] p-10 text-center cursor-pointer transition-all duration-300
        ${
          dragging
            ? "border-emerald-500/60 bg-emerald-500/[0.06]"
            : "border-emerald-500/15 hover:border-emerald-500/35 hover:bg-emerald-500/[0.03]"
        }
        ${isLoading ? "pointer-events-none opacity-60" : ""}
      `}>
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.docx"
        className="hidden"
        onChange={handleChange}
      />
      <div className="w-[52px] h-[52px] rounded-[14px] bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400 mx-auto mb-[14px]">
        {isLoading ? (
          <Loader2 size={22} className="animate-spin" />
        ) : (
          <Upload size={22} />
        )}
      </div>
      <div className="font-syne font-bold text-[1.05rem] mb-[6px]">
        {isLoading ? "Menganalisis CV..." : "Upload CV Kamu"}
      </div>
      <p className="text-[#7a9585] text-[0.85rem]">
        {isLoading
          ? "AI sedang memproses dokumen kamu, mohon tunggu sebentar"
          : "Drag & drop file PDF atau DOCX, atau klik untuk memilih file"}
      </p>
      {!isLoading && (
        <>
          <p className="text-[#7a9585] text-[0.75rem] mt-[6px]">
            Maks. 5MB · PDF, DOCX
          </p>
          <Button className="mt-4 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-[0.9rem] px-7 py-3 rounded-[10px] hover:shadow-[0_6px_20px_rgba(16,185,129,0.3)] hover:-translate-y-[1px] inline-flex items-center gap-2">
            <Upload size={15} /> Pilih File CV
          </Button>
        </>
      )}
    </div>
  );
}

// ── Analysis Result ───────────────────────────────────────────────────────────
function AnalysisResult({
  data,
  onReset,
}: {
  data: AnalysisData;
  onReset: () => void;
}) {
  const scoreCards = [
    {
      label: "Resume Quality Score",
      score: data.resumeScore,
      color: "#10b981",
      Icon: FileText,
    },
    {
      label: "Job Matching Score",
      score: data.matchingScore,
      color: "#06b6d4",
      Icon: TrendingUp,
    },
    {
      label: "ATS Compatibility",
      score: data.atsScore,
      color: "#8b5cf6",
      Icon: Zap,
    },
    {
      label: "Overall Rating",
      score: data.overallScore,
      color: "#f59e0b",
      Icon: Star,
    },
  ];

  return (
    <motion.div
      key="result"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}>
      <section className="py-12 pb-20">
        <div className="max-w-[1100px] mx-auto px-6">
          {/* File badge + reset */}
          {data.fileName && (
            <FadeIn>
              <div className="flex items-center justify-between mb-5">
                <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-[6px] text-[0.75rem] text-emerald-400 font-medium">
                  <FileText size={13} />
                  {data.fileName}
                </div>
                <button
                  onClick={onReset}
                  className="inline-flex items-center gap-[6px] text-[0.78rem] text-[#7a9585] hover:text-red-400 transition-colors border border-emerald-500/15 hover:border-red-500/30 rounded-full px-3 py-[5px]">
                  <X size={12} /> Analisis Ulang
                </button>
              </div>
            </FadeIn>
          )}

          {/* Score rings */}
          <FadeIn>
            <div
              className="grid gap-4 mb-5"
              style={{
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              }}>
              {scoreCards.map((s, i) => (
                <div
                  key={i}
                  className="bg-[#0f1612] border border-emerald-500/15 rounded-[16px] px-5 py-7 flex flex-col items-center gap-[14px] transition-all duration-300 hover:border-emerald-500/35 hover:-translate-y-[2px]">
                  <div
                    className="flex items-center gap-[5px] text-[0.7rem] font-bold tracking-[0.07em] uppercase"
                    style={{ color: s.color }}>
                    <s.Icon size={14} /> {s.label}
                  </div>
                  <ScoreRing score={s.score} color={s.color} size={120} />
                  <div className="text-[0.78rem] text-[#7a9585] text-center">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </FadeIn>

          {/* Skills + Breakdown */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <FadeIn delay={0.05}>
              <Card>
                <CardTitle>Skill Proficiency</CardTitle>
                {data.skills.map((s, i) => (
                  <div key={i} className="mb-[14px]">
                    <div className="flex justify-between items-center mb-[6px]">
                      <span className="text-[0.85rem] font-medium">
                        {s.name}
                      </span>
                      <span className="text-[0.75rem] font-bold text-emerald-400 font-mono">
                        {s.level}%
                      </span>
                    </div>
                    <div className="h-[6px] rounded-full bg-white/[0.06] overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-[1.2s] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)]"
                        style={{
                          width: `${s.level}%`,
                          background: "linear-gradient(90deg,#10b981,#06b6d4)",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </Card>
            </FadeIn>

            <FadeIn delay={0.1}>
              <Card>
                <CardTitle>Score Breakdown</CardTitle>
                {data.categories.map((c, i) => (
                  <div key={i} className="flex items-center gap-3 mb-3">
                    <span className="text-[0.8rem] text-[#7a9585] w-[160px] flex-shrink-0">
                      {c.label}
                    </span>
                    <div className="flex-1 h-2 rounded-full bg-white/[0.05] overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-[1.3s]"
                        style={{
                          width: `${c.score}%`,
                          background: catColors[i],
                        }}
                      />
                    </div>
                    <span
                      className="text-[0.78rem] font-bold w-8 text-right"
                      style={{ color: catColors[i] }}>
                      {c.score}
                    </span>
                  </div>
                ))}
              </Card>
            </FadeIn>
          </div>

          {/* Strengths + Improvements */}
          <FadeIn delay={0.15}>
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardTitle color="#10b981">
                  <CheckCircle2 size={16} className="text-emerald-400" />{" "}
                  Kekuatan CV
                </CardTitle>
                <div className="flex flex-col gap-2">
                  {data.strengths.map((s, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-[10px] bg-emerald-500/[0.06] border border-emerald-500/15 rounded-[10px] p-3">
                      <CheckCircle2
                        size={14}
                        className="text-emerald-400 flex-shrink-0 mt-[1px]"
                      />
                      <span className="text-[0.83rem] text-[#7a9585] leading-[1.55]">
                        {s}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>

              <Card>
                <CardTitle color="#f59e0b">
                  <AlertCircle size={16} className="text-amber-400" /> Area
                  Perbaikan
                </CardTitle>
                <div className="flex flex-col gap-2">
                  {data.improvements.map((s, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-[10px] bg-amber-500/[0.06] border border-amber-500/15 rounded-[10px] p-3">
                      <ChevronRight
                        size={14}
                        className="text-amber-400 flex-shrink-0 mt-[1px]"
                      />
                      <span className="text-[0.83rem] text-[#7a9585] leading-[1.55]">
                        {s}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </FadeIn>
        </div>
      </section>
    </motion.div>
  );
}

// ── Empty State (Upload Prompt) ───────────────────────────────────────────────
function EmptyState({
  onFileSelect,
  isLoading,
}: {
  onFileSelect: (file: File) => void;
  isLoading: boolean;
}) {
  return (
    <motion.div
      key="empty"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}>
      <section className="py-12 pb-20">
        <div className="max-w-[1100px] mx-auto px-6">
          {/* How it works */}
          {!isLoading && (
            <FadeIn>
              <div className="grid grid-cols-3 gap-4 mb-8">
                {[
                  {
                    step: "01",
                    title: "Upload CV",
                    desc: "Upload file PDF atau DOCX CV kamu",
                    color: "#10b981",
                  },
                  {
                    step: "02",
                    title: "AI Parsing",
                    desc: "Teks diekstrak dan dikirim ke backend AI untuk analisis mendalam",
                    color: "#06b6d4",
                  },
                  {
                    step: "03",
                    title: "Hasil Instan",
                    desc: "Dapatkan score, insights, dan rekomendasi personal dalam detik",
                    color: "#8b5cf6",
                  },
                ].map((s, i) => (
                  <div
                    key={i}
                    className="bg-[#0f1612] border border-emerald-500/15 rounded-[16px] p-6">
                    <div
                      className="font-syne font-extrabold text-[2rem] leading-none mb-3 opacity-20"
                      style={{ color: s.color }}>
                      {s.step}
                    </div>
                    <div className="font-syne font-bold text-[0.95rem] mb-2">
                      {s.title}
                    </div>
                    <p className="text-[0.8rem] text-[#7a9585] leading-[1.6]">
                      {s.desc}
                    </p>
                  </div>
                ))}
              </div>
            </FadeIn>
          )}

          {/* Upload zone */}
          <FadeIn delay={0.1}>
            <UploadZone onFileSelect={onFileSelect} isLoading={isLoading} />
          </FadeIn>
        </div>
      </section>
    </motion.div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function AnalyzePage() {
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * FLOW:
   * 1. User upload PDF
   * 2. Frontend parse PDF pakai pdfjs-dist → ekstrak plain text di browser
   * 3. POST { text } ke Express backend (http://localhost:5000/api/analyze)
   * 4. Express kirim teks ke Gemini/OpenAI → return JSON hasil analisis
   * 5. Frontend render hasil
   *
   * Install: npm install pdfjs-dist
   */
  const extractTextFromPDF = async (file: File): Promise<string> => {
    // Dynamic import agar tidak ngebreak SSR Next.js
    const pdfjsLib = await import("pdfjs-dist");

    // Wajib set workerSrc agar pdfjs bisa jalan di browser
    pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
      "pdfjs-dist/build/pdf.worker.mjs",
      import.meta.url,
    ).toString();

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    let fullText = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const pageText = content.items
        .map((item: any) => ("str" in item ? item.str : ""))
        .join(" ");
      fullText += pageText + "\n";
    }

    return fullText.trim();
  };

  const handleFileSelect = async (file: File) => {
    setIsLoading(true);

    try {
      // ── Step 1: Ekstrak teks dari PDF di browser ───────────────
      const extractedText = await extractTextFromPDF(file);

      // ── Step 2: Kirim teks ke Express backend ──────────────────
      const res = await fetch("http://localhost:5000/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: extractedText }),
      });

      if (!res.ok) throw new Error("Analisis gagal");
      const result: AnalysisData = await res.json();
      setAnalysisData({ ...result, fileName: file.name });

      // ── DEMO: comment blok di atas, uncomment ini ──────────────
      // await new Promise((r) => setTimeout(r, 2200));
      // setAnalysisData({ ...demoAnalysis, fileName: file.name });
      // ──────────────────────────────────────────────────────────
    } catch (err) {
      console.error(err);
      // TODO: tampilkan toast error
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => setAnalysisData(null);

  return (
    <div className="min-h-screen bg-[#0a0f0d] text-[#e8f0ec]">
      {/* NAVBAR */}

      <main className="pt-16 bg-[#0a0f0d] min-h-screen">
        {/* HERO */}
        <section
          className="pt-[112px] pb-16 relative overflow-hidden text-center"
          style={{
            background:
              "radial-gradient(ellipse 70% 55% at 50% -5%, rgba(16,185,129,0.07) 0%, transparent 65%), #0a0f0d",
          }}>
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(rgba(16,185,129,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.035) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />
          <motion.div
            className="relative max-w-[760px] mx-auto px-6"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}>
            <div className="inline-flex items-center gap-[6px] bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-[14px] py-[5px] rounded-full text-[0.7rem] font-semibold tracking-[0.1em] uppercase mb-[18px]">
              <span className="animate-pulse">●</span> AI Resume Analyzer
            </div>

            <h1
              className="font-syne font-extrabold leading-[1.1] tracking-tight mb-[14px]"
              style={{ fontSize: "clamp(2rem,4.5vw,3rem)" }}>
              Analisis CV dengan{" "}
              <span className="bg-gradient-to-br from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                Kecerdasan Buatan
              </span>
            </h1>

            <p className="text-[#7a9585] text-[0.95rem] leading-[1.7] mb-8 max-w-[540px] mx-auto">
              Dapatkan resume score, job matching analysis, dan rekomendasi
              personal berbasis AI — dalam hitungan detik.
            </p>

            {/* Status indicator */}
            <div className="inline-flex items-center gap-[6px] bg-[#0f1612] border border-emerald-500/15 rounded-full px-4 py-[7px] text-[0.75rem] text-[#7a9585]">
              {isLoading ? (
                <>
                  <Loader2
                    size={12}
                    className="text-emerald-400 animate-spin"
                  />
                  <span>Menganalisis dokumen...</span>
                </>
              ) : analysisData ? (
                <>
                  <CheckCircle2 size={12} className="text-emerald-400" />
                  <span className="text-emerald-400">Analisis selesai</span>
                  <span>·</span>
                  <span>{analysisData.fileName}</span>
                </>
              ) : (
                <>
                  <Eye size={12} className="text-emerald-400" />
                  <span>Upload CV untuk memulai analisis</span>
                </>
              )}
            </div>
          </motion.div>
        </section>

        {/* CONTENT */}
        <AnimatePresence mode="wait">
          {analysisData ? (
            <AnalysisResult
              key="result"
              data={analysisData}
              onReset={handleReset}
            />
          ) : (
            <EmptyState
              key="empty"
              onFileSelect={handleFileSelect}
              isLoading={isLoading}
            />
          )}
        </AnimatePresence>

        {/* FOOTER */}
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
