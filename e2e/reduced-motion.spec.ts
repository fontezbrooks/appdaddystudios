import { test, expect } from "@playwright/test";

/**
 * BrandLogo respects prefers-reduced-motion via useReducedMotion(): the logo
 * should be present and settled when reduced motion is requested.
 */
test.describe("prefers-reduced-motion", () => {
  test("renders the logo settled when reduced motion is requested", async ({
    browser,
  }) => {
    const context = await browser.newContext({ reducedMotion: "reduce" });
    const page = await context.newPage();
    await page.goto("/");

    const logo = page.getByRole("img", { name: "App Daddy Studios" });
    await expect(logo).toBeVisible();

    // Settled: bounding box is stable across a short interval (no entrance drift).
    const first = await logo.boundingBox();
    await page.waitForTimeout(200);
    const second = await logo.boundingBox();
    expect(first).not.toBeNull();
    expect(second).toEqual(first);
  });
});
