import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Digital Lady Technopark | 2026",
  description:
    "The conference bringing AI into the physical world. October 22, 2026 in San Francisco.",
  icons: {
    icon: "/icon.svg",
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="bg-ink suisse_48a771a2-module__2RBtPa__variable geist_mono_42eec60-module__Gb1_vG__variable">
      <head>
        <link rel="stylesheet" href="/styles/original.css" />
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
