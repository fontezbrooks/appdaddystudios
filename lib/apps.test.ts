import { describe, it, expect } from "vitest";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { showcaseApps, SCREENSHOT_WIDTH, SCREENSHOT_HEIGHT } from "./apps";

describe("showcaseApps", () => {
  it("lists the four released apps in showcase order", () => {
    expect(showcaseApps.map((a) => a.name)).toEqual([
      "parkDaddy",
      "syncDaddy",
      "Gulch",
      "The Southern Shmooze",
    ]);
  });

  it("has unique slugs", () => {
    const slugs = showcaseApps.map((a) => a.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("gives every app a name, tagline, and descriptive alt text", () => {
    for (const app of showcaseApps) {
      expect(app.name.trim()).not.toBe("");
      expect(app.tagline.trim()).not.toBe("");
      expect(app.screenshot.alt).toContain(app.name);
    }
  });

  it("points every screenshot at a file that exists under public/", () => {
    for (const app of showcaseApps) {
      const file = resolve(process.cwd(), "public", app.screenshot.src.replace(/^\//, ""));
      expect(existsSync(file), `${app.slug}: ${file}`).toBe(true);
    }
  });

  it("uses a portrait screenshot ratio", () => {
    expect(SCREENSHOT_HEIGHT).toBeGreaterThan(SCREENSHOT_WIDTH);
  });
});
