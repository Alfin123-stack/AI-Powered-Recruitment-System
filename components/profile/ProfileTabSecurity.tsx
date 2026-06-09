"use client";

import { useState } from "react";
import { Shield } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { ProfileSaveButton } from "./ProfileSaveButton";
import { ToastType } from "@/types/profile";
import { ProfilePasswordInput } from "./ProfilePasswordInput";

interface ProfileTabSecurityProps {
  addToast: (type: ToastType, message: string) => void;
}

export function ProfileTabSecurity({ addToast }: ProfileTabSecurityProps) {
  const [form, setForm] = useState({ new: "", confirm: "" });
  const [errors, setErrors] = useState({ new: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleChange = (field: "new" | "confirm", value: string) => {
    setForm((p) => ({ ...p, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: "" }));
  };

  const validate = (): boolean => {
    const errs = { new: "", confirm: "" };
    let valid = true;

    if (!form.new) {
      errs.new = "New password is required";
      valid = false;
    } else if (form.new.length < 6) {
      errs.new = "Password must be at least 6 characters";
      valid = false;
    }

    if (!form.confirm) {
      errs.confirm = "Please confirm your new password";
      valid = false;
    } else if (form.confirm !== form.new) {
      errs.confirm = "Passwords do not match";
      valid = false;
    }

    setErrors(errs);
    return valid;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: form.new,
      });
      if (error) throw error;
      setSaved(true);
      setForm({ new: "", confirm: "" });
      setErrors({ new: "", confirm: "" });
      addToast("success", "Password changed successfully!");
      setTimeout(() => setSaved(false), 2500);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to change password.";
      setErrors((p) => ({ ...p, new: message }));
      addToast("error", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-[1.1rem] font-bold text-[#e8f0ec]">
          Account Security
        </h2>
        <p className="text-[#4d6b5a] text-[0.82rem] mt-0.5">
          Manage your password and account security
        </p>
      </div>

      <div className="rounded-[12px] border border-emerald-500/10 p-5 mb-5 bg-emerald-500/[0.02]">
        <div className="flex items-center gap-2 mb-4">
          <Shield size={15} className="text-emerald-400" />
          <h3 className="text-[0.9rem] font-semibold text-[#c5d8cc]">
            Change Password
          </h3>
        </div>

        <div className="flex flex-col gap-4 mb-4">
          <ProfilePasswordInput
            label="New Password"
            value={form.new}
            onChange={(v) => handleChange("new", v)}
            placeholder="At least 6 characters"
            error={errors.new}
          />
          <ProfilePasswordInput
            label="Confirm New Password"
            value={form.confirm}
            onChange={(v) => handleChange("confirm", v)}
            placeholder="Repeat new password"
            error={errors.confirm}
          />
        </div>

        <div className="flex justify-end">
          <ProfileSaveButton
            loading={loading}
            saved={saved}
            onClick={handleSave}
            label="Change Password"
          />
        </div>
      </div>
    </div>
  );
}
