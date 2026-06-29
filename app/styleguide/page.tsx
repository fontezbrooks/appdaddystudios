const sizes = [
  { label: "9xl", class: "text-9xl", size: "128px", lineHeight: "1",      letterSpacing: "-0.04em" },
  { label: "8xl", class: "text-8xl", size: "96px",  lineHeight: "1",      letterSpacing: "-0.04em" },
  { label: "7xl", class: "text-7xl", size: "72px",  lineHeight: "1",      letterSpacing: "-0.04em" },
  { label: "6xl", class: "text-6xl", size: "60px",  lineHeight: "1",      letterSpacing: "-0.02em" },
  { label: "5xl", class: "text-5xl", size: "48px",  lineHeight: "1",      letterSpacing: "-0.02em" },
  { label: "4xl", class: "text-4xl", size: "36px",  lineHeight: "2.5rem", letterSpacing: "-0.02em" },
  { label: "3xl", class: "text-3xl", size: "30px",  lineHeight: "2.25rem",letterSpacing: "-0.01em" },
  { label: "2xl", class: "text-2xl", size: "24px",  lineHeight: "2rem",   letterSpacing: "0em"     },
  { label: "xl",  class: "text-xl",  size: "20px",  lineHeight: "1.75rem",letterSpacing: "0em"     },
  { label: "lg",  class: "text-lg",  size: "18px",  lineHeight: "1.75rem",letterSpacing: "0em"     },
  { label: "base",class: "text-base",size: "16px",  lineHeight: "1.5rem", letterSpacing: "0em"     },
  { label: "sm",  class: "text-sm",  size: "14px",  lineHeight: "1.25rem",letterSpacing: "0em"     },
  { label: "xs",  class: "text-xs",  size: "12px",  lineHeight: "1rem",   letterSpacing: "0em"     },
];

const fonts = [
  { label: "Ozik (font-heading)",          class: "font-heading font-medium" },
  { label: "Vulf (font-display)",          class: "font-display"             },
  { label: "Ubuntu Regular (font-sans)",   class: "font-sans font-normal"    },
  { label: "Ubuntu Medium (font-sans)",    class: "font-sans font-medium"    },
  { label: "Ubuntu Bold (font-sans)",      class: "font-sans font-bold"      },
  { label: "Ubuntu Light (font-sans)",     class: "font-sans font-light"     },
];

const sample = "effortless automation robot-facing // human-facing";

export default function TypographyTest() {
  return (
    <main className="bg-background text-foreground min-h-screen px-10 py-12 space-y-16">
      <div className="border-b border-neutral-700 pb-4">
        <p className="font-sans text-xs text-neutral-500 uppercase tracking-widest mb-1">App Daddy Studios — Design System</p>
        <h1 className="font-heading text-3xl text-orange-200">Web Type Styles</h1>
      </div>

      {/* Column headers */}
      <div className="font-sans text-xs text-neutral-500 uppercase tracking-widest grid grid-cols-[200px_1fr_80px_100px_120px] gap-4 border-b border-neutral-800 pb-2">
        <span>Style</span>
        <span>Example</span>
        <span>Size</span>
        <span>Line Height</span>
        <span>Letter Spacing</span>
      </div>

      {fonts.map((font) => (
        <section key={font.label} className="space-y-4">
          <h2 className="font-sans text-base text-white font-medium border-b border-neutral-800 pb-2">
            {font.label}
          </h2>
          <div className="space-y-6">
            {sizes.map((size) => (
              <div key={size.label} className="grid grid-cols-[200px_1fr_80px_100px_120px] gap-4 items-start">
                <div className="font-sans text-sm text-neutral-300 pt-1">
                  {font.label.split("(")[0].trim()} {size.label}
                </div>
                <span className={`${font.class} ${size.class} leading-tight`}>
                  {sample}
                </span>
                <span className="font-sans text-sm text-neutral-300 pt-1">{size.size}</span>
                <span className="font-sans text-sm text-neutral-300 pt-1">{size.lineHeight}</span>
                <span className="font-sans text-sm text-neutral-300 pt-1">{size.letterSpacing}</span>
              </div>
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}
