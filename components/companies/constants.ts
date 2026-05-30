// Palette warna dipakai untuk assign accent color per index company.
// Warna tidak disimpan di DB — di-generate di sisi server saat fetch.

const PALETTES = [
  "#10b981",
  "#3b82f6",
  "#8b5cf6",
  "#f59e0b",
  "#ef4444",
  "#ec4899",
];

export const getPaletteColor = (i: number): string =>
  PALETTES[i % PALETTES.length];

// Filter lokasi untuk toolbar — UI concern, bukan dari DB
export const LOCATION_FILTERS = [
  "Semua",
  "Jakarta",
  "Bandung",
  "Surabaya",
  "Remote",
];
