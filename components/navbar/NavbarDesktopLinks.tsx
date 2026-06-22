import Link from "next/link";
import { navLinks } from "./navLinks";

interface NavbarDesktopLinksProps {
  isActive: (href: string) => boolean;
}

export default function NavbarDesktopLinks({ isActive }: NavbarDesktopLinksProps) {
  return (
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
            `}
          >
            {/* Icon */}
            <span
              className={`transition-all duration-200 ${
                active ? "opacity-80" : "opacity-40 group-hover:opacity-70"
              }`}
            >
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
  );
}
