"use client";

import { useState } from "react";
import { Mail } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { ProfileFormField } from "./ProfileFormField";
import { ProfileSaveButton } from "./ProfileSaveButton";
import { inputCls } from "@/types/hr/interviews";
import type { TabHRProfileProps } from "@/types/profile";

export function ProfileTabHRProfile({ user, addToast }: TabHRProfileProps) {
  const [fullName, setFullName] = useState(user.user_metadata?.full_name ?? "");
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: { full_name: fullName },
      });
      if (error) throw error;
      setSaved(true);
      addToast("success", "Account profile saved successfully!");
      setTimeout(() => setSaved(false), 2500);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to save profile.";
      addToast("error", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-[1.1rem] font-bold text-[#e8f0ec]">Account Profile</h2>
        <p className="text-[#4d6b5a] text-[0.82rem] mt-0.5">
          Your HR account information
        </p>
      </div>

      <div className="flex flex-col gap-4 mb-6">
        <ProfileFormField
          label="Full Name"
          hint="Enter your full name">
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Your full name"
            title="Enter your full name"
            aria-label="Full name"
            className={inputCls}
          />
        </ProfileFormField>

        <ProfileFormField label="Email" hint="Email cannot be changed.">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#3a5244]">
              <Mail size={14} />
            </span>
            <input
              value={user.email}
              disabled
              title="Email cannot be changed"
              aria-label="Email address (cannot be changed)"
              className={`${inputCls} pl-9 opacity-50 cursor-not-allowed`}
            />
          </div>
        </ProfileFormField>
      </div>

      <ProfileSaveButton loading={loading} saved={saved} onClick={handleSave} />
    </div>
  );
}
