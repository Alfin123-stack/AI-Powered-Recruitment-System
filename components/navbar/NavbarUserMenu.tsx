import Link from "next/link";
import { ChevronDown, Settings, LogOut } from "lucide-react";

interface NavbarUserMenuProps {
  userMenuOpen: boolean;
  setUserMenuOpen: (fn: (v: boolean) => boolean) => void;
  name: string | undefined;
  avatar: string | null | undefined;
  email: string | undefined;
  getInitials: (name: string) => string;
  handleLogout: () => void;
}

export default function NavbarUserMenu({
  userMenuOpen,
  setUserMenuOpen,
  name,
  avatar,
  email,
  getInitials,
  handleLogout,
}: NavbarUserMenuProps) {
  const displayName = name ?? "";

  return (
    <div className="relative" data-user-menu>
      {/* Trigger button */}
      <button
        onClick={() => setUserMenuOpen((v) => !v)}
        className={`
          flex items-center gap-[7px] h-9 pl-[5px] pr-[10px] rounded-[10px]
          border transition-all duration-200 cursor-pointer
          ${
            userMenuOpen
              ? "border-emerald-500/35 bg-emerald-500/[0.09] text-[#e8f0ec]"
              : "border-emerald-500/15 bg-emerald-500/[0.04] text-[#c5d8cc] hover:border-emerald-500/30 hover:bg-emerald-500/[0.08]"
          }
        `}
      >
        {avatar ? (
          <img
            src={avatar}
            alt={displayName}
            className="w-[26px] h-[26px] rounded-[7px] object-cover"
          />
        ) : (
          <div
            className="
              w-[26px] h-[26px] rounded-[7px] flex items-center justify-center
              text-[0.66rem] font-bold text-black flex-shrink-0
              bg-gradient-to-br from-emerald-400 to-cyan-400
            "
          >
            {getInitials(displayName)}
          </div>
        )}

        <span className="hidden sm:block text-[0.8rem] font-semibold max-w-[80px] truncate">
          {displayName.split(" ")[0]}
        </span>

        <ChevronDown
          size={12}
          className={`text-[#7a9585] transition-transform duration-200 flex-shrink-0 ${
            userMenuOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown */}
      {userMenuOpen && (
        <div
          className="
            nav-drop absolute right-0 top-[calc(100%+10px)] w-[210px]
            rounded-[14px] border border-emerald-500/[0.14]
            bg-[rgba(8,12,10,0.98)] backdrop-blur-[28px]
            shadow-[0_20px_60px_rgba(0,0,0,0.6),0_0_0_1px_rgba(16,185,129,0.06)]
            overflow-hidden
          "
        >
          {/* Header */}
          <div className="px-4 py-[14px] border-b border-emerald-500/[0.08]">
            <div className="flex items-center gap-[10px]">
              {avatar ? (
                <img
                  src={avatar}
                  alt={displayName}
                  className="w-9 h-9 rounded-[9px] object-cover flex-shrink-0"
                />
              ) : (
                <div
                  className="
                    w-9 h-9 rounded-[9px] flex items-center justify-center
                    text-[0.75rem] font-bold text-black flex-shrink-0
                    bg-gradient-to-br from-emerald-400 to-cyan-400
                  "
                >
                  {getInitials(displayName)}
                </div>
              )}
              <div className="min-w-0">
                <p className="text-[0.84rem] font-semibold text-[#e8f0ec] truncate">
                  {displayName}
                </p>
                <p className="text-[0.72rem] text-[#3d5a49] truncate mt-[1px]">
                  {email ?? ""}
                </p>
              </div>
            </div>
          </div>

          {/* Settings link */}
          <div className="py-[6px]">
            <Link
              href="/profile"
              className="
                group flex items-center gap-[10px] px-4 py-[9px]
                text-[0.82rem] text-[#7a9585] no-underline
                hover:text-[#e8f0ec] hover:bg-white/[0.04]
                transition-all duration-150
              "
            >
              <Settings
                size={13}
                className="group-hover:text-emerald-400 transition-colors duration-150"
              />
              Settings
            </Link>
          </div>

          <div className="h-px mx-3 bg-emerald-500/[0.07]" />

          {/* Logout */}
          <div className="py-[6px]">
            <button
              onClick={handleLogout}
              className="
                group w-full flex items-center gap-[10px] px-4 py-[9px]
                text-[0.82rem] text-[#7a9585]
                hover:text-red-400 hover:bg-red-500/[0.07]
                transition-all duration-150 cursor-pointer
              "
            >
              <LogOut
                size={13}
                className="group-hover:text-red-400 transition-colors"
              />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}