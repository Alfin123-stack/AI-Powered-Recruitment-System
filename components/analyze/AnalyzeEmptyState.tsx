"use client";

import { motion } from "framer-motion";
import { Info } from "lucide-react";
import UploadZone from "./AnalyzeUploadZone";
import { FEATURES } from "@/constants/main/analyze";
import type { UserRole } from "@/hooks/main/useUserRole";

type Props = {
  onFileSelect: (f: File) => void;
  isLoading: boolean;
  role?: UserRole;
};

export default function EmptyState({ onFileSelect, isLoading, role }: Props) {
  const isHR = role === "hr";

  return (
    <motion.div
      key="empty"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}>
      <section className="py-8 pb-20">
        <div className="max-w-[960px] mx-auto px-6">
          {!isLoading && !isHR && (
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

          {isHR ? (
            <div
              className="rounded-[16px] p-6 flex items-start gap-4"
              style={{
                background: "rgba(245,158,11,0.05)",
                border: "1px solid rgba(245,158,11,0.18)",
              }}>
              <Info
                size={17}
                className="flex-shrink-0 mt-[2px]"
                style={{ color: "rgba(245,158,11,0.75)" }}
              />
              <div>
                <div
                  className="font-semibold text-[13.5px] mb-[6px]"
                  style={{ color: "rgba(255,255,255,0.7)" }}>
                  This feature is for candidate accounts only
                </div>
                <p
                  className="text-[12px] leading-[1.7]"
                  style={{ color: "rgba(255,255,255,0.35)" }}>
                  You&apos;re signed in as an HR account. CV analysis is only
                  available for candidate accounts checking their resume
                  score and ATS compatibility.
                </p>
              </div>
            </div>
          ) : (
            <UploadZone onFileSelect={onFileSelect} isLoading={isLoading} />
          )}
        </div>
      </section>
    </motion.div>
  );
}