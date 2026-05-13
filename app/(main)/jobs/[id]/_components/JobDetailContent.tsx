"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase"; // ✅ ganti import
import {
  CheckCircle2,
  Building2,
  Bookmark,
  Upload,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import FadeIn from "./FadeIn";
import { Job } from "../page";
import { formatDeadline } from "@/lib/utils";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

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

export default function JobDetailContent({
  job,
  requirements,
  applied,
  checkingApplied,
  color,
  status,
  handleApplyClick,
}: {
  job: Job;
  requirements: string[];
  applied: boolean;
  checkingApplied: boolean;
  color: string;
  status: { text: string; color: string; bg: string; border: string } | null;
  handleApplyClick: () => void;
}) {
  const [saved, setSaved] = useState(false);
  const [savingLoading, setSavingLoading] = useState(false);
  const [checkingSaved, setCheckingSaved] = useState(false);

  useEffect(() => {
    const checkSavedStatus = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.access_token) return;
      setCheckingSaved(true);
      try {
        const res = await fetch(`${API}/api/saved-jobs/check/${job.id}`, {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });
        const { saved: isSaved } = await res.json();
        setSaved(isSaved);
      } catch {
      } finally {
        setCheckingSaved(false);
      }
    };
    checkSavedStatus();
  }, [job.id]);

  const handleToggleSave = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session?.access_token) {
      window.location.href = `/login?redirect=/jobs/${job.id}`;
      return;
    }

    setSavingLoading(true);
    try {
      if (saved) {
        await fetch(`${API}/api/saved-jobs/${job.id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${session.access_token}` },
        });
        setSaved(false);
      } else {
        await fetch(`${API}/api/saved-jobs`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ job_id: job.id }),
        });
        setSaved(true);
      }
    } catch {
    } finally {
      setSavingLoading(false);
    }
  };

  return (
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
            {/* Apply button area */}
            {checkingApplied ? (
              <div className="w-full py-[14px] rounded-[11px] bg-[#141f19] border border-emerald-500/15 flex items-center justify-center gap-2 mb-[10px]">
                <Loader2 size={14} className="text-emerald-400 animate-spin" />
                <span className="text-[#7a9585] text-[0.85rem]">
                  Mengecek status...
                </span>
              </div>
            ) : applied && status ? (
              <div className="mb-[10px]">
                <div
                  className="w-full py-[13px] rounded-[11px] border flex items-center justify-center gap-2 mb-2"
                  style={{ background: status.bg, borderColor: status.border }}>
                  <CheckCircle2 size={15} style={{ color: status.color }} />
                  <span
                    className="font-bold text-[0.9rem]"
                    style={{ color: status.color }}>
                    {status.text}
                  </span>
                </div>
                <Link
                  href="/dashboard/candidate/applications"
                  className="flex items-center justify-center gap-1 text-[0.75rem] text-emerald-400 hover:text-emerald-300 no-underline transition-colors">
                  Lihat detail lamaran →
                </Link>
              </div>
            ) : (
              <Button
                onClick={handleApplyClick}
                className="w-full py-[14px] bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-[11px] text-[0.95rem] hover:shadow-[0_6px_24px_rgba(16,185,129,0.3)] hover:-translate-y-[1px] mb-[10px]">
                <Upload size={15} /> Apply Sekarang
              </Button>
            )}

            {/* ✅ Tombol Simpan — hover diperbaiki */}
            <button
              onClick={handleToggleSave}
              disabled={savingLoading || checkingSaved}
              className={`
                w-full py-[11px] rounded-[11px] text-[0.88rem] font-semibold border
                flex items-center justify-center gap-2
                transition-all duration-200 cursor-pointer
                disabled:opacity-50 disabled:cursor-not-allowed
                ${
                  saved
                    ? `bg-emerald-500/10 text-emerald-400 border-emerald-500/30
                     hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30
                     active:scale-[0.98]`
                    : `bg-[#141f19] text-[#c5d8cc] border-emerald-500/15
                     hover:bg-emerald-500/10 hover:text-emerald-400 hover:border-emerald-500/40
                     hover:shadow-[0_0_16px_rgba(16,185,129,0.08)]
                     active:scale-[0.98]`
                }
              `}>
              {savingLoading ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Bookmark
                  size={14}
                  fill={saved ? "currentColor" : "none"}
                  className="transition-transform duration-200 group-hover:scale-110"
                />
              )}
              {savingLoading
                ? "Memproses..."
                : saved
                  ? "Tersimpan · Klik untuk hapus"
                  : "Simpan Lowongan"}
            </button>

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
                Upload CV untuk mengetahui tingkat kecocokan dengan posisi ini.
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
  );
}
