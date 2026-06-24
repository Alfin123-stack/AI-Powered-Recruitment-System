import { Toaster } from "sonner";
import AuthLeftPanel from "@/components/auth/layout/AuthLeftPanel";
import AuthRightPanel from "@/components/auth/layout/AuthRightPanel";

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-[#0a0f0d] font-poppins">
      <Toaster
        position="top-right"
        theme="dark"
        toastOptions={{
          style: {
            background: "#0f1a14",
            border: "1px solid rgba(16,185,129,0.2)",
            color: "#e8f0ec",
          },
        }}
      />
      <AuthLeftPanel />
      <AuthRightPanel>{children}</AuthRightPanel>
    </div>
  );
}