"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, FileText, Loader2, RefreshCw } from "lucide-react";
import ScoreBlock from "./ScoreBlock";
import AnimatedBar from "./AnimatedBar";
import SummaryBanner from "./SummaryBanner";
import TabBar from "./TabBar";
import OverviewTab from "./OverviewTab";
import ATSTab from "./ATSTab";
import FeedbackTab from "./FeedbackTab";
import WritingTab from "./WritingTab";
import { scoreColor } from "./analyze-helpers";
import type { AnalysisData, Tab } from "@/types/analyze";

// ─── ANALYSIS RESULT ─────────────────────────────────────────────────────────
type Props = {
  data: AnalysisData;
  onReanalyze: (f: File) => void;
  isLoading: boolean;
};

export default function AnalyzeResult({ data, onReanalyze, isLoading }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const readability = data.readabilityScore ?? 0;
  const impact = data.impactScore ?? 0;

  return (
    <motion.div
      key="result"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}>
      <section className="py-6 pb-20">
        <div className="max-w-[960px] mx-auto px-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <div>
              <div
                className="font-semibold text-[14px] flex items-center gap-2"
                style={{ color: "rgba(255,255,255,0.75)" }}>
                Hasil analisis CV
                {data.isFromDB && (
                  <span
                    className="text-[10px] px-[7px] py-[2px] rounded-full"
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      color: "rgba(255,255,255,0.22)",
                    }}>
                    Analisis terakhir
                  </span>
                )}
              </div>
              {data.fileName && (
                <div
                  className="text-[11.5px] mt-[3px] flex items-center gap-1"
                  style={{ color: "rgba(255,255,255,0.25)" }}>
                  <FileText size={11} /> {data.fileName}
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <button
                className="flex items-center gap-[6px] text-[12px] px-4 py-[7px] rounded-[8px] transition-all"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  color: "rgba(255,255,255,0.3)",
                }}>
                <Download size={12} /> Export PDF
              </button>
              <input
                title="Reanalyze with a different CV file"
                ref={inputRef}
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) onReanalyze(f);
                }}
              />
              <button
                onClick={() => inputRef.current?.click()}
                disabled={isLoading}
                className="flex items-center gap-[6px] text-[12px] font-medium px-4 py-[7px] rounded-[8px] transition-all disabled:opacity-40"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "rgba(255,255,255,0.55)",
                }}>
                {isLoading ? (
                  <Loader2 size={12} className="animate-spin" />
                ) : (
                  <RefreshCw size={12} />
                )}
                Analisis CV lain
              </button>
            </div>
          </div>

          {/* Score grid */}
          <div className="grid grid-cols-4 gap-[10px] mb-4">
            <ScoreBlock
              label="Overall Score"
              value={data.overallScore}
              sub="Skor gabungan analisis"
              primary
              delay={0.05}
            />
            <ScoreBlock
              label="Resume Score"
              value={data.resumeScore}
              sub="Kualitas konten"
              delay={0.1}
            />
            <ScoreBlock
              label="ATS Score"
              value={data.atsScore}
              sub="Kompatibilitas sistem"
              delay={0.15}
            />
            <ScoreBlock
              label="Impact Score"
              value={impact}
              sub="Kekuatan bahasa"
              delay={0.2}
            />
          </div>

          {/* Readability bar */}
          {readability > 0 && (
            <div
              className="flex items-center gap-4 mb-5 px-4 py-3 rounded-[10px]"
              style={{
                background: "rgba(255,255,255,0.025)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}>
              <div
                className="text-[11px] flex-shrink-0"
                style={{ width: 90, color: "rgba(255,255,255,0.3)" }}>
                Readability
              </div>
              <div className="flex-1">
                <AnimatedBar
                  value={readability}
                  color={scoreColor(readability)}
                  delay={700}
                  height={4}
                />
              </div>
              <div
                className="text-[12px] font-bold flex-shrink-0"
                style={{ color: scoreColor(readability) }}>
                {readability}/100
              </div>
            </div>
          )}

          {/* AI Summary */}
          <SummaryBanner data={data} />

          {/* Divider */}
          <div
            className="mb-5"
            style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
          />

          {/* Tabs */}
          <TabBar active={activeTab} onChange={setActiveTab} />

          {/* Tab content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}>
              {activeTab === "overview" && <OverviewTab data={data} />}
              {activeTab === "ats" && <ATSTab checks={data.atsChecks} />}
              {activeTab === "feedback" && (
                <FeedbackTab feedback={data.lineFeedback} />
              )}
              {activeTab === "writing" && (
                <WritingTab suggestions={data.writingSuggestions} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
    </motion.div>
  );
}
