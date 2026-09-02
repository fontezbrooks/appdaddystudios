/**
 * Apps shown in the home-page showcase carousel.
 *
 * To add an app: append one entry here and drop its portrait screenshot in
 * `public/apps/`. Nothing else needs to change.
 *
 * Screenshots are portrait phone captures at SCREENSHOT_WIDTH × SCREENSHOT_HEIGHT
 * (iPhone 14 Pro), encoded as WebP and kept under ~300 KB each.
 */

export const SCREENSHOT_WIDTH = 1170;
export const SCREENSHOT_HEIGHT = 2532;

export type ShowcaseApp = {
  /** Stable id, used as React key and for tests. */
  slug: string;
  name: string;
  tagline: string;
  screenshot: {
    src: string;
    alt: string;
  };
  /** Optional store / web link. Unused in V1 unless provided. */
  href?: string;
};

export const showcaseApps: readonly ShowcaseApp[] = [
  {
    slug: "parkdaddy",
    name: "parkDaddy",
    tagline: "Parking, sorted in one tap.", // TODO: confirm copy
    screenshot: {
      src: "/apps/parkdaddy.webp",
      alt: "parkDaddy app on an iPhone",
    },
  },
  {
    slug: "syncdaddy",
    name: "syncDaddy",
    tagline: "Unified smart light control across multiple brands", 
    screenshot: {
      src: "/apps/syncdaddy.webp",
      alt: "syncDaddy app on an iPhone",
    },
  },
  {
    slug: "gulch",
    name: "Gulch",
    tagline: "Official App for Gulch Magazine covering Atlanta's visual arts", 
    screenshot: {
      src: "/apps/gulch.webp",
      alt: "Gulch app on an iPhone",
    },
  },
  {
    slug: "southern-shmooze",
    name: "The Southern Shmooze",
    tagline: "Official Southern Shmooze App", 
    screenshot: {
      src: "/apps/southern-shmooze.webp",
      alt: "The Southern Shmooze app on an iPhone",
    },
  },
];
