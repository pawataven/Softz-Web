# SOFT Z DIGITAL — Website

Astro 7 + Tailwind CSS v4, static output.

## Getting started

```sh
npm install
cp .env.example .env
npm run dev
```

| Command           | What it does                                   |
| ----------------- | ---------------------------------------------- |
| `npm run dev`     | Dev server at `localhost:4321`                 |
| `npm run check`   | Type-check `.astro` / `.ts` and content schema |
| `npm run build`   | `check` + static build to `dist/`              |
| `npm run preview` | Serve `dist/` locally                          |

## Environment

| Variable                | Required in prod | Purpose                                                                     |
| ----------------------- | ---------------- | --------------------------------------------------------------------------- |
| `SITE_URL`              | yes              | Canonical, Open Graph, sitemap and robots.txt URLs                          |
| `PUBLIC_ALLOW_INDEXING` | yes (`true`)     | Only the production deploy sets `true`; any other build is `noindex` and disallowed in robots.txt |

## Structure

```text
public/                     served as-is (stable URLs: favicon, OG image, logo for JSON-LD)
src/
├── assets/images/          images processed by astro:assets (brand/, screens/)
├── components/
│   ├── layout/             SiteHeader, MenuOverlay, SiteFooter, FloatingLineButton
│   ├── sections/           page sections, grouped by page (home/, product/, about/, contact/) + shared ones
│   ├── seo/                Seo (meta, OG, Twitter, canonical, robots), JsonLd
│   └── ui/                 Icon, LineButton, SectionHeading, DeviceStage/DeviceComposition/DeviceFrame, …
├── config/                 site identity, contact info, routes, navigation, product categories
├── content/
│   ├── products/           one JSON file per product, filename = URL slug
│   └── work/               one JSON file per case study
├── content.config.ts       content schema; a bad field or missing image fails the build
├── data/                   page copy that is not a collection (home, about, pricing, package finder)
├── layouts/BaseLayout.astro  <head>, fonts, structured data graph, header/menu/footer
├── lib/                    pure helpers: formatting, LINE links, product queries, device types, seo/schema
├── pages/                  routes; [product].astro generates /website/, /crm/, … from content
├── scripts/                client-side TypeScript, one module per behaviour, imported by the component that needs it
└── styles/
    ├── global.css          entry: Tailwind + design-system imports + Tailwind theme mapped to tokens
    ├── tokens.css          design tokens from Figma (colors, spacing, radius, fonts)
    ├── base.css, motion.css
    ├── components/         buttons, panel, device mockups, toast
    ├── layout/             nav, menu overlay, footer, floating LINE button
    └── sections/           one file per section type
```

## Design system

The look comes from the approved prototype, ported 1:1 as plain CSS classes (`.btn`, `.panel`, `.section`, `.plans`, …) in `src/styles/`. It sits in Tailwind's `components` layer, so Tailwind utilities can still override it on a single element. Use Tailwind for one-off tweaks; add or extend a CSS file when it's a reusable pattern.

### Grid and spacing

All layout values live in `src/styles/tokens.css`. Use the tokens, not raw pixel values:

| Token | Desktop | Tablet (≤1023) | Mobile (≤767) | Use for |
| --- | --- | --- | --- | --- |
| `--grid-columns` | 12 | 8 | 4 | `.page-grid` columns |
| `--gutter` / `--margin` | 24 / 120 (48 at 1024–1279) | 24 / 48 | 16 / 20 | column gap / page side margin |
| `--container` | 1680 | | | max content width; content stretches between the 120px margins, so they stay exactly 120px on every screen up to 1920px wide |
| `--col1` | one column + gutter on the active grid | | | insetting a block by whole columns |
| `--space-section` | `clamp(56px, 7vh, 120px)` | `clamp(64px, 8vh, 112px)` | `clamp(56px, 8vh, 88px)` | minimum padding above and below every `.section` |
| `--space-section-tight` | `clamp(48px, 6vh, 96px)` | `clamp(56px, 6vh, 88px)` | `clamp(48px, 6vh, 64px)` | `.section.tight` |
| `--space-hero-start` / `--space-hero-end` | `clamp(24px, 4vh, 96px)` / `clamp(56px, 6vh, 120px)` | – / `clamp(48px, 7vh, 96px)` | 40 / `clamp(40px, 7vh, 72px)` | above / below every hero |
| `--space-stage` | `clamp(24px, 4vh, 96px)` | | 40 | hero text → device stage |
| `--space-stack` | `clamp(40px, 5.5vh, 72px)` | `clamp(40px, 5vh, 56px)` | 40 | section heading → its content |
| `--space-actions` | `clamp(24px, 4vh, 40px)` | | 28 | heading → its button row |

**Full-screen sections.** Every `main > section` is at least one viewport tall (`100svh`; the first one minus the nav) and centres its content vertically; content taller than the screen simply grows the section. Vertical spacing scales with the viewport height, so on 1440×900 and 1920×1080 every section fits one screen except the About carousel at 900px. On short laptop screens (1366×768) and on mobile, content-heavy sections are taller than one screen by design. Heroes with devices fit the first screen: the stage takes the height left under the text and the devices scale to it with container query units (`--stage-ratio` in `hero.css`).

Every section pads both of its own edges, so the divider drawn between two plain sections (and the edges of `.tone` bands) always sits between two equal gaps (at least 48px) and never touches content. Block-level layouts (bento, plans, cards, FAQ, brief, footer…) start and end on page-grid column lines at every breakpoint.

Scroll effects (tilt, sticky Explore, steps line, nav hide) share one `requestAnimationFrame` loop in `scripts/scroll-engine.ts`. All motion is disabled under `prefers-reduced-motion`, and reveal animations only hide content when JS is running (`html.js`), so the page is fully readable without JavaScript.

## Contact form

The brief form validates on the client. If `PUBLIC_BRIEF_ENDPOINT` is set, it POSTs the brief as JSON there. Otherwise the thank-you screen asks the visitor to send it to the team over LINE with one tap (the message is pre-filled).

## SEO conventions

- Every page renders through `BaseLayout` and passes `title`, `description` and, for inner pages, `breadcrumbs`.
- Titles are rendered as `{title} — SOFT Z DIGITAL`; keep `title` ≤ 60 and `description` ≤ 160 characters (enforced for products by the schema).
- Each page has exactly one `<h1>`, in Thai.
- Structured data is one `@graph` per page: Organization + WebSite + WebPage on every page, plus BreadcrumbList, Service (with Offers) and FAQPage where they apply. Pre-launch products (`status: "in-development"`) publish no Offers.
- URLs always end with `/` (`trailingSlash: 'always'`). Link through `ROUTES` in `src/config/routes.ts` instead of hard-coding paths.
- Fonts are self-hosted at build time through Astro's Fonts API, so the site makes no requests to Google Fonts.
- Tailwind's default palette is removed, so only brand colors from `global.css` are available (`bg-surface`, `text-gray`, `text-orange`, …).

## Adding a product

Add `src/content/products/<slug>.json` following the existing files. The page, navigation, footer, home card, sitemap entry and JSON-LD are all generated from it.

## Adding a case study (work)

Add `src/content/work/<slug>.json` following the existing files (`noir-cars.json` is the fullest example). The card on `/work/` is generated from it; add a `detail` block to also get a case study page at `/work/<slug>/` (pinned split gallery, chapters, mobile strip, price breakdown, tech stack).

- `category` is a product id or `demo` (demo websites, see `src/config/work.ts`); `styles` are 1–3 names from `WORK_STYLES` in the same file (unknown names fail the build). Both feed the filters on `/work/`, which also read/write the URL hash (`#demo&style=luxury`).
- `detail.pricing.items` must add up to `detail.pricing.total`, or the build fails.
- `detail.showcase.video` (optional) plays a muted, looping walkthrough in the laptop. Files go in `public/videos/work/` as `.mp4` (+ optional `.webm`), with the screenshot as poster.
- **When you replace an image or video, give it a new file name** (e.g. `home-desktop-v2.webp`). Images are served with a one-year cache, so a file replaced under the same name keeps showing the old version in browsers that saw it.

## Behaviour added in Nov 2026

- **Site search** (`components/layout/NavSearch.astro`, `scripts/site-search.ts`): suggestions while typing across services, packages, case studies, pages and FAQ, built at build time. Extra keywords per item (Thai/English spellings, kinds of business) live in `src/config/search.ts`; new case studies are searchable automatically. `/` or Ctrl+K focuses it.
- **Section-by-section scrolling** on desktop (`scripts/section-snap.ts`): one wheel gesture / arrow key moves one section. `fitSections()` scales a section's content down (to 0.8) so it fits one screen; sections that should scroll normally are listed in `FIT_SKIP`. Horizontal carousels take the wheel themselves until they reach an end (`scripts/carousel.ts`).
- **Thai line breaks** (`scripts/thai-text.ts`): keeps listed loanwords and compounds on one line, justifies left-aligned Thai paragraphs, and greys Thai text inside orange `.label`s. Add words to `KEEP_TOGETHER` if one breaks badly.
- **Motion and testing**: everything respects `prefers-reduced-motion`. Add `?motion=1` to a URL to force animations on (it is remembered per browser) when testing on a machine with animations turned off.
- `public/videos/work/` holds about 30 MB of walkthrough videos; keep them out of any image optimisation step.
