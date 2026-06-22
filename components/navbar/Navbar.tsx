"use client";

import NavbarKeyframes from "./NavbarKeyframes";
import NavbarLogo from "./NavbarLogo";
import NavbarDesktopLinks from "./NavbarDesktopLinks";
import NavbarActions from "./NavbarActions";
import NavbarMobileDrawer from "./NavbarMobileDrawer";
import { useNavbar } from "@/hooks/main/useNavbar";


export default function Navbar() {
  const {
    menuOpen,
    setMenuOpen,
    userMenuOpen,
    setUserMenuOpen,
    scrolled,
    user,
    roleUser,
    isActive,
    handleLogout,
    name,
    avatar,
    getInitials,
  } = useNavbar();

  return (
    <>
      <NavbarKeyframes />

      {/* ── NAVBAR ── */}
      <nav
        className={`
          fixed top-0 left-0 right-0 z-[100] font-poppins transition-all duration-300
          ${scrolled ? "shadow-[0_8px_48px_rgba(0,0,0,0.45)]" : ""}
        `}
      >
        {/* Backdrop blur layer */}
        <div
          className={`
            absolute inset-0 border-b transition-all duration-500
            [backdrop-filter:blur(20px)_saturate(1.4)]
            ${
              scrolled
                ? "bg-[rgba(8,12,10,0.97)] border-emerald-500/[0.18]"
                : "bg-[rgba(10,15,13,0.82)] border-emerald-500/10"
            }
          `}
        />

        {/* Subtle top green line when scrolled */}
        <div
          className={`
            absolute top-0 left-0 right-0 h-px transition-opacity duration-500
            bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent
            ${scrolled ? "opacity-100" : "opacity-0"}
          `}
        />

        {/* Inner */}
        <div className="relative z-10 max-w-[1180px] mx-auto px-6 h-[60px] flex items-center justify-between gap-6">
          <NavbarLogo />
          <NavbarDesktopLinks isActive={isActive} />
          <NavbarActions
            user={user}
            roleUser={roleUser}
            menuOpen={menuOpen}
            setMenuOpen={setMenuOpen}
            userMenuOpen={userMenuOpen}
            setUserMenuOpen={setUserMenuOpen}
            name={name}
            avatar={avatar}
            getInitials={getInitials}
            handleLogout={handleLogout}
          />
        </div>
      </nav>

      {/* ── MOBILE DRAWER ── */}
      <NavbarMobileDrawer
        menuOpen={menuOpen}
        isActive={isActive}
        user={user}
        name={name}
        avatar={avatar}
        getInitials={getInitials}
        handleLogout={handleLogout}
      />
    </>
  );
}
