"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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
/** Release velocity (px/s) that counts as a flick even under the distance threshold. */
const FLICK_VELOCITY_PX_S = 500;
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

/** Slides rendered on each side of the active one (±1 visible, ±2 staged offscreen). */
const RENDER_RADIUS = 2;

/** Always-positive modulo. */
function mod(n: number, m: number): number {
  return ((n % m) + m) % m;
}

export function AppCarousel({
  apps,
  label = "Our apps",
  autoplayIntervalMs = AUTOPLAY_INTERVAL_MS,
}: AppCarouselProps) {
  const count = apps.length;
  // `cursor` is an unbounded integer, not wrapped to [0, count). Slides are
  // keyed by their virtual index (cursor + offset), so keys stay continuous
  // across wrap-around and every move animates between adjacent positions.
  // Without this, the 4th of 4 slides would sweep from offset -1 to +2
  // straight through the centre on every advance.
  const [cursor, setCursor] = useState(0);
  const active = mod(cursor, count);
  // Tracked separately so one condition ending cannot unpause while another
  // is still active (e.g. drag ends but pointer is still hovering).
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const isPaused = isHovered || isFocused || isDragging;
  // A drag that ends over a side phone also fires `click` on it. This flag
  // lets the click handler tell a real click from the tail of a drag.
  const didDragRef = useRef(false);
  const prefersReducedMotion = useReducedMotion();

  const next = useCallback(() => setCursor((c) => c + 1), []);
  const prev = useCallback(() => setCursor((c) => c - 1), []);

  function handleSlideClick(virtualIndex: number) {
    if (didDragRef.current) return;
    setCursor(virtualIndex);
  }

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
    setIsDragging(false);
    // One slide per gesture. Distance or a quick flick both count.
    const { x: distance } = info.offset;
    const { x: velocity } = info.velocity;
    if (distance < -DRAG_THRESHOLD_PX || velocity < -FLICK_VELOCITY_PX_S) next();
    else if (distance > DRAG_THRESHOLD_PX || velocity > FLICK_VELOCITY_PX_S) prev();
  }

  const transition = {
    duration: prefersReducedMotion ? duration.instant : duration.slow,
    ease: ease.outSoft,
  };

  const virtualIndices = Array.from(
    { length: RENDER_RADIUS * 2 + 1 },
    (_, k) => cursor - RENDER_RADIUS + k,
  );

  const navButtonClass =
    "rounded-full bg-brown-400/80 p-3 text-peach backdrop-blur-sm transition-colors hover:bg-brown-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-pumpkin cursor-pointer";

  return (
    <section
      aria-roledescription="carousel"
      aria-label={label}
      className="flex w-full flex-col items-center gap-6"
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
    >
      <motion.div
        className="relative h-[600px] w-full cursor-grab select-none overflow-hidden active:cursor-grabbing"
        drag={count > 1 ? "x" : false}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onPointerDown={() => {
          didDragRef.current = false;
        }}
        onDragStart={() => {
          didDragRef.current = true;
          setIsDragging(true);
        }}
        onDragEnd={handleDragEnd}
      >
        {virtualIndices.map((v) => {
          const i = mod(v, count);
          const app = apps[i];
          const offset = v - cursor;
          const isActive = offset === 0;
          const isVisible = Math.abs(offset) <= 1;
          return (
            // Centering lives on this plain wrapper. Framer writes an inline
            // `transform` on the motion child, which would clobber a
            // translate utility placed on the same element.
            <div
              key={v}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${count}`}
              aria-hidden={!isActive}
              data-active={isActive ? "true" : undefined}
              style={{ zIndex: isActive ? 2 : 1 }}
              className={cn(
                "absolute left-1/2 top-0 w-[240px] -translate-x-1/2",
                !isVisible && "pointer-events-none",
                isVisible && !isActive && "cursor-pointer",
              )}
              onClick={isActive ? undefined : () => handleSlideClick(v)}
            >
              <motion.div
                className="flex flex-col items-center gap-4"
                initial={false}
                animate={{
                  x: offset * SLIDE_SPACING_PX,
                  scale: isActive ? 1 : SIDE_SCALE,
                  opacity: isVisible ? (isActive ? 1 : SIDE_OPACITY) : 0,
                }}
                transition={transition}
              >
                <PhoneFrame src={app.screenshot.src} alt={app.screenshot.alt} className="w-full" />
                <div className="flex flex-col items-center gap-1 text-center">
                  <p className="font-heading text-3xl leading-none text-peach">{app.name}</p>
                  <p className="font-sans text-base text-white/80">{app.tagline}</p>
                </div>
              </motion.div>
            </div>
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
