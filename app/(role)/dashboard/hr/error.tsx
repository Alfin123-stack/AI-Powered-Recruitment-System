"use client";

// ─────────────────────────────────────────────────────────────────────────────
// ERROR BOUNDARY — HR Dashboard
// Route: app/dashboard/hr/error.tsx
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function HRDashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[HRDashboard Error]", error);
  }, [error]);

  return (
    <div
      className="min-h-screen flex items-center justify-center p-8"
      style={{ background: "#080d0a" }}
    >
      <div className="text-center max-w-sm">
        <div className="w-14 h-14 rounded-[16px] bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-5">
          <AlertTriangle size={24} className="text-red-400" />
        </div>
        <h2 className="text-[1.1rem] font-black text-[#e8f0ec] mb-2">Terjadi Kesalahan</h2>
        <p className="text-[0.78rem] text-[#7a9585] mb-6 leading-relaxed">
          Gagal memuat data dashboard. Silakan coba lagi atau hubungi tim teknis jika masalah berlanjut.
        </p>
        <button
          onClick={reset}
          className="flex items-center gap-2 mx-auto px-5 py-2 rounded-[10px] text-[0.82rem] font-bold cursor-pointer transition-all hover:opacity-80"
          style={{
            background: "rgba(16,185,129,0.1)",
            border: "1px solid rgba(16,185,129,0.25)",
            color: "#10b981",
          }}
        >
          <RefreshCw size={13} /> Coba Lagi
        </button>
      </div>
    </div>
  );
}
