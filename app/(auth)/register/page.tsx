import { Suspense } from "react";
import { redirect } from "next/navigation";

import { getServerSession } from "@/lib/auth/getServerSession";
import { RegisterForm } from "@/components/auth/register/RegisterForm";
import { RegisterSkeleton } from "@/components/auth/register/RegisterSkeleton";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Daftar — Buat Akun Baru",
  description:
    "Daftar dan mulai analisis CV dengan AI. Gratis untuk kandidat, tidak perlu kartu kredit.",
};
export default async function RegisterPage() {
  const session = await getServerSession();
  if (session) {
    const role = session.user.user_metadata?.role;
    redirect(role === "hr" ? "/dashboard/hr" : "/dashboard/candidate");
  }

  return (
    <div className="w-full">
      <Suspense fallback={<RegisterSkeleton />}>
        <RegisterForm />
      </Suspense>
    </div>
  );
}
