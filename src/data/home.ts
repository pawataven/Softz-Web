import type { BentoItem } from '../components/sections/FeatureBento.astro';
import { ROUTES } from '../config/routes';
import type { DeviceComposition } from '../lib/devices';
import { SCREENS } from './screens';

export const HERO_COMPOSITION: DeviceComposition = {
  layout: 'combo',
  devices: [
    { kind: 'laptop', image: SCREENS.backofficeDashboard, alt: 'ตัวอย่างระบบหลังบ้านที่ SOFT Z พัฒนา' },
    { kind: 'phone', image: SCREENS.crmMemberRewards, alt: 'ตัวอย่างหน้าของรางวัลในแอปสมาชิก' },
  ],
};

/** Keyed by product id (= URL slug). */
export const EXPLORE_SCENES: Record<string, DeviceComposition> = {
  website: {
    layout: 'combo',
    devices: [
      { kind: 'laptop', image: SCREENS.websiteNoirDesktop, alt: 'เว็บตัวอย่าง Noir Cars เต็นท์รถมือสองหรู' },
      { kind: 'phone', image: SCREENS.websiteNoirMobile, alt: 'เว็บ Noir Cars บนมือถือ' },
    ],
  },
  'back-office': {
    layout: 'combo',
    devices: [
      { kind: 'laptop', image: SCREENS.backofficeDashboard, alt: 'แดชบอร์ดระบบหลังบ้าน' },
      { kind: 'tablet', image: SCREENS.backofficeMembers, alt: 'หน้าจัดการสมาชิก' },
    ],
  },
  design: {
    layout: 'trio',
    devices: [
      { kind: 'phone', image: SCREENS.crmMemberRewards, alt: 'งานออกแบบหน้า Rewards' },
      { kind: 'phone', image: SCREENS.crmMemberCard, alt: 'งานออกแบบหน้าบัตรสมาชิก' },
      { kind: 'phone', image: SCREENS.crmMemberOrderEntry, alt: 'งานออกแบบหน้ากรอกคำสั่งซื้อ' },
    ],
  },
  'photo-booth': {
    layout: 'combo',
    devices: [
      { kind: 'laptop', image: SCREENS.photoboothBackofficeDashboard, alt: 'หลังบ้าน Photo Booth' },
      { kind: 'tablet', image: SCREENS.photoboothBackofficeList, alt: 'รายการงานพิมพ์ทุกตู้' },
    ],
  },
  crm: {
    layout: 'combo',
    devices: [
      { kind: 'laptop', image: SCREENS.crmAdminDashboard, alt: 'หลังบ้าน Member CRM' },
      { kind: 'phone', image: SCREENS.crmMemberCard, alt: 'บัตรสมาชิกบนมือถือ' },
    ],
  },
  pos: { layout: 'solo', devices: [{ kind: 'laptop', screen: 'pos' }] },
};

export interface TogetherItem {
  id: string;
  title: string;
  description: string;
  href: string;
  composition: DeviceComposition;
}

export const TOGETHER_ITEMS: TogetherItem[] = [
  {
    id: 'website',
    title: 'เว็บไซต์ + ระบบหลังบ้าน',
    description:
      'หน้าเว็บสวยตามแบรนด์ พร้อมหลังบ้านให้แก้ข้อความ รูป และสินค้าเองได้ ไม่ต้องรอทีมทุกครั้ง แพ็กเกจคู่ Business + CMS 22,900 บาท',
    href: ROUTES.product('back-office'),
    composition: {
      layout: 'combo',
      devices: [
        { kind: 'laptop', image: SCREENS.websiteShogunDesktop, alt: 'เว็บตัวอย่าง Shogun Coffee' },
        { kind: 'tablet', image: SCREENS.backofficeMembers, alt: 'หลังบ้าน' },
      ],
    },
  },
  {
    id: 'crm',
    title: 'หลังบ้าน CRM + แอปสมาชิก',
    description: 'ร้านดูยอดและออเดอร์จากหลังบ้าน ลูกค้าเปิดบัตรสมาชิก สะสมแต้ม และแลกรางวัลจากมือถือ',
    href: ROUTES.product('crm'),
    composition: {
      layout: 'combo',
      devices: [
        { kind: 'laptop', image: SCREENS.crmAdminDashboard, alt: 'หลังบ้าน CRM' },
        { kind: 'phone', image: SCREENS.crmMemberOrderEntry, alt: 'แอปสมาชิก' },
      ],
    },
  },
  {
    id: 'photo-booth',
    title: 'หน้าตู้ + หลังบ้านดูทุกตู้',
    description: 'ลูกค้าเลือกฟิลเตอร์และจ่ายเงินที่หน้าตู้ เจ้าของดูยอดและจัดการทุกตู้จากหลังบ้านที่เดียว',
    href: ROUTES.product('photo-booth'),
    composition: {
      layout: 'combo',
      devices: [
        { kind: 'laptop', image: SCREENS.photoboothBackofficeDashboard, alt: 'หลังบ้าน Photo Booth' },
        { kind: 'tablet', image: SCREENS.photoboothBackofficeList, alt: 'รายการงานพิมพ์ทุกตู้' },
      ],
    },
  },
];

export const WHY_ITEMS: BentoItem[] = [
  { icon: 'code', title: 'ส่งมอบ Source Code', description: 'ได้โค้ดส่วนที่พัฒนาให้ ไม่ถูกผูกกับเราไปตลอด' },
  { icon: 'shield', title: 'รับประกันแก้บั๊ก 30 วัน', description: 'เจอปัญหาหลังส่งงาน ทีมแก้ให้ตามขอบเขตงาน' },
  { icon: 'graduation', title: 'สอนจนทีมใช้เองได้', description: 'มีคู่มือและสอนใช้งาน พร้อมแพ็กเกจดูแลรายเดือน' },
  { icon: 'document', title: 'ราคาชัดตั้งแต่ใบแรก', description: 'ระบุขอบเขต รอบแก้ และวันส่งงานในใบเสนอราคา' },
];

export const START_STEPS = [
  { title: 'ทักแชท บอกธุรกิจและงบ', description: 'รับคำแนะนำแพ็กเกจที่เหมาะ ฟรี' },
  { title: 'รับใบเสนอราคา', description: 'ระบุขอบเขต รอบแก้ และวันส่งงาน' },
  { title: 'ชำระงวดแรก เริ่มงาน', description: 'ส่งความคืบหน้าให้ดูทุกขั้นตอน' },
  { title: 'ตรวจรับ สอนใช้งาน', description: 'ส่งมอบพร้อมดูแลหลังส่งงาน' },
];
