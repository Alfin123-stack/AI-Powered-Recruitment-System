// components/Navbar.tsx
"use client";

import { useState, useEffect, startTransition } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  X,
  ChevronRight,
  LayoutDashboard,
  LogOut,
  User,
  ChevronDown,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

const navLinks = [
  { label: "Jobs", href: "/jobs" },
  { label: "AI Analyzer", href: "/analyze" },
  { label: "Company", href: "/company" },
  { label: "Applications", href: "/applications" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<any>(null);

  console.log(user?.identities[0]?.identity_data?.role);

  const roleUser = user?.identities[0]?.identity_data?.role || null;
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ✅ fix react warning
  useEffect(() => {
    if (menuOpen || userMenuOpen) {
      startTransition(() => {
        setMenuOpen(false);
        setUserMenuOpen(false);
      });
    }
  }, [pathname]);

  // ✅ supabase auth
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user ?? null);
    };

    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Tutup user dropdown saat klik di luar
  useEffect(() => {
    if (!userMenuOpen) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-user-menu]")) setUserMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [userMenuOpen]);

  const isActive = (href: string) =>
    pathname === href || pathname?.startsWith(href + "/");

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUserMenuOpen(false);
    router.replace("/");
  };

  const name =
    user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User";
  const avatar = user?.user_metadata?.avatar_url;

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

  return (
    <>
      {/* ── NAVBAR ── */}
      <nav
        className={`fixed top-0 left-0 right-0 z-[100] transition-shadow duration-300 font-poppins
          ${scrolled ? "shadow-[0_8px_40px_rgba(0,0,0,0.35)]" : ""}`}>
        {/* Backdrop */}
        <div
          className={`absolute inset-0 border-b transition-all duration-300
            ${
              scrolled
                ? "bg-[rgba(10,15,13,0.96)] border-[rgba(16,185,129,0.22)]"
                : "bg-[rgba(10,15,13,0.88)] border-[rgba(16,185,129,0.15)]"
            }`}
          style={{ backdropFilter: "blur(18px) saturate(1.3)" }}
        />

        {/* Inner */}
        <div className="relative z-10 max-w-[1180px] mx-auto px-6 h-16 flex items-center justify-between gap-4">
          {/* ── LOGO ── */}
          <Link
            href="/"
            className="group flex items-center gap-[9px] no-underline flex-shrink-0">
            <div
              className="w-8 h-8 rounded-[9px] flex items-center justify-center text-base font-black text-black transition-all duration-300 group-hover:rotate-[15deg] group-hover:scale-110 group-hover:shadow-[0_4px_16px_rgba(16,185,129,0.4)]"
              style={{ background: "linear-gradient(135deg,#10b981,#06b6d4)" }}>
              ✦
            </div>
            <span className="font-extrabold text-[1.1rem] text-[#e8f0ec] tracking-[-0.01em] leading-none">
              Recruit<em className="not-italic text-emerald-400">AI</em>
            </span>
          </Link>

          {/* ── DESKTOP LINKS ── */}
          <div className="hidden md:flex items-center gap-[2px] flex-1 justify-center">
            {navLinks.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className={`relative px-[14px] py-2 rounded-[9px] text-[0.86rem] font-medium no-underline border whitespace-nowrap
                  transition-all duration-200
                  after:content-[''] after:absolute after:bottom-[6px] after:left-[14px] after:right-[14px]
                  after:h-[1.5px] after:rounded-[1px] after:bg-emerald-400
                  after:origin-left after:transition-transform after:duration-[220ms]
                  ${
                    isActive(href)
                      ? "text-emerald-400 bg-emerald-500/[0.08] border-emerald-500/20 after:scale-x-100"
                      : "text-[#7a9585] border-transparent hover:text-[#e8f0ec] hover:bg-white/[0.04] after:scale-x-0 hover:after:scale-x-100"
                  }`}>
                {label}
              </Link>
            ))}
          </div>

          {/* ── ACTIONS ── */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {user ? (
              /* ── LOGGED IN STATE ── */
              <>
                {/* Dashboard button */}
                <Link
                  href={
                    roleUser === "hr" ? "/dashboard/hr" : "/dashboard/candidate"
                  }
                  className="hidden sm:flex items-center gap-[6px] px-[14px] py-2 rounded-[9px] text-[0.85rem] font-medium text-[#7a9585] no-underline transition-all duration-200 hover:text-[#e8f0ec] hover:bg-white/[0.05]">
                  <LayoutDashboard size={14} />
                  Dashboard
                </Link>

                {/* User avatar dropdown */}
                <div className="relative" data-user-menu>
                  <button
                    onClick={() => setUserMenuOpen((v) => !v)}
                    className="flex items-center gap-[6px] h-9 pl-1 pr-3 rounded-[9px] border border-[rgba(16,185,129,0.15)] bg-[rgba(16,185,129,0.04)] hover:border-[rgba(16,185,129,0.35)] hover:bg-[rgba(16,185,129,0.08)] transition-all duration-200 cursor-pointer">
                    {/* Avatar */}
                    {avatar ? (
                      <img
                        src={avatar}
                        alt={name}
                        className="w-7 h-7 rounded-[7px] object-cover"
                      />
                    ) : (
                      <div
                        className="w-7 h-7 rounded-[7px] flex items-center justify-center text-[0.7rem] font-bold text-black"
                        style={{
                          background: "linear-gradient(135deg,#10b981,#06b6d4)",
                        }}>
                        {getInitials(name)}
                      </div>
                    )}
                    <span className="hidden sm:block text-[0.82rem] font-medium text-[#c5d8cc] max-w-[90px] truncate">
                      {name.split(" ")[0]}
                    </span>
                    <ChevronDown
                      size={13}
                      className={`text-[#7a9585] transition-transform duration-200 ${
                        userMenuOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Dropdown menu */}
                  {userMenuOpen && (
                    <div
                      className="absolute right-0 top-[calc(100%+8px)] w-[200px] rounded-[12px] border border-[rgba(16,185,129,0.15)] overflow-hidden"
                      style={{
                        background: "rgba(10,15,13,0.98)",
                        backdropFilter: "blur(24px)",
                        boxShadow: "0 16px 48px rgba(0,0,0,0.5)",
                      }}>
                      {/* User info header */}
                      <div className="px-4 py-3 border-b border-[rgba(16,185,129,0.1)]">
                        <p className="text-[0.82rem] font-semibold text-[#e8f0ec] truncate">
                          {name}
                        </p>
                        <p className="text-[0.75rem] text-[#4d6b5a] truncate mt-0.5">
                          {user.email}
                        </p>
                      </div>

                      {/* Menu items */}
                      <div className="py-1.5">
                        <Link
                          href="/dashboard"
                          className="flex items-center gap-[10px] px-4 py-2.5 text-[0.84rem] text-[#7a9585] no-underline hover:text-[#e8f0ec] hover:bg-white/[0.04] transition-colors duration-150">
                          <LayoutDashboard size={14} />
                          Dashboard
                        </Link>
                        <Link
                          href="/profile"
                          className="flex items-center gap-[10px] px-4 py-2.5 text-[0.84rem] text-[#7a9585] no-underline hover:text-[#e8f0ec] hover:bg-white/[0.04] transition-colors duration-150">
                          <User size={14} />
                          Profile
                        </Link>
                      </div>

                      {/* Divider */}
                      <div className="h-px bg-[rgba(16,185,129,0.08)] mx-2" />

                      {/* Logout */}
                      <div className="py-1.5">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-[10px] px-4 py-2.5 text-[0.84rem] text-[#7a9585] hover:text-red-400 hover:bg-red-500/[0.06] transition-colors duration-150 cursor-pointer">
                          <LogOut size={14} />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              /* ── GUEST STATE ── */
              <>
                {/* Login */}
                <Link
                  href="/login"
                  className="hidden sm:block px-[14px] py-2 rounded-[9px] text-[0.85rem] font-medium text-[#7a9585] no-underline transition-all duration-200 hover:text-[#e8f0ec] hover:bg-white/[0.05]">
                  Login
                </Link>

                {/* Spinning border CTA */}
                <Link
                  href="/register"
                  className="relative inline-flex h-9 rounded-[9px] overflow-hidden p-[1.5px] no-underline flex-shrink-0 focus-visible:outline-none focus-visible:shadow-[0_0_0_3px_rgba(16,185,129,0.4)]">
                  <span
                    className="absolute inset-[-1000%]"
                    style={{
                      background:
                        "conic-gradient(from 0deg,#10b981,#06b6d4,#8b5cf6,#10b981)",
                      animation: "ctaSpin 5s linear infinite",
                    }}
                  />
                  <span className="relative z-10 inline-flex items-center gap-[6px] h-full px-4 rounded-[7.5px] bg-[#0a0f0d] text-[0.84rem] font-bold text-emerald-400 whitespace-nowrap transition-all duration-200 hover:text-[#e8f0ec] hover:bg-emerald-500/[0.12]">
                    Coba Gratis <span className="text-[0.75rem]">→</span>
                  </span>
                </Link>
              </>
            )}

            {/* Hamburger */}
            <button
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Toggle menu"
              className="flex md:hidden w-9 h-9 rounded-[9px] items-center justify-center bg-[#0f1612] border border-[rgba(16,185,129,0.15)] text-[#7a9585] cursor-pointer transition-all duration-200 hover:border-[rgba(16,185,129,0.35)] hover:text-[#e8f0ec] flex-shrink-0">
              {menuOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </div>
      </nav>

      {/* ── MOBILE DRAWER ── */}
      <div
        className={`fixed top-16 left-0 right-0 z-[99] border-b border-[rgba(16,185,129,0.15)] px-5 pt-4 pb-6
          transition-all duration-[280ms] ease-[cubic-bezier(0.22,1,0.36,1)]
          ${
            menuOpen
              ? "opacity-100 translate-y-0 pointer-events-auto"
              : "opacity-0 -translate-y-[10px] pointer-events-none"
          }`}
        style={{
          background: "rgba(10,15,13,0.97)",
          backdropFilter: "blur(24px)",
        }}>
        {/* Nav links */}
        {navLinks.map(({ label, href }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center justify-between px-[14px] py-3 rounded-[10px] mb-1 text-[0.9rem] font-medium no-underline border transition-all duration-200
              ${
                isActive(href)
                  ? "text-emerald-400 bg-emerald-500/[0.08] border-emerald-500/20"
                  : "text-[#7a9585] border-transparent hover:text-[#e8f0ec] hover:bg-white/[0.04]"
              }`}>
            {label}
            <ChevronRight size={14} className="opacity-40" />
          </Link>
        ))}

        {/* Divider */}
        <div className="h-px bg-[rgba(16,185,129,0.1)] my-3" />

        {user ? (
          /* ── MOBILE LOGGED IN ── */
          <>
            {/* User info card */}
            <div className="flex items-center gap-3 px-[14px] py-3 mb-1 rounded-[10px] bg-[rgba(16,185,129,0.04)] border border-[rgba(16,185,129,0.1)]">
              {avatar ? (
                <img
                  src={avatar}
                  alt={name}
                  className="w-9 h-9 rounded-[8px] object-cover flex-shrink-0"
                />
              ) : (
                <div
                  className="w-9 h-9 rounded-[8px] flex items-center justify-center text-[0.75rem] font-bold text-black flex-shrink-0"
                  style={{
                    background: "linear-gradient(135deg,#10b981,#06b6d4)",
                  }}>
                  {getInitials(name)}
                </div>
              )}
              <div className="min-w-0">
                <p className="text-[0.88rem] font-semibold text-[#e8f0ec] truncate">
                  {name}
                </p>
                <p className="text-[0.76rem] text-[#4d6b5a] truncate">
                  {user.email}
                </p>
              </div>
            </div>

            <Link
              href="/dashboard"
              className="flex items-center justify-between px-[14px] py-3 rounded-[10px] mb-1 text-[0.9rem] font-medium text-[#7a9585] no-underline border border-transparent transition-all duration-200 hover:text-[#e8f0ec] hover:bg-white/[0.04]">
              <span className="flex items-center gap-2">
                <LayoutDashboard size={15} />
                Dashboard
              </span>
              <ChevronRight size={14} className="opacity-40" />
            </Link>

            <Link
              href="/profile"
              className="flex items-center justify-between px-[14px] py-3 rounded-[10px] mb-2 text-[0.9rem] font-medium text-[#7a9585] no-underline border border-transparent transition-all duration-200 hover:text-[#e8f0ec] hover:bg-white/[0.04]">
              <span className="flex items-center gap-2">
                <User size={15} />
                Profile
              </span>
              <ChevronRight size={14} className="opacity-40" />
            </Link>

            {/* Mobile Logout */}
            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-[10px] text-[0.9rem] font-bold text-red-400 border border-red-500/20 bg-red-500/[0.06] hover:bg-red-500/[0.12] transition-all duration-200 cursor-pointer">
              <LogOut size={15} />
              Logout
            </button>
          </>
        ) : (
          /* ── MOBILE GUEST ── */
          <>
            <Link
              href="/login"
              className="flex items-center justify-between px-[14px] py-3 rounded-[10px] mb-2 text-[0.9rem] font-medium text-[#7a9585] no-underline border border-transparent transition-all duration-200 hover:text-[#e8f0ec] hover:bg-white/[0.04]">
              Login
              <ChevronRight size={14} className="opacity-40" />
            </Link>

            {/* Mobile CTA */}
            <Link
              href="/register"
              className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-emerald-500 hover:bg-emerald-400 hover:shadow-[0_6px_20px_rgba(16,185,129,0.3)] rounded-[10px] text-[0.9rem] font-bold text-black no-underline transition-all duration-200">
              ✦ Coba Gratis →
            </Link>
          </>
        )}
      </div>

      {/* @keyframes ctaSpin { to { transform: rotate(360deg); } } — taruh di globals.css */}
    </>
  );
}
