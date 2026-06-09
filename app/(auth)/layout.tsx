// app/(auth)/layout.tsx
import AuthLeftPanel from "@/components/auth/layout/AuthLeftPanel";
import AuthRightPanel from "@/components/auth/layout/AuthRightPanel";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Autentikasi · RecruitAI",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-[#0a0f0d] font-poppins">
      <AuthLeftPanel />
      <AuthRightPanel>{children}</AuthRightPanel>
    </div>
  );
}
