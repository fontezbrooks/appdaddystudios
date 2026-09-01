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

  test("desktop: mouse drag over the phone screenshot changes slide", async ({ page }) => {
    await page.goto("/");
    // Carousel is below the fold at the default viewport; mouse events at
    // off-screen coordinates hit nothing. Hovering also pauses autoplay so
    // the assertions below are deterministic.
    await carousel(page).scrollIntoViewIfNeeded();
    const box = await activeSlide(page).getByRole("img").boundingBox();
    if (!box) throw new Error("active slide image has no bounding box");
    const cx = box.x + box.width / 2;
    const cy = box.y + box.height / 2;
    await page.mouse.move(cx, cy);
    await page.mouse.down();
    await page.mouse.move(cx - 150, cy, { steps: 10 });
    await page.mouse.up();
    await expect(activeSlide(page)).toHaveAttribute("aria-label", "2 of 4");

    await page.mouse.move(cx, cy);
    await page.mouse.down();
    await page.mouse.move(cx + 150, cy, { steps: 10 });
    await page.mouse.up();
    await expect(activeSlide(page)).toHaveAttribute("aria-label", "1 of 4");
  });

  test("desktop: clicking a side phone brings it to the centre", async ({ page }) => {
    await page.goto("/");
    await carousel(page).hover();
    // Side slides are aria-hidden, so query the element directly rather than by role.
    await carousel(page).locator("[aria-label='2 of 4'] img").click();
    await expect(activeSlide(page)).toHaveAttribute("aria-label", "2 of 4");
  });

  test("mobile: touch swipe changes slide", async ({ browser, browserName }) => {
    // Synthetic multi-point touch needs CDP, which only Chromium exposes.
    test.skip(browserName !== "chromium", "touch swipe injection requires CDP (Chromium only)");
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      hasTouch: true,
      isMobile: true,
    });
    const page = await context.newPage();
    await page.goto("/");
    await carousel(page).scrollIntoViewIfNeeded();
    const box = await activeSlide(page).getByRole("img").boundingBox();
    if (!box) throw new Error("active slide image has no bounding box");
    const x = box.x + box.width / 2;
    const y = box.y + box.height / 2;
    const cdp = await context.newCDPSession(page);
    await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x, y }] });
    for (let step = 1; step <= 8; step += 1) {
      await cdp.send("Input.dispatchTouchEvent", {
        type: "touchMove",
        touchPoints: [{ x: x - step * 20, y }],
      });
    }
    await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
    await expect(activeSlide(page)).toHaveAttribute("aria-label", "2 of 4");
    await context.close();
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
