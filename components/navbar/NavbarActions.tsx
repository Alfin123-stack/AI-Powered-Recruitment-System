import Link from "next/link";
import { Menu, X, LayoutDashboard } from "lucide-react";
import NavbarUserMenu from "./NavbarUserMenu";
import NavbarAuthButtons from "./NavbarAuthButtons";

interface NavbarActionsProps {
  user: { email?: string } | null;
  roleUser: string | null;
  menuOpen: boolean;
  setMenuOpen: (fn: (v: boolean) => boolean) => void;
  userMenuOpen: boolean;
  setUserMenuOpen: (fn: (v: boolean) => boolean) => void;
  name: string | undefined;
  avatar: string | null | undefined;
  getInitials: (name: string) => string;
  handleLogout: () => void;
}

export default function NavbarActions({
  user,
  roleUser,
  menuOpen,
  setMenuOpen,
  userMenuOpen,
  setUserMenuOpen,
  name,
  avatar,
  getInitials,
  handleLogout,
}: NavbarActionsProps) {
  return (
    <div className="flex items-center gap-[6px] flex-shrink-0">
      {user ? (
        <>
          {/* Dashboard pill */}
          <Link
            href={roleUser === "hr" ? "/dashboard/hr" : "/dashboard/candidate"}
            className="
              hidden sm:flex items-center gap-[7px] px-[13px] py-[7px] rounded-[9px]
              text-[0.82rem] font-medium text-[#6b8878] no-underline
              border border-transparent
              transition-all duration-200
              hover:text-emerald-400 hover:bg-emerald-500/[0.07] hover:border-emerald-500/20
            "
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
      ) : (
        <NavbarAuthButtons />
      )}

      {/* Hamburger */}
      <button
        onClick={() => setMenuOpen((v) => !v)}
        aria-label="Toggle menu"
        className={`
          flex md:hidden w-9 h-9 rounded-[9px] items-center justify-center
          border transition-all duration-200 cursor-pointer flex-shrink-0
          ${
            menuOpen
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
              : "bg-[#0f1612] border-emerald-500/[0.14] text-[#6b8878] hover:border-emerald-500/30 hover:text-[#d4e8dd]"
          }
        `}
      >
        <span
          className={`transition-all duration-200 ${
            menuOpen ? "rotate-90" : "rotate-0"
          }`}
        >
          {menuOpen ? <X size={15} /> : <Menu size={15} />}
        </span>
      </button>
    </div>
  );
}