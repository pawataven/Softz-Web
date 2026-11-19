export const SITE = {
  name: 'SOFT Z DIGITAL',
  tagline: 'Creative Design Meets Technology',
  defaultTitle: 'SOFT Z DIGITAL — Creative Design Meets Technology',
  defaultDescription: 'เว็บไซต์ ระบบหลังบ้าน POS CRM และ Photo Booth ราคาชัดตั้งแต่ใบเสนอราคาแรก',
  titleSeparator: ' — ',
  lang: 'th',
  locale: 'th_TH',
  themeColor: '#08090A',
  defaultOgImage: '/images/og-default.png',
  logo: '/images/logo.png',
  currency: 'THB',
  areaServed: 'TH',
} as const;

export const CONTACT = {
  phoneDisplay: '093 778 2055',
  phoneE164: '+66937782055',
  email: 'softz.office@gmail.com',
  lineId: '@552jtues',
  // TODO(dev): Facebook page URL is still pending from the client.
  facebookUrl: null as string | null,
} as const;

export const SOCIAL_PROFILES: string[] = [
  `https://line.me/R/ti/p/${CONTACT.lineId}`,
  ...(CONTACT.facebookUrl ? [CONTACT.facebookUrl] : []),
];
