import { defineConfig, devices } from "@playwright/test";

const PORT = 3000;
const baseURL = `http://localhost:${PORT}`;
const isCI = !!process.env.CI;

/**
 * E2E config. Tests run against the production build (`build` + `start`),
 * matching how the site behaves on Vercel — per the Next.js Playwright guide.
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: isCI,
  retries: 0, // No retries-into-green: a flake is a bug, not a re-run.
  workers: isCI ? 1 : undefined,
  reporter: isCI ? [["html", { open: "never" }], ["list"]] : "list",
  use: {
    baseURL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
  ],
  webServer: {
    command: "bun run build && bun run start",
    url: baseURL,
    reuseExistingServer: !isCI,
    timeout: 120_000,
  },
});
