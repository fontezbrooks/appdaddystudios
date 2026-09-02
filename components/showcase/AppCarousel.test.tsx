import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { AppCarousel } from "./AppCarousel";
import type { ShowcaseApp } from "@/lib/apps";

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

const apps: ShowcaseApp[] = ["Alpha", "Bravo", "Charlie"].map((name) => ({
  slug: name.toLowerCase(),
  name,
  tagline: `${name} tagline`,
  screenshot: { src: `/apps/${name.toLowerCase()}.svg`, alt: `${name} app on an iPhone` },
}));

const INTERVAL = 1000;

/** The slide currently presented to assistive tech (the only non-hidden one). */
function activeSlide() {
  return screen.getByRole("group");
}

function renderCarousel(props: Partial<React.ComponentProps<typeof AppCarousel>> = {}) {
  return render(<AppCarousel apps={apps} label="Test apps" autoplayIntervalMs={INTERVAL} {...props} />);
}

describe("AppCarousel", () => {
  beforeEach(() => {
    mockReducedMotion(false);
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("exposes an accessible carousel region covering every app", () => {
    renderCarousel();
    expect(screen.getByRole("region", { name: "Test apps" })).toHaveAttribute(
      "aria-roledescription",
      "carousel",
    );
    const labels = screen
      .getAllByRole("group", { hidden: true })
      .map((el) => el.getAttribute("aria-label"));
    expect(new Set(labels)).toEqual(new Set(["1 of 3", "2 of 3", "3 of 3"]));
  });

  it("exposes exactly one active slide at a time", () => {
    renderCarousel();
    const active = screen
      .getAllByRole("group", { hidden: true })
      .filter((el) => el.getAttribute("data-active") === "true");
    expect(active).toHaveLength(1);
  });

  it("keeps advancing past the wrap point without losing position", () => {
    renderCarousel();
    const nextBtn = screen.getByRole("button", { name: "Next app" });
    for (let step = 0; step < 7; step += 1) fireEvent.click(nextBtn);
    expect(activeSlide()).toHaveAccessibleName("2 of 3");
  });

  it("shows the first app as active on load with its name and tagline", () => {
    renderCarousel();
    const slide = activeSlide();
    expect(slide).toHaveAccessibleName("1 of 3");
    expect(slide).toHaveTextContent("Alpha");
    expect(slide).toHaveTextContent("Alpha tagline");
    expect(screen.getByRole("img", { name: "Alpha app on an iPhone" })).toBeInTheDocument();
  });

  it("advances with the next button and wraps around at the end", () => {
    renderCarousel();
    const nextBtn = screen.getByRole("button", { name: "Next app" });
    fireEvent.click(nextBtn);
    expect(activeSlide()).toHaveAccessibleName("2 of 3");
    fireEvent.click(nextBtn);
    fireEvent.click(nextBtn);
    expect(activeSlide()).toHaveAccessibleName("1 of 3");
  });

  it("goes back with the previous button and wraps to the last slide", () => {
    renderCarousel();
    fireEvent.click(screen.getByRole("button", { name: "Previous app" }));
    expect(activeSlide()).toHaveAccessibleName("3 of 3");
  });

  it("responds to arrow keys", () => {
    renderCarousel();
    const region = screen.getByRole("region", { name: "Test apps" });
    fireEvent.keyDown(region, { key: "ArrowRight" });
    expect(activeSlide()).toHaveAccessibleName("2 of 3");
    fireEvent.keyDown(region, { key: "ArrowLeft" });
    expect(activeSlide()).toHaveAccessibleName("1 of 3");
  });

  it("autoplays on an interval", () => {
    renderCarousel();
    act(() => {
      vi.advanceTimersByTime(INTERVAL);
    });
    expect(activeSlide()).toHaveAccessibleName("2 of 3");
  });

  it("pauses autoplay while hovered and resumes after leaving", () => {
    renderCarousel();
    const region = screen.getByRole("region", { name: "Test apps" });
    fireEvent.mouseEnter(region);
    act(() => {
      vi.advanceTimersByTime(INTERVAL * 2);
    });
    expect(activeSlide()).toHaveAccessibleName("1 of 3");
    fireEvent.mouseLeave(region);
    act(() => {
      vi.advanceTimersByTime(INTERVAL);
    });
    expect(activeSlide()).toHaveAccessibleName("2 of 3");
  });

  it("pauses autoplay while a control has focus", () => {
    renderCarousel();
    fireEvent.focus(screen.getByRole("button", { name: "Next app" }));
    act(() => {
      vi.advanceTimersByTime(INTERVAL * 2);
    });
    expect(activeSlide()).toHaveAccessibleName("1 of 3");
  });

  it("stays paused when the pointer leaves while a control still has focus", () => {
    renderCarousel();
    const region = screen.getByRole("region", { name: "Test apps" });
    fireEvent.mouseEnter(region);
    fireEvent.focus(screen.getByRole("button", { name: "Next app" }));
    fireEvent.mouseLeave(region);
    act(() => {
      vi.advanceTimersByTime(INTERVAL * 2);
    });
    expect(activeSlide()).toHaveAccessibleName("1 of 3");
  });

  it("stays paused when focus leaves while the pointer is still hovering", () => {
    renderCarousel();
    const region = screen.getByRole("region", { name: "Test apps" });
    const nextBtn = screen.getByRole("button", { name: "Next app" });
    fireEvent.focus(nextBtn);
    fireEvent.mouseEnter(region);
    fireEvent.blur(nextBtn);
    act(() => {
      vi.advanceTimersByTime(INTERVAL * 2);
    });
    expect(activeSlide()).toHaveAccessibleName("1 of 3");
  });

  it("does not autoplay when reduced motion is preferred but still responds to controls", () => {
    mockReducedMotion(true);
    renderCarousel();
    act(() => {
      vi.advanceTimersByTime(INTERVAL * 3);
    });
    expect(activeSlide()).toHaveAccessibleName("1 of 3");
    fireEvent.click(screen.getByRole("button", { name: "Next app" }));
    expect(activeSlide()).toHaveAccessibleName("2 of 3");
  });

  it("does not autoplay when the interval is 0", () => {
    renderCarousel({ autoplayIntervalMs: 0 });
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(activeSlide()).toHaveAccessibleName("1 of 3");
  });

  it("renders a single app without controls breaking", () => {
    renderCarousel({ apps: [apps[0]] });
    expect(activeSlide()).toHaveAccessibleName("1 of 1");
    fireEvent.click(screen.getByRole("button", { name: "Next app" }));
    expect(activeSlide()).toHaveAccessibleName("1 of 1");
  });
});
