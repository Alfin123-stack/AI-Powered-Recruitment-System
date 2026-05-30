"use client";

// Wajib client karena menggunakan CATEGORY_ICONS — mapping ke Lucide React
// components yang perlu dijalankan di browser.

import Link from "next/link";
import { getCategoryIcon } from "./categoryIcons";

type CompanyLogoProps = {
  id: string;
  name: string;
  logoUrl: string | null;
  accent: string;
};

export default function CompanyLogo({ id, name, logoUrl, accent }: CompanyLogoProps) {
  const CategoryIcon = getCategoryIcon(id);

  return (
    <Link href={`/companies/${id}`} className="no-underline flex-shrink-0">
      <div
        className="w-[40px] h-[40px] rounded-[10px] flex items-center justify-center border border-[rgba(255,255,255,0.06)] transition-opacity hover:opacity-75"
        style={{ background: `${accent}18` }}
      >
        {logoUrl ? (
          <img
            src={logoUrl}
            alt={name}
            className="w-full h-full object-cover rounded-[10px]"
          />
        ) : (
          <CategoryIcon size={18} style={{ color: accent }} />
        )}
      </div>
    </Link>
  );
}
