
"use client";

import Link from "next/link";
import {
  Menu,
  X,
  ChevronRight,
  LayoutDashboard,
  LogOut,
  User,
  ChevronDown,
  Settings,
  Sparkles,
  BriefcaseBusiness,
  ScanText,
  Building2,
  BookOpen,
} from "lucide-react";
import { useNavbar } from "@/hooks/main/useNavbar";

const navLinks = [
  { label: "Jobs", href: "/jobs", icon: <BriefcaseBusiness size={13} /> },
    { label: "Companies", href: "/companies", icon: <Building2 size={13} /> },
  { label: "AI Analyzer", href: "/analyze", icon: <ScanText size={13} /> },
  { label: "Blog", href: "/blog", icon: <BookOpen size={13} /> },
];

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
      <style>{`
        @keyframes ctaSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes navDropIn {
          from { opacity: 0; transform: translateY(-6px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0)    scale(1);    }
        }
        .cta-spin { animation: ctaSpin 5s linear infinite; }
        .nav-drop { animation: navDropIn 0.18s ease forwards; }
      `}</style>

      {/* ── NAVBAR ── */}
      <nav
        className={`fixed top-0 left-0 right-0 z-[100] font-poppins transition-all duration-300
          ${scrolled ? "shadow-[0_8px_48px_rgba(0,0,0,0.45)]" : ""}`}>
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
          {/* ── LOGO ── */}
          <Link
            href="/"
            className="group flex items-center gap-[8px] no-underline flex-shrink-0">
            <div
              className="relative w-[32px] h-[32px] rounded-[10px] flex items-center justify-center overflow-hidden flex-shrink-0
              bg-gradient-to-br from-emerald-400 to-cyan-400
              shadow-[0_0_0_0_rgba(16,185,129,0)]
              transition-all duration-300
              group-hover:shadow-[0_0_0_4px_rgba(16,185,129,0.18)]
              group-hover:scale-110 group-hover:rotate-[8deg]">
              <span className="text-black font-black text-[1rem] leading-none">
                ✦
              </span>
            </div>
            <span className="font-extrabold text-[1.08rem] tracking-[-0.02em] text-[#e8f0ec] leading-none whitespace-nowrap">
              Recruit
              <em className="not-italic bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                AI
              </em>
            </span>
          </Link>

          {/* ── DESKTOP NAV LINKS ── */}
          <div className="hidden md:flex items-center gap-[1px] flex-1 justify-center">
            {navLinks.map(({ label, href, icon }) => {
              const active = isActive(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={`
                    group relative flex items-center gap-[6px]
                    px-[13px] py-[7px] rounded-[9px]
                    text-[0.82rem] font-medium no-underline
                    transition-all duration-200 select-none
                    ${
                      active
                        ? "text-emerald-400 bg-emerald-500/[0.10]"
                        : "text-[#6b8878] hover:text-[#d4e8dd] hover:bg-white/[0.04]"
                    }
                  `}>
                  {/* Icon — subtle, scales on hover */}
                  <span
                    className={`transition-all duration-200 ${active ? "opacity-80" : "opacity-40 group-hover:opacity-70"}`}>
                    {icon}
                  </span>

                  {label}

                  {/* Active dot indicator */}
                  {active && (
                    <span className="absolute bottom-[4px] left-1/2 -translate-x-1/2 w-[14px] h-[2px] rounded-full bg-emerald-400 opacity-80" />
                  )}

                  {/* Hover underline (non-active) */}
                  {!active && (
                    <span
                      className="absolute bottom-[4px] left-[13px] right-[13px] h-[1.5px] rounded-full bg-emerald-400/50
                      scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-[200ms]"
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* ── ACTIONS ── */}
          <div className="flex items-center gap-[6px] flex-shrink-0">
            {user ? (
              <>
                {/* Dashboard pill */}
                <Link
                  href={
                    roleUser === "hr" ? "/dashboard/hr" : "/dashboard/candidate"
                  }
                  className="hidden sm:flex items-center gap-[7px] px-[13px] py-[7px] rounded-[9px]
                    text-[0.82rem] font-medium text-[#6b8878] no-underline
                    border border-transparent
                    transition-all duration-200
                    hover:text-emerald-400 hover:bg-emerald-500/[0.07] hover:border-emerald-500/20">
                  <LayoutDashboard size={13} />
                  Dashboard
                </Link>

                {/* Avatar dropdown */}
                <div className="relative" data-user-menu>
                  <button
                    onClick={() => setUserMenuOpen((v) => !v)}
                    className={`flex items-center gap-[7px] h-[36px] pl-[5px] pr-[10px] rounded-[10px]
                      border transition-all duration-200 cursor-pointer
                      ${
                        userMenuOpen
                          ? "border-emerald-500/35 bg-emerald-500/[0.09] text-[#e8f0ec]"
                          : "border-emerald-500/15 bg-emerald-500/[0.04] text-[#c5d8cc] hover:border-emerald-500/30 hover:bg-emerald-500/[0.08]"
                      }`}>
                    {avatar ? (
                      <img
                        src={avatar}
                        alt={name}
                        className="w-[26px] h-[26px] rounded-[7px] object-cover"
                      />
                    ) : (
                      <div
                        className="w-[26px] h-[26px] rounded-[7px] flex items-center justify-center
                        text-[0.66rem] font-bold text-black
                        bg-gradient-to-br from-emerald-400 to-cyan-400 flex-shrink-0">
                        {getInitials(name)}
                      </div>
                    )}
                    <span className="hidden sm:block text-[0.8rem] font-semibold max-w-[80px] truncate">
                      {name.split(" ")[0]}
                    </span>
                    <ChevronDown
                      size={12}
                      className={`text-[#7a9585] transition-transform duration-200 flex-shrink-0 ${userMenuOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {/* Dropdown */}
                  {userMenuOpen && (
                    <div
                      className="nav-drop absolute right-0 top-[calc(100%+10px)] w-[210px]
                      rounded-[14px] border border-[rgba(16,185,129,0.14)]
                      bg-[rgba(8,12,10,0.98)] [backdrop-filter:blur(28px)]
                      shadow-[0_20px_60px_rgba(0,0,0,0.6),0_0_0_1px_rgba(16,185,129,0.06)]
                      overflow-hidden">
                      {/* Header */}
                      <div className="px-4 py-[14px] border-b border-[rgba(16,185,129,0.08)]">
                        <div className="flex items-center gap-[10px]">
                          {avatar ? (
                            <img
                              src={avatar}
                              alt={name}
                              className="w-9 h-9 rounded-[9px] object-cover flex-shrink-0"
                            />
                          ) : (
                            <div
                              className="w-9 h-9 rounded-[9px] flex items-center justify-center
                              text-[0.75rem] font-bold text-black flex-shrink-0
                              bg-gradient-to-br from-emerald-400 to-cyan-400">
                              {getInitials(name)}
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="text-[0.84rem] font-semibold text-[#e8f0ec] truncate">
                              {name}
                            </p>
                            <p className="text-[0.72rem] text-[#3d5a49] truncate mt-[1px]">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="py-[6px]">
                        {[
                          {
                            icon: <LayoutDashboard size={13} />,
                            label: "Dashboard",
                            href: "/dashboard",
                          },
                          {
                            icon: <Settings size={13} />,
                            label: "Pengaturan",
                            href: "/profile",
                          },
                        ].map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            className="group flex items-center gap-[10px] px-4 py-[9px]
                              text-[0.82rem] text-[#7a9585] no-underline
                              hover:text-[#e8f0ec] hover:bg-white/[0.04]
                              transition-all duration-150">
                            <span className="group-hover:text-emerald-400 transition-colors duration-150">
                              {item.icon}
                            </span>
                            {item.label}
                          </Link>
                        ))}
                      </div>

                      <div className="h-px mx-3 bg-[rgba(16,185,129,0.07)]" />

                      <div className="py-[6px]">
                        <button
                          onClick={handleLogout}
                          className="group w-full flex items-center gap-[10px] px-4 py-[9px]
                            text-[0.82rem] text-[#7a9585]
                            hover:text-red-400 hover:bg-red-500/[0.07]
                            transition-all duration-150 cursor-pointer">
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
              </>
            ) : (
              <>
                {/* Login */}
                <Link
                  href="/login"
                  className="hidden sm:block px-[13px] py-[7px] rounded-[9px]
                    text-[0.82rem] font-medium text-[#6b8878] no-underline
                    transition-all duration-200
                    hover:text-[#d4e8dd] hover:bg-white/[0.04]">
                  Masuk
                </Link>

                {/* Animated CTA */}
                <Link
                  href="/register"
                  className="relative inline-flex h-[36px] rounded-[10px] overflow-hidden p-[1.5px] no-underline flex-shrink-0
                    focus-visible:outline-none focus-visible:shadow-[0_0_0_3px_rgba(16,185,129,0.35)]
                    hover:scale-[1.03] active:scale-[0.97] transition-transform duration-150">
                  <span className="absolute inset-[-1000%] cta-spin bg-[conic-gradient(from_0deg,#10b981,#06b6d4,#8b5cf6,#ec4899,#10b981)]" />
                  <span
                    className="relative z-10 inline-flex items-center gap-[6px] h-full px-[14px]
                    rounded-[8.5px] bg-[#0a0f0d]
                    text-[0.81rem] font-bold text-emerald-400 whitespace-nowrap
                    hover:text-white hover:bg-[#0f1612]
                    transition-all duration-200">
                    <Sparkles size={12} className="opacity-80" />
                    Coba Gratis
                  </span>
                </Link>
              </>
            )}

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
                }`}>
              <span
                className={`transition-all duration-200 ${menuOpen ? "rotate-90 opacity-100" : "rotate-0 opacity-100"}`}>
                {menuOpen ? <X size={15} /> : <Menu size={15} />}
              </span>
            </button>
          </div>
        </div>
      </nav>

      {/* ── MOBILE DRAWER ── */}
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
          }`}>
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
                  }`}>
                <span className="flex items-center gap-[9px]">
                  <span className={active ? "opacity-80" : "opacity-40"}>
                    {icon}
                  </span>
                  {label}
                </span>
                <ChevronRight size={13} className="opacity-30" />
              </Link>
            );
          })}
        </div>

        <div className="h-px bg-[rgba(16,185,129,0.08)] mb-3" />

        {user ? (
          <>
            {/* User card */}
            <div
              className="flex items-center gap-3 px-[13px] py-[10px] mb-2 rounded-[10px]
              bg-emerald-500/[0.05] border border-emerald-500/[0.12]">
              {avatar ? (
                <img
                  src={avatar}
                  alt={name}
                  className="w-9 h-9 rounded-[8px] object-cover flex-shrink-0"
                />
              ) : (
                <div
                  className="w-9 h-9 rounded-[8px] flex items-center justify-center text-[0.72rem] font-bold text-black flex-shrink-0
                  bg-gradient-to-br from-emerald-400 to-cyan-400">
                  {getInitials(name)}
                </div>
              )}
              <div className="min-w-0">
                <p className="text-[0.86rem] font-semibold text-[#e8f0ec] truncate">
                  {name}
                </p>
                <p className="text-[0.73rem] text-[#3d5a49] truncate">
                  {user.email}
                </p>
              </div>
            </div>

            {[
              {
                icon: <LayoutDashboard size={14} />,
                label: "Dashboard",
                href: "/dashboard",
              },
              { icon: <User size={14} />, label: "Profile", href: "/profile" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center justify-between px-[13px] py-[11px] rounded-[10px] mb-[2px]
                  text-[0.88rem] font-medium text-[#6b8878] no-underline
                  border border-transparent
                  hover:text-[#d4e8dd] hover:bg-white/[0.04]
                  transition-all duration-200">
                <span className="flex items-center gap-[9px] opacity-80">
                  {item.icon}
                  {item.label}
                </span>
                <ChevronRight size={13} className="opacity-30" />
              </Link>
            ))}

            <button
              onClick={handleLogout}
              className="mt-1 flex items-center justify-center gap-2 w-full px-4 py-[11px] rounded-[10px]
                text-[0.88rem] font-bold text-red-400
                border border-red-500/20 bg-red-500/[0.05]
                hover:bg-red-500/[0.10] hover:border-red-500/35
                transition-all duration-200 cursor-pointer">
              <LogOut size={14} />
              Logout
            </button>
          </>
        ) : (
          <div className="flex flex-col gap-[6px]">
            <Link
              href="/login"
              className="flex items-center justify-between px-[13px] py-[11px] rounded-[10px]
                text-[0.88rem] font-medium text-[#6b8878] no-underline
                border border-transparent
                hover:text-[#d4e8dd] hover:bg-white/[0.04]
                transition-all duration-200">
              Masuk
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
                active:scale-[0.98]">
              <Sparkles size={14} />
              Coba Gratis
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
