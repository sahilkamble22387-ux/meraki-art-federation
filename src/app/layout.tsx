import type { Metadata } from "next";
import { Cormorant_Garamond, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const serifFont = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const sansFont = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Under Construction — Meraki Art Federation | Designed by Foxbyte Studios",
  description:
    "The digital pavilion of the Meraki Art Federation is currently under construction, designed and engineered by Foxbyte Studios. Unveiling our global vault of fine arts, sculpture, and master fellowships soon.",
  metadataBase: new URL("https://merakiartfed.com"),
  alternates: {
    canonical: "https://merakiartfed.com",
  },
  openGraph: {
    title: "Meraki Art Federation — Digital Pavilion Under Construction",
    description:
      "Crafted by Foxbyte Studios for the Meraki Art Federation. Archiving visionary painters, sculptors, and creative soul.",
    url: "https://merakiartfed.com",
    siteName: "Meraki Art Federation",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${serifFont.variable} ${sansFont.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col bg-[#070608] text-[#f4efe8] selection:bg-[#cda250]/30 selection:text-[#f4efe8]">
        {children}
      </body>
    </html>
  );
}
