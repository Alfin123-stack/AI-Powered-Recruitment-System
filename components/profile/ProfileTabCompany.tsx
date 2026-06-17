"use client";

import { useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

import type { CompanyData, ToastType } from "@/types/profile";
import { ProfileErrorBanner } from "./ProfileErrorBanner";
import { ProfileFormField } from "./ProfileFormField";
import { ProfileSaveButton } from "./ProfileSaveButton";
import { inputCls } from "../shared/input";



interface ProfileTabCompanyProps {
  token: string;
  initialCompany: CompanyData | null;
  addToast: (type: ToastType, message: string) => void;
}

export function ProfileTabCompany({
  token,
  initialCompany,
  addToast,
}: ProfileTabCompanyProps) {
  const [form, setForm] = useState({
    name: initialCompany?.name ?? "",
    description: initialCompany?.description ?? "",
    company_size: initialCompany?.company_size ?? "",
  });
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const set =
    (key: keyof typeof form) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) =>
      setForm((p) => ({ ...p, [key]: e.target.value }));

  const handleSave = async () => {
    if (!form.name.trim()) {
      setError("Company name is required");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API}/api/companies/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error(await res.text());
      setSaved(true);
      addToast("success", "Company profile saved successfully!");
      setTimeout(() => setSaved(false), 2500);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to save company profile.";
      setError(message);
      addToast("error", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-[1.1rem] font-bold text-[#e8f0ec]">
          Company Profile
        </h2>
        <p className="text-[#4d6b5a] text-[0.82rem] mt-0.5">
          Company information visible to candidates
        </p>
      </div>

      <ProfileErrorBanner msg={error} />

      <div className="flex flex-col gap-4 mb-6">
        <ProfileFormField label="Company Name *">
          <input
            value={form.name}
            onChange={set("name")}
            placeholder="Acme Technologies Inc."
            className={inputCls}
          />
        </ProfileFormField>

        <ProfileFormField label="Company Size">
          <select
            title="select"
            value={form.company_size}
            onChange={set("company_size")}
            className={`${inputCls} appearance-none cursor-pointer`}>
            <option value="">Select size...</option>
            <option value="1-10 employees">1–10 employees</option>
            <option value="11-50 employees">11–50 employees</option>
            <option value="51-200 employees">51–200 employees</option>
            <option value="201-500 employees">201–500 employees</option>
            <option value="500+ employees">500+ employees</option>
          </select>
        </ProfileFormField>

        <ProfileFormField label="Short Description">
          <textarea
            value={form.description}
            onChange={set("description")}
            rows={4}
            placeholder="Tell candidates about your company..."
            className={`${inputCls} resize-none`}
          />
        </ProfileFormField>
      </div>

      <ProfileSaveButton loading={loading} saved={saved} onClick={handleSave} />
    </div>
  );
}
