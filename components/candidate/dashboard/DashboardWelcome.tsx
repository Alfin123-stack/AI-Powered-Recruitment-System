"use client";

// app/dashboard/candidate/_components/WelcomeBanner.tsx
// CSR — greeting berbasis waktu (hour), harus di client

import { motion } from "framer-motion";
import Link from "next/link";
import { Upload, Trophy, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { UserProfile } from "@/types/candidate/dashboard";

interface DashboardWelcomeProps {
  user: UserProfile | null;
  shortlistedCount: number;
  upcomingInterviewCount: number;
}

export function DashboardWelcome({
  user,
  shortlistedCount,
  upcomingInterviewCount,
}: DashboardWelcomeProps) {
  const firstName = user?.full_name?.split(" ")[0] || "Kandidat";
  const hour = new Date().getHours();
  const greeting =
    hour < 11
      ? "Selamat pagi"
      : hour < 15
        ? "Selamat siang"
        : hour < 18
          ? "Selamat sore"
          : "Selamat malam";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative overflow-hidden bg-gradient-to-br from-emerald-500/[0.09] via-cyan-500/[0.05] to-transparent border border-emerald-500/15 rounded-[18px] px-7 py-6 mb-6">
      {/* Decorative glow */}
      <div
        className="absolute right-0 top-0 w-48 h-full opacity-[0.04] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 100% 50%, #10b981 0%, transparent 70%)",
        }}
      />

      <div className="flex items-center justify-between gap-5 relative">
        <div>
          <div className="flex items-center gap-2 mb-[5px]">
            <span className="text-[0.72rem] text-[#7a9585] font-medium">
              {greeting},
            </span>
          </div>
          <h2 className="font-extrabold text-[1.3rem] mb-2">
            {firstName}! <span className="inline-block animate-bounce">👋</span>
          </h2>
          <div className="flex items-center gap-3 flex-wrap">
            {shortlistedCount > 0 ? (
              <span className="flex items-center gap-1 text-[0.8rem] text-[#a0b5aa]">
                <Trophy size={13} className="text-amber-400" />
                <strong className="text-emerald-400">
                  {shortlistedCount} shortlist
                </strong>{" "}
                menunggu interview
              </span>
            ) : (
              <span className="text-[0.8rem] text-[#7a9585]">
                Mulai lamar lowongan yang sesuai skill kamu.
              </span>
            )}
            {upcomingInterviewCount > 0 && (
              <span className="flex items-center gap-1 text-[0.8rem] px-2 py-[3px] rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <Calendar size={11} /> {upcomingInterviewCount} interview segera
              </span>
            )}
          </div>
        </div>

        <Button
          asChild
          className="bg-emerald-500 hover:bg-emerald-400 hover:shadow-[0_4px_20px_rgba(16,185,129,0.35)] text-black font-bold text-[0.82rem] px-5 py-[10px] rounded-[10px] flex-shrink-0 transition-all">
          <Link href="/analyze" className="inline-flex items-center gap-2">
            <Upload size={14} /> Upload CV Baru
          </Link>
        </Button>
      </div>
    </motion.div>
  );
}
