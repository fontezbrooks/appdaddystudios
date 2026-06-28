import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrandLogo } from "./BrandLogo";

/** Override matchMedia so useReducedMotion() resolves to `prefers`. */
function mockReducedMotion(prefers: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: prefers && query.includes("reduced-motion"),
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
}

describe("BrandLogo", () => {
  beforeEach(() => {
    mockReducedMotion(false);
  });

  it("exposes the brand as an accessible image", () => {
    render(<BrandLogo />);
    const logo = screen.getByRole("img", { name: "App Daddy Studios" });
    expect(logo).toBeInTheDocument();
  });

  it("forwards a custom className to the root element", () => {
    render(<BrandLogo className="w-40" />);
    expect(screen.getByRole("img", { name: "App Daddy Studios" })).toHaveClass(
      "w-40",
    );
  });

  it("renders the inner logo SVG mark", () => {
    const { container } = render(<BrandLogo />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("still renders accessibly when reduced motion is preferred", () => {
    mockReducedMotion(true);
    render(<BrandLogo />);
    expect(
      screen.getByRole("img", { name: "App Daddy Studios" }),
    ).toBeInTheDocument();
  });
});
