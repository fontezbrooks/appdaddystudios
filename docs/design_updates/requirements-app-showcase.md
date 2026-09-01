# App Showcase Carousel — Requirements

> Status: **implemented 2026-09-01** (from-scratch build; placeholder screenshots + TODO taglines remain)
> Date: 2026-09-01
> Source design: 21st.dev `phone-mockups-1` by harshitproject (`docs/design_updates/design_updates.md`)

## Goal

Add a phone-mockup carousel between the hero and the contact form on the home
page that showcases released App Daddy Studios apps. Visitor sees real product,
builds trust before hitting "Let's talk".

## Confirmed decisions

| # | Topic | Decision |
| --- | --- | --- |
| 1 | Design source | 21st.dev `phone-mockups-1` (wrapper + shadcn button pasted; core carousel file missing, see blocker) |
| 2 | Apps | parkDaddy, syncDaddy, Gulch, The Southern Shmooze (4 total, this order) |
| 3 | Card content | Screenshot + app name + one-line tagline |
| 4 | Screenshot format | Portrait, inside phone mockup frame |
| 5 | Placement | Home page, between hero copy and contact form |
| 6 | Behavior | Autoplay, infinite loop, drag/swipe |
| 7 | Data | Hardcoded array (`lib/apps.ts` or similar) |
| 8 | Styling | Adapt component to ADS palette + OZIK (heading) / Ubuntu (body) fonts |
| 9 | Tests | Unit (Vitest) + E2E (Playwright: a11y, keyboard, reduced motion) |
| 10 | Housekeeping | `pnpm-lock.yaml` + `pnpm-workspace.yaml` deleted (done) |

## Functional requirements

- FR1. Render one slide per app: phone frame containing portrait screenshot, app name, tagline.
- FR2. Autoplay advances slides on an interval. Pauses on hover and on focus-within. Resumes on leave.
- FR3. Infinite loop in both directions.
- FR4. Pointer drag and touch swipe change slides.
- FR5. Keyboard: arrow keys change slides when carousel is focused. Prev/next buttons are real `<button>` elements with accessible labels.
- FR6. Placeholder screenshots at final aspect ratio until real captures exist. Swapping in real images requires changing only the data array.
- FR7. Data array holds `name`, `tagline`, `screenshot` (src + alt). Optional `href` for store/web link (unused for V1 unless provided).
- FR8. Section has a heading (OZIK) introducing the showcase so it reads as a distinct section, not a floating widget.

## Non-functional requirements

- NFR1. **Accessibility**: passes axe in existing `e2e/a11y.spec.ts`. Carousel region has `aria-roledescription="carousel"`, slides have `role="group"` + `aria-roledescription="slide"` + `aria-label="n of N"`. Live region not required if autoplay pauses on focus.
- NFR2. **Reduced motion**: when `prefers-reduced-motion: reduce`, autoplay off and slide transitions instant. Must pass `e2e/reduced-motion.spec.ts`.
- NFR3. **Dark mode**: uses tokens so `e2e/dark-mode.spec.ts` still passes (site is currently single-palette, both modes map to Royal).
- NFR4. **Performance**: screenshots via `next/image` with explicit width/height, lazy below fold. No layout shift on load. Target each screenshot ≤ 300 KB.
- NFR5. **Tokens**: no hardcoded hex. Use `globals.css` primitives/semantics (`text-peach`, `bg-brown-400`, `bg-pumpkin`, `font-heading`, `font-sans`) consistent with current `app/page.tsx`.
- NFR6. **Motion tokens**: transition durations/easing from `lib/tokens.ts` (framer-motion) or `--duration-*` / `--ease-*` (CSS). No ad-hoc timing values.
- NFR7. **Testing rules** (README): tests query by role / aria-label, never DOM structure or exact copy.
- NFR8. **Next 16**: check `node_modules/next/dist/docs/` for `next/image` and client-component conventions before implementing.

## User stories / acceptance criteria

**US1** As a visitor, I see the studio's apps in phone frames after the hero.
- AC: 4 slides render; each shows frame, screenshot, name, tagline.
- AC: section visible without interaction; first slide shown on load.

**US2** As a visitor, slides advance on their own but stop when I engage.
- AC: slide changes after interval without input.
- AC: hover or focus pauses; leaving resumes.

**US3** As a visitor on mobile, I can swipe through apps.
- AC: horizontal swipe advances/rewinds; wraps at ends.

**US4** As a keyboard user, I can operate the carousel.
- AC: Tab reaches prev/next buttons; Enter/Space activates.
- AC: buttons have visible focus ring (`ring-pumpkin` pattern).

**US5** As a user with reduced motion, nothing moves without my input.
- AC: no autoplay; button/swipe still switches slides without animation.

**US6** As the maintainer, I add a new app by editing one array entry.
- AC: adding entry to data file renders new slide with no other code change.

## Blockers / open questions

1. **Missing core component (confirmed 2026-09-01).** `design_updates.md` imports `@/components/ui/phone-mockups-1-utils/phone-carousel` (`PhoneCarousel`, `ImageItem`). User re-pasted directly from 21st.dev; the site's own export omits that file. Registry endpoint and component page both return "Component Not Found". The 21st.dev paste is unusable as-is. **Recommendation: build from scratch** with framer-motion (installed): drag/swipe, autoplay, infinite loop, CSS phone frame. Only reusable piece from paste is the `ImageItem` prop shape (`src`, `alt`) and the visual intent (row of iPhone frames, center one emphasized).
2. **Taglines.** Need one line per app for parkDaddy, syncDaddy, Gulch, The Southern Shmooze.
3. **Screenshot spec.** Confirm target size for captures (recommend 1170×2532 iPhone 14 Pro portrait, PNG or WebP). Placeholders will be generated at that ratio.
4. **Autoplay interval.** Default 4 s unless told otherwise.
5. **Links.** Include App Store / Play / web links per app in V1, or omit?

## Out of scope (V1)

- CMS / MDX data source.
- Per-app detail pages.
- Multiple screenshots per app.
- Video or animated previews.

## Next step

Resolve blocker 1, then `/sc:design` for component architecture, or `/sc:workflow` for implementation plan.
