// components/Navbar.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronRight } from "lucide-react";

const navLinks = [
  { label: "Jobs", href: "/jobs" },
  { label: "AI Analyzer", href: "/analyze" },
  { label: "Company", href: "/company" },
  { label: "Applications", href: "/applications" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const isActive = (href: string) =>
    pathname === href || pathname?.startsWith(href + "/");

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
              {/* Spinning conic gradient */}
              <span
                className="absolute inset-[-1000%]"
                style={{
                  background:
                    "conic-gradient(from 0deg,#10b981,#06b6d4,#8b5cf6,#10b981)",
                  animation: "ctaSpin 5s linear infinite",
                }}
              />
              {/* Inner */}
              <span className="relative z-10 inline-flex items-center gap-[6px] h-full px-4 rounded-[7.5px] bg-[#0a0f0d] text-[0.84rem] font-bold text-emerald-400 whitespace-nowrap transition-all duration-200 hover:text-[#e8f0ec] hover:bg-emerald-500/[0.12]">
                Coba Gratis <span className="text-[0.75rem]">→</span>
              </span>
            </Link>

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

        {/* Mobile login */}
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
      </div>

      {/* Keyframe untuk spinning CTA — taruh di globals.css */}
      {/* @keyframes ctaSpin { to { transform: rotate(360deg); } } */}
    </>
  );
}
