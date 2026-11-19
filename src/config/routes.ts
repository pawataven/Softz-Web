export const ROUTES = {
  home: '/',
  work: '/work/',
  caseStudy: (slug: string) => `/work/${slug}/`,
  pricing: '/pricing/',
  about: '/about/',
  contact: '/contact/',
  privacy: '/privacy/',
  product: (slug: string) => `/${slug}/`,
} as const;
