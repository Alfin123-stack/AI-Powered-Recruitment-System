import Link from "next/link";
import type { IconBtnProps } from "@/types/topbar";

export function TopbarIconBtn({ onClick, active, children, title, href }: IconBtnProps) {
  const cls = `w-[34px] h-[34px] rounded-lg border flex items-center justify-center transition-colors duration-150 cursor-pointer
    ${
      active
        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
        : "bg-[#0f1612] border-white/[0.08] text-[#7a9585] hover:border-white/[0.14] hover:text-[#e8f0ec]"
    }`;

  if (href) {
    return (
      <Link href={href} title={title} aria-label={title} className={`${cls} no-underline`}>
        {children}
      </Link>
    );
  }

  return (
    <button onClick={onClick} title={title} aria-label={title} className={cls}>
      {children}
    </button>
  );
}
