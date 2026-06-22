"use client";

import { Menu, X } from "lucide-react";
import { useNavbar } from "@/hooks/main/useNavbar";

import NavbarStyles from "./NavbarStyles";
import NavbarBrand from "./NavbarBrand";
import NavbarDesktopLinks from "./NavbarDesktopLinks";
import NavbarActions from "./NavbarActions";
import NavbarMobileDrawer from "./NavbarMobileDrawer";

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
      <NavbarStyles />

      {/* ── NAVBAR ── */}
      <nav
        className={`fixed top-0 left-0 right-0 z-[100] font-poppins transition-all duration-300
          ${scrolled ? "shadow-[0_8px_48px_rgba(0,0,0,0.45)]" : ""}`}
      >
        {/* Backdrop blur layer */}
        <div
          className={`absolute inset-0 border-b transition-all duration-500
            [backdrop-filter:blur(20px)_saturate(1.4)]
            ${
              scrolled
                ? "bg-[rgba(8,12,10,0.97)] border-[rgba(16,185,129,0.18)]"
                : "bg-[rgba(10,15,13,0.82)] border-[rgba(16,185,129,0.10)]"
            }`}
        />

        {/* Subtle top green line when scrolled */}
        <div
          className={`absolute top-0 left-0 right-0 h-[1px] transition-opacity duration-500
            bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent
            ${scrolled ? "opacity-100" : "opacity-0"}`}
        />

        {/* Inner */}
        <div className="relative z-10 max-w-[1180px] mx-auto px-6 h-[60px] flex items-center justify-between gap-6">
          <NavbarBrand />

          <NavbarDesktopLinks isActive={isActive} />

          {/* Right-side actions + hamburger */}
          <div className="flex items-center gap-[6px] flex-shrink-0">
            <NavbarActions
              user={user}
              roleUser={roleUser}
              userMenuOpen={userMenuOpen}
              setUserMenuOpen={setUserMenuOpen}
              name={name}
              avatar={avatar}
              getInitials={getInitials}
              handleLogout={handleLogout}
            />

            {/* Hamburger */}
            <button
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Toggle menu"
              className={`flex md:hidden w-[36px] h-[36px] rounded-[9px] items-center justify-center
                border transition-all duration-200 cursor-pointer flex-shrink-0
                ${
                  menuOpen
                    ? "bg-emerald-500/[0.10] border-emerald-500/30 text-emerald-400"
                    : "bg-[#0f1612] border-[rgba(16,185,129,0.14)] text-[#6b8878] hover:border-[rgba(16,185,129,0.30)] hover:text-[#d4e8dd]"
                }`}
            >
              <span
                className={`transition-all duration-200 ${
                  menuOpen ? "rotate-90 opacity-100" : "rotate-0 opacity-100"
                }`}
              >
                {menuOpen ? <X size={15} /> : <Menu size={15} />}
              </span>
            </button>
          </div>
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
