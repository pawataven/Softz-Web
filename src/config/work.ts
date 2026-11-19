import { ROUTES } from './routes';

/**
 * Work categories that are not products (products come from src/content/products). A case study uses one of these
 * ids as its "category" instead of a product slug; the work page adds them to the filter after the software group.
 */
export const EXTRA_WORK_CATEGORIES = [
  {
    id: 'demo',
    label: 'เว็บไซต์ตัวอย่าง',
    groupLabel: 'เว็บไซต์ตัวอย่าง',
    /** Where the empty state's "ดูรายละเอียด" goes. */
    href: ROUTES.product('website'),
  },
] as const;

export type ExtraWorkCategoryId = (typeof EXTRA_WORK_CATEGORIES)[number]['id'];
export const EXTRA_WORK_CATEGORY_IDS = EXTRA_WORK_CATEGORIES.map((category) => category.id) as [ExtraWorkCategoryId, ...ExtraWorkCategoryId[]];

/**
 * Design styles a case study can be tagged with (English, shown as written). Add a new style here first, then use
 * it in src/content/work/<slug>.json → "styles". The work page filter only offers styles that some work uses.
 */
export const WORK_STYLES = [
  'Modern',
  'Minimal',
  'Luxury',
  'Bold',
  'Editorial',
  'Warm',
  'Scandinavian',
  'Japandi',
  'Playful',
  'Corporate',
  'Retro',
  'Industrial',
] as const;

export type WorkStyle = (typeof WORK_STYLES)[number];
export const styleSlug = (style: string) => style.toLowerCase().replace(/[^a-z0-9]+/g, '-');
