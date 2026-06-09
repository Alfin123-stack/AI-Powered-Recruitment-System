// Server Component — no interactivity, purely static markup.
// Rendered once at build/request time; no "use client" needed.

import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import type { NavItem } from "../../types/notifications";

interface NotificationsHeaderProps {
  backHref: string;
  navItems: NavItem[];
}

export default function NotificationsHeader({
  backHref,
  navItems,
}: NotificationsHeaderProps) {
  return (
    <header
      className="sticky top-0 z-40 backdrop-blur-xl"
      style={{
        background: "rgba(8,13,11,0.85)",
        borderBottom: "1px solid rgba(255,255,255,0.04)",
      }}>
      <div className="max-w-[720px] mx-auto px-5 h-14 flex items-center justify-between">
        {/* Left: back + logo */}
        <div className="flex items-center gap-2">
          <Link
            href={backHref}
            className="w-8 h-8 rounded-xl flex items-center justify-center transition-all no-underline border border-white/[0.07] text-[#3a5245] hover:text-[#6aad8a] hover:border-white/[0.12]"
            style={{ background: "rgba(255,255,255,0.03)" }}>
            <ArrowLeft size={14} />
          </Link>
          <Link
            href="/"
            className="font-extrabold text-[0.95rem] flex items-center gap-1.5 no-underline ml-1"
            style={{ color: "#dff0e8" }}>
            <Sparkles size={13} className="text-emerald-400" />
            Recruit<em className="not-italic text-emerald-400">AI</em>
          </Link>
        </div>

        {/* Right: nav items */}
        <nav className="flex items-center gap-[1px]">
          {navItems.map(({ href, icon: Icon, label }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-[5px] px-3 py-[5px] rounded-lg text-[0.73rem] font-medium no-underline transition-colors text-[#3a5245] hover:text-[#6aad8a]">
              <Icon size={12} />
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
