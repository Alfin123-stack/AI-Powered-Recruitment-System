"use client";

import { supabase } from "@/lib/supabase";
import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  CheckCircle2,
  FileText,
  Loader2,
  Upload,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Job } from "@/types/jobs";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export function ApplyModal({
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
      text += text +=
        content.items.map((item) => ("str" in item ? item.str : "")).join(" ") +
        "\n";
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

      // 2. Public URL
      const { data: urlData } = supabase.storage
        .from("cv_candidate")
        .getPublicUrl(filePath);
      const cv_url = urlData.publicUrl;

      // 3. Ekstrak teks PDF
      const cvText = await extractTextFromPDF(file);

      // 4. Analisis CV vs JD via AI backend
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

      // 5. Submit lamaran
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
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg("Terjadi kesalahan");
      }

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
              {job.title} · {job.companies?.name}
            </p>
          </div>
          <button
            title="close"
            onClick={onClose}
            className="w-8 h-8 rounded-[8px] bg-[#141f19] border border-emerald-500/15 flex items-center justify-center text-[#7a9585] hover:text-[#e8f0ec] cursor-pointer transition-colors">
            <X size={14} />
          </button>
        </div>

        <div className="px-7 py-6">
          <AnimatePresence mode="wait">
            {/* Upload / Error */}
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
                    ${
                      file
                        ? "border-emerald-500/40 bg-emerald-500/[0.04]"
                        : dragging
                          ? "border-emerald-500/60 bg-emerald-500/[0.06]"
                          : "border-emerald-500/15 hover:border-emerald-500/30 hover:bg-emerald-500/[0.02]"
                    }`}>
                  <input
                    title="file input"
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
                        title="Remove file"
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

            {/* Analyzing */}
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

            {/* Done */}
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
                  {job.companies?.name}. Pantau status di dashboard kamu.
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
