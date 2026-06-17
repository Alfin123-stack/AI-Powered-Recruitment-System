"use client";

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
import { useJobApply } from "@/hooks/main/useJobApply";

export function JobApplyModal({
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
  const {
    file,
    step,
    errorMsg,
    dragging,
    inputRef,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleRemoveFile,
    handleInputChange,
    handleSubmit,
  } = useJobApply({ job, token, userId, onSuccess });

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
              Apply for Job
            </h2>
            <p className="text-[#7a9585] text-[0.78rem] mt-[3px]">
              {job.title} · {job.companies?.name}
            </p>
          </div>
          <button
            title="Close"
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
                  Upload your CV (PDF). AI will analyze how well your CV matches
                  this position before the application is submitted.
                </p>

                {/* Drop zone */}
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
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
                    title="File input"
                    ref={inputRef}
                    type="file"
                    accept=".pdf"
                    className="hidden"
                    onChange={handleInputChange}
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
                        onClick={handleRemoveFile}
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
                        Upload your CV
                      </div>
                      <div className="text-[#7a9585] text-[0.75rem]">
                        Drag & drop or click · PDF · Max 5MB
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
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={!file}
                    className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-[10px]">
                    Submit Application →
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
                  Analyzing CV...
                </div>
                <p className="text-[#7a9585] text-[0.82rem] leading-relaxed">
                  AI is evaluating how well your CV matches the {job.title}{" "}
                  position. Please wait a moment.
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
                  Application Submitted! 🎉
                </div>
                <p className="text-[#7a9585] text-[0.82rem] leading-relaxed mb-6">
                  Your CV has been analyzed by AI and your application has been
                  sent to {job.companies?.name}. Track the status in your
                  dashboard.
                </p>
                <div className="flex gap-3">
                  <Button
                    onClick={onClose}
                    variant="outline"
                    className="flex-1 border-emerald-500/15 text-[#7a9585] hover:border-emerald-500/35 hover:text-[#e8f0ec] bg-transparent rounded-[10px]">
                    Close
                  </Button>
                  <Link
                    href="/dashboard/candidate/applications"
                    className="flex-1 flex items-center justify-center bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-[10px] py-[10px] text-[0.88rem] no-underline transition-all">
                    View Applications →
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
