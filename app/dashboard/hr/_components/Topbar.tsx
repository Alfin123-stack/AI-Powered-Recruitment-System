"use client";

import { usePathname } from "next/navigation";
import { Bell, Download, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IconButton, Company } from "./shared";
import Link from "next/link";

const titleMap: Record<string, string> = {
  "/dashboard/hr/overview": "HR Dashboard",
  "/dashboard/hr/jobs": "Kelola Lowongan",
  "/dashboard/hr/candidates": "Candidates",
  "/dashboard/hr/analytics": "Analytics",
  "/dashboard/hr/interviews": "Interviews",
};

export default function Topbar({ company }: { company: Company | null }) {
  const pathname = usePathname();
  const title = titleMap[pathname] ?? "HR Dashboard";
  const isJobsPage = pathname === "/dashboard/hr/jobs";

  return (
    <div
      className="sticky top-0 z-40 border-b border-emerald-500/15 px-8 h-[60px] flex items-center justify-between"
      style={{
        background: "rgba(10,15,13,0.9)",
        backdropFilter: "blur(16px)",
      }}>
      <div>
        <span className="font-bold text-[1rem]">{title}</span>
        {company && (
          <span className="text-[#7a9585] text-[0.78rem] ml-2">
            — {company.name}
          </span>
        )}
      </div>
      <div className="flex items-center gap-[10px]">
        <IconButton>
          <Bell size={15} />
        </IconButton>
        <IconButton>
          <Download size={15} />
        </IconButton>
        {!isJobsPage && (
          <Link href="/dashboard/jobs">
            <Button className="inline-flex items-center gap-[7px] bg-emerald-500 hover:bg-emerald-400 hover:shadow-[0_4px_16px_rgba(16,185,129,0.3)] text-black font-bold text-[0.85rem] px-[18px] py-[9px] rounded-[9px]">
              <Plus size={14} /> Buat Lowongan
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
