import { describe, it, expect } from "vitest";
import { toReactComponent, VIEW_BOX } from "./transform-logo";

const SAMPLE_SVG = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="260" height="188" viewBox="0 0 520 376">
  <path fill="#311E09" d="M0 0h10v10H0z" />
  <circle cx="5" cy="5" r="2" />
</svg>`;

describe("toReactComponent", () => {
  it("emits a LogoMark React component", () => {
    const out = toReactComponent(SAMPLE_SVG);
    expect(out).toContain("export function LogoMark(props: SVGProps<SVGSVGElement>)");
    expect(out).toContain("{...props}");
  });

  it("strips the XML declaration", () => {
    expect(toReactComponent(SAMPLE_SVG)).not.toContain("<?xml");
  });

  it("strips the source <svg> wrapper attributes and re-wraps with the baked viewBox", () => {
    const out = toReactComponent(SAMPLE_SVG);
    // Source width/height/viewBox must not survive verbatim...
    expect(out).not.toContain('viewBox="0 0 520 376"');
    expect(out).not.toContain('width="260"');
    // ...the component emits its own canonical viewBox + a11y attrs instead.
    expect(out).toContain(`viewBox="${VIEW_BOX}"`);
    expect(out).toContain('aria-hidden="true"');
  });

  it("preserves the inner SVG markup (paths, shapes)", () => {
    const out = toReactComponent(SAMPLE_SVG);
    expect(out).toContain('<path fill="#311E09"');
    expect(out).toContain("<circle");
  });

  it("is deterministic — same input yields byte-identical output", () => {
    expect(toReactComponent(SAMPLE_SVG)).toBe(toReactComponent(SAMPLE_SVG));
  });

  it("throws on malformed input with no opening <svg> tag", () => {
    expect(() => toReactComponent("<not-an-svg />")).toThrow(/no opening <svg> tag/);
  });
});
