import type { BentoItem } from '../components/sections/FeatureBento.astro';
import type { DeviceComposition } from '../lib/devices';
import { SCREENS } from './screens';

export const VALUES: BentoItem[] = [
  { title: 'ราคาชัดตั้งแต่แรก', description: 'ขอบเขต รอบแก้ และวันส่งงาน อยู่ในใบเสนอราคาตั้งแต่ต้น' },
  { title: 'ออกแบบก่อนเขียนโค้ด', description: 'เห็นหน้าตาและการใช้งานก่อน แก้ง่าย ไม่เสียเวลา' },
  { title: 'ของคุณหลังส่งงาน', description: 'ส่งมอบ Source Code ส่วนที่พัฒนา ไม่ผูกคุณไว้กับเรา' },
  { title: 'คุยภาษาเจ้าของธุรกิจ', description: 'อธิบายเป็นภาษาคน สอนจนทีมของคุณใช้เองได้' },
];

export interface CarouselArt {
  gradient: 'g1' | 'g2' | 'g3' | 'g4' | 'g5' | 'g6';
  composition: DeviceComposition;
}

/** Keyed by product id (= URL slug). The art is decorative: each card's heading already names the product. */
export const CAROUSEL_ART: Record<string, CarouselArt> = {
  website: { gradient: 'g1', composition: { layout: 'single', devices: [{ kind: 'phone', image: SCREENS.websiteShogunMobile, alt: '' }] } },
  'back-office': {
    gradient: 'g2',
    composition: { layout: 'single', devices: [{ kind: 'laptop', image: SCREENS.backofficeDashboard, alt: '' }] },
  },
  design: {
    gradient: 'g3',
    composition: {
      layout: 'trio',
      devices: [
        { kind: 'phone', image: SCREENS.crmMemberRewards, alt: '' },
        { kind: 'phone', image: SCREENS.crmMemberCard, alt: '' },
        { kind: 'phone', image: SCREENS.crmMemberOrderEntry, alt: '' },
      ],
    },
  },
  'photo-booth': {
    gradient: 'g4',
    composition: { layout: 'single', devices: [{ kind: 'laptop', image: SCREENS.photoboothBackofficeDashboard, alt: '' }] },
  },
  crm: { gradient: 'g5', composition: { layout: 'single', devices: [{ kind: 'phone', image: SCREENS.crmMemberOrderEntry, alt: '' }] } },
  pos: { gradient: 'g6', composition: { layout: 'single', devices: [{ kind: 'laptop', screen: 'pos' }] } },
};
