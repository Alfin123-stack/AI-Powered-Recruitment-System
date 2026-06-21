"use client";

import {
  Briefcase,
  MapPin,
  Layers,
  FileText,
  CalendarDays,
  ClipboardList,
  Gift,
  ChevronDown,
  AlertCircle,
} from "lucide-react";
import { JobsSection } from "./JobsSection";
import { JobsField } from "./JobsField";
import { JobsTagInput } from "./JobsTagInput";
import { inputCls } from "@/components/input";

export type FormState = {
  title: string;
  description: string;
  salary: string;
  location: string;
  type: string;
  deadline: string;
};

interface JobsFormBodyProps {
  form: FormState;
  setForm: React.Dispatch<React.SetStateAction<FormState>>;
  requirements: string[];
  setRequirements: (v: string[]) => void;
  skills: string[];
  setSkills: (v: string[]) => void;
  benefits: string[];
  setBenefits: (v: string[]) => void;
  error: string;
}

export function JobsFormBody({
  form,
  setForm,
  requirements,
  setRequirements,
  skills,
  setSkills,
  benefits,
  setBenefits,
  error,
}: JobsFormBodyProps) {
  const set = (key: keyof FormState) => (e: { target: { value: string } }) =>
    setForm((p) => ({ ...p, [key]: e.target.value }));

  return (
    <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-4">
      <JobsSection label="Main Information" icon={<Briefcase size={12} />} />

      <JobsField label="Job Title" icon={<Briefcase size={10} />}>
        <input
          value={form.title}
          onChange={set("title")}
          placeholder="e.g. Frontend Developer, Data Analyst..."
          className={inputCls}
        />
      </JobsField>

      <div className="grid grid-cols-2 gap-3">
        <JobsField label="Location" icon={<MapPin size={10} />}>
          <input
            value={form.location}
            onChange={set("location")}
            placeholder="Jakarta / Remote"
            className={inputCls}
          />
        </JobsField>
        <JobsField label="Job Type" icon={<Layers size={10} />}>
          <div className="relative">
            <select
              title="Select Job Type"
              value={form.type}
              onChange={set("type")}
              className={`${inputCls} appearance-none cursor-pointer pr-8`}>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Freelance">Freelance</option>
              <option value="Internship">Internship</option>
            </select>
            <ChevronDown
              size={13}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4d7060] pointer-events-none"
            />
          </div>
        </JobsField>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <JobsField label="Salary Range" icon={<FileText size={10} />}>
          <input
            value={form.salary}
            onChange={set("salary")}
            placeholder="e.g. $3,000–5,000/mo"
            className={inputCls}
          />
        </JobsField>
        <JobsField label="Deadline" icon={<CalendarDays size={10} />}>
          <input
            title="date"
            type="date"
            value={form.deadline}
            onChange={set("deadline")}
            className={inputCls}
          />
        </JobsField>
      </div>

      <JobsSection
        label="Description & Requirements"
        icon={<FileText size={12} />}
      />

      <JobsField
        label="Job Description"
        icon={<FileText size={10} />}
        hint="Describe the responsibilities and overview of the role">
        <textarea
          value={form.description}
          onChange={set("description")}
          rows={3}
          placeholder="Describe the responsibilities and overview of the role..."
          className={`${inputCls} resize-y min-h-[90px]`}
        />
      </JobsField>

      <JobsField
        label="Qualifications & Requirements"
        icon={<ClipboardList size={10} />}
        hint="Press Enter to add each qualification">
        <JobsTagInput
          value={requirements}
          onChange={setRequirements}
          placeholder="e.g. Bachelor's degree, 2+ years React experience..."
          chipColor="blue"
        />
      </JobsField>

      <JobsSection label="Skills & Benefit" icon={<Gift size={12} />} />

      <JobsField
        label="Skills"
        icon={<Layers size={10} />}
        hint="Tekan Enter atau koma untuk menambah">
        <JobsTagInput
          value={skills}
          onChange={setSkills}
          placeholder="e.g. React, TypeScript, Node.js..."
          chipColor="emerald"
        />
      </JobsField>

      <JobsField
        label="Benefits & Perks"
        icon={<Gift size={10} />}
        hint="Tekan Enter atau koma untuk menambah">
        <JobsTagInput
          value={benefits}
          onChange={setBenefits}
          placeholder="e.g. Remote-friendly, Health insurance, Laptop..."
          chipColor="green"
        />
      </JobsField>

      {error && (
        <div className="flex items-center gap-2 text-red-400 text-[0.8rem] bg-red-500/8 border border-red-500/20 rounded-[9px] px-3 py-2">
          <AlertCircle size={13} className="flex-shrink-0" />
          {error}
        </div>
      )}
    </div>
  );
}
