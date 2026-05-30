// lib/auth/validation.ts

export type AuthFieldErrors = {
  email?: string;
  password?: string;
  fullName?: string;
  role?: string;
};

export function validateEmail(email: string): string | undefined {
  if (!email.trim()) return "Kamu belum mengisi alamat email";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return "Format email tidak valid";
}

export function validatePassword(password: string): string | undefined {
  if (!password.trim()) return "Kamu belum mengisi password";
}

export function validateStrongPassword(password: string): string | undefined {
  if (!password) return "Kamu belum mengisi password";
  if (getPasswordStrength(password) < 2)
    return "Password terlalu lemah, penuhi minimal 2 persyaratan di atas";
}

export function validateFullName(fullName: string): string | undefined {
  if (!fullName.trim()) return "Kamu belum mengisi nama lengkap";
  if (fullName.trim().length < 2) return "Nama minimal 2 karakter";
}

export function validateRole(role: string): string | undefined {
  if (!role) return "Kamu belum memilih peran";
}

export function getPasswordStrength(pw: string): number {
  if (!pw) return 0;
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s;
}

export const PASSWORD_STRENGTH_META = [
  { label: "Terlalu pendek", color: "bg-red-500", text: "text-red-400" },
  { label: "Lemah", color: "bg-orange-400", text: "text-orange-400" },
  { label: "Sedang", color: "bg-yellow-400", text: "text-yellow-400" },
  { label: "Kuat", color: "bg-emerald-400", text: "text-emerald-400" },
  { label: "Sangat kuat", color: "bg-emerald-500", text: "text-emerald-400" },
] as const;

export const PASSWORD_RULES = (password: string) => [
  { ok: password.length >= 8, label: "Minimal 8 karakter" },
  { ok: /[A-Z]/.test(password), label: "Huruf kapital (A–Z)" },
  { ok: /[0-9]/.test(password), label: "Mengandung angka" },
  { ok: /[^A-Za-z0-9]/.test(password), label: "Simbol (!@#$...)" },
];
