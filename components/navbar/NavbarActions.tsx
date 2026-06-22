import Link from "next/link";
import { LayoutDashboard, Sparkles } from "lucide-react";
import NavbarUserMenu from "./NavbarUserMenu";

interface NavbarActionsProps {
  user: { email: string } | null;
  roleUser: string | null;
  userMenuOpen: boolean;
  setUserMenuOpen: (fn: (v: boolean) => boolean) => void;
  name: string;
  avatar: string | null;
  getInitials: (name: string) => string;
  handleLogout: () => void;
}

export default function NavbarActions({
  user,
  roleUser,
  userMenuOpen,
  setUserMenuOpen,
  name,
  avatar,
  getInitials,
  handleLogout,
}: NavbarActionsProps) {
  if (user) {
    return (
      <>
        {/* Dashboard pill */}
        <Link
          href={roleUser === "hr" ? "/dashboard/hr" : "/dashboard/candidate"}
          className="hidden sm:flex items-center gap-[7px] px-[13px] py-[7px] rounded-[9px]
            text-[0.82rem] font-medium text-[#6b8878] no-underline
            border border-transparent
            transition-all duration-200
            hover:text-emerald-400 hover:bg-emerald-500/[0.07] hover:border-emerald-500/20"
        >
          <LayoutDashboard size={13} />
          Dashboard
        </Link>

        {/* Avatar + dropdown */}
        <NavbarUserMenu
          userMenuOpen={userMenuOpen}
          setUserMenuOpen={setUserMenuOpen}
          name={name}
          avatar={avatar}
          email={user.email}
          getInitials={getInitials}
          handleLogout={handleLogout}
        />
      </>
    );
  }

  return (
    <>
      {/* Login */}
      <Link
        href="/login"
        className="hidden sm:block px-[13px] py-[7px] rounded-[9px]
          text-[0.82rem] font-medium text-[#6b8878] no-underline
          transition-all duration-200
          hover:text-[#d4e8dd] hover:bg-white/[0.04]"
      >
        Login
      </Link>

      {/* Animated CTA */}
      <Link
        href="/register"
        className="relative inline-flex h-[36px] rounded-[10px] overflow-hidden p-[1.5px] no-underline flex-shrink-0
          focus-visible:outline-none focus-visible:shadow-[0_0_0_3px_rgba(16,185,129,0.35)]
          hover:scale-[1.03] active:scale-[0.97] transition-transform duration-150"
      >
        <span className="absolute inset-[-1000%] cta-spin bg-[conic-gradient(from_0deg,#10b981,#06b6d4,#8b5cf6,#ec4899,#10b981)]" />
        <span
          className="relative z-10 inline-flex items-center gap-[6px] h-full px-[14px]
            rounded-[8.5px] bg-[#0a0f0d]
            text-[0.81rem] font-bold text-emerald-400 whitespace-nowrap
            hover:text-white hover:bg-[#0f1612]
            transition-all duration-200"
        >
          <Sparkles size={12} className="opacity-80" />
          Try Free
        </span>
      </Link>
    </>
  );
}
