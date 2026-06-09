"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import {
  Camera,
  Building2,
  FileText,
  Star,
  Calendar,
  Briefcase,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

import { CompanyData, ToastType } from "@/types/profile";

const getInitials = (name: string) =>
  (name || "U")
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

type UserMetadata = {
  avatar_url?: string;
  job_title?: string;
  [key: string]: string | undefined;
};

interface ProfileAvatarCardProps {
  user: {
    id: string;
    email: string;
    created_at: string;
    user_metadata: UserMetadata;
  };
  role: "candidate" | "hr";
  displayName: string;
  applicationCount: number;
  savedCount: number;
  company: CompanyData | null;
  token: string;
  addToast: (type: ToastType, message: string) => void;
}

export function ProfileAvatarCard({
  user,
  role,
  displayName,
  applicationCount,
  savedCount,
  company,
  token,
  addToast,
}: ProfileAvatarCardProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const avatarSrc = avatarPreview ?? user.user_metadata?.avatar_url ?? null;

  const joinDate = user.created_at
    ? new Date(user.created_at).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "-";

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setAvatarPreview(reader.result as string);
    reader.readAsDataURL(file);

    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `avatars/${user.id}.${ext}`;
      const { error: uploadErr } = await supabase.storage
        .from("avatars")
        .upload(path, file, { upsert: true });

      if (uploadErr) throw uploadErr;

      const { data: urlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(path);

      await supabase.auth.updateUser({
        data: { avatar_url: urlData.publicUrl },
      });

      addToast("success", "Profile photo updated successfully!");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to upload photo.";
      addToast("error", message);
    } finally {
      setUploading(false);
    }
  };

  const stats = [
    {
      icon: <FileText size={12} />,
      label: "Applications",
      value: String(applicationCount),
    },
    {
      icon: <Star size={12} />,
      label: "Saved",
      value: String(savedCount),
    },
    {
      icon: <Calendar size={12} />,
      label: "Joined",
      value: joinDate,
    },
    {
      icon: <Briefcase size={12} />,
      label: "Position",
      value: user.user_metadata?.job_title ?? "-",
    },
  ] satisfies { icon: React.ReactNode; label: string; value: string }[];

  return (
    <div className="rounded-[16px] border border-emerald-500/15 p-6 flex flex-col items-center gap-4 bg-[#0f1612]">
      {/* Avatar with hover overlay for upload */}
      <div className="relative group">
        {avatarSrc ? (
          <Image
            src={avatarSrc}
            alt={`Profile photo of ${displayName}`}
            width={96}
            height={96}
            className="w-24 h-24 rounded-[16px] object-cover border-2 border-emerald-500/20"
            unoptimized={avatarSrc.startsWith("data:")}
          />
        ) : (
          <div
            aria-label={`Profile initials for ${displayName}`}
            className="w-24 h-24 rounded-[16px] flex items-center justify-center text-2xl font-black text-black border-2 border-emerald-500/20 bg-gradient-to-br from-emerald-500 to-cyan-500">
            {getInitials(displayName)}
          </div>
        )}

        {role === "candidate" && (
          <>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              title={uploading ? "Uploading photo…" : "Change profile photo"}
              aria-label={uploading ? "Uploading photo…" : "Change profile photo"}
              className="absolute inset-0 rounded-[16px] bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer disabled:cursor-wait">
              <Camera size={20} className="text-white" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              aria-label="Choose profile photo file"
              title="Choose profile photo file"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </>
        )}
      </div>

      {/* Name & email */}
      <div className="text-center">
        <p className="text-[#e8f0ec] font-bold text-[1rem]">{displayName}</p>
        <p className="text-[#4d6b5a] text-[0.78rem] mt-0.5">{user.email}</p>
        <div
          className={`inline-flex items-center gap-1 mt-2 px-2 py-[2px] rounded-full text-[0.65rem] font-bold border ${
            role === "hr"
              ? "bg-blue-500/10 border-blue-500/20 text-blue-400"
              : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
          }`}>
          {role === "hr" ? "✦ HR / Recruiter" : "✓ Candidate"}
        </div>
      </div>

      {/* Mini stats */}
      {role === "candidate" && (
        <div className="w-full grid grid-cols-2 gap-2">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-[10px] p-2.5 border border-emerald-500/[0.08] bg-emerald-500/[0.03] flex flex-col gap-1">
              <span className="text-[#4d6b5a] flex items-center gap-1 text-[0.72rem]">
                {stat.icon}
                {stat.label}
              </span>
              <span className="text-[#c5d8cc] font-semibold text-[0.78rem] truncate">
                {stat.value}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* HR company info */}
      {role === "hr" && company && (
        <div className="w-full rounded-[10px] p-3 border border-emerald-500/10 bg-emerald-500/[0.03]">
          <p className="text-[0.72rem] text-[#4d6b5a] mb-1 flex items-center gap-1">
            <Building2 size={11} />
            Company
          </p>
          <p className="text-[0.84rem] font-semibold text-[#c5d8cc]">
            {company.name}
          </p>
          {company.company_size && (
            <p className="text-[0.72rem] text-[#4d6b5a] mt-0.5">
              {company.company_size}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
