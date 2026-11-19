/**
 * Extra words people may type that do not appear in a page's own title or text (other spellings, English/Thai,
 * the kind of business). Keyed by product id, work slug, or page id. Search also reads titles, descriptions,
 * tags, plan names and FAQ questions, so only add what those miss.
 */
export const SEARCH_KEYWORDS: Record<string, string[]> = {
  // Services and software
  website: ['web', 'เว็บ', 'เวป', 'เว็ป', 'landing page', 'แลนดิ้ง', 'หน้าเว็บ', 'ทำเว็บ', 'รับทำเว็บ', 'site', 'โดเมน', 'domain', 'hosting', 'โฮสติ้ง', 'seo', 'เว็บบริษัท', 'เว็บร้าน'],
  'back-office': ['cms', 'admin', 'แอดมิน', 'หลังร้าน', 'dashboard', 'แดชบอร์ด', 'ระบบจอง', 'booking', 'จองคิว', 'สต็อก', 'stock', 'รับออเดอร์', 'ระบบสั่งซื้อ'],
  design: ['ui', 'ux', 'figma', 'ฟิกม่า', 'ออกแบบแอป', 'ออกแบบเว็บ', 'design', 'prototype', 'โปรโตไทป์', 'wireframe', 'mockup', 'ม็อคอัพ'],
  'photo-booth': ['photobooth', 'ตู้ถ่ายรูป', 'ตู้ถ่ายภาพ', 'ตู้สติ๊กเกอร์', 'ถ่ายรูป', 'dslr', 'qr', 'งานแต่ง', 'อีเวนต์'],
  crm: ['crm', 'สมาชิก', 'member', 'สะสมแต้ม', 'แต้ม', 'point', 'loyalty', 'บัตรสมาชิก', 'คูปอง', 'coupon', 'rewards'],
  pos: ['pos', 'แคชเชียร์', 'cashier', 'ขายหน้าร้าน', 'เครื่องคิดเงิน', 'คิดเงิน', 'ร้านอาหาร', 'ร้านค้า', 'ใบเสร็จ'],
  // Case studies
  'sunsun-print': ['sunsun', 'ซันซัน', 'ป้าย', 'สติ๊กเกอร์', 'งานพิมพ์', 'โรงพิมพ์', 'print', 'printing', 'ดิสเพลย์', 'บรรจุภัณฑ์'],
  'shogun-coffee': ['shogun', 'โชกุน', 'ร้านกาแฟ', 'คาเฟ่', 'cafe', 'coffee', 'กาแฟ', 'โรงคั่ว', 'เบเกอรี่', 'ขนม', 'เมนู'],
  'noir-cars': ['noir', 'นัวร์', 'รถ', 'รถยนต์', 'เต็นท์รถ', 'รถมือสอง', 'car', 'cars', 'used car', 'ไฟแนนซ์', 'ค่างวด', 'โชว์รูม'],
  stagecraft: ['stage', 'สเตจ', 'อีเวนต์', 'event', 'organizer', 'ออแกไนซ์', 'เวที', 'แสง', 'เสียง', 'คอนเสิร์ต', 'จอ led', 'สัมมนา', 'งานเลี้ยง'],
  // Pages
  work: ['ผลงาน', 'portfolio', 'พอร์ต', 'ตัวอย่างงาน', 'เว็บตัวอย่าง', 'case study', 'งานที่ทำ'],
  pricing: ['ราคา', 'price', 'แพ็กเกจ', 'แพคเกจ', 'package', 'ค่าใช้จ่าย', 'งบ', 'กี่บาท', 'ผ่อน', 'รายเดือน'],
  about: ['เกี่ยวกับ', 'about', 'ทีม', 'team', 'บริษัท', 'soft z', 'ซอฟท์ซี'],
  contact: ['ติดต่อ', 'contact', 'line', 'ไลน์', 'โทร', 'เบอร์', 'อีเมล', 'email', 'ที่อยู่', 'แผนที่', 'ขอใบเสนอราคา', 'quotation'],
  privacy: ['privacy', 'นโยบาย', 'ความเป็นส่วนตัว', 'pdpa', 'cookie', 'คุกกี้'],
};
