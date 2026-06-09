// @/hooks/profile/useLogout.ts
// Enkapsulasi logika sign-out Supabase + redirect.
// Dipisah agar mudah di-mock saat testing dan reusable di komponen lain.

import { useRouter } from "next/navigation";
import { supabase }  from "@/lib/supabase";

export function useLogout(redirectTo: string = "/") {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace(redirectTo);
  };

  return { handleLogout };
}
