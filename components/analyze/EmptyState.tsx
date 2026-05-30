"use client";

import { motion } from "framer-motion";
import UploadZone from "./UploadZone";

// ─── EMPTY STATE ─────────────────────────────────────────────────────────────
type Props = {
  onFileSelect: (f: File) => void;
  isLoading: boolean;
};

const FEATURES = [
  { label: "Skor CV", desc: "Resume score, ATS score, impact, dan readability" },
  { label: "ATS Check", desc: "8 titik cek kompatibilitas sistem rekrutmen otomatis" },
  { label: "Feedback", desc: "Komentar AI spesifik per bagian dan baris CV" },
  { label: "Saran Penulisan", desc: "AI menulis ulang kalimat lemah menjadi versi lebih kuat" },
];

export default function EmptyState({ onFileSelect, isLoading }: Props) {
  return (
    <motion.div
      key="empty"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}>
      <section className="py-8 pb-20">
        <div className="max-w-[960px] mx-auto px-6">
          {!isLoading && (
            <div className="grid grid-cols-4 gap-[8px] mb-6">
              {FEATURES.map((f, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className="rounded-[11px] p-4"
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}>
                  <div
                    className="font-semibold text-[13px] mb-[5px]"
                    style={{ color: "rgba(255,255,255,0.65)" }}>
                    {f.label}
                  </div>
                  <p
                    className="text-[11.5px] leading-[1.6]"
                    style={{ color: "rgba(255,255,255,0.28)" }}>
                    {f.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          )}
          <UploadZone onFileSelect={onFileSelect} isLoading={isLoading} />
        </div>
      </section>
    </motion.div>
  );
}
