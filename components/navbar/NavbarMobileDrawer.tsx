import Link from "next/link";
import {
  ChevronRight,
  LayoutDashboard,
  User,
  LogOut,
  Sparkles,
  BriefcaseBusiness,
  Building2,
  ScanText,
  BookOpen,
  LucideProps,
} from "lucide-react";
import {
  NAV_LINKS,
  NavLink,
  NAVBAR_MOBILE_ACTIVE_LINK_CLS,
  NAVBAR_MOBILE_INACTIVE_LINK_CLS,
} from "@/constants/navbar";

type IconName = NavLink["iconName"];

const ICON_MAP: Record<IconName, React.ComponentType<LucideProps>> = {
  BriefcaseBusiness,
  Building2,
  ScanText,
  BookOpen,
};

interface NavbarMobileDrawerProps {
  menuOpen: boolean;
  isActive: (href: string) => boolean;
  user: { email?: string } | null;
  name: string | undefined;
  avatar: string | null | undefined;
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
  const displayName = name ?? "";

  const mobileMenuItems = [
    { icon: <LayoutDashboard size={14} />, label: "Dashboard", href: "/dashboard" },
    { icon: <User size={14} />, label: "Profile", href: "/profile" },
  ];

  return (
    <div
      className={`
        fixed top-[60px] left-0 right-0 z-[99]
        border-b border-emerald-500/[0.12]
        bg-[rgba(8,12,10,0.98)] backdrop-blur-[28px]
        px-4 pt-3 pb-5
        transition-all duration-[260ms] ease-[cubic-bezier(0.22,1,0.36,1)]
        ${
          menuOpen
            ? "opacity-100 translate-y-0 pointer-events-auto shadow-[0_16px_48px_rgba(0,0,0,0.5)]"
            : "opacity-0 -translate-y-3 pointer-events-none"
        }
      `}
    >
      {/* Nav links */}
      <div className="flex flex-col gap-[2px] mb-3">
        {NAV_LINKS.map(({ label, href, iconName }: NavLink) => {
          const active = isActive(href);
          const Icon = ICON_MAP[iconName];
          return (
            <Link
              key={href}
              href={href}
              className={`
                flex items-center justify-between px-[13px] py-[11px] rounded-[10px]
                text-[0.88rem] font-medium no-underline
                transition-all duration-200
                ${active ? NAVBAR_MOBILE_ACTIVE_LINK_CLS : NAVBAR_MOBILE_INACTIVE_LINK_CLS}
              `}
            >
              <span className="flex items-center gap-[9px]">
                <span className={active ? "opacity-80" : "opacity-40"}>
                  <Icon size={13} />
                </span>
                {label}
              </span>
              <ChevronRight size={13} className="opacity-30" />
            </Link>
          );
        })}
      </div>

      <div className="h-px bg-emerald-500/[0.08] mb-3" />

      {user ? (
        <>
          {/* User card */}
          <div className="flex items-center gap-3 px-[13px] py-[10px] mb-2 rounded-[10px] bg-emerald-500/[0.05] border border-emerald-500/[0.12]">
            {avatar ? (
              <img
                src={avatar}
                alt={displayName}
                className="w-9 h-9 rounded-[8px] object-cover flex-shrink-0"
              />
            ) : (
              <div className="w-9 h-9 rounded-[8px] flex items-center justify-center text-[0.72rem] font-bold text-black flex-shrink-0 bg-gradient-to-br from-emerald-400 to-cyan-400">
                {getInitials(displayName)}
              </div>
            )}
            <div className="min-w-0">
              <p className="text-[0.86rem] font-semibold text-[#e8f0ec] truncate">{displayName}</p>
              <p className="text-[0.73rem] text-[#3d5a49] truncate">{user.email ?? ""}</p>
            </div>
          </div>

          {mobileMenuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="
                flex items-center justify-between px-[13px] py-[11px] rounded-[10px] mb-[2px]
                text-[0.88rem] font-medium text-[#6b8878] no-underline
                border border-transparent
                hover:text-[#d4e8dd] hover:bg-white/[0.04]
                transition-all duration-200
              "
            >
              <span className="flex items-center gap-[9px] opacity-80">
                {item.icon}
                {item.label}
              </span>
              <ChevronRight size={13} className="opacity-30" />
            </Link>
          ))}

          <button
            onClick={handleLogout}
            className="
              mt-1 flex items-center justify-center gap-2 w-full px-4 py-[11px] rounded-[10px]
              text-[0.88rem] font-bold text-red-400
              border border-red-500/20 bg-red-500/[0.05]
              hover:bg-red-500/10 hover:border-red-500/35
              transition-all duration-200 cursor-pointer
            "
          >
            <LogOut size={14} />
            Logout
          </button>
        </>
      ) : (
        <div className="flex flex-col gap-[6px]">
          <Link
            href="/login"
            className="
              flex items-center justify-between px-[13px] py-[11px] rounded-[10px]
              text-[0.88rem] font-medium text-[#6b8878] no-underline
              border border-transparent
              hover:text-[#d4e8dd] hover:bg-white/[0.04]
              transition-all duration-200
            "
          >
            Login
            <ChevronRight size={13} className="opacity-30" />
          </Link>

          <Link
            href="/register"
            className="
              flex items-center justify-center gap-[7px] w-full px-4 py-[11px]
              bg-gradient-to-r from-emerald-500 to-cyan-500
              hover:from-emerald-400 hover:to-cyan-400
              rounded-[10px] text-[0.9rem] font-bold text-black no-underline
              transition-all duration-200
              hover:shadow-[0_6px_24px_rgba(16,185,129,0.3)]
              active:scale-[0.98]
            "
          >
            <Sparkles size={14} />
            Try Free
          </Link>
        </div>
      )}
    </div>
  );
}