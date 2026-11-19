import { defineCollection, reference, type SchemaContext } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { EXTRA_WORK_CATEGORY_IDS, WORK_STYLES } from './config/work';

const nonEmptyText = z.string().trim().min(1);

const lineCta = z.object({
  label: nonEmptyText,
  lineMessage: nonEmptyText,
});

const deviceComposition = ({ image }: SchemaContext) =>
  z.object({
    layout: z.enum(['combo', 'trio', 'solo']),
    devices: z
      .array(
        z.union([
          z.object({ kind: z.enum(['laptop', 'phone', 'tablet']), image: image(), alt: z.string() }),
          z.object({ kind: z.literal('laptop'), screen: z.literal('pos') }),
        ]),
      )
      .min(1),
  });

const plan = z.object({
  tag: nonEmptyText,
  name: nonEmptyText,
  price: z.number().nonnegative(),
  unit: nonEmptyText,
  isStartingPrice: z.boolean().optional(),
  compareAtPrice: z.number().nonnegative().optional(),
  badge: nonEmptyText.optional(),
  featured: z.boolean(),
  chips: z.array(nonEmptyText).optional(),
  items: z.array(nonEmptyText).min(1),
  cta: lineCta,
});

const products = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/products' }),
  schema: (context) =>
    z.object({
      order: z.number().int().positive(),
      category: z.enum(['service', 'software']),
      status: z.enum(['available', 'in-development']),
      label: nonEmptyText,
      englishName: nonEmptyText,
      navLabel: nonEmptyText,
      navDescription: nonEmptyText,
      seo: z.object({
        title: nonEmptyText.max(60),
        description: nonEmptyText.max(160),
      }),
      summary: z.object({
        title: nonEmptyText,
        description: nonEmptyText,
      }),
      startingPrice: z.object({
        prefix: nonEmptyText,
        amount: z.number().nonnegative(),
        unit: nonEmptyText,
      }),
      hero: z.object({
        heading: z.array(nonEmptyText).min(1),
        subtitle: z.array(nonEmptyText).min(1),
        priceFrom: nonEmptyText,
        tag: nonEmptyText.optional(),
        primaryCta: lineCta,
        secondaryCtaLabel: nonEmptyText,
        stage: deviceComposition(context),
      }),
      features: z.object({
        intro: nonEmptyText,
        items: z.array(z.object({ title: nonEmptyText, description: nonEmptyText })).min(1),
      }),
      plans: z.array(plan).min(1),
      plansNote: nonEmptyText,
      faq: z.array(z.object({ question: nonEmptyText, answer: nonEmptyText })),
    }),
});

/** Long-form case study page at /work/<slug>/. Optional: a case study without it only shows as a card. */
const caseStudyDetail = ({ image }: SchemaContext) => {
  const picture = z.object({ image: image(), alt: nonEmptyText });
  const screen = z.object({ kind: z.enum(['desktop', 'mobile']), image: image(), alt: nonEmptyText });
  return z.object({
    seo: z.object({ title: nonEmptyText.max(60), description: nonEmptyText.max(160) }),
    cover: picture.extend({
      eyebrow: nonEmptyText,
      subtitle: nonEmptyText,
      /** object-position used when a phone crops the wide cover photo to portrait. */
      mobileFocus: nonEmptyText.default('50% 50%'),
    }),
    statement: z.array(nonEmptyText).min(1),
    /** Hero screen. With `video`, the laptop plays a muted looping walkthrough (files in public/), the image is its poster. */
    showcase: screen.extend({
      video: z.object({ mp4: nonEmptyText.startsWith('/'), webm: nonEmptyText.startsWith('/').optional() }).optional(),
    }),
    story: nonEmptyText,
    facts: z.array(z.object({ value: nonEmptyText, label: nonEmptyText })).min(1),
    chapters: z
      .array(
        z.object({
          label: nonEmptyText,
          title: nonEmptyText,
          body: nonEmptyText,
          screens: z.array(screen).min(1).max(2),
        }),
      )
      .min(1),
    mobileStrip: z.object({ label: nonEmptyText.default('MOBILE FIRST'), title: nonEmptyText, body: nonEmptyText, screens: z.array(screen).min(2) }),
    photos: z.object({ label: nonEmptyText.default('GALLERY'), title: nonEmptyText, body: nonEmptyText, items: z.array(picture).min(3) }),
    pricing: z.object({
      total: z.number().nonnegative(),
      totalLabel: nonEmptyText.default('รวมทั้งโปรเจกต์'),
      title: nonEmptyText,
      intro: nonEmptyText,
      items: z.array(z.object({ name: nonEmptyText, detail: nonEmptyText, amount: z.number().nonnegative() })).min(1),
      notes: z.array(nonEmptyText),
    }),
    stack: z.array(nonEmptyText),
  });
};

const work = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/work' }),
  schema: (context) =>
    z.object({
      order: z.number().int().positive(),
      /**
       * Filter category: a product slug (e.g. "website", "crm"), or one of the extra work-only categories in
       * config/work.ts (e.g. "demo"). Either way the parsed value is { id }.
       */
      category: z.union([
        z.enum(EXTRA_WORK_CATEGORY_IDS).transform((id) => ({ id, collection: 'extra' as const })),
        reference('products'),
      ]),
      title: nonEmptyText,
      /** Design style, 1–3 from config/work.ts (e.g. "Luxury", "Minimal"). Shown on the card and filterable. */
      styles: z.array(z.enum(WORK_STYLES)).min(1).max(3),
      description: nonEmptyText,
      tags: z.array(nonEmptyText),
      liveUrl: z.url().optional(),
      cta: lineCta,
      art: deviceComposition(context),
      detail: caseStudyDetail(context).optional(),
    }),
});

export const collections = { products, work };
