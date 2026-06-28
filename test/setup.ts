/**
 * Vitest global setup (jsdom environment).
 *
 * - Extends `expect` with jest-dom matchers.
 * - Polyfills browser APIs that framer-motion / React 19 touch but jsdom
 *   doesn't implement, so component tests render without throwing.
 */

import "@testing-library/jest-dom/vitest";
import { afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";

// Unmount React trees between tests to keep them isolated.
afterEach(() => {
  cleanup();
});

// jsdom has no matchMedia; framer-motion's useReducedMotion reads it.
// Default: reduced motion NOT preferred. Tests override via mockMatchMedia().
if (!window.matchMedia) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
}

// framer-motion measures layout; jsdom lacks ResizeObserver.
if (!globalThis.ResizeObserver) {
  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}
