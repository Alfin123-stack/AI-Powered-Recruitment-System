// File ini hanya diimport oleh Client Components karena berisi
// referensi ke Lucide React components (perlu bundle di client).

import {
  Bot,
  Laptop,
  Cpu,
  ShoppingCart,
  CreditCard,
  Palette,
  Building2,
  type LucideIcon,
} from "lucide-react";

export const CATEGORY_ICONS: Record<string, LucideIcon> = {
  "1": Bot,
  "2": Laptop,
  "3": Cpu,
  "4": ShoppingCart,
  "5": CreditCard,
  "6": Palette,
};

export const DEFAULT_ICON: LucideIcon = Building2;

export function getCategoryIcon(id: string): LucideIcon {
  return CATEGORY_ICONS[id] ?? DEFAULT_ICON;
}
