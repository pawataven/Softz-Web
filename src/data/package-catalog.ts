import { ROUTES } from '../config/routes';

export interface PackageCatalogItem {
  icon: string;
  name: string;
  description: string;
  price: string;
  tag?: string;
  href: string;
  /** Thai + English search terms; Thai has no word spacing, so keywords are matched as substrings. */
  keywords: string;
}

export const PACKAGE_CATALOG: PackageCatalogItem[] = [
  {
    icon: 'OPS',
    name: 'Operations ระบบงานธุรกิจ',
    description: 'รับจอง · งานเช่า · รับคำสั่งซื้อ',
    price: 'เริ่ม 29,900 บาท',
    href: ROUTES.product('back-office'),
    keywords: 'จอง booking คาเฟ่ ร้าน คิว นัด เช่า สั่งซื้อ order ระบบ หลังบ้าน operations',
  },
  {
    icon: 'WEB',
    name: 'Web Operations รายเดือน',
    description: 'เว็บ 3–5 หน้า + ระบบจอง/เช่า/สั่งซื้อ',
    price: '2,990/เดือน',
    href: `${ROUTES.pricing}#monthly`,
    keywords: 'จอง booking คาเฟ่ เว็บ รายเดือน ผ่อน เช่า สั่งซื้อ website monthly',
  },
  {
    icon: 'CRM',
    name: 'Member CRM Plus',
    description: 'ระดับสมาชิก คูปอง แจ้งเตือนผ่าน LINE',
    price: '1,990/เดือน',
    href: ROUTES.product('crm'),
    keywords: 'สมาชิก แต้ม สะสม คูปอง ลูกค้าประจำ คาเฟ่ ร้าน line crm member',
  },
  {
    icon: 'POS',
    name: 'POS Plus',
    description: 'จัดการโต๊ะ ส่งออเดอร์เข้าครัว',
    price: '1,290/เดือน',
    tag: 'กำลังพัฒนา',
    href: ROUTES.product('pos'),
    keywords: 'pos ขาย หน้าร้าน โต๊ะ ครัว คาเฟ่ ร้านอาหาร สต็อก แคชเชียร์',
  },
  {
    icon: 'WEB',
    name: 'Landing Page หน้าเดียว',
    description: 'ปิดการขายไว · 7 วัน · แก้ 2 รอบ',
    price: '5,900 บาท',
    href: ROUTES.product('website'),
    keywords: 'เว็บ หน้าเดียว landing ขาย โปรโมท ยิงแอด website',
  },
  {
    icon: 'WEB',
    name: 'Business Website 3–5 หน้า',
    description: 'SEO + Analytics · โดเมนฟรีปีแรก',
    price: '12,900 บาท',
    href: ROUTES.product('website'),
    keywords: 'เว็บ บริษัท ธุรกิจ ร้าน คาเฟ่ website หน้าเว็บ seo google',
  },
  {
    icon: 'WEB',
    name: 'Premium Website 6–10 หน้า',
    description: 'ดีไซน์เฉพาะแบรนด์ + แอนิเมชัน',
    price: '24,900 บาท',
    href: ROUTES.product('website'),
    keywords: 'เว็บ แบรนด์ premium ใหญ่ หลายหน้า website',
  },
  {
    icon: 'CMS',
    name: 'CMS แก้เว็บเองได้',
    description: 'เลือก 2 โมดูล · สอนใช้ 1 ครั้ง',
    price: '12,900 บาท',
    href: ROUTES.product('back-office'),
    keywords: 'แก้เว็บเอง cms หลังบ้าน บทความ สินค้า back office',
  },
  {
    icon: 'UX',
    name: 'Business Design 3–5 หน้า',
    description: 'ไฟล์ Figma พร้อมพัฒนา · 10 วัน',
    price: '7,900 บาท',
    href: ROUTES.product('design'),
    keywords: 'ออกแบบ ui ux figma ดีไซน์ แอป app design',
  },
  {
    icon: 'PB',
    name: 'Photo Booth เช่า 12 เดือน',
    description: 'หน้าตู้ + หลังบ้านดูทุกตู้ · ติดตั้งฟรี',
    price: '1,990/เดือน',
    href: ROUTES.product('photo-booth'),
    keywords: 'ตู้ถ่ายรูป photo booth งาน อีเวนต์ ถ่ายรูป ปริ้น',
  },
  {
    icon: 'CRM',
    name: 'Member CRM',
    description: 'สะสมแต้ม แลกรางวัล บัตรสมาชิก',
    price: '990/เดือน',
    href: ROUTES.product('crm'),
    keywords: 'สมาชิก แต้ม สะสม crm member shopee lazada tiktok ลูกค้า',
  },
];
