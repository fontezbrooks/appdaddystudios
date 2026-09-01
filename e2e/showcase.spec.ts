import { test, expect, type Page } from "@playwright/test";

/**
 * App showcase carousel on the home page: slides, controls, autoplay, and
 * the reduced-motion contract (no autoplay, controls still work).
 */
const CAROUSEL_NAME = "Apps we've shipped";
const AUTOPLAY_MS = 4000;

function carousel(page: Page) {
  return page.getByRole("region", { name: CAROUSEL_NAME });
}

function activeSlide(page: Page) {
  return carousel(page).locator("[data-active='true']");
}

test.describe("app showcase", () => {
  test("renders a carousel with one slide per app", async ({ page }) => {
    await page.goto("/");
    await expect(carousel(page)).toBeVisible();
    await expect(carousel(page)).toHaveAttribute("aria-roledescription", "carousel");
    await expect(carousel(page).locator("[aria-roledescription='slide']")).toHaveCount(4);
    await expect(activeSlide(page)).toHaveAttribute("aria-label", "1 of 4");
  });

  test("next and previous buttons change the active slide and wrap", async ({ page }) => {
    await page.goto("/");
    await carousel(page).getByRole("button", { name: "Next app" }).click();
    await expect(activeSlide(page)).toHaveAttribute("aria-label", "2 of 4");
    await carousel(page).getByRole("button", { name: "Previous app" }).click();
    await carousel(page).getByRole("button", { name: "Previous app" }).click();
    await expect(activeSlide(page)).toHaveAttribute("aria-label", "4 of 4");
  });

  test("keyboard arrows operate the carousel when a control is focused", async ({ page }) => {
    await page.goto("/");
    await carousel(page).getByRole("button", { name: "Next app" }).focus();
    await page.keyboard.press("ArrowRight");
    await expect(activeSlide(page)).toHaveAttribute("aria-label", "2 of 4");
    await page.keyboard.press("ArrowLeft");
    await expect(activeSlide(page)).toHaveAttribute("aria-label", "1 of 4");
  });

  test("autoplays when motion is allowed", async ({ page }) => {
    await page.goto("/");
    await expect(activeSlide(page)).toHaveAttribute("aria-label", "2 of 4", {
      timeout: AUTOPLAY_MS + 2000,
    });
  });

  test("does not autoplay under reduced motion, but controls still work", async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: "reduce" });
    const page = await context.newPage();
    await page.goto("/");
    await page.waitForTimeout(AUTOPLAY_MS + 500);
    await expect(activeSlide(page)).toHaveAttribute("aria-label", "1 of 4");
    await carousel(page).getByRole("button", { name: "Next app" }).click();
    await expect(activeSlide(page)).toHaveAttribute("aria-label", "2 of 4");
    await context.close();
  });
});
