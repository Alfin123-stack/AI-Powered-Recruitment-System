"use client";


import { useEffect } from "react";
import { RefreshCw, AlertTriangle } from "lucide-react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function NotificationsError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("[NotificationsError]", error);
  }, [error]);

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: "#080d0b" }}
    >
      <div className="text-center max-w-sm px-6">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-red-500/20"
          style={{ background: "rgba(239,68,68,0.08)" }}
        >
          <AlertTriangle size={22} className="text-red-400" />
        </div>

        <h2 className="font-bold text-[1rem] mb-2 text-[#e8f5f0]">
          Gagal memuat notifikasi
        </h2>
        <p className="text-[0.75rem] mb-6 text-[#2e4438]">
          Terjadi kesalahan saat mengambil data. Silakan coba lagi.
        </p>

        <button
          onClick={reset}
          className="flex items-center gap-2 mx-auto px-4 py-2 rounded-xl text-[0.8rem] font-medium transition-all cursor-pointer border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/10"
          style={{ background: "rgba(52,211,153,0.06)" }}
        >
          <RefreshCw size={13} />
          Coba lagi
        </button>
      </div>
    </div>
  );
}
