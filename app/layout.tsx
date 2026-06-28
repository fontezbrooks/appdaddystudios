import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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

const themeBootstrapScript = `
(function() {
  try {
    var mq = window.matchMedia('(prefers-color-scheme: dark)');
    if (mq.matches) document.documentElement.classList.add('dark');
  } catch (_) {}
})();
`.trim();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootstrapScript }} />
      </head>
      <body className="min-h-full antialiased">{children}</body>
    </html>
  );
}
