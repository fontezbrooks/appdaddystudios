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
  themeColor: "#311e09",
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
      className={`${inter.variable} ${ozik.variable} ${vulf.variable} h-full`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootstrapScript }} />
      </head>
      <body className="min-h-full antialiased">{children}</body>
    </html>
  );
}
