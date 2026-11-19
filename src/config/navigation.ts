import { ROUTES } from './routes';

export interface NavLink {
  label: string;
  href: string;
  /** Longer label used in the full-screen menu, where there is room for it. */
  menuLabel?: string;
}

export const PRIMARY_NAV: NavLink[] = [
  { label: 'ผลงาน', href: ROUTES.work },
  { label: 'ราคา', href: ROUTES.pricing, menuLabel: 'ราคาทั้งหมด' },
  { label: 'เกี่ยวกับเรา', href: ROUTES.about },
  { label: 'ติดต่อ', href: ROUTES.contact },
];

export const PRODUCT_CATEGORIES = {
  service: { navLabel: 'บริการ', groupLabel: 'ทำให้เฉพาะคุณ', shortLabel: 'ทำให้เฉพาะคุณ', dropdownId: 'dd-services' },
  software: { navLabel: 'ซอฟต์แวร์', groupLabel: 'ซอฟต์แวร์เช่าใช้', shortLabel: 'เช่าใช้', dropdownId: 'dd-software' },
} as const;

export type ProductCategory = keyof typeof PRODUCT_CATEGORIES;
