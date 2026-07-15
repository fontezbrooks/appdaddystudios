# Contact Form — Figma Recreation Spec

> Companion to `docs/design-spec.md`. This documents the contact form
> shipped in `app/page.tsx` (commit `6874535`) so it can be rebuilt as
> editable Figma frames — either manually or as a reference alongside an
> `html.to.design` import.

## Fonts

| Role | Family | Fallback stack |
| --- | --- | --- |
| Heading | OZIK | ui-sans-serif, system-ui, sans-serif |
| Body / labels / inputs | Ubuntu | ui-sans-serif, system-ui, sans-serif |

Both are loaded as web fonts — install OZIK and Ubuntu locally (or the
closest match) before building in Figma, since Figma won't auto-resolve
`next/font` files.

## Color palette (hex)

| Token | Hex | Used for |
| --- | --- | --- |
| `royal` | `#491e3d` | Page background, drop-shadow color on headline/button text |
| `peach` | `#ffd5a8` | Headline text, form field labels (at 80% opacity) |
| `pumpkin` | `#f88000` | Submit button fill, input focus ring |
| `brown-100` | `#f6efeb` | (unused in this component) |
| `brown-200` | `#dcb193` | (unused in this component) |
| `brown-300` | `#8b734e` | Card border (30% opacity), input border (20% opacity) |
| `brown-400` | `#4d3c29` | Card background (80% opacity, backdrop-blur) |
| `brown-500` | `#311e09` | Input / textarea fill |
| `brown-600` | `#1e1102` | (unused in this component) |
| white | `#ffffff` | Supporting paragraph text, input text |
| `orange-300` (Tailwind default) | `#fdba74` | Button hover fill |
| red-300 (Tailwind default) | `#fca5a5` | Error message text |

Page background image: `/website-bg.png`, `background-size: cover`,
centered, fixed attachment, sitting under the `royal` color.

## Layout

Outer wrapper: centered column, `max-width: 48rem` (3xl), `gap: 2.5rem`
(10), horizontal padding `2rem` mobile / `4rem` ≥640px, vertical padding
`6rem` (24).

Stacking order top → bottom: logo (80–180px, clamp-scaled) → headline →
supporting paragraph → **contact form card**.

### Card (form container)

- Fill: `brown-400` @ 80% opacity + backdrop blur
- Border: `1px solid brown-300` @ 30% opacity
- Radius: `12px` (`rounded-xl`)
- Padding: `2rem` horizontal / `2.5rem` vertical (32px / 40px)
- Full width of the outer wrapper
- Internal vertical gap between rows: `1rem`

### Field grid

- 2 columns ≥640px (`name` + `businessName` on row 1, `email` + `phone`
  on row 2), 1 column below 640px
- Column/row gap: `1rem`
- `message` textarea spans full width below the grid, `4` rows tall

### Field anatomy (name, businessName, email, phone)

1. **Label** — uppercase, letter-spacing wide, `14px`, `peach` @ 80%
   opacity, `6px` gap to input below
2. **Input** — fill `brown-500`, border `1px solid brown-300` @ 20%
   opacity, radius `8px`, padding `12px 16px` (`py-3 px-4`), text `16px`
   white, placeholder `neutral-500` (`#737373`)
3. **Focus state** — `2px` ring in `pumpkin`, no border color change

| Field | Type | Required | Placeholder |
| --- | --- | --- | --- |
| Name | text | yes | "Jane Smith" |
| Business Name | text | yes | "Smith Roofing Co." |
| Email | email | yes | "jane@smithroofing.com" |
| Phone | tel | no | "(404) 555-0100" |
| Message | textarea | no (labeled "optional") | "Tell us a little about your business and what you're looking to build." |

### Submit button

- Full width, `8px` radius, padding `16px 24px` (`py-4 px-6`)
- Fill `pumpkin`, hover fill `orange-300`
- Text: heading font, `24px`, white, drop-shadow `2px 2px 0 #491e3d`
- Label states: `Let's talk →` (idle) / `Sending…` (submitting, button
  also at 60% opacity + disabled cursor)

### Error state

Inline text below the field grid, above the button: `14px`, `red-300`,
left-aligned. Copy: *"Something went wrong. Try emailing us directly at
hi@appdaddystudios.com"*

### Success state

Replaces the entire form card (same container styling: fill, blur,
border, radius, padding) with a centered column:
- Heading font, `48px`, `peach`, drop-shadow `2px 2px 0 #491e3d`:
  *"We'll be in touch."*
- Body, `20px`, white @ 80% opacity: *"Thanks for reaching out — expect
  to hear from us soon."*
- `1rem` gap between the two lines

## Building it in Figma (manual route)

1. Create a frame, set fill to `#491e3d`, drop in `website-bg.png` as a
   cover-fit background layer beneath everything else.
2. Build the card as an auto-layout frame (vertical, gap 16, padding
   40/32) with the fill/border/radius/blur values above.
3. Build one field as a component (label auto-layout + input auto-layout
   stacked, gap 6) — variants: `default`, `focus`, `error`. Instance it
   4×, swap labels/placeholders per the table.
4. Build the button as a component with `default` / `hover` / `disabled`
   variants.
5. Duplicate the card frame and swap contents for the success state.
6. Turn the 11 colors above into Figma **variables** (a `royal`/`peach`/
   `pumpkin`/`brown-*` collection) so future palette changes propagate —
   this mirrors the token system already in `app/globals.css`.

This manual route is slower than the `html.to.design` import but gives
you clean component/variant structure instead of whatever layer names the
importer produces — worth doing once you're happy with the general shape
pulled in from the live site.
