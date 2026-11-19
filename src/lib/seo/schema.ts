import type {
  BreadcrumbList,
  FAQPage,
  Graph,
  Offer,
  Organization,
  Service,
  Thing,
  WebPage,
  WebSite,
} from 'schema-dts';
import type { CollectionEntry } from 'astro:content';
import { CONTACT, SITE, SOCIAL_PROFILES } from '../../config/site';
import { isMonthlyUnit } from '../format';

export interface BreadcrumbItem {
  name: string;
  path: string;
}

const absoluteUrl = (path: string, site: URL) => new URL(path, site).href;

const organizationId = (site: URL) => absoluteUrl('/#organization', site);
const websiteId = (site: URL) => absoluteUrl('/#website', site);

export function organizationSchema(site: URL): Organization {
  return {
    '@type': 'Organization',
    '@id': organizationId(site),
    name: SITE.name,
    url: absoluteUrl('/', site),
    logo: absoluteUrl(SITE.logo, site),
    email: CONTACT.email,
    telephone: CONTACT.phoneE164,
    areaServed: SITE.areaServed,
    sameAs: SOCIAL_PROFILES,
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      telephone: CONTACT.phoneE164,
      email: CONTACT.email,
      availableLanguage: ['th'],
    },
  };
}

export function websiteSchema(site: URL): WebSite {
  return {
    '@type': 'WebSite',
    '@id': websiteId(site),
    name: SITE.name,
    url: absoluteUrl('/', site),
    inLanguage: SITE.lang,
    publisher: { '@id': organizationId(site) },
  };
}

export function webPageSchema(params: { url: URL; site: URL; title: string; description: string }): WebPage {
  return {
    '@type': 'WebPage',
    '@id': `${params.url.href}#webpage`,
    url: params.url.href,
    name: params.title,
    description: params.description,
    inLanguage: SITE.lang,
    isPartOf: { '@id': websiteId(params.site) },
  };
}

export function breadcrumbSchema(items: BreadcrumbItem[], site: URL): BreadcrumbList {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path, site),
    })),
  };
}

export function serviceSchema(product: CollectionEntry<'products'>, url: URL, site: URL): Service {
  const { data } = product;
  // Pre-launch prices are estimates, so they are not published as structured offers.
  const offers: Offer[] =
    data.status === 'available'
      ? data.plans.map((plan) => ({
          '@type': 'Offer',
          name: `${plan.tag} — ${plan.name}`,
          url: `${url.href}#plans`,
          availability: 'https://schema.org/InStock',
          priceSpecification: {
            '@type': 'UnitPriceSpecification',
            price: plan.price,
            priceCurrency: SITE.currency,
            ...(isMonthlyUnit(plan.unit) && { unitCode: 'MON', referenceQuantity: { '@type': 'QuantitativeValue', value: 1, unitCode: 'MON' } }),
            ...(plan.isStartingPrice && { minPrice: plan.price }),
          },
        }))
      : [];

  return {
    '@type': 'Service',
    '@id': `${url.href}#service`,
    name: data.seo.title,
    description: data.seo.description,
    serviceType: data.summary.title,
    url: url.href,
    provider: { '@id': organizationId(site) },
    areaServed: SITE.areaServed,
    ...(offers.length > 0 && { offers }),
  };
}

export function faqSchema(faq: { question: string; answer: string }[]): FAQPage {
  return {
    '@type': 'FAQPage',
    mainEntity: faq.map(({ question, answer }) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: { '@type': 'Answer', text: answer },
    })),
  };
}

export function buildGraph(nodes: Thing[]): Graph {
  return { '@context': 'https://schema.org', '@graph': nodes };
}
