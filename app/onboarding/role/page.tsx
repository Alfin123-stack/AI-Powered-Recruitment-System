import { Suspense } from "react";
import { RegisterForm } from "@/components/auth/register/RegisterForm";
import { RegisterSkeleton } from "@/components/auth/register/RegisterSkeleton";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Pilih Role — RecruitAI",
};

export default function OnboardingRolePage() {
  return (
    <div className="w-full">
      <Suspense fallback={<RegisterSkeleton />}>
        <RegisterForm />
      </Suspense>
    </div>
  );
}