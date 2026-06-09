// @/components/profile/shell/ProfileAmbientBackground.tsx
// Decorative fixed radial-gradient background behind the profile page.
// Split from ProfileShell to keep layout code cleaner.

export function ProfileAmbientBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      <div className="absolute top-[-20%] left-[10%] w-[600px] h-[600px] rounded-full opacity-[0.04] bg-[radial-gradient(circle,#10b981_0%,transparent_70%)]" />
      <div className="absolute bottom-[-10%] right-[5%] w-[400px] h-[400px] rounded-full opacity-[0.03] bg-[radial-gradient(circle,#06b6d4_0%,transparent_70%)]" />
    </div>
  );
}
