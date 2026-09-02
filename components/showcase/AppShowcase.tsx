import { showcaseApps } from "@/lib/apps";
import { royalShadow } from "@/lib/tokens";
import { AppCarousel } from "./AppCarousel";

/**
 * Home-page section showcasing shipped apps in phone frames.
 * Sits between the hero copy and the contact form.
 */
export function AppShowcase() {
  return (
    <div className="flex w-full flex-col items-center gap-8">
      <h2
        className="font-heading text-5xl leading-none text-peach sm:text-6xl"
        style={{ textShadow: royalShadow }}
      >
        Apps we&apos;ve shipped
      </h2>
      <AppCarousel apps={showcaseApps} label="Apps we've shipped" />
    </div>
  );
}
