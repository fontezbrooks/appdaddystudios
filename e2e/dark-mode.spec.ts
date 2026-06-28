import { test, expect } from "@playwright/test";

/**
 * Dark mode follows the OS preference via the pre-paint bootstrap script in
 * app/layout.tsx — no toggle in V1. The script adds `.dark` to <html> before
 * React hydrates, so there should be no flash of the wrong theme.
 */
test.describe("OS-preference dark mode", () => {
  test("adds .dark to <html> when the OS prefers dark", async ({ browser }) => {
    const context = await browser.newContext({ colorScheme: "dark" });
    const page = await context.newPage();
    await page.goto("/");
    await expect(page.locator("html")).toHaveClass(/\bdark\b/);
    await context.close();
  });

  test("does not add .dark when the OS prefers light", async ({ browser }) => {
    const context = await browser.newContext({ colorScheme: "light" });
    const page = await context.newPage();
    await page.goto("/");
    await expect(page.locator("html")).not.toHaveClass(/\bdark\b/);
    await context.close();
  });
});
