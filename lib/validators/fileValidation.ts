// Validasi file CV di client SEBELUM diproses (parsing PDF & extract text
// itu berat, mending gagal cepat sebelum browser buang waktu/memori buat
// file yang jelas salah).
//
// CATATAN: ini validasi client-side untuk UX (kasih feedback cepat ke
// user), BUKAN satu-satunya lapisan keamanan. Pertahanan sebenarnya ada di
// backend: /api/ai/analyze membatasi panjang teks yang diterima (maks
// 15.000 karakter) dan di-rate-limit -- jadi walau validasi client ini
// di-bypass (misal panggil langsung tanpa lewat UI), backend tetap aman.

export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB, sesuai copy UI "Max. 5MB"

export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

export function validateCvFile(file: File): FileValidationResult {
  const looksLikePdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");

  if (!looksLikePdf) {
    return { valid: false, error: "File harus berformat PDF." };
  }

  if (file.size === 0) {
    return { valid: false, error: "File kosong, coba pilih file lain." };
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
    return { valid: false, error: `Ukuran file ${sizeMb}MB, maksimal 5MB.` };
  }

  return { valid: true };
}
