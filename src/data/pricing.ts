import { ROUTES } from '../config/routes';

/** Prices from the 2026 rate card, valid until 31 Jan 2570 (2027). */
export const PRICE_VALID_UNTIL = '31 ม.ค. 2570';

export interface OneTimeRow {
  name: string;
  price: string;
  isStartingPrice?: boolean;
  detail: string;
}

export interface OneTimeCard {
  label: string;
  title: string;
  rows: OneTimeRow[];
  href: string;
}

export const ONE_TIME_CARDS: OneTimeCard[] = [
  {
    label: 'WEBSITE',
    title: 'เว็บไซต์',
    href: ROUTES.product('website'),
    rows: [
      { name: 'Landing Page หน้าเดียว', price: '5,900', detail: '7 วัน · แก้ 2 รอบ' },
      { name: 'Business Website', price: '12,900', detail: '3–5 หน้า · 14–21 วัน · แก้ 3 รอบ' },
      { name: 'Premium Website', price: '24,900', detail: '6–10 หน้า · 30 วัน · แก้ 3 รอบ' },
    ],
  },
  {
    label: 'BACK OFFICE',
    title: 'ระบบหลังบ้าน',
    href: ROUTES.product('back-office'),
    rows: [
      { name: 'CMS แก้เว็บเองได้', price: '12,900', detail: 'เลือก 2 โมดูล · สอนใช้ 1 ครั้ง' },
      { name: 'Business + CMS', price: '22,900', detail: 'เว็บ 3–5 หน้า + ระบบหลังบ้าน' },
      { name: 'Operations', price: '29,900', isStartingPrice: true, detail: 'ระบบรับจอง งานเช่า หรือคำสั่งซื้อ' },
    ],
  },
  {
    label: 'UI/UX DESIGN',
    title: 'ออกแบบ UI/UX',
    href: ROUTES.product('design'),
    rows: [
      { name: 'Landing Design', price: '2,900', detail: '1 หน้า · ไฟล์ Figma · 5 วัน' },
      { name: 'Business Design', price: '7,900', detail: '3–5 หน้า · ไฟล์ Figma · 10 วัน' },
      { name: 'Premium UI/UX', price: '14,900', detail: '6–10 หน้า + Prototype · 15–20 วัน' },
    ],
  },
];

export const ONE_TIME_NOTE = 'Figma to Web เริ่ม 3,900 · จ่าย 50/50 (Premium 50/30/20) · ราคายังไม่รวมภาษีมูลค่าเพิ่ม';

export interface MonthlyCard {
  label: string;
  tag?: string;
  title: string;
  price: string;
  isStartingPrice?: boolean;
  rows: { name: string; value: string }[];
  action: { label: string; href: string } | { label: string; lineMessage: string };
}

export const MONTHLY_CARDS: MonthlyCard[] = [
  {
    label: 'WEB MONTHLY',
    title: 'เว็บรายเดือน',
    price: '790',
    isStartingPrice: true,
    rows: [
      { name: 'Landing Page', value: '790/เดือน' },
      { name: 'เว็บธุรกิจ', value: '1,790/เดือน' },
      { name: 'ครบ 12 เดือน', value: 'ซื้อขาดได้ 50%' },
    ],
    action: { label: 'ดูรายละเอียด', href: ROUTES.product('website') },
  },
  {
    label: 'PHOTO BOOTH',
    title: 'ตู้ถ่ายรูป',
    price: '1,990',
    rows: [
      { name: 'เช่า 12 เดือน', value: 'ติดตั้งฟรี' },
      { name: 'จ่ายตามใช้', value: '790 + 5 บาท/ครั้ง' },
      { name: '5 ตู้ขึ้นไป', value: '1,690/ตู้' },
    ],
    action: { label: 'ดูรายละเอียด', href: ROUTES.product('photo-booth') },
  },
  {
    label: 'MEMBER CRM',
    title: 'ระบบสมาชิก',
    price: '990',
    rows: [
      { name: 'Plus · Pro', value: '1,990 · 3,490' },
      { name: 'สัญญาขั้นต่ำ', value: '6 เดือน' },
      { name: 'จ่ายรายปี', value: 'ฟรี 2 เดือน' },
    ],
    action: { label: 'ดูรายละเอียด', href: ROUTES.product('crm') },
  },
  {
    label: 'POS',
    tag: 'กำลังพัฒนา',
    title: 'ระบบขายหน้าร้าน',
    price: '590',
    rows: [
      { name: 'Plus · Pro', value: '1,290 · 2,490' },
      { name: 'ราคา', value: 'เปิดตัวโดยประมาณ' },
      { name: 'เดโม', value: 'ลงชื่อได้แล้ว' },
    ],
    action: { label: 'ลงชื่อรับเดโม', lineMessage: 'สนใจ POS ขอลงชื่อรับเดโมครับ' },
  },
];

export const MONTHLY_NOTE = 'สัญญาขั้นต่ำ 6–12 เดือนตามแพ็กเกจ · ไม่รวมฮาร์ดแวร์ LINE OA และเครดิต SMS · ราคายังไม่รวมภาษีมูลค่าเพิ่ม';

export const TERMS_GROUPS = [
  {
    title: 'ดูแลหลังส่งงาน',
    items: [
      { term: 'CARE', value: '390/เดือน' },
      { term: 'CARE PLUS', value: '790/เดือน' },
      { term: 'CARE รายปี', value: '3,900/ปี' },
      { term: 'CARE PLUS รายปี', value: '7,900/ปี' },
    ],
  },
  {
    title: 'แพ็กเกจคู่',
    items: [
      { term: 'Business + CMS', value: '22,900' },
      { term: 'Premium + CMS', value: '34,900' },
      { term: 'Premium + Operations', value: '49,900' },
      { term: 'ประหยัดสูงสุด', value: '4,900' },
    ],
  },
  {
    title: 'บริการเสริม',
    items: [
      { term: 'เพิ่มหน้า', value: '990/หน้า' },
      { term: 'สองภาษา', value: '+30%' },
      { term: 'งานด่วน', value: '+30%' },
      { term: 'นอกขอบเขต', value: '500/ชม.' },
    ],
  },
  {
    id: 'terms',
    title: 'การชำระเงิน',
    items: [
      { term: 'ซื้อขาด', value: '50/50' },
      { term: 'Premium', value: '50/30/20' },
      { term: 'VAT', value: 'ยังไม่รวม' },
      { term: 'ยืนราคาถึง', value: PRICE_VALID_UNTIL },
    ],
  },
];
