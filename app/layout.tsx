import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://sangseok.com"), // Replace with your actual domain
  title: {
    default: "SANGSEOK LOG",
    template: "%s | SANGSEOK LOG",
  },
  description: "그냥 기록. 인생은 가까이서 보면 비극이지만 멀리서 보면 희극.",
  keywords: ["sangseok", "log", "blog", "회고", "개발", "인생", "기록"],
  authors: [{ name: "ysang" }],
  creator: "ysang",
  openGraph: {
    title: "SANGSEOK LOG",
    description: "그냥 기록. 인생은 가까이서 보면 비극이지만 멀리서 보면 희극.",
    url: "https://sangseok.com", // Replace with your actual domain
    siteName: "SANGSEOK LOG",
    images: [
      {
        url: "https://sangseok.com/og-image.jpg", // Replace with your actual OG image
        width: 1200,
        height: 630,
        alt: "SANGSEOK LOG",
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SANGSEOK LOG",
    description: "그냥 기록. 인생은 가까이서 보면 비극이지만 멀리서 보면 희극.",
    images: ["https://sangseok.com/og-image.jpg"], // Replace with your actual OG image
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body>{children}</body>
    </html>
  );
}
