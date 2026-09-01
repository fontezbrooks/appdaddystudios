"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, useReducedMotion, type PanInfo } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { duration, ease } from "@/lib/tokens";
import type { ShowcaseApp } from "@/lib/apps";
import { cn } from "@/lib/utils";
import { PhoneFrame } from "./PhoneFrame";

/** Milliseconds between automatic slide advances. */
export const AUTOPLAY_INTERVAL_MS = 4000;
/** Horizontal drag distance (px) needed to change slide. */
const DRAG_THRESHOLD_PX = 50;
/** Horizontal distance between adjacent phone centres (px). */
const SLIDE_SPACING_PX = 220;
const SIDE_SCALE = 0.82;
const SIDE_OPACITY = 0.45;

type AppCarouselProps = {
  apps: readonly ShowcaseApp[];
  /** Accessible name for the carousel region. */
  label?: string;
  /** Override interval; 0 disables autoplay. Tests use this. */
  autoplayIntervalMs?: number;
};

/**
 * Signed distance of slide `i` from the active slide, wrapped so the
 * carousel loops: for 4 slides with active 0 -> offsets [0, 1, -2, -1].
 */
function slideOffset(i: number, active: number, count: number): number {
  const raw = (((i - active) % count) + count) % count;
  return raw > count / 2 ? raw - count : raw;
}

export function AppCarousel({
  apps,
  label = "Our apps",
  autoplayIntervalMs = AUTOPLAY_INTERVAL_MS,
}: AppCarouselProps) {
  const count = apps.length;
  const [active, setActive] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const goTo = useCallback(
    (delta: number) => setActive((i) => (((i + delta) % count) + count) % count),
    [count],
  );
  const next = useCallback(() => goTo(1), [goTo]);
  const prev = useCallback(() => goTo(-1), [goTo]);

  const isAutoplayEnabled =
    autoplayIntervalMs > 0 && !prefersReducedMotion && !isPaused && count > 1;

  useEffect(() => {
    if (!isAutoplayEnabled) return;
    const id = setInterval(next, autoplayIntervalMs);
    return () => clearInterval(id);
  }, [isAutoplayEnabled, autoplayIntervalMs, next]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLElement>) {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      next();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      prev();
    }
  }

  function handleDragEnd(_: unknown, info: PanInfo) {
    setIsPaused(false);
    if (info.offset.x < -DRAG_THRESHOLD_PX) next();
    else if (info.offset.x > DRAG_THRESHOLD_PX) prev();
  }

  const transition = {
    duration: prefersReducedMotion ? duration.instant : duration.slow,
    ease: ease.outSoft,
  };

  const navButtonClass =
    "rounded-full bg-brown-400/80 p-3 text-peach backdrop-blur-sm transition-colors hover:bg-brown-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-pumpkin cursor-pointer";

  return (
    <section
      aria-roledescription="carousel"
      aria-label={label}
      className="flex w-full flex-col items-center gap-6"
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      <motion.div
        className="relative h-[640px] w-full cursor-grab select-none overflow-hidden active:cursor-grabbing"
        drag={count > 1 ? "x" : false}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragStart={() => setIsPaused(true)}
        onDragEnd={handleDragEnd}
      >
        {apps.map((app, i) => {
          const offset = slideOffset(i, active, count);
          const isActive = offset === 0;
          const isVisible = Math.abs(offset) <= 1;
          return (
            <motion.div
              key={app.slug}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${count}`}
              aria-hidden={!isActive}
              data-active={isActive ? "true" : undefined}
              className={cn(
                "absolute left-1/2 top-0 flex w-[240px] -translate-x-1/2 flex-col items-center gap-4",
                !isVisible && "pointer-events-none",
              )}
              initial={false}
              animate={{
                x: offset * SLIDE_SPACING_PX,
                scale: isActive ? 1 : SIDE_SCALE,
                opacity: isVisible ? (isActive ? 1 : SIDE_OPACITY) : 0,
                zIndex: isActive ? 2 : 1,
              }}
              transition={transition}
            >
              <PhoneFrame
                src={app.screenshot.src}
                alt={app.screenshot.alt}
                preload={i === 0}
                className="w-full"
              />
              <div className="flex flex-col items-center gap-1 text-center">
                <p className="font-heading text-3xl leading-none text-peach">{app.name}</p>
                <p className="font-sans text-base text-white/80">{app.tagline}</p>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      <div className="flex items-center gap-4">
        <button type="button" aria-label="Previous app" onClick={prev} className={navButtonClass}>
          <ChevronLeft aria-hidden="true" className="size-6" />
        </button>
        <p className="font-sans text-sm text-white/70 tabular-nums">
          {active + 1} / {count}
        </p>
        <button type="button" aria-label="Next app" onClick={next} className={navButtonClass}>
          <ChevronRight aria-hidden="true" className="size-6" />
        </button>
      </div>
    </section>
  );
}
