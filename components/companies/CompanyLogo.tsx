"use client";

import { createElement } from "react";
import Link from "next/link";
import Image from "next/image";
import { getCategoryIcon } from "@/constants/main/blogs";

type CompanyLogoProps = {
  id: string;
  name: string;
  logoUrl: string | null;
  accent: string;
};

export default function CompanyLogo({
  id,
  name,
  logoUrl,
  accent,
}: CompanyLogoProps) {
  return (
    <Link href={`/companies/${id}`} className="no-underline flex-shrink-0">
      <div
        className="w-[40px] h-[40px] rounded-[10px] flex items-center justify-center border border-[rgba(255,255,255,0.06)] transition-opacity hover:opacity-75"
        style={{ background: `${accent}18` }}>
        {logoUrl ? (
          <Image
            src={logoUrl}
            alt={name}
            width={40}
            height={40}
            className="w-full h-full object-cover rounded-[10px]"
          />
        ) : (
          // ✅ Fix: createElement prevents React from treating it as a new component
          createElement(getCategoryIcon(id), {
            size: 18,
            style: { color: accent },
          })
        )}
      </div>
    </Link>
  );
}
