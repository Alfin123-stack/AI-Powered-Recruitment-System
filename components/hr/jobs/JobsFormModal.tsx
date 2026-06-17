"use client";

import { motion } from "framer-motion";

import { JobsFormHeader } from "./JobsFormHeader";
import { JobsFormBody } from "./JobsFormBody";
import { JobsFormFooter } from "./JobsFormFooter";
import { Job } from "@/types/hr/dashboard";
import { useJobsForm } from "@/hooks/dashboard/hr/useJobsForm";

interface JobsFormModalProps {
  token: string;
  editJob: Job | null;
  onDone: () => void;
  onClose: () => void;
}

export function JobsFormModal({
  token,
  editJob,
  onDone,
  onClose,
}: JobsFormModalProps) {
  const {
    form,
    setForm,
    requirements,
    setRequirements,
    skills,
    setSkills,
    benefits,
    setBenefits,
    loading,
    error,
    handleSubmit,
  } = useJobsForm({ token, editJob, onDone });

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-[8px]">
      <div className="absolute inset-0" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 8 }}
        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-[600px] max-h-[92vh] flex flex-col bg-[#0a100c] border border-emerald-500/20 rounded-[20px] overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.7)]">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent flex-shrink-0" />

        <JobsFormHeader isEdit={!!editJob} onClose={onClose} />

        <JobsFormBody
          form={form}
          setForm={setForm}
          requirements={requirements}
          setRequirements={setRequirements}
          skills={skills}
          setSkills={setSkills}
          benefits={benefits}
          setBenefits={setBenefits}
          error={error}
        />

        <JobsFormFooter
          isEdit={!!editJob}
          loading={loading}
          onClose={onClose}
          onSubmit={handleSubmit}
        />
      </motion.div>
    </div>
  );
}
