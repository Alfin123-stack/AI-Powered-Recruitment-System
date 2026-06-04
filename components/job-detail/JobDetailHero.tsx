import React from "react";
import Link from "next/link";
import { MapPin, Clock, Briefcase, Building2, ArrowLeft } from "lucide-react";
import FadeIn from "./FadeIn";
import type { Job } from "@/types/jobs";
import { timeAgo } from "@/lib/utils";

export default function JobDetailHero({
  job,
  color,
}: {
  job: Job;
  color: string;
}) {
  return (
    <section
      className="pt-[72px] pb-14 relative overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(16,185,129,0.07) 0%, transparent 65%), #0a0f0d",
      }}>
      {/* Grid pattern */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(16,185,129,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.035) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <FadeIn>
        <div className="max-w-[1100px] mx-auto px-6">
          {/* Back button */}
          <div className="mt-6 mb-5">
            <Link
              href="/jobs"
              className="inline-flex items-center gap-2 text-[#7a9585] hover:text-emerald-400 text-[0.83rem] font-medium no-underline transition-colors group">
              <ArrowLeft
                size={14}
                className="transition-transform group-hover:-translate-x-[3px]"
              />
              Kembali ke Jobs
            </Link>
          </div>

          {/* Badge */}
          <div className="block mb-5">
            <div className="inline-flex items-center gap-[6px] bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-[14px] py-[5px] rounded-full text-[0.7rem] font-semibold tracking-[0.1em] uppercase">
              Job Details
            </div>
          </div>

          <div className="flex items-start gap-5 mb-6">
            {/* Company logo */}
            <div
              className="w-16 h-16 rounded-[14px] flex items-center justify-center flex-shrink-0 border border-white/[0.08]"
              style={{ background: `${color}18`, color }}>
              {/* FIX: double optional chaining untuk companies yang nullable */}
              {job.companies?.logo_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={job.companies.logo_url}
                  alt={job.companies?.name ?? "Company"}
                  className="w-full h-full object-cover rounded-[14px]"
                />
              ) : (
                <Building2 size={28} />
              )}
            </div>

            <div>
              <h1
                className="font-syne font-extrabold leading-[1.1] tracking-tight mb-2"
                style={{ fontSize: "clamp(1.9rem,4vw,2.8rem)" }}>
                {job.title}
              </h1>

              {/* FIX: render companies.name hanya jika ada */}
              <div className="text-[#7a9585] text-[0.95rem] mb-4">
                {job.companies?.name
                  ? `${job.companies.name} · ${job.location}`
                  : job.location}
              </div>

              {/* Meta chips */}
              <div className="flex flex-wrap gap-[14px] mb-5">
                {[
                  { Icon: MapPin, text: job.location },
                  { Icon: Briefcase, text: job.type },
                  { Icon: Clock, text: `Diposting ${timeAgo(job.created_at)}` },
                ]
                  .filter((m) => m.text)
                  .map(({ Icon, text }) => (
                    <span
                      key={text}
                      className="flex items-center gap-[6px] text-[#7a9585] text-[0.82rem]">
                      <Icon size={13} /> {text}
                    </span>
                  ))}
                {job.salary && (
                  <span
                    className="flex items-center gap-[6px] text-[0.82rem] font-semibold"
                    style={{ color }}>
                    💰 {job.salary}
                  </span>
                )}
              </div>

              {/* Skill tags */}
              <div className="flex flex-wrap gap-[7px]">
                {(job.skills ?? []).map((s) => (
                  <span
                    key={s}
                    className="bg-white/[0.04] border border-white/[0.09] text-[#e8f0ec] px-3 py-[5px] rounded-[7px] text-[0.78rem] font-medium font-mono hover:border-emerald-500/35 hover:text-emerald-400 transition-all cursor-default">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </FadeIn>
    </section>
  );
}
