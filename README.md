This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Testing

The suite is **owned by the maintainer**, not the designer. Keep tests
**resilient**: assert on behavior and semantic queries (`getByRole`,
`aria-label`) — never on DOM structure, generated SVG internals
(`components/brand/LogoMark.tsx` is auto-generated), or exact copy. This keeps
tests stable across cosmetic redesigns where behavior is unchanged.

| Command | What it runs |
| --- | --- |
| `bun run test` | Unit/component tests (Vitest + Testing Library, jsdom) |
| `bun run test:watch` | Vitest in watch mode |
| `bun run test:e2e` | E2E + a11y tests (Playwright, runs against a production build) |
| `bun run test:e2e:ui` | Playwright UI mode (local debugging) |
| `bun run typecheck` | `tsc --noEmit` |
| `bun run lint` | ESLint |

**Layout**

- Unit/component: colocated `*.test.ts(x)` (`lib/`, `components/`, `scripts/`)
- E2E + accessibility: `e2e/*.spec.ts` (Chromium + WebKit, axe-core)
- Pure logic is extracted for testability — e.g. `scripts/transform-logo.ts`
  holds the SVG→component transform; `scripts/prepare-logo.ts` is the CLI wrapper.

First run needs browsers: `bunx playwright install chromium webkit`.

### Continuous integration

`.github/workflows/ci.yml` runs on every PR to `main` (and pushes to `main`):
`lint`, `typecheck`, `unit`, `build`, and `e2e` jobs on `bun`. These are
intended to be **required status checks** — enable branch protection on `main`
once the pipeline has one green baseline run so a PR cannot merge with a
failing check. A flaky test is treated as a bug (no retries-into-green).

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
