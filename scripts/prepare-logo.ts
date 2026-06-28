/**
 * Build-time SVG transform.
 *
 * Reads the source logo from `public/logos/logo-ads-stacked-white.svg`,
 * strips the source `<svg>` wrapper, and emits a transparent React component
 * at `components/brand/LogoMark.tsx`.
 *
 * Runs via `bun run prepare-logo` or automatically before `next build` via
 * the `prebuild` hook in `package.json`.
 *
 * Idempotent — the pure transform lives in `scripts/transform-logo.ts`.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { toReactComponent } from "./transform-logo";

const SOURCE_SVG = resolve(process.cwd(), "public/logos/logo-ads-stacked-white.svg");
const OUTPUT_TSX = resolve(process.cwd(), "components/brand/LogoMark.tsx");

function main(): void {
  if (!existsSync(SOURCE_SVG)) {
    throw new Error(`prepare-logo: source SVG not found at ${SOURCE_SVG}`);
  }

  const source = readFileSync(SOURCE_SVG, "utf8");
  const component = toReactComponent(source);

  const outDir = dirname(OUTPUT_TSX);
  if (!existsSync(outDir)) {
    mkdirSync(outDir, { recursive: true });
  }

  writeFileSync(OUTPUT_TSX, component, "utf8");

  const bytesIn = Buffer.byteLength(source, "utf8");
  const bytesOut = Buffer.byteLength(component, "utf8");
  console.log(
    `prepare-logo: wrote ${OUTPUT_TSX} (${bytesIn} → ${bytesOut} bytes)`,
  );
}

main();
