import { useState, useEffect, startTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

export function useNavbar() {
  const pathname = usePathname();
  const router = useRouter();

  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const roleUser =
    (user?.identities?.[0]?.identity_data?.role as string | undefined) ?? null;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (menuOpen || userMenuOpen) {
      startTransition(() => {
        setMenuOpen(false);
        setUserMenuOpen(false);
      });
    }
  }, [pathname]);

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
  const avatar = user?.user_metadata?.avatar_url as string | undefined;

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

  return {
    pathname,
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
  };
}
