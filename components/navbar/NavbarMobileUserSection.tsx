import Link from "next/link";
import { LayoutDashboard, User, LogOut, ChevronRight } from "lucide-react";

interface NavbarMobileUserSectionProps {
  user: { email: string };
  name: string;
  avatar: string | null;
  getInitials: (name: string) => string;
  handleLogout: () => void;
}

const userMenuItems = [
  { icon: <LayoutDashboard size={14} />, label: "Dashboard", href: "/dashboard" },
  { icon: <User size={14} />, label: "Profile", href: "/profile" },
];

export default function NavbarMobileUserSection({
  user,
  name,
  avatar,
  getInitials,
  handleLogout,
}: NavbarMobileUserSectionProps) {
  return (
    <>
      {/* User card */}
      <div
        className="flex items-center gap-3 px-[13px] py-[10px] mb-2 rounded-[10px]
          bg-emerald-500/[0.05] border border-emerald-500/[0.12]"
      >
        {avatar ? (
          <img
            src={avatar}
            alt={name}
            className="w-9 h-9 rounded-[8px] object-cover flex-shrink-0"
          />
        ) : (
          <div
            className="w-9 h-9 rounded-[8px] flex items-center justify-center text-[0.72rem] font-bold text-black flex-shrink-0
              bg-gradient-to-br from-emerald-400 to-cyan-400"
          >
            {getInitials(name)}
          </div>
        )}
        <div className="min-w-0">
          <p className="text-[0.86rem] font-semibold text-[#e8f0ec] truncate">{name}</p>
          <p className="text-[0.73rem] text-[#3d5a49] truncate">{user.email}</p>
        </div>
      </div>

      {/* Nav items */}
      {userMenuItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="flex items-center justify-between px-[13px] py-[11px] rounded-[10px] mb-[2px]
            text-[0.88rem] font-medium text-[#6b8878] no-underline
            border border-transparent
            hover:text-[#d4e8dd] hover:bg-white/[0.04]
            transition-all duration-200"
        >
          <span className="flex items-center gap-[9px] opacity-80">
            {item.icon}
            {item.label}
          </span>
          <ChevronRight size={13} className="opacity-30" />
        </Link>
      ))}

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="mt-1 flex items-center justify-center gap-2 w-full px-4 py-[11px] rounded-[10px]
          text-[0.88rem] font-bold text-red-400
          border border-red-500/20 bg-red-500/[0.05]
          hover:bg-red-500/[0.10] hover:border-red-500/35
          transition-all duration-200 cursor-pointer"
      >
        <LogOut size={14} />
        Logout
      </button>
    </>
  );
}
