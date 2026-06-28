import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const ozik = localFont({
  src: "../public/fonts/OZIKSoft-Medium.woff2",
  variable: "--font-ozik",
  weight: "500",
  display: "swap",
});

const vulf = localFont({
  src: "../public/fonts/Vulf_Mono-Black_Italic_web.woff2",
  variable: "--font-vulf",
  weight: "900",
  style: "italic",
  display: "swap",
});

export const metadata: Metadata = {
  title: "App Daddy Studios",
  description:
    "Effortless automation for smart people — one tap to do what used to take ten steps.",
  applicationName: "App Daddy Studios",
  openGraph: {
    title: "App Daddy Studios",
    description:
      "Effortless automation for smart people — one tap to do what used to take ten steps.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f3f3f1" },
    { media: "(prefers-color-scheme: dark)", color: "#131311" },
  ],
};

/**
 * Dark-mode detection runs before first paint to prevent FOUC.
 * Reads prefers-color-scheme and toggles `.dark` on <html>.
 * No UI toggle in V1 — respects OS preference only.
 *
 * TEMPORARY (2026-04-07): Dark mode is suppressed while the logo is a
 * raster trace with a baked cream background. A dark page with a cream
 * logo rectangle looks worse than no dark mode. The script is kept
 * (commented below) so re-enabling is a one-line change once a proper
 * vector logo arrives. See scripts/prepare-logo.ts and globals.css for
 * the matching workarounds.
 */
// const themeBootstrapScript = `
// (function() {
//   try {
//     var mq = window.matchMedia('(prefers-color-scheme: dark)');
//     if (mq.matches) document.documentElement.classList.add('dark');
//   } catch (_) {}
// })();
// `.trim();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${ozik.variable} ${vulf.variable} h-full`}
    >
      <body className="min-h-full antialiased">{children}</body>
    </html>
  );
}
