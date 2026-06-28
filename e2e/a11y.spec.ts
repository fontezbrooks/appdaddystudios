import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

/**
 * Automated accessibility checks via axe-core, run in both color schemes.
 * Brand accent (honey-bronze) must keep contrast in light AND dark surfaces,
 * so we scan both. Only serious/critical violations fail the build.
 */
const SEVERITIES = ["serious", "critical"] as const;

for (const colorScheme of ["light", "dark"] as const) {
  test(`has no serious or critical a11y violations (${colorScheme})`, async ({
    browser,
  }) => {
    const context = await browser.newContext({ colorScheme });
    const page = await context.newPage();
    await page.goto("/");

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    const blocking = results.violations.filter((v) =>
      SEVERITIES.includes(v.impact as (typeof SEVERITIES)[number]),
    );

    expect(
      blocking,
      blocking.map((v) => `${v.id}: ${v.help}`).join("\n"),
    ).toEqual([]);

    await context.close();
  });
}
