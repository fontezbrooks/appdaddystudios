# App Daddy Studios — Landing Page Design Spec

> Status: **implemented in V1**
> Last updated: 2026-04-07

App Daddy Studios is the umbrella brand over the Daddy app ecosystem
(parkDaddy, certDaddy, docuDaddy, syncDaddy). This document captures the
design decisions behind the V1 landing page so future contributors (human or
agent) can extend the brand without re-deriving them.

## Brand philosophy

> Effortless automation for smart people — one tap to do what used to take
> ten steps.

Tone: clean, confident, uncluttered, restrained motion. The brand should feel
like a premium tool, not a typical SaaS product.

## Stack

| Area | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router) + TypeScript strict |
| Styling | Tailwind CSS v4 + shadcn/ui (Radix primitives, Nova preset) |
| Package manager | bun |
| Deploy target | Vercel |
| Animation | framer-motion |
| Fonts | Geist Sans / Geist Mono via `next/font/google` |
| Icons | Lucide (bundled with shadcn Nova preset) |

## Visual foundation

### Neutral family: `ash-grey`

The source logo (`docs/app_daddy_logo.svg`) is painted in a warm bone
(`#F5F4F1`) and warm charcoal (`~#1A1D20`) pairing. The `ash-grey` family in
`docs/tailwind-v4-colors.md` is a near-perfect match — warm-leaning neutrals
with zero chromatic bias. Scale is used wholesale (50 → 950).

### Accent family: `honey-bronze`

Picked after scoring all seven families in `tailwind-v4-colors.md` on four
criteria (harmony with logo, brand voice fit, CTA clarity, dark-mode
legibility). Runner-up was `air-force-blue`; `honey-bronze` won on harmony
and voice — amber/bronze evokes a brass toggle being flipped, which is the
physical metaphor for *"one tap to do what used to take ten steps."*

- Light mode accent: `honey-bronze-500` (`#e4941b`)
- Dark mode accent: `honey-bronze-400` (`#eaa948`) — kept legible on
  `ash-grey-950` dark surfaces
- Reserved for **large text, icons, fills, focus rings**. Body text always
  reads from `text.primary` (neutrals) because `honey-bronze-500` can fail
  WCAG AA for small text on `ash-grey-50`.

## Token architecture (3-layer model)

The token system lives entirely in `app/globals.css`. Three layers, single
source of truth:

```
┌─ LAYER 1: PRIMITIVES (@theme) ────────────────────────────┐
│  Raw hex + font stacks + motion values                     │
│  --color-ash-grey-*, --color-honey-bronze-*, --font-*,     │
│  --duration-*, --ease-*                                    │
│  Mode-agnostic. No light/dark concept.                     │
└─────────────────────────┬──────────────────────────────────┘
                          │
                          ▼
┌─ LAYER 2: SHADCN BRIDGE (@theme inline) ──────────────────┐
│  Maps :root CSS variables to Tailwind color utilities.     │
│  This is what makes `bg-background`, `border-border`,      │
│  `bg-primary`, etc. compile as utility classes.            │
│  Uses var() so light/dark flip at runtime, not build time. │
└─────────────────────────┬──────────────────────────────────┘
                          │
                          ▼
┌─ LAYER 3: SHADCN CONTRACT (:root + .dark) ────────────────┐
│  --background, --foreground, --primary, --border, ... —    │
│  the canonical CSS variables every shadcn component reads. │
│  Two mappings: `:root` for light, `.dark` for dark.        │
└────────────────────────────────────────────────────────────┘
```

**Rule**: Components reference layer 3 class names (`bg-background`,
`text-foreground`, `border-border`, etc.) only. Never hardcode hex. Never
reference layer 1 primitives directly in components — they exist only so
layer 3 can be composed from them.

**To add or remove a token**: edit `app/globals.css` only. No other file
changes required.

### Color token map

| Semantic role | Light | Dark |
| --- | --- | --- |
| `--background` | `ash-grey-50` | `ash-grey-950` |
| `--foreground` | `ash-grey-950` | `ash-grey-50` |
| `--card` | `ash-grey-50` | `ash-grey-900` |
| `--popover` | `ash-grey-50` | `ash-grey-900` |
| `--primary` | `honey-bronze-500` | `honey-bronze-400` |
| `--primary-foreground` | `ash-grey-50` | `ash-grey-950` |
| `--secondary` | `ash-grey-100` | `ash-grey-800` |
| `--muted` | `ash-grey-100` | `ash-grey-800` |
| `--muted-foreground` | `ash-grey-600` | `ash-grey-400` |
| `--accent` (tinted surface) | `honey-bronze-50` | `honey-bronze-950` |
| `--accent-foreground` | `honey-bronze-800` | `honey-bronze-200` |
| `--border`, `--input` | `ash-grey-200` | `ash-grey-800` |
| `--ring` | `honey-bronze-500` | `honey-bronze-400` |
| `--destructive` | `#b42318` | `#f04438` |

`--radius: 0.625rem` baseline; `-sm` / `-md` / `-lg` / `-xl` derived via
multiplicative calc.

### Motion tokens

Mirrored between `app/globals.css` (CSS) and `lib/tokens.ts`
(framer-motion). Keep in sync by convention.

| Token | Value | Purpose |
| --- | --- | --- |
| `duration.instant` | 0ms | Reduced-motion fallback |
| `duration.fast` | 150ms | Hover/focus transitions |
| `duration.base` | 300ms | Standard transitions |
| `duration.slow` | 600ms | Large surface transitions |
| `duration.entrance` | 700ms | Page-load entrance animations |
| `ease.outSoft` | `cubic-bezier(0.16, 1, 0.3, 1)` | Exponential-out, default for entrances |
| `ease.inOutSoft` | `cubic-bezier(0.65, 0, 0.35, 1)` | Symmetric, for bidirectional transitions |

## File layout

```
appdaddystudios/
├── app/
│   ├── layout.tsx              # Root layout, Geist fonts, metadata, theme bootstrap
│   ├── page.tsx                # Landing — renders <BrandLogo />
│   ├── globals.css             # 3-layer token system
│   └── favicon.ico
├── components/
│   ├── brand/
│   │   ├── BrandLogo.tsx       # Client component — framer-motion entrance
│   │   └── LogoMark.tsx        # AUTO-GENERATED — do not edit
│   └── ui/                     # shadcn components (empty in V1)
├── lib/
│   ├── tokens.ts               # TS mirror of motion tokens
│   └── utils.ts                # shadcn cn() helper
├── scripts/
│   └── prepare-logo.ts         # Build-time SVG transform
└── docs/
    ├── app_daddy_logo.svg      # Source logo (with baked background rect)
    ├── app_daddy_logo.png      # Reference only, not shipped
    ├── tailwind-v4-colors.md   # Primitive palette source of truth
    └── design-spec.md          # This document
```

## Build-time SVG transform

The source logo at `docs/app_daddy_logo.svg` is a raster-traced SVG
(2130×1984, 418 unique hex paths) with a baked-in `#F5F4F1` background
rectangle covering the full canvas. Shipping it as-is would fight any page
surface that isn't exactly that tone (especially dark mode).

`scripts/prepare-logo.ts` runs before every `next build` (via the `prebuild`
hook) and:

1. Reads `docs/app_daddy_logo.svg`
2. Strips the `<?xml ... ?>` declaration
3. Strips the single `<path fill="#F5F4F1" .../>` background rect
4. Wraps the result in a React component with `{...props}` spread
5. Emits `components/brand/LogoMark.tsx`

**Guarantees:**
- Idempotent — re-running produces byte-identical output
- Fails loudly if the background rect is missing (the source SVG changed and
  needs human review)
- Does not mutate the source file
- Runs automatically on Vercel deploys via `prebuild`

**To regenerate manually:** `bun run prepare-logo`

## Animation contract

`BrandLogo` plays a subtle entrance animation once per page load:

```ts
initial:  { opacity: 0, y: 8, scale: 0.98 }
animate:  { opacity: 1, y: 0, scale: 1 }
transition: {
  duration: 0.7,             // from lib/tokens.ts duration.entrance
  ease: [0.16, 1, 0.3, 1],   // from lib/tokens.ts ease.outSoft
}
```

Values chosen deliberately:

- **700ms** is long enough to feel intentional, short enough to not test
  patience. Anything under 500ms feels twitchy for a hero entrance.
- **y: 8px** is below perceptual "sliding" threshold — reads as a gentle
  settle, not a swipe.
- **scale: 0.98** adds almost-imperceptible "emerging" depth without drawing
  attention.
- **Exponential-out curve** fits "effortless" — accelerates instantly,
  decelerates smoothly, no bounce.

`prefers-reduced-motion` is respected via `useReducedMotion()` — the logo
renders in its final state with `duration: 0`.

## Dark mode strategy

V1 has **no UI toggle**. Dark mode follows the OS preference via a small
inline script in `<head>` that runs before first paint:

```js
if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
  document.documentElement.classList.add('dark');
}
```

This runs before React hydrates, eliminating flash of unstyled content.
`<html suppressHydrationWarning>` is set because the class differs between
server-rendered HTML (no class) and client DOM (possibly `.dark`).

When a toggle UI is needed later, swap this script for `next-themes` without
changing any tokens.

## Out of scope (V1)

- Routes beyond `/`
- Hero copy, taglines, or any text content in the UI (tone lives in metadata
  only)
- Links to individual Daddy apps or app-store badges
- Dark-mode toggle UI, analytics, cookie banners, contact forms
- i18n
- Unit / integration / e2e tests (V2)

## Adding the next section

When V2 adds hero text / app cards / footer:

1. Reference `bg-background`, `text-foreground`, `border-border`, `bg-card`,
   etc. — never hardcode hex.
2. For brand accent fills or icons, use `bg-primary` / `text-primary`.
3. For tinted backgrounds (e.g. highlight a callout), use `bg-accent` with
   `text-accent-foreground`.
4. Install shadcn components via `bunx shadcn@latest add <component>` — they
   automatically inherit the token system.
5. If a new semantic role is needed (e.g. `--success`), add it to both
   `:root` and `.dark` in `globals.css`, then add the bridge in
   `@theme inline`.

## Performance budget

| Metric | Target |
| --- | --- |
| First-load JS (route `/`) | < 120 KB |
| LCP | < 1.0s on fast 3G simulation |
| CLS | 0 |
| Lighthouse (Perf / A11y / BP / SEO) | ≥ 95 each |

The 231 KB LogoMark is inlined into the server-rendered HTML — not shipped
as a separate request. Trade-off accepted: larger HTML payload, zero
additional network roundtrips, instant paint.
