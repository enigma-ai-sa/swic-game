import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

const swcc = localFont({
  src: [
    { path: "./fonts/SWCC-Regular.ttf", weight: "400", style: "normal" },
    { path: "./fonts/SWCC-Medium.ttf", weight: "500", style: "normal" },
    { path: "./fonts/SWCC-Bold.ttf", weight: "700", style: "normal" },
  ],
  variable: "--font-arabic",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ذاكرة الابتكار",
  description: "لعبة الذاكرة لاكتشاف شركاء الابتكار في قطاع المياه",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0891b2",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${swcc.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
