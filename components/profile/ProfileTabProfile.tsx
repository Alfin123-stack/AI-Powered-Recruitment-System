"use client";

import { useState } from "react";
import { User, Mail, Phone, MapPin, Briefcase } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { ProfileForm, TabProfileProps } from "@/types/profile";
import { ProfileErrorBanner } from "./ProfileErrorBanner";
import { ProfileFormField } from "./ProfileFormField";
import { ProfileSaveButton } from "./ProfileSaveButton";
import { inputCls } from "../shared/input";

export function ProfileTabProfile({ user, token, addToast }: TabProfileProps) {
  const [profileForm, setProfileForm] = useState<ProfileForm>({
    full_name: user.user_metadata?.full_name ?? "",
    phone: user.user_metadata?.phone ?? "",
    location: user.user_metadata?.location ?? "",
    job_title: user.user_metadata?.job_title ?? "",
    bio: user.user_metadata?.bio ?? "",
  });
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    setLoading(true);
    setError("");
    try {
      const { error: updateError } = await supabase.auth.updateUser({
        data: { ...profileForm },
      });
      if (updateError) throw updateError;
      setSaved(true);
      addToast("success", "Profile saved successfully!");
      setTimeout(() => setSaved(false), 2500);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to save profile.";
      setError(message);
      addToast("error", message);
    } finally {
      setLoading(false);
    }
  };

  const set =
    (key: keyof ProfileForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setProfileForm((f) => ({ ...f, [key]: e.target.value }));

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-[1.1rem] font-bold text-[#e8f0ec]">
          Profile Information
        </h2>
        <p className="text-[#4d6b5a] text-[0.82rem] mt-0.5">
          Update your personal details and professional information
        </p>
      </div>

      <ProfileErrorBanner msg={error} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <ProfileFormField label="Full Name">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#3a5244]">
              <User size={14} />
            </span>
            <input
              value={profileForm.full_name}
              onChange={set("full_name")}
              placeholder="Your full name"
              title="Enter your full name"
              aria-label="Full name"
              className={`${inputCls} pl-9`}
            />
          </div>
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

        <ProfileFormField label="Phone Number">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#3a5244]">
              <Phone size={14} />
            </span>
            <input
              value={profileForm.phone}
              onChange={set("phone")}
              placeholder="+1 234 567 8900"
              title="Enter your phone number"
              aria-label="Phone number"
              className={`${inputCls} pl-9`}
            />
          </div>
        </ProfileFormField>

        <ProfileFormField label="Location">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#3a5244]">
              <MapPin size={14} />
            </span>
            <input
              value={profileForm.location}
              onChange={set("location")}
              placeholder="New York, USA"
              title="Enter your location"
              aria-label="Location"
              className={`${inputCls} pl-9`}
            />
          </div>
        </ProfileFormField>

        <div className="sm:col-span-2">
          <ProfileFormField label="Position / Job Title">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#3a5244]">
                <Briefcase size={14} />
              </span>
              <input
                value={profileForm.job_title}
                onChange={set("job_title")}
                placeholder="Frontend Developer"
                title="Enter your position or job title"
                aria-label="Position or job title"
                className={`${inputCls} pl-9`}
              />
            </div>
          </ProfileFormField>
        </div>

        <div className="sm:col-span-2">
          <ProfileFormField label="Bio">
            <textarea
              value={profileForm.bio}
              onChange={set("bio")}
              rows={4}
              placeholder="Tell us a little about yourself..."
              title="Enter a short bio about yourself"
              aria-label="Bio"
              className={`${inputCls} resize-none`}
            />
          </ProfileFormField>
        </div>
      </div>

      <div className="flex justify-end">
        <ProfileSaveButton
          loading={loading}
          saved={saved}
          onClick={handleSave}
        />
      </div>
    </div>
  );
}
