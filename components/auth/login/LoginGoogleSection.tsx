"use client";

import { supabase } from "@/lib/supabase";
import { GoogleButton } from "@/components/auth/GoogleButton";
import { Divider } from "@/components/auth/Divider";

export function LoginGoogleSection() {
  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          prompt: "select_account",
        },
      },
    });
  };

  return (
    <>
      <GoogleButton label="Continue with Google" onClick={handleGoogleLogin} />
      <div className="my-5">
        <Divider label="or sign in with email" />
      </div>
    </>
  );
}