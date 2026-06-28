import { test, expect } from "@playwright/test";

test.describe("home page", () => {
  test("loads successfully with the expected title", async ({ page }) => {
    const response = await page.goto("/");
    expect(response?.status()).toBe(200);
    await expect(page).toHaveTitle("App Daddy Studios");
  });

  test("renders the brand logo as an accessible image", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("img", { name: "App Daddy Studios" }),
    ).toBeVisible();
  });

  test("loads without console errors or page errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });
    page.on("pageerror", (err) => errors.push(err.message));

    await page.goto("/");
    await page.waitForLoadState("networkidle");

    expect(errors).toEqual([]);
  });
});
