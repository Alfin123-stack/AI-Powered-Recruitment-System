import Link from "next/link";
import { ChevronRight, Sparkles } from "lucide-react";
import { navLinks } from "./navLinks";
import NavbarMobileUserSection from "./NavbarMobileUserSection";

interface NavbarMobileDrawerProps {
  menuOpen: boolean;
  isActive: (href: string) => boolean;
  user: { email: string } | null;
  name: string;
  avatar: string | null;
  getInitials: (name: string) => string;
  handleLogout: () => void;
}

export default function NavbarMobileDrawer({
  menuOpen,
  isActive,
  user,
  name,
  avatar,
  getInitials,
  handleLogout,
}: NavbarMobileDrawerProps) {
  return (
    <div
      className={`fixed top-[60px] left-0 right-0 z-[99]
        border-b border-[rgba(16,185,129,0.12)]
        bg-[rgba(8,12,10,0.98)] [backdrop-filter:blur(28px)]
        px-4 pt-3 pb-5
        transition-all duration-[260ms] ease-[cubic-bezier(0.22,1,0.36,1)]
        ${
          menuOpen
            ? "opacity-100 translate-y-0 pointer-events-auto shadow-[0_16px_48px_rgba(0,0,0,0.5)]"
            : "opacity-0 -translate-y-3 pointer-events-none"
        }`}
    >
      {/* Nav links */}
      <div className="flex flex-col gap-[2px] mb-3">
        {navLinks.map(({ label, href, icon }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center justify-between px-[13px] py-[11px] rounded-[10px]
                text-[0.88rem] font-medium no-underline
                transition-all duration-200
                ${
                  active
                    ? "text-emerald-400 bg-emerald-500/[0.10] border border-emerald-500/20"
                    : "text-[#6b8878] border border-transparent hover:text-[#d4e8dd] hover:bg-white/[0.04]"
                }`}
            >
              <span className="flex items-center gap-[9px]">
                <span className={active ? "opacity-80" : "opacity-40"}>{icon}</span>
                {label}
              </span>
              <ChevronRight size={13} className="opacity-30" />
            </Link>
          );
        })}
      </div>

      <div className="h-px bg-[rgba(16,185,129,0.08)] mb-3" />

      {/* Auth section */}
      {user ? (
        <NavbarMobileUserSection
          user={user}
          name={name}
          avatar={avatar}
          getInitials={getInitials}
          handleLogout={handleLogout}
        />
      ) : (
        <div className="flex flex-col gap-[6px]">
          <Link
            href="/login"
            className="flex items-center justify-between px-[13px] py-[11px] rounded-[10px]
              text-[0.88rem] font-medium text-[#6b8878] no-underline
              border border-transparent
              hover:text-[#d4e8dd] hover:bg-white/[0.04]
              transition-all duration-200"
          >
            Login
            <ChevronRight size={13} className="opacity-30" />
          </Link>

          <Link
            href="/register"
            className="flex items-center justify-center gap-[7px] w-full px-4 py-[11px]
              bg-gradient-to-r from-emerald-500 to-cyan-500
              hover:from-emerald-400 hover:to-cyan-400
              rounded-[10px] text-[0.9rem] font-bold text-black no-underline
              transition-all duration-200
              hover:shadow-[0_6px_24px_rgba(16,185,129,0.3)]
              active:scale-[0.98]"
          >
            <Sparkles size={14} />
            Try Free
          </Link>
        </div>
      )}
    </div>
  );
}
