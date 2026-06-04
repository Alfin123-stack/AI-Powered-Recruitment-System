import { Suspense } from "react";
import { redirect } from "next/navigation";

import { getServerSession } from "@/lib/auth/getServerSession";
import { LoginHeader } from "@/components/auth/login/LoginHeader";
import { LoginForm } from "@/components/auth/login/LoginForm";
import { LoginFooter } from "@/components/auth/login/LoginFooter";
import {
  LoginHeaderSkeleton,
  LoginFormSkeleton,
  LoginFooterSkeleton,
} from "@/components/auth/login/LoginSkeleton";

export const metadata = {
  title: "Masuk | RecruitAI",
  description: "Masuk ke dashboard rekrutmen dan mulai analisis CV Anda.",
};

export default async function LoginPage() {
  const session = await getServerSession();
  if (session) {
    const role = session.user.user_metadata?.role;
    redirect(role === "hr" ? "/dashboard/hr" : "/dashboard/candidate");
  }

  return (
    <div className="w-full">
      <Suspense fallback={<LoginHeaderSkeleton />}>
        <LoginHeader />
      </Suspense>

      <Suspense fallback={<LoginFormSkeleton />}>
        <LoginForm />
      </Suspense>

      <Suspense fallback={<LoginFooterSkeleton />}>
        <LoginFooter />
      </Suspense>
    </div>
  );
}
