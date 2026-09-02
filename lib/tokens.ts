/**
 * Motion tokens mirrored from app/globals.css.
 *
 * Kept in sync by convention — any time you change `--duration-*` or
 * `--ease-*` in globals.css, update the corresponding value here so
 * framer-motion and CSS stay aligned.
 *
 * Why not read the CSS variables at runtime?
 * - framer-motion needs raw numbers for `duration`, not CSS strings
 * - SSR has no computed style, so reading var() would hydrate mismatched
 *
 * Durations are in SECONDS (framer-motion convention).
 */

export const duration = {
  instant: 0,
  fast: 0.15,
  base: 0.3,
  slow: 0.6,
  entrance: 0.7,
} as const;

/**
 * Easing curves as framer-motion-compatible cubic-bezier tuples.
 */
export const ease = {
  outSoft: [0.16, 1, 0.3, 1] as const,
  inOutSoft: [0.65, 0, 0.35, 1] as const,
} as const;

/**
 * Hard offset text shadow in Royal, used on display copy over the
 * photographic background so it reads as printed rather than floating.
 */
export const royalShadow = "2px 2px 0px #491e3d";

export type Duration = keyof typeof duration;
export type Ease = keyof typeof ease;
