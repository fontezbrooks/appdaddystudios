"use client";

import { motion, useReducedMotion } from "framer-motion";
import { LogoMark } from "./LogoMark";
import { duration, ease } from "@/lib/tokens";

type BrandLogoProps = {
  className?: string;
};

/**
 * Renders the App Daddy Studios brand mark with a subtle entrance animation
 * on mount. Respects `prefers-reduced-motion` — the logo renders in its
 * final state with no animation when the user has requested reduced motion.
 *
 * Sizing is controlled by the consumer via `className` (typically a
 * width utility); height is auto to preserve the logo's 2130:1984 ratio.
 */
export function BrandLogo({ className }: BrandLogoProps) {
  const prefersReducedMotion = useReducedMotion();

  const initial = prefersReducedMotion
    ? { opacity: 1, y: 0, scale: 1 }
    : { opacity: 0, y: 8, scale: 0.98 };

  return (
    <motion.div
      role="img"
      aria-label="App Daddy Studios"
      className={className}
      initial={initial}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: prefersReducedMotion ? duration.instant : duration.entrance,
        ease: ease.outSoft,
      }}
    >
      <LogoMark className="h-auto w-full" />
    </motion.div>
  );
}
