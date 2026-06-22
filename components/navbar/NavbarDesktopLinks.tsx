import Link from "next/link";
import { BriefcaseBusiness, Building2, ScanText, BookOpen, LucideProps } from "lucide-react";
import {
  NAV_LINKS,
  NavLink,
  NAVBAR_ACTIVE_LINK_CLS,
  NAVBAR_INACTIVE_LINK_CLS,
} from "@/constants/navbar";

type IconName = NavLink["iconName"];

const ICON_MAP: Record<IconName, React.ComponentType<LucideProps>> = {
  BriefcaseBusiness,
  Building2,
  ScanText,
  BookOpen,
};

interface NavbarDesktopLinksProps {
  isActive: (href: string) => boolean;
}

export default function NavbarDesktopLinks({ isActive }: NavbarDesktopLinksProps) {
  return (
    <div className="hidden md:flex items-center gap-[1px] flex-1 justify-center">
      {NAV_LINKS.map(({ label, href, iconName }: NavLink) => {
        const active = isActive(href);
        const Icon = ICON_MAP[iconName];
        return (
          <Link
            key={href}
            href={href}
            className={`
              group relative flex items-center gap-[6px]
              px-[13px] py-[7px] rounded-[9px]
              text-[0.82rem] font-medium no-underline
              transition-all duration-200 select-none
              ${active ? NAVBAR_ACTIVE_LINK_CLS : NAVBAR_INACTIVE_LINK_CLS}
            `}
          >
            <span
              className={`transition-all duration-200 ${
                active ? "opacity-80" : "opacity-40 group-hover:opacity-70"
              }`}
            >
              <Icon size={13} />
            </span>

            {label}

            {active && (
              <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-[14px] h-[2px] rounded-full bg-emerald-400 opacity-80" />
            )}

            {!active && (
              <span
                className="
                  absolute bottom-1 left-[13px] right-[13px] h-[1.5px] rounded-full bg-emerald-400/50
                  scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-200
                "
              />
            )}
          </Link>
        );
      })}
    </div>
  );
}