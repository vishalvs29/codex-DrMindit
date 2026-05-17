import type { Metadata, Viewport } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

export const metadata: Metadata = {
  title: "DrMindit | AI mental wellness platform",
  description:
    "A premium AI-powered mental wellness platform for individuals, schools, employers, military families, and clinical partners.",
  keywords: ["AI therapy", "mental wellness", "mood tracking", "guided meditation", "employee wellness"],
  openGraph: {
    title: "DrMindit",
    description: "AI-powered mental wellness with calm design, privacy-first analytics, and guided emotional support.",
    type: "website"
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#050812"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className="dark">
        <body className="font-sans antialiased">{children}</body>
      </html>
    </ClerkProvider>
  );
}
